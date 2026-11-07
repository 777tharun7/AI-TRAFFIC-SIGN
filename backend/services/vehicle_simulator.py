"""
Vehicle Simulator & Physics Engine for RoadSense AI.
Provides authentic rule-based vehicle motion simulation along authentic Hyderabad corridors.
Integrates VehicleBehaviorEngine to enforce traffic signal obedience, stop lines,
speed limits, speed bumps, stop signs, and no-entry rerouting.
"""

import time
import math
from typing import List, Dict, Optional
from ..models.schemas import (
    VehicleState, VehicleBehaviorState, VehicleType, 
    RoadEvent, TrafficSignal, SignalState
)
from .geospatial import haversine_distance, calculate_bearing, interpolate_segment
from .riu_service import riu_service
from .signal_simulator import signal_simulator
from .road_event_engine import road_event_engine
from .vehicle_behavior_engine import vehicle_behavior_engine

HYDERABAD_ROUTES = {
    "route_hussain_sagar_necklace": {
        "id": "route_hussain_sagar_necklace",
        "name": "Hussain Sagar Lake & Necklace Road Connected Corridor",
        "city": "Hyderabad",
        "total_distance_km": 6.4,
        "default_speed_kmh": 42.0,
        "road_name": "Necklace Road & Tank Bund Connected Corridor",
        "waypoints": [
            {"lat": 17.4120, "lon": 78.4410, "road": "Banjara Hills Road No. 1"},
            {"lat": 17.4180, "lon": 78.4500, "road": "Panjagutta Junction"},
            {"lat": 17.4220, "lon": 78.4550, "road": "Somajiguda (Raj Bhavan Road)"},
            {"lat": 17.4270, "lon": 78.4630, "road": "Necklace Road Khairatabad Approach"},
            {"lat": 17.4290, "lon": 78.4700, "road": "Necklace Road Waterfront (People's Plaza)"},
            {"lat": 17.4230, "lon": 78.4750, "road": "NTR Gardens / Tank Bund South"},
            {"lat": 17.4280, "lon": 78.4820, "road": "Tank Bund Promenade"},
            {"lat": 17.4350, "lon": 78.4850, "road": "Kavadiguda / Sailing Club Approach"},
            {"lat": 17.4410, "lon": 78.4865, "road": "Secunderabad Paradise Junction"}
        ]
    },
    "route_hitec_gachibowli": {
        "id": "route_hitec_gachibowli",
        "name": "Hitec City to Gachibowli Corridor",
        "city": "Hyderabad",
        "total_distance_km": 4.8,
        "default_speed_kmh": 45.0,
        "road_name": "Hitec City Main Road & Gachibowli Expressway",
        "waypoints": [
            {"lat": 17.4520, "lon": 78.3750, "road": "Hitec City Entrance (Cyber Gateway)"},
            {"lat": 17.4502, "lon": 78.3808, "road": "Cyber Towers Junction"},
            {"lat": 17.4450, "lon": 78.3818, "road": "Mindspace Roundabout"},
            {"lat": 17.4380, "lon": 78.3780, "road": "Inorbit Mall Road"},
            {"lat": 17.4325, "lon": 78.3712, "road": "Bio-Diversity Park Junction"},
            {"lat": 17.4260, "lon": 78.3620, "road": "Gachibowli Flyover North"},
            {"lat": 17.4215, "lon": 78.3540, "road": "Gachibowli Outer Ring Road Interchange"}
        ]
    },
    "route_jubilee_cable_bridge": {
        "id": "route_jubilee_cable_bridge",
        "name": "Jubilee Hills to Cable Bridge",
        "city": "Hyderabad",
        "total_distance_km": 3.6,
        "default_speed_kmh": 40.0,
        "road_name": "Road No. 36 & Durgam Cheruvu Express",
        "waypoints": [
            {"lat": 17.4280, "lon": 78.4140, "road": "Jubilee Hills Checkpost"},
            {"lat": 17.4310, "lon": 78.4080, "road": "Road No. 36 Metro Station"},
            {"lat": 17.4340, "lon": 78.4020, "road": "Peddamma Temple Junction"},
            {"lat": 17.4338, "lon": 78.3905, "road": "Durgam Cheruvu Cable Bridge Approach"},
            {"lat": 17.4370, "lon": 78.3840, "road": "Knowledge City Gateway"}
        ]
    },
    "route_orr_expressway": {
        "id": "route_orr_expressway",
        "name": "Outer Ring Road (ORR) High-Speed Corridor",
        "city": "Hyderabad",
        "total_distance_km": 8.2,
        "default_speed_kmh": 80.0,
        "road_name": "Nehru Outer Ring Road Expressway",
        "waypoints": [
            {"lat": 17.4600, "lon": 78.3450, "road": "ORR Nanakramguda Exit"},
            {"lat": 17.4350, "lon": 78.3500, "road": "ORR Financial District Straight"},
            {"lat": 17.4180, "lon": 78.3580, "road": "ORR Gachibowli Interchange"},
            {"lat": 17.3950, "lon": 78.3750, "road": "ORR Rajendranagar Stretch"}
        ]
    }
}

class VehicleSimulator:
    def __init__(self, vehicle_id: str = "VEH-HYD-001", vehicle_type: VehicleType = VehicleType.CAR):
        self.vehicle_id = vehicle_id
        self.vehicle_type = vehicle_type
        self.route_id = "route_hussain_sagar_necklace"
        self.route = HYDERABAD_ROUTES[self.route_id]
        
        # Motion & Position state
        self.current_segment_idx = 0
        self.segment_fraction = 0.0
        self.is_running = True
        
        # Initial coordinates
        wp0 = self.route["waypoints"][0]
        wp1 = self.route["waypoints"][1]
        self.lat = wp0["lat"]
        self.lon = wp0["lon"]
        self.heading = calculate_bearing(wp0["lat"], wp0["lon"], wp1["lat"], wp1["lon"])
        self.current_road = wp0["road"]
        
        # Kinematics & Behavior Engine State
        self.default_speed_kmh = self.route.get("default_speed_kmh", 45.0)
        self.speed_kmh = 35.0 if vehicle_type == VehicleType.CAR else 30.0
        self.target_speed_kmh = self.default_speed_kmh
        self.acceleration_mps2 = 0.0
        self.behavior_state = VehicleBehaviorState.MOVING
        self.active_rule = "CRUISE_CORRIDOR"
        self.decision_reason = "Cruising along corridor path at road design speed"
        self.distance_to_stop_line_m: Optional[float] = None
        self.distance_to_event_m: Optional[float] = None
        self.stop_line_lat: Optional[float] = None
        self.stop_line_lon: Optional[float] = None
        
        # Telemetry & intelligence state
        self.active_events: List[RoadEvent] = []
        self.approaching_events: List[RoadEvent] = []
        self.upcoming_signal: Optional[TrafficSignal] = None
        self.recommended_speed_kmh = 40.0
        self.advisory_message = "RoadSense AI Active: Cruising Cyber Towers Corridor"
        self.conflict_detected = False
        self.conflict_details = None

    def set_route(self, route_id: str):
        if route_id in HYDERABAD_ROUTES:
            self.route_id = route_id
            self.route = HYDERABAD_ROUTES[route_id]
            self.default_speed_kmh = self.route.get("default_speed_kmh", 45.0)
            self.reset()

    def set_vehicle_type(self, v_type: VehicleType):
        self.vehicle_type = v_type
        if v_type == VehicleType.BIKE:
            self.default_speed_kmh = min(self.default_speed_kmh, 45.0)

    def play(self):
        self.is_running = True

    def pause(self):
        self.is_running = False

    def reset(self):
        self.current_segment_idx = 0
        self.segment_fraction = 0.0
        wp0 = self.route["waypoints"][0]
        wp1 = self.route["waypoints"][min(1, len(self.route["waypoints"]) - 1)]
        self.lat = wp0["lat"]
        self.lon = wp0["lon"]
        self.heading = calculate_bearing(wp0["lat"], wp0["lon"], wp1["lat"], wp1["lon"])
        self.speed_kmh = 35.0
        self.target_speed_kmh = self.default_speed_kmh
        self.behavior_state = VehicleBehaviorState.MOVING
        self.active_rule = "CRUISE_CORRIDOR"
        self.decision_reason = "Simulation initialized"
        self.is_running = True

    def speed_up(self, delta: float = 5.0):
        self.default_speed_kmh = min(120.0, self.default_speed_kmh + delta)

    def slow_down(self, delta: float = 5.0):
        self.default_speed_kmh = max(15.0, self.default_speed_kmh - delta)

    def step(self, delta_seconds: float = 0.5) -> VehicleState:
        """
        Advances the simulation by delta_seconds executing the authentic
        rule-based behavior and physics engine.
        """
        wps = self.route["waypoints"]
        num_segs = len(wps) - 1

        # 1. Advance Infrastructure Traffic Signals
        signal_simulator.tick(delta_seconds)

        # 2. Query V-RIUs and Road Event State Machine
        all_rius = riu_service.get_all_rius()
        active_events, approaching_events, _ = road_event_engine.evaluate_vehicle_events(
            self.vehicle_id, self.lat, self.lon, self.heading, self.speed_kmh, all_rius
        )
        self.active_events = active_events
        self.approaching_events = approaching_events

        # 3. Query Upcoming Traffic Signal
        self.upcoming_signal = signal_simulator.get_upcoming_signal(
            self.lat, self.lon, self.heading, self.speed_kmh
        )

        # 4. Evaluate Traffic Rules via VehicleBehaviorEngine
        decision = vehicle_behavior_engine.evaluate_traffic_rules(
            current_speed_kmh=self.speed_kmh,
            current_lat=self.lat,
            current_lon=self.lon,
            heading=self.heading,
            default_corridor_speed_kmh=self.default_speed_kmh,
            active_events=self.active_events,
            approaching_events=self.approaching_events,
            upcoming_signal=self.upcoming_signal,
            current_behavior=self.behavior_state,
            delta_seconds=delta_seconds
        )

        # Update decision parameters
        self.target_speed_kmh = decision["target_speed_kmh"]
        target_accel = decision["target_accel_mps2"]
        prev_behavior = self.behavior_state
        self.behavior_state = decision["behavior_state"]
        self.active_rule = decision["active_rule"]
        self.decision_reason = decision["decision_reason"]
        self.distance_to_stop_line_m = decision["distance_to_stop_line_m"]
        self.distance_to_event_m = decision["distance_to_event_m"]
        self.stop_line_lat = decision["stop_line_lat"]
        self.stop_line_lon = decision["stop_line_lon"]
        hold_pos = decision["hold_position"]

        # Log state transition if changed
        if prev_behavior != self.behavior_state:
            vehicle_behavior_engine.log_event(
                self.vehicle_id, self.behavior_state, self.active_rule, self.decision_reason, self.speed_kmh
            )

        # 5. Integrate Vehicle Kinematics Physics
        if self.is_running and num_segs > 0:
            new_spd, actual_accel, dist_moved_m = vehicle_behavior_engine.update_vehicle_physics(
                current_speed_kmh=self.speed_kmh,
                target_speed_kmh=self.target_speed_kmh,
                target_accel_mps2=target_accel,
                hold_position=hold_pos,
                delta_seconds=delta_seconds
            )
            self.speed_kmh = new_spd
            self.acceleration_mps2 = actual_accel

            # 6. Physical Position Update
            if dist_moved_m > 0 and not hold_pos:
                p1 = wps[self.current_segment_idx]
                p2 = wps[self.current_segment_idx + 1]
                seg_len_m = haversine_distance(p1["lat"], p1["lon"], p2["lat"], p2["lon"])

                if seg_len_m > 0:
                    fraction_step = dist_moved_m / seg_len_m
                    self.segment_fraction += fraction_step

                    if self.segment_fraction >= 1.0:
                        # Move to next road segment
                        self.current_segment_idx += 1
                        self.segment_fraction = 0.0

                        if self.current_segment_idx >= num_segs:
                            # Loop back to start for continuous corridor simulation
                            self.current_segment_idx = 0

                        p1 = wps[self.current_segment_idx]
                        p2 = wps[self.current_segment_idx + 1]

                    self.lat, self.lon = interpolate_segment(
                        p1["lat"], p1["lon"], p2["lat"], p2["lon"], self.segment_fraction
                    )
                    self.heading = calculate_bearing(p1["lat"], p1["lon"], p2["lat"], p2["lon"])
                    self.current_road = p1["road"]

            # Handle No-Entry Rerouting
            if self.behavior_state == VehicleBehaviorState.REROUTING:
                # Switch to alternative route to bypass restriction
                if self.route_id == "route_hitec_gachibowli":
                    self.set_route("route_jubilee_cable_bridge")
                else:
                    self.set_route("route_hitec_gachibowli")

        # 7. Format Driver Advisory Message
        self.recommended_speed_kmh = self.target_speed_kmh
        self.advisory_message = self.decision_reason

        overall_progress = ((self.current_segment_idx + self.segment_fraction) / max(1, num_segs)) * 100.0

        return VehicleState(
            vehicle_id=self.vehicle_id,
            vehicle_type=self.vehicle_type,
            latitude=round(self.lat, 6),
            longitude=round(self.lon, 6),
            speed_kmh=round(self.speed_kmh, 1),
            target_speed_kmh=round(self.target_speed_kmh, 1),
            acceleration_mps2=round(self.acceleration_mps2, 2),
            heading=round(self.heading, 1),
            current_road=self.current_road,
            road_segment_id=f"HYD-ROAD-{101 + self.current_segment_idx}",
            route_id=self.route_id,
            progress_pct=round(overall_progress, 1),
            is_running=self.is_running,
            behavior_state=self.behavior_state,
            active_rule=self.active_rule,
            decision_reason=self.decision_reason,
            distance_to_stop_line_m=self.distance_to_stop_line_m,
            distance_to_event_m=self.distance_to_event_m,
            stop_line_lat=self.stop_line_lat,
            stop_line_lon=self.stop_line_lon,
            active_events=self.active_events,
            approaching_events=self.approaching_events,
            active_signal=self.upcoming_signal,
            recommended_speed_kmh=self.recommended_speed_kmh,
            advisory_message=self.advisory_message,
            conflict_detected=self.conflict_detected,
            conflict_details=self.conflict_details,
            recent_event_logs=vehicle_behavior_engine.event_log[-6:],
            timestamp=time.strftime("%Y-%m-%d %H:%M:%S")
        )

vehicle_simulator = VehicleSimulator()
