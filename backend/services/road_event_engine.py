"""
Road Event State Machine & Predictive Activation Engine.
Implements the 5-State Life Cycle:
DISCOVERED -> APPROACHING -> ACTIVE -> PASSED -> COMPLETED

Features:
- Rigorous Passed-Sign solution with signed along-track projections
- Angular heading validation (default ±30° tolerance)
- Geofence radius checks
- Dynamic active event filtering and automatic alert retirement
"""

import time
from typing import List, Dict, Optional, Tuple
from ..models.schemas import RoadEvent, RoadEventState, PriorityLevel, VirtualRIU
from .geospatial import haversine_distance, calculate_along_track_distance, is_heading_aligned

class RoadEventEngine:
    def __init__(self, heading_tolerance: float = 30.0):
        self.heading_tolerance = heading_tolerance
        self._road_events: Dict[str, RoadEvent] = {}
        self._vehicle_event_states: Dict[str, Dict[str, RoadEventState]] = {}
        self._init_catalog_events()

    def _init_catalog_events(self):
        catalog = [
            {
                "event_id": "EVT-HYD-001",
                "event_type": "SPEED_LIMIT",
                "name": "Speed Limit 40 km/h Ahead",
                "value": 40.0,
                "unit": "km/h",
                "latitude": 17.4498,
                "longitude": 78.3805,
                "heading": 92.0,
                "direction": 92.0,
                "road_segment_id": "HYD-ROAD-101",
                "activation_distance": 250.0,
                "trigger_distance": 50.0,
                "expiry_distance": 60.0,
                "priority": PriorityLevel.MEDIUM,
                "confidence": 0.98,
                "source": "SIMULATED_RIU"
            },
            {
                "event_id": "EVT-HYD-002",
                "event_type": "SPEED_BREAKER",
                "name": "Speed Breaker / Hump Ahead",
                "value": 20.0,
                "unit": "km/h",
                "latitude": 17.4425,
                "longitude": 78.3822,
                "heading": 105.0,
                "direction": 105.0,
                "road_segment_id": "HYD-ROAD-102",
                "activation_distance": 200.0,
                "trigger_distance": 45.0,
                "expiry_distance": 50.0,
                "priority": PriorityLevel.HIGH,
                "confidence": 0.95,
                "source": "SIMULATED_RIU"
            },
            {
                "event_id": "EVT-HYD-003",
                "event_type": "PEDESTRIAN_CROSSING",
                "name": "Pedestrian Crossing / School Ahead",
                "value": 25.0,
                "unit": "km/h",
                "latitude": 17.4368,
                "longitude": 78.3615,
                "heading": 130.0,
                "direction": 130.0,
                "road_segment_id": "HYD-ROAD-103",
                "activation_distance": 220.0,
                "trigger_distance": 50.0,
                "expiry_distance": 55.0,
                "priority": PriorityLevel.HIGH,
                "confidence": 0.92,
                "source": "SIMULATED_RIU"
            },
            {
                "event_id": "EVT-HYD-004",
                "event_type": "STOP",
                "name": "Stop Sign at Junction Entry",
                "value": 0.0,
                "unit": None,
                "latitude": 17.4322,
                "longitude": 78.3715,
                "heading": 145.0,
                "direction": 145.0,
                "road_segment_id": "HYD-ROAD-104",
                "activation_distance": 180.0,
                "trigger_distance": 40.0,
                "expiry_distance": 45.0,
                "priority": PriorityLevel.HIGH,
                "confidence": 0.96,
                "source": "SIMULATED_RIU"
            },
            {
                "event_id": "EVT-HYD-005",
                "event_type": "SPEED_LIMIT",
                "name": "Expressway Speed Limit 80 km/h",
                "value": 80.0,
                "unit": "km/h",
                "latitude": 17.4210,
                "longitude": 78.3545,
                "heading": 185.0,
                "direction": 185.0,
                "road_segment_id": "HYD-ROAD-105",
                "activation_distance": 350.0,
                "trigger_distance": 70.0,
                "expiry_distance": 80.0,
                "priority": PriorityLevel.MEDIUM,
                "confidence": 0.99,
                "source": "SIMULATED_RIU"
            },
            {
                "event_id": "EVT-HYD-006",
                "event_type": "ROAD_WORK",
                "name": "Road Work / Lane Restriction Ahead",
                "value": 30.0,
                "unit": "km/h",
                "latitude": 17.4338,
                "longitude": 78.4055,
                "heading": 78.0,
                "direction": 78.0,
                "road_segment_id": "HYD-ROAD-106",
                "activation_distance": 280.0,
                "trigger_distance": 60.0,
                "expiry_distance": 70.0,
                "priority": PriorityLevel.HIGH,
                "confidence": 0.94,
                "source": "SIMULATED_RIU"
            },
            {
                "event_id": "EVT-HYD-007",
                "event_type": "NO_ENTRY",
                "name": "Wrong Way / Restricted Access",
                "value": None,
                "unit": None,
                "latitude": 17.4335,
                "longitude": 78.3908,
                "heading": 270.0,
                "direction": 270.0,
                "road_segment_id": "HYD-ROAD-107",
                "activation_distance": 200.0,
                "trigger_distance": 40.0,
                "expiry_distance": 50.0,
                "priority": PriorityLevel.CRITICAL,
                "confidence": 0.99,
                "source": "SIMULATED_RIU"
            }
        ]
        
        now = time.strftime("%Y-%m-%d %H:%M:%S")
        for c in catalog:
            c["created_at"] = now
            c["updated_at"] = now
            evt = RoadEvent(**c)
            self._road_events[evt.event_id] = evt

    def evaluate_vehicle_events(
        self,
        vehicle_id: str,
        veh_lat: float,
        veh_lon: float,
        veh_heading: float,
        veh_speed_kmh: float,
        rius: List[VirtualRIU]
    ) -> Tuple[List[RoadEvent], List[RoadEvent], List[RoadEvent]]:
        """
        Executes State Machine transitions for all events relative to the moving vehicle.
        Returns (active_events, approaching_events, passed_or_completed_events).
        """
        if vehicle_id not in self._vehicle_event_states:
            self._vehicle_event_states[vehicle_id] = {}
            
        veh_states = self._vehicle_event_states[vehicle_id]
        
        active_list: List[RoadEvent] = []
        approaching_list: List[RoadEvent] = []
        completed_list: List[RoadEvent] = []
        
        # Merge catalog road events with active V-RIUs
        all_event_targets: Dict[str, RoadEvent] = dict(self._road_events)
        for r in rius:
            if r.status == "ACTIVE":
                r_id = f"EVT-{r.id}"
                if r_id not in all_event_targets:
                    all_event_targets[r_id] = RoadEvent(
                        event_id=r_id,
                        event_type=r.event_type,
                        name=f"{r.name} ({r.event_type})",
                        value=r.value,
                        unit="km/h" if r.value else None,
                        latitude=r.latitude,
                        longitude=r.longitude,
                        heading=r.direction,
                        direction=r.direction,
                        road_segment_id=r.road_segment_id,
                        activation_distance=r.activation_radius,
                        trigger_distance=r.trigger_distance,
                        expiry_distance=r.validity_distance - r.activation_radius if r.validity_distance > r.activation_radius else 60.0,
                        priority=r.priority,
                        confidence=0.98,
                        source="SIMULATED_RIU"
                    )
                    
        for evt_id, evt in all_event_targets.items():
            prev_state = veh_states.get(evt_id, RoadEventState.DISCOVERED)
            
            # Step 1: Heading Alignment Check
            aligned = is_heading_aligned(veh_heading, evt.direction, tolerance=self.heading_tolerance)
            
            # Step 2: Distance Projection
            along_dist, direct_dist = calculate_along_track_distance(
                veh_lat, veh_lon, veh_heading, evt.latitude, evt.longitude
            )
            
            evt_copy = evt.model_copy()
            evt_copy.distance_to_vehicle = round(abs(along_dist), 1)
            
            # If not heading aligned and vehicle is not actively within trigger zone, ignore/stay discovered
            if not aligned and direct_dist > 30.0:
                veh_states[evt_id] = RoadEventState.DISCOVERED
                evt_copy.state = RoadEventState.DISCOVERED
                continue
                
            # State Machine Transitions
            new_state = RoadEventState.DISCOVERED
            
            if along_dist > evt.activation_distance:
                # Far ahead
                new_state = RoadEventState.DISCOVERED
                
            elif evt.trigger_distance < along_dist <= evt.activation_distance:
                # Approaching within activation range
                new_state = RoadEventState.APPROACHING
                
            elif 0 <= along_dist <= evt.trigger_distance:
                # Vehicle is in the immediate trigger zone
                new_state = RoadEventState.ACTIVE
                
            elif -evt.expiry_distance <= along_dist < 0:
                # Vehicle has crossed the trigger line!
                new_state = RoadEventState.PASSED
                
            else:
                # along_dist < -evt.expiry_distance (Vehicle has passed beyond validity distance)
                new_state = RoadEventState.COMPLETED
                
            veh_states[evt_id] = new_state
            evt_copy.state = new_state
            
            if new_state == RoadEventState.ACTIVE:
                active_list.append(evt_copy)
            elif new_state == RoadEventState.APPROACHING:
                approaching_list.append(evt_copy)
            elif new_state in (RoadEventState.PASSED, RoadEventState.COMPLETED):
                completed_list.append(evt_copy)
                
        # Sort by distance
        active_list.sort(key=lambda x: x.distance_to_vehicle or 9999)
        approaching_list.sort(key=lambda x: x.distance_to_vehicle or 9999)
        
        return active_list, approaching_list, completed_list

    def get_all_events(self) -> List[RoadEvent]:
        return list(self._road_events.values())

road_event_engine = RoadEventEngine()
