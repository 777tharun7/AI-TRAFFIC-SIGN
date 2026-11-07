"""
Vehicle Behavior Engine & Traffic Rules Controller for RoadSense AI.
Implements authentic rule-based vehicle physics, stop line calculations,
event priority arbitration, and state-machine transitions.

Architecture:
  UPCOMING EVENTS / SIGNALS
           ↓
  TRAFFIC RULES ENGINE (Red, Yellow, Green, Speed Limits, Bumps, Stop Signs, No Entry)
           ↓
  VEHICLE BEHAVIOR ENGINE (State Machine & Speed Control)
           ↓
  VEHICLE KINEMATICS & PHYSICS (dt integration & position update)
"""

import time
import math
from typing import List, Dict, Tuple, Optional, Any
from ..models.schemas import (
    VehicleState, VehicleBehaviorState, VehicleType, 
    RoadEvent, TrafficSignal, SignalState, PriorityLevel
)
from .geospatial import haversine_distance, calculate_bearing

class VehicleBehaviorEngine:
    def __init__(self):
        # Kinematic limits (SI units: m/s^2)
        self.comfort_accel = 1.8      # Normal cruising acceleration
        self.comfort_decel = 2.6      # Normal braking deceleration
        self.max_braking_decel = 4.5  # Emergency braking limit
        self.reaction_time_s = 0.4    # Simulated driver / ADAS reaction delay
        
        # State tracking
        self.stop_wait_timer = 0.0
        self.min_stop_sign_duration_s = 3.0
        self.police_stop_timer = 0.0
        self.min_police_stop_duration_s = 5.0
        self.event_log: List[Dict[str, Any]] = []

    def calculate_stopping_distance(self, speed_kmh: float, decel_mps2: Optional[float] = None) -> float:
        """
        Calculates required safe stopping distance: d_stop = (v^2 / 2a) + v*t_reaction.
        """
        v_ms = (speed_kmh * 1000.0) / 3600.0
        a = decel_mps2 or self.comfort_decel
        braking_dist = (v_ms ** 2) / (2.0 * max(a, 0.5))
        reaction_dist = v_ms * self.reaction_time_s
        return braking_dist + reaction_dist

    def evaluate_traffic_rules(
        self,
        current_speed_kmh: float,
        current_lat: float,
        current_lon: float,
        heading: float,
        default_corridor_speed_kmh: float,
        active_events: List[RoadEvent],
        approaching_events: List[RoadEvent],
        upcoming_signal: Optional[TrafficSignal],
        current_behavior: VehicleBehaviorState,
        delta_seconds: float
    ) -> Dict[str, Any]:
        """
        Evaluates upcoming traffic events and signals in strict priority order to determine:
        - Target Speed (km/h)
        - Target Acceleration / Deceleration (m/s^2)
        - Next Vehicle Behavior State
        - Active Decision Reason & Rule
        - Distance to Stop Line / Event
        """
        v_ms = (current_speed_kmh * 1000.0) / 3600.0
        safe_stop_dist = self.calculate_stopping_distance(current_speed_kmh)

        # Initialize default cruise decision
        decision = {
            "target_speed_kmh": default_corridor_speed_kmh,
            "target_accel_mps2": self.comfort_accel,
            "behavior_state": VehicleBehaviorState.MOVING,
            "active_rule": "CRUISE_CORRIDOR",
            "decision_reason": f"Cruising clear at design speed ({int(default_corridor_speed_kmh)} km/h)",
            "distance_to_stop_line_m": None,
            "distance_to_event_m": None,
            "stop_line_lat": None,
            "stop_line_lon": None,
            "hold_position": False
        }

        # -------------------------------------------------------------
        # PRIORITY 1 (CRITICAL): TRAFFIC SIGNALS (RED / YELLOW / GREEN)
        # -------------------------------------------------------------
        if upcoming_signal:
            sig_lat = upcoming_signal.latitude
            sig_lon = upcoming_signal.longitude
            sig_dist = haversine_distance(current_lat, current_lon, sig_lat, sig_lon)
            
            # Virtual Stop Line positioned 8.0m before the physical signal post
            stop_line_offset_m = 8.0
            dist_to_stop_line = max(0.0, sig_dist - stop_line_offset_m)
            
            # Compute stop line coordinates
            bearing_rad = math.radians(upcoming_signal.direction)
            # Offset backwards from signal pole
            d_lat = -(stop_line_offset_m / 111320.0) * math.cos(bearing_rad)
            d_lon = -(stop_line_offset_m / (111320.0 * math.cos(math.radians(sig_lat)))) * math.sin(bearing_rad)
            stop_line_lat = sig_lat + d_lat
            stop_line_lon = sig_lon + d_lon
            
            decision["distance_to_stop_line_m"] = round(dist_to_stop_line, 1)
            decision["distance_to_event_m"] = round(dist_to_stop_line, 1)
            decision["stop_line_lat"] = round(stop_line_lat, 6)
            decision["stop_line_lon"] = round(stop_line_lon, 6)

            # Signal State Evaluation
            if upcoming_signal.state == SignalState.RED:
                rem_time = upcoming_signal.remaining_time
                
                # Case A: Already stopped or at stop line
                if dist_to_stop_line <= 3.0 or current_behavior in [VehicleBehaviorState.STOPPED, VehicleBehaviorState.WAITING_FOR_GREEN]:
                    decision["target_speed_kmh"] = 0.0
                    decision["target_accel_mps2"] = 0.0
                    decision["behavior_state"] = VehicleBehaviorState.WAITING_FOR_GREEN
                    decision["active_rule"] = "MANDATORY_STOP_RED_SIGNAL"
                    decision["decision_reason"] = f"Signal is RED ({rem_time}s left) — Holding stopped behind Stop Line ({dist_to_stop_line:.1f}m)"
                    decision["hold_position"] = True
                    return decision
                    
                # Case B: Approaching & Decelerating before stop line
                elif dist_to_stop_line <= safe_stop_dist + 35.0:
                    # Calculate required smooth deceleration to reach 0 at stop line
                    needed_decel = (v_ms ** 2) / (2.0 * max(dist_to_stop_line - 1.5, 1.0))
                    clamped_decel = min(self.max_braking_decel, max(self.comfort_decel, needed_decel))
                    
                    # Target speed scales progressively with remaining distance to stop line
                    fraction = max(0.0, min(1.0, (dist_to_stop_line - 2.0) / (safe_stop_dist + 35.0)))
                    target_v = current_speed_kmh * (fraction ** 0.85)
                    decision["target_speed_kmh"] = round(min(target_v, current_speed_kmh * 0.88), 1)
                    decision["target_accel_mps2"] = -clamped_decel
                    decision["behavior_state"] = VehicleBehaviorState.DECELERATING if dist_to_stop_line > 10.0 else VehicleBehaviorState.STOPPING
                    decision["active_rule"] = "DECELERATE_RED_SIGNAL"
                    decision["decision_reason"] = f"RED Signal ahead ({rem_time}s, {dist_to_stop_line:.0f}m) — Decelerating to Stop Line"
                    return decision
                    
                elif dist_to_stop_line <= 180.0:
                    decision["behavior_state"] = VehicleBehaviorState.APPROACHING_EVENT
                    decision["decision_reason"] = f"Signal ahead is RED ({rem_time}s) — Approaching intersection ({dist_to_stop_line:.0f}m)"

            elif upcoming_signal.state == SignalState.YELLOW:
                # Dilemma zone evaluation
                if dist_to_stop_line > safe_stop_dist:
                    # Safe to stop
                    needed_decel = min(self.max_braking_decel, (v_ms ** 2) / (2.0 * max(dist_to_stop_line - 1.5, 1.0)))
                    decision["target_speed_kmh"] = 0.0
                    decision["target_accel_mps2"] = -needed_decel
                    decision["behavior_state"] = VehicleBehaviorState.DECELERATING
                    decision["active_rule"] = "STOP_YELLOW_SIGNAL"
                    decision["decision_reason"] = f"Yellow Signal ({dist_to_stop_line:.0f}m) — Safely decelerating before stop line"
                    return decision
                else:
                    # Inside safe stopping distance — continue through intersection safely
                    decision["target_speed_kmh"] = min(default_corridor_speed_kmh, 45.0)
                    decision["behavior_state"] = VehicleBehaviorState.MOVING
                    decision["active_rule"] = "PASS_YELLOW_SIGNAL"
                    decision["decision_reason"] = "Yellow Signal — Inside braking threshold; proceeding safely through intersection"
                    return decision

            elif upcoming_signal.state == SignalState.GREEN:
                # Was waiting at RED and now GREEN -> Resume acceleration!
                if current_behavior in [VehicleBehaviorState.WAITING_FOR_GREEN, VehicleBehaviorState.STOPPED, VehicleBehaviorState.RESUMING]:
                    decision["target_speed_kmh"] = default_corridor_speed_kmh
                    decision["target_accel_mps2"] = self.comfort_accel
                    decision["behavior_state"] = VehicleBehaviorState.RESUMING if current_speed_kmh < (default_corridor_speed_kmh * 0.7) else VehicleBehaviorState.MOVING
                    decision["active_rule"] = "RESUME_GREEN_SIGNAL"
                    decision["decision_reason"] = f"Signal changed to GREEN ({upcoming_signal.remaining_time}s) — Resuming acceleration"
                    decision["hold_position"] = False
                    return decision
                else:
                    # Normal green-wave pass
                    decision["target_speed_kmh"] = upcoming_signal.recommended_speed_max or default_corridor_speed_kmh
                    decision["behavior_state"] = VehicleBehaviorState.MOVING
                    decision["active_rule"] = "GREEN_WAVE_CONTINUE"
                    decision["decision_reason"] = f"Green Signal active ({upcoming_signal.remaining_time}s) — Maintaining green-wave flow"

        # -------------------------------------------------------------
        # PRIORITY 2 (CRITICAL): TRAFFIC POLICE MANUAL HALT / VIP MINISTER CONVOY
        # -------------------------------------------------------------
        police_events = [e for e in active_events + approaching_events if e.event_type in ["POLICE_HALT", "VIP_CONVOY"]]
        if police_events:
            pol_evt = police_events[0]
            dist_to_pol = pol_evt.distance_to_vehicle or haversine_distance(current_lat, current_lon, pol_evt.latitude, pol_evt.longitude)
            decision["distance_to_event_m"] = round(dist_to_pol, 1)

            if current_behavior == VehicleBehaviorState.WAITING_FOR_POLICE_CLEARANCE:
                self.police_stop_timer += delta_seconds
                if self.police_stop_timer >= self.min_police_stop_duration_s:
                    self.police_stop_timer = 0.0
                    decision["target_speed_kmh"] = default_corridor_speed_kmh
                    decision["target_accel_mps2"] = self.comfort_accel
                    decision["behavior_state"] = VehicleBehaviorState.RESUMING
                    decision["active_rule"] = "VIP_CONVOY_CLEARED_POLICE_GO"
                    decision["decision_reason"] = "VIP Minister Convoy cleared — Traffic Police signaling Green Go — Resuming travel"
                    decision["hold_position"] = False
                    return decision
                else:
                    decision["target_speed_kmh"] = 0.0
                    decision["behavior_state"] = VehicleBehaviorState.WAITING_FOR_POLICE_CLEARANCE
                    decision["active_rule"] = "MANDATORY_POLICE_VIP_HALT"
                    decision["decision_reason"] = f"VIP Minister Convoy passing — Traffic Police holding traffic stopped ({self.police_stop_timer:.1f}s / {self.min_police_stop_duration_s:.0f}s)"
                    decision["hold_position"] = True
                    return decision
            elif dist_to_pol <= 4.0 or (dist_to_pol <= 15.0 and current_speed_kmh <= 6.0):
                self.police_stop_timer = 0.0
                decision["target_speed_kmh"] = 0.0
                decision["behavior_state"] = VehicleBehaviorState.WAITING_FOR_POLICE_CLEARANCE
                decision["active_rule"] = "MANDATORY_POLICE_VIP_HALT"
                decision["decision_reason"] = "VIP Convoy Arrived — Traffic Police manual halt instruction active"
                decision["hold_position"] = True
                return decision
            elif dist_to_pol <= safe_stop_dist + 25.0:
                needed_decel = min(self.max_braking_decel, (v_ms ** 2) / (2.0 * max(dist_to_pol - 2.0, 1.0)))
                decision["target_speed_kmh"] = 0.0
                decision["target_accel_mps2"] = -needed_decel
                decision["behavior_state"] = VehicleBehaviorState.DECELERATING
                decision["active_rule"] = "DECELERATE_POLICE_VIP_HALT"
                decision["decision_reason"] = f"Traffic Police Halt / VIP Convoy ahead ({dist_to_pol:.0f}m) — Decelerating to Police Halt line"
                return decision

        # -------------------------------------------------------------
        # PRIORITY 3 (CRITICAL): STOP SIGNS (MANDATORY 3-SECOND STOP)
        # -------------------------------------------------------------
        stop_events = [e for e in active_events + approaching_events if e.event_type == "STOP"]
        if stop_events:
            stop_evt = stop_events[0]
            dist_to_stop = stop_evt.distance_to_vehicle or haversine_distance(current_lat, current_lon, stop_evt.latitude, stop_evt.longitude)
            decision["distance_to_event_m"] = round(dist_to_stop, 1)

            if current_behavior == VehicleBehaviorState.WAITING_AT_STOP_SIGN:
                self.stop_wait_timer += delta_seconds
                if self.stop_wait_timer >= self.min_stop_sign_duration_s:
                    # Finished mandatory 3s stop -> Resume!
                    self.stop_wait_timer = 0.0
                    decision["target_speed_kmh"] = default_corridor_speed_kmh
                    decision["target_accel_mps2"] = self.comfort_accel
                    decision["behavior_state"] = VehicleBehaviorState.RESUMING
                    decision["active_rule"] = "STOP_SIGN_CLEARED"
                    decision["decision_reason"] = "Mandatory stop duration completed (3.0s) — Resuming travel"
                    return decision
                else:
                    decision["target_speed_kmh"] = 0.0
                    decision["behavior_state"] = VehicleBehaviorState.WAITING_AT_STOP_SIGN
                    decision["active_rule"] = "MANDATORY_STOP_SIGN_HOLD"
                    decision["decision_reason"] = f"STOP Sign — Holding mandatory stop ({self.stop_wait_timer:.1f}s / {self.min_stop_sign_duration_s:.0f}s)"
                    decision["hold_position"] = True
                    return decision
            elif dist_to_stop <= 3.0 or (dist_to_stop <= 12.0 and current_speed_kmh <= 5.0):
                # Arrived at Stop Sign -> Begin 3-second hold
                self.stop_wait_timer = 0.0
                decision["target_speed_kmh"] = 0.0
                decision["behavior_state"] = VehicleBehaviorState.WAITING_AT_STOP_SIGN
                decision["active_rule"] = "MANDATORY_STOP_SIGN_HOLD"
                decision["decision_reason"] = "STOP Sign arrived — Initiating mandatory 3.0s complete stop"
                decision["hold_position"] = True
                return decision
            elif dist_to_stop <= safe_stop_dist + 20.0:
                needed_decel = min(self.max_braking_decel, (v_ms ** 2) / (2.0 * max(dist_to_stop - 2.0, 1.0)))
                decision["target_speed_kmh"] = 0.0
                decision["target_accel_mps2"] = -needed_decel
                decision["behavior_state"] = VehicleBehaviorState.DECELERATING
                decision["active_rule"] = "DECELERATE_STOP_SIGN"
                decision["decision_reason"] = f"STOP Sign {dist_to_stop:.0f}m ahead — Decelerating to complete stop"
                return decision

        # -------------------------------------------------------------
        # PRIORITY 3 (CRITICAL): NO ENTRY (STOP BEFORE & REROUTE)
        # -------------------------------------------------------------
        no_entry_events = [e for e in active_events + approaching_events if e.event_type == "NO_ENTRY"]
        if no_entry_events:
            ne_evt = no_entry_events[0]
            dist_to_ne = ne_evt.distance_to_vehicle or haversine_distance(current_lat, current_lon, ne_evt.latitude, ne_evt.longitude)
            decision["distance_to_event_m"] = round(dist_to_ne, 1)

            if dist_to_ne <= 10.0 or current_speed_kmh <= 3.0:
                decision["target_speed_kmh"] = 0.0
                decision["behavior_state"] = VehicleBehaviorState.REROUTING
                decision["active_rule"] = "NO_ENTRY_REROUTE"
                decision["decision_reason"] = "RESTRICTED / NO ENTRY SEGMENT — Stopping and calculating alternative detour"
                decision["hold_position"] = True
                return decision
            elif dist_to_ne <= safe_stop_dist + 25.0:
                decision["target_speed_kmh"] = 0.0
                decision["target_accel_mps2"] = -self.comfort_decel
                decision["behavior_state"] = VehicleBehaviorState.DECELERATING
                decision["active_rule"] = "NO_ENTRY_APPROACH"
                decision["decision_reason"] = f"NO ENTRY ahead ({dist_to_ne:.0f}m) — Decelerating before restricted boundary"
                return decision

        # -------------------------------------------------------------
        # PRIORITY 4 (MEDIUM): SPEED BREAKER (SLOW DOWN TO ~20 km/h, NEVER STOP)
        # -------------------------------------------------------------
        bump_events = [e for e in active_events + approaching_events if e.event_type == "SPEED_BREAKER"]
        if bump_events:
            bump_evt = bump_events[0]
            dist_to_bump = bump_evt.distance_to_vehicle or haversine_distance(current_lat, current_lon, bump_evt.latitude, bump_evt.longitude)
            decision["distance_to_event_m"] = round(dist_to_bump, 1)

            if dist_to_bump <= 15.0:
                # Over the speed breaker
                decision["target_speed_kmh"] = 20.0
                decision["target_accel_mps2"] = self.comfort_decel
                decision["behavior_state"] = VehicleBehaviorState.MOVING
                decision["active_rule"] = "CROSSING_SPEED_BREAKER"
                decision["decision_reason"] = "Crossing Speed Breaker at caution speed (20 km/h)"
                return decision
            elif dist_to_bump <= 70.0:
                decision["target_speed_kmh"] = 20.0
                decision["target_accel_mps2"] = -self.comfort_decel
                decision["behavior_state"] = VehicleBehaviorState.DECELERATING
                decision["active_rule"] = "APPROACHING_SPEED_BREAKER"
                decision["decision_reason"] = f"Speed Breaker {dist_to_bump:.0f}m ahead — Slowing down to 20 km/h"
                return decision

        # -------------------------------------------------------------
        # PRIORITY 5 (MEDIUM): SPEED LIMITS (REDUCE & CAP SPEED, NEVER STOP)
        # -------------------------------------------------------------
        speed_limit_events = [e for e in active_events + approaching_events if e.event_type.startswith("SPEED_LIMIT") and e.value]
        if speed_limit_events:
            sl_evt = speed_limit_events[0]
            limit_val = float(sl_evt.value)
            dist_to_sl = sl_evt.distance_to_vehicle or haversine_distance(current_lat, current_lon, sl_evt.latitude, sl_evt.longitude)
            decision["distance_to_event_m"] = round(dist_to_sl, 1)

            if current_speed_kmh > limit_val:
                decision["target_speed_kmh"] = limit_val
                decision["target_accel_mps2"] = -self.comfort_decel
                decision["behavior_state"] = VehicleBehaviorState.DECELERATING
                decision["active_rule"] = f"ADAPTING_SPEED_LIMIT_{int(limit_val)}"
                decision["decision_reason"] = f"Speed Limit {int(limit_val)} km/h active — Decelerating from {current_speed_kmh:.0f} to {int(limit_val)} km/h"
                return decision
            else:
                decision["target_speed_kmh"] = min(limit_val, default_corridor_speed_kmh)
                decision["behavior_state"] = VehicleBehaviorState.MOVING
                decision["active_rule"] = f"SPEED_LIMIT_{int(limit_val)}_COMPLIANT"
                decision["decision_reason"] = f"Speed Limit {int(limit_val)} km/h — Compliant speed maintained"
                return decision

        # -------------------------------------------------------------
        # PRIORITY 6 (MEDIUM): ROAD WORK (CAUTION SPEED ~30 km/h)
        # -------------------------------------------------------------
        work_events = [e for e in active_events + approaching_events if e.event_type == "ROAD_WORK"]
        if work_events:
            work_evt = work_events[0]
            dist_to_work = work_evt.distance_to_vehicle or 50.0
            decision["target_speed_kmh"] = 30.0
            decision["behavior_state"] = VehicleBehaviorState.DECELERATING if current_speed_kmh > 32.0 else VehicleBehaviorState.MOVING
            decision["active_rule"] = "ROAD_WORK_CAUTION"
            decision["decision_reason"] = f"Road Work in Progress ({dist_to_work:.0f}m ahead) — Maintaining 30 km/h caution speed"
            return decision

        # -------------------------------------------------------------
        # PRIORITY 7: PEDESTRIAN CROSSING
        # -------------------------------------------------------------
        ped_events = [e for e in active_events + approaching_events if e.event_type == "PEDESTRIAN_CROSSING"]
        if ped_events:
            ped_evt = ped_events[0]
            dist_to_ped = ped_evt.distance_to_vehicle or 60.0
            if dist_to_ped <= 50.0:
                decision["target_speed_kmh"] = 30.0
                decision["behavior_state"] = VehicleBehaviorState.MOVING
                decision["active_rule"] = "PEDESTRIAN_CROSSING_CAUTION"
                decision["decision_reason"] = f"Pedestrian Crossing ({dist_to_ped:.0f}m) — Caution speed active"
                return decision

        return decision

    def update_vehicle_physics(
        self,
        current_speed_kmh: float,
        target_speed_kmh: float,
        target_accel_mps2: float,
        hold_position: bool,
        delta_seconds: float
    ) -> Tuple[float, float, float]:
        """
        Integrates kinematics:
        v(t + dt) = v(t) + a * dt
        Returns: (new_speed_kmh, actual_accel_mps2, distance_moved_meters)
        """
        if hold_position:
            return 0.0, 0.0, 0.0

        v_ms = (current_speed_kmh * 1000.0) / 3600.0
        target_v_ms = (target_speed_kmh * 1000.0) / 3600.0

        diff_v = target_v_ms - v_ms
        if abs(diff_v) < 0.1:
            new_v_ms = target_v_ms
            actual_accel = 0.0
        elif diff_v > 0:
            # Accelerating
            actual_accel = min(target_accel_mps2, self.comfort_accel)
            new_v_ms = min(target_v_ms, v_ms + (actual_accel * delta_seconds))
        else:
            # Decelerating / Braking
            actual_accel = -min(abs(target_accel_mps2), self.max_braking_decel)
            new_v_ms = max(0.0, v_ms + (actual_accel * delta_seconds))

        new_speed_kmh = max(0.0, (new_v_ms * 3600.0) / 1000.0)
        
        # Average velocity across the timestep for precise distance integration
        avg_v_ms = (v_ms + new_v_ms) / 2.0
        dist_moved_m = avg_v_ms * delta_seconds if new_speed_kmh > 0.01 else 0.0

        return round(new_speed_kmh, 1), round(actual_accel, 2), dist_moved_m

    def log_event(self, vehicle_id: str, behavior: VehicleBehaviorState, rule: str, reason: str, speed_kmh: float):
        timestamp_str = time.strftime("%H:%M:%S")
        entry = {
            "timestamp": timestamp_str,
            "vehicle_id": vehicle_id,
            "behavior_state": behavior.value,
            "rule": rule,
            "decision": reason,
            "speed_kmh": speed_kmh
        }
        self.event_log.append(entry)
        if len(self.event_log) > 20:
            self.event_log.pop(0)

vehicle_behavior_engine = VehicleBehaviorEngine()
