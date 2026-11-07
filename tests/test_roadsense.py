"""
Automated Test Suite for RoadSense AI.
Verifies:
1. Traffic Sign CV Detection
2. Geospatial Mathematics & Heading Validation (±30°)
3. Road Event State Machine & Passed-Sign Resolution
4. Context Fusion Engine & Conflict Detection
5. Virtual RIU Service CRUD
6. Traffic Signal Green-Wave Prediction
"""

import os
import pytest
from backend.services.geospatial import (
    haversine_distance, calculate_bearing, angular_difference,
    is_heading_aligned, calculate_along_track_distance
)
from backend.services.road_event_engine import RoadEventEngine
from backend.services.fusion_engine import ContextFusionEngine
from backend.services.riu_service import VirtualRIUService
from backend.services.signal_simulator import TrafficSignalSimulator
from backend.models.schemas import (
    RoadEvent, RoadEventState, VirtualRIUCreate, PriorityLevel,
    DetectionItem, TrafficSignal, SignalState
)
from ml.inference.detector import TrafficSignDetector

def test_heading_validation():
    """Verify ±30° heading validation rejects opposite & perpendicular traffic."""
    # Aligned: 90° vs 87° (Diff = 3°) -> Apply
    assert is_heading_aligned(87.0, 90.0, tolerance=30.0) is True
    
    # Aligned on wrap-around: 355° vs 5° (Diff = 10°) -> Apply
    assert is_heading_aligned(355.0, 5.0, tolerance=30.0) is True
    
    # Opposite traffic: 90° vs 270° (Diff = 180°) -> Ignore
    assert is_heading_aligned(270.0, 90.0, tolerance=30.0) is False
    
    # Perpendicular: 90° vs 180° (Diff = 90°) -> Ignore
    assert is_heading_aligned(180.0, 90.0, tolerance=30.0) is False

def test_along_track_distance_passed_sign():
    """Verify along-track projection signs (Positive = Approaching, Negative = Passed)."""
    # Vehicle at (17.4500, 78.3800), heading East (90°)
    # Sign at (17.4500, 78.3810) -> Directly East ahead
    along_m, direct_m = calculate_along_track_distance(17.4500, 78.3800, 90.0, 17.4500, 78.3810)
    assert along_m > 0
    assert direct_m > 0
    
    # Vehicle passes sign: vehicle at (17.4500, 78.3820), sign at (17.4500, 78.3810)
    along_passed, _ = calculate_along_track_distance(17.4500, 78.3820, 90.0, 17.4500, 78.3810)
    assert along_passed < 0 # Negative indicates vehicle has passed the sign!

def test_road_event_state_machine_lifecycle():
    """
    CRITICAL TEST:
    Vehicle approaches sign -> APPROACHING
    Vehicle reaches trigger -> ACTIVE
    Vehicle crosses sign -> PASSED
    Vehicle leaves validity zone -> COMPLETED (Removed from active UI)
    """
    engine = RoadEventEngine(heading_tolerance=30.0)
    engine._road_events = {}  # Pure isolated test
    
    sign_lat = 17.4500
    sign_lon = 78.3810
    sign_heading = 90.0
    
    # Mock V-RIU
    riu = VirtualRIUCreate(
        name="Test Speed Limit 40",
        event_type="SPEED_LIMIT",
        value=40.0,
        latitude=sign_lat,
        longitude=sign_lon,
        direction=sign_heading,
        road_segment_id="ROAD-TEST",
        activation_radius=200.0,
        trigger_distance=40.0,
        validity_distance=250.0
    )
    riu_svc = VirtualRIUService()
    riu_svc._rius = {}
    created_riu = riu_svc.create_riu(riu)
    
    # 1. Far away (approx 500m west) -> DISCOVERED
    active, approaching, completed = engine.evaluate_vehicle_events(
        "VEH-TEST", 17.4500, 78.3750, 90.0, 40.0, [created_riu]
    )
    assert len(active) == 0
    assert len(approaching) == 0
    
    # 2. Approaching (approx 100m west) -> APPROACHING
    active, approaching, completed = engine.evaluate_vehicle_events(
        "VEH-TEST", 17.4500, 78.3800, 90.0, 40.0, [created_riu]
    )
    assert len(approaching) == 1
    assert approaching[0].state == RoadEventState.APPROACHING
    
    # 3. Inside trigger zone (approx 20m west) -> ACTIVE
    active, approaching, completed = engine.evaluate_vehicle_events(
        "VEH-TEST", 17.4500, 78.3808, 90.0, 40.0, [created_riu]
    )
    assert len(active) == 1
    assert active[0].state == RoadEventState.ACTIVE
    
    # 4. Vehicle crosses sign (approx 15m east) -> PASSED
    active, approaching, completed = engine.evaluate_vehicle_events(
        "VEH-TEST", 17.4500, 78.38115, 90.0, 40.0, [created_riu]
    )
    assert len(active) == 0 # Event is no longer in active alert list!
    assert any(c.state == RoadEventState.PASSED for c in completed)
    
    # 5. Vehicle leaves validity zone (approx 300m east) -> COMPLETED
    active, approaching, completed = engine.evaluate_vehicle_events(
        "VEH-TEST", 17.4500, 78.3840, 90.0, 40.0, [created_riu]
    )
    assert len(active) == 0
    assert len(approaching) == 0
    assert any(c.state == RoadEventState.COMPLETED for c in completed)

def test_fusion_engine_conflict_detection():
    """Verify fusion engine flags data discrepancies between Camera & Infrastructure."""
    fusion = ContextFusionEngine()
    
    # Vision detects 40 km/h
    vision_det = DetectionItem(
        bbox=[100, 100, 200, 200],
        confidence=0.92,
        class_id=2,
        code="SPEED_LIMIT_40",
        name="Speed Limit 40 km/h",
        category="REGULATORY",
        priority=PriorityLevel.MEDIUM,
        value=40.0,
        unit="km/h"
    )
    
    # V-RIU broadcast specifies 60 km/h (Mismatch!)
    infra_event = RoadEvent(
        event_id="EVT-TEST-01",
        event_type="SPEED_LIMIT_60",
        name="Speed Limit 60 km/h",
        value=60.0,
        unit="km/h",
        latitude=17.4500,
        longitude=78.3800,
        heading=90.0,
        direction=90.0,
        road_segment_id="ROAD-TEST",
        priority=PriorityLevel.MEDIUM,
        confidence=0.98,
        source="SIMULATED_RIU",
        state=RoadEventState.ACTIVE,
        distance_to_vehicle=45.0
    )
    
    fused_events = fusion.fuse_events(
        vision_detections=[vision_det],
        active_road_events=[infra_event],
        approaching_road_events=[],
        upcoming_signal=None,
        current_speed_kmh=42.0
    )
    
    assert len(fused_events) >= 1
    conflict_event = next(e for e in fused_events if e.fused_event_id == "FUSED-EVT-TEST-01")
    assert conflict_event.conflict_detected is True
    assert "Discrepancy" in conflict_event.conflict_note
    # Safe conservative speed chosen
    assert conflict_event.value == 40.0

def test_traffic_signal_green_wave_advisory():
    """Verify green-wave speed recommendation for approaching signals."""
    simulator = TrafficSignalSimulator()
    sig = TrafficSignal(
        signal_id="SIG-TEST",
        name="Test Junction Signal",
        latitude=17.4500,
        longitude=78.3800,
        direction=90.0,
        road_segment_id="ROAD-TEST",
        state=SignalState.GREEN,
        remaining_time=12,
        cycle_duration=60
    )
    
    # Vehicle 120m away approaching with 12s green left -> ~36 km/h needed
    min_spd, max_spd, msg = simulator.calculate_green_wave_advisory(sig, 120.0, 40.0)
    assert min_spd is not None
    assert max_spd is not None
    assert "Green-Wave" in msg or "green" in msg.lower()

def test_cvdv_engine_transformation():
    """Verify CVDV engine bridges 43-sign taxonomy to connected vehicle ADAS advisories."""
    from backend.services.cvdv_engine import cvdv_engine
    assert len(cvdv_engine.sign_catalog) == 43
    
    stop_sign = cvdv_engine.sign_catalog[14]
    assert stop_sign["class_id"] == 14
    assert stop_sign["sign_name"] == "Stop"
    
    sample_veh = {
        "speed_kmh": 48.0,
        "heading": 90.0,
        "current_road": "Hitec City Main Road"
    }
    explanation = cvdv_engine.explain_cvdv_transformation({"class_id": 14, "confidence": 0.96}, sample_veh)
    assert explanation["cv_perception"]["class_id"] == 14
    assert explanation["dv_digital_twin"]["geofence_status"] == "ACTIVE_APPROACHING"
    assert explanation["hud_advisory"]["target_speed_advisory_kmh"] == 0.0
    assert explanation["hud_advisory"]["driver_alert_level"] == "WARNING"

# =========================================================================
# VEHICLE BEHAVIOR ENGINE & TRAFFIC RULES TESTS
# =========================================================================

def test_behavior_red_signal_stops_before_line():
    """TEST 1: Red signal ahead -> Vehicle decelerates and comes to full stop before stop line."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    
    # Red signal at 17.4500, 78.3810 (approx 60m ahead of vehicle at 17.4500, 78.3804)
    sig = TrafficSignal(
        signal_id="SIG-RED-01",
        name="Cyber Towers Red Signal",
        latitude=17.4500,
        longitude=78.3810,
        direction=90.0,
        road_segment_id="ROAD-01",
        state=SignalState.RED,
        remaining_time=25,
        cycle_duration=60
    )
    
    # 1. Approaching 50m before signal at 45 km/h -> Should start decelerating
    dec = engine.evaluate_traffic_rules(
        current_speed_kmh=45.0,
        current_lat=17.4500,
        current_lon=78.3805,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[],
        approaching_events=[],
        upcoming_signal=sig,
        current_behavior=VehicleBehaviorState.MOVING,
        delta_seconds=0.5
    )
    assert dec["behavior_state"] in [VehicleBehaviorState.DECELERATING, VehicleBehaviorState.STOPPING]
    assert dec["target_speed_kmh"] < 45.0
    assert dec["distance_to_stop_line_m"] > 0
    
    # 2. At stop line (dist <= 2.5m) -> MUST BE STOPPED / WAITING_FOR_GREEN at 0 km/h
    dec_at_line = engine.evaluate_traffic_rules(
        current_speed_kmh=0.0,
        current_lat=17.4500,
        current_lon=78.38092, # right at stop line
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[],
        approaching_events=[],
        upcoming_signal=sig,
        current_behavior=VehicleBehaviorState.DECELERATING,
        delta_seconds=0.5
    )
    assert dec_at_line["behavior_state"] == VehicleBehaviorState.WAITING_FOR_GREEN
    assert dec_at_line["target_speed_kmh"] == 0.0
    assert dec_at_line["hold_position"] is True

def test_behavior_green_signal_continues():
    """TEST 2: Green signal -> Vehicle continues through intersection at corridor speed."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    sig = TrafficSignal(
        signal_id="SIG-GRN-01",
        name="Cyber Towers Green Signal",
        latitude=17.4500,
        longitude=78.3810,
        direction=90.0,
        road_segment_id="ROAD-01",
        state=SignalState.GREEN,
        remaining_time=18,
        cycle_duration=60
    )
    
    dec = engine.evaluate_traffic_rules(
        current_speed_kmh=42.0,
        current_lat=17.4500,
        current_lon=78.3805,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[],
        approaching_events=[],
        upcoming_signal=sig,
        current_behavior=VehicleBehaviorState.MOVING,
        delta_seconds=0.5
    )
    assert dec["behavior_state"] == VehicleBehaviorState.MOVING
    assert dec["target_speed_kmh"] >= 40.0
    assert dec["hold_position"] is False

def test_behavior_red_to_green_transition_resumes():
    """TEST 3: Red to Green transition -> Vehicle waiting for green resumes acceleration."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    sig = TrafficSignal(
        signal_id="SIG-RESUME-01",
        name="Cyber Towers Green Transition",
        latitude=17.4500,
        longitude=78.3810,
        direction=90.0,
        road_segment_id="ROAD-01",
        state=SignalState.GREEN, # Switched to GREEN
        remaining_time=25,
        cycle_duration=60
    )
    
    dec = engine.evaluate_traffic_rules(
        current_speed_kmh=0.0,
        current_lat=17.4500,
        current_lon=78.38092,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[],
        approaching_events=[],
        upcoming_signal=sig,
        current_behavior=VehicleBehaviorState.WAITING_FOR_GREEN,
        delta_seconds=0.5
    )
    assert dec["behavior_state"] == VehicleBehaviorState.RESUMING
    assert dec["target_speed_kmh"] == 45.0
    assert dec["hold_position"] is False

def test_behavior_speed_limit_slows_never_stops():
    """TEST 4: Speed limit 40 -> Vehicle slows from 55 to 40 km/h and maintains it. NEVER stops."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    sl_event = RoadEvent(
        event_id="EVT-SL-40",
        event_type="SPEED_LIMIT_40",
        name="Speed Limit 40 km/h",
        value=40.0,
        latitude=17.4500,
        longitude=78.3800,
        heading=90.0,
        direction=90.0,
        road_segment_id="ROAD-01",
        priority=PriorityLevel.MEDIUM,
        state=RoadEventState.ACTIVE,
        distance_to_vehicle=25.0
    )
    
    dec = engine.evaluate_traffic_rules(
        current_speed_kmh=55.0,
        current_lat=17.4500,
        current_lon=78.3797,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[sl_event],
        approaching_events=[],
        upcoming_signal=None,
        current_behavior=VehicleBehaviorState.MOVING,
        delta_seconds=0.5
    )
    assert dec["target_speed_kmh"] == 40.0
    assert dec["behavior_state"] == VehicleBehaviorState.DECELERATING
    assert dec["hold_position"] is False # NEVER stops!

def test_behavior_speed_breaker_slows_never_stops():
    """TEST 5: Speed breaker -> Vehicle slows to 20 km/h across bump. NEVER stops."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    bump_event = RoadEvent(
        event_id="EVT-BUMP-01",
        event_type="SPEED_BREAKER",
        name="Speed Breaker Ahead",
        latitude=17.4500,
        longitude=78.3800,
        heading=90.0,
        direction=90.0,
        road_segment_id="ROAD-01",
        priority=PriorityLevel.MEDIUM,
        state=RoadEventState.ACTIVE,
        distance_to_vehicle=12.0
    )
    
    dec = engine.evaluate_traffic_rules(
        current_speed_kmh=42.0,
        current_lat=17.4500,
        current_lon=78.3799,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[bump_event],
        approaching_events=[],
        upcoming_signal=None,
        current_behavior=VehicleBehaviorState.MOVING,
        delta_seconds=0.5
    )
    assert dec["target_speed_kmh"] == 20.0
    assert dec["hold_position"] is False # NEVER stops!

def test_behavior_stop_sign_holds_3_seconds():
    """TEST 6: STOP Sign -> Vehicle stops, holds for 3 seconds, then resumes."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    stop_event = RoadEvent(
        event_id="EVT-STOP-01",
        event_type="STOP",
        name="Stop Sign",
        latitude=17.4500,
        longitude=78.3800,
        heading=90.0,
        direction=90.0,
        road_segment_id="ROAD-01",
        priority=PriorityLevel.CRITICAL,
        state=RoadEventState.ACTIVE,
        distance_to_vehicle=2.0
    )
    
    # 1. Arrived at stop sign -> Initiate 3s hold
    dec1 = engine.evaluate_traffic_rules(
        current_speed_kmh=0.0,
        current_lat=17.4500,
        current_lon=78.3800,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[stop_event],
        approaching_events=[],
        upcoming_signal=None,
        current_behavior=VehicleBehaviorState.STOPPING,
        delta_seconds=0.5
    )
    assert dec1["behavior_state"] == VehicleBehaviorState.WAITING_AT_STOP_SIGN
    assert dec1["hold_position"] is True
    
    # 2. After 3.5 seconds -> Must transition to RESUMING
    engine.stop_wait_timer = 3.2
    dec2 = engine.evaluate_traffic_rules(
        current_speed_kmh=0.0,
        current_lat=17.4500,
        current_lon=78.3800,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[stop_event],
        approaching_events=[],
        upcoming_signal=None,
        current_behavior=VehicleBehaviorState.WAITING_AT_STOP_SIGN,
        delta_seconds=0.5
    )
    assert dec2["behavior_state"] == VehicleBehaviorState.RESUMING
    assert dec2["target_speed_kmh"] == 45.0
    assert dec2["hold_position"] is False

def test_behavior_no_entry_rerouting():
    """TEST 7: NO ENTRY -> Vehicle stops before boundary and triggers REROUTING."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    ne_event = RoadEvent(
        event_id="EVT-NE-01",
        event_type="NO_ENTRY",
        name="No Entry",
        latitude=17.4500,
        longitude=78.3800,
        heading=90.0,
        direction=90.0,
        road_segment_id="ROAD-01",
        priority=PriorityLevel.CRITICAL,
        state=RoadEventState.ACTIVE,
        distance_to_vehicle=8.0
    )
    
    dec = engine.evaluate_traffic_rules(
        current_speed_kmh=0.0,
        current_lat=17.4500,
        current_lon=78.3799,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[ne_event],
        approaching_events=[],
        upcoming_signal=None,
        current_behavior=VehicleBehaviorState.DECELERATING,
        delta_seconds=0.5
    )
    assert dec["behavior_state"] == VehicleBehaviorState.REROUTING
    assert dec["target_speed_kmh"] == 0.0

def test_behavior_event_priority_arbitration():
    """TEST 10: Two simultaneous events (Red Signal + Speed Limit 60) -> Red Signal takes absolute priority."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    sig = TrafficSignal(
        signal_id="SIG-PRIO-01",
        name="Prio Signal",
        latitude=17.4500,
        longitude=78.3810,
        direction=90.0,
        road_segment_id="ROAD-01",
        state=SignalState.RED,
        remaining_time=20,
        cycle_duration=60
    )
    sl_event = RoadEvent(
        event_id="EVT-SL-60",
        event_type="SPEED_LIMIT_60",
        name="Speed Limit 60",
        value=60.0,
        latitude=17.4500,
        longitude=78.3805,
        heading=90.0,
        direction=90.0,
        road_segment_id="ROAD-01",
        priority=PriorityLevel.MEDIUM,
        state=RoadEventState.ACTIVE,
        distance_to_vehicle=30.0
    )
    
    dec = engine.evaluate_traffic_rules(
        current_speed_kmh=45.0,
        current_lat=17.4500,
        current_lon=78.3805,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[sl_event],
        approaching_events=[],
        upcoming_signal=sig,
        current_behavior=VehicleBehaviorState.MOVING,
        delta_seconds=0.5
    )
    # Red signal MUST dominate over 60 km/h speed limit
    assert "SIGNAL" in dec["active_rule"] or dec["behavior_state"] in [VehicleBehaviorState.DECELERATING, VehicleBehaviorState.STOPPING]
    assert dec["target_speed_kmh"] < 45.0


def test_behavior_police_halt_and_vip_convoy_holds_and_resumes():
    """TEST 11: VIP Minister Convoy / Police Halt stops vehicle and resumes automatically upon clearance."""
    from backend.services.vehicle_behavior_engine import VehicleBehaviorEngine
    from backend.models.schemas import VehicleBehaviorState
    
    engine = VehicleBehaviorEngine()
    police_event = RoadEvent(
        event_id="EVT-POLICE-01",
        event_type="POLICE_HALT",
        name="VIP Minister Convoy Police Stop",
        value=0.0,
        latitude=17.4500,
        longitude=78.3802,
        heading=90.0,
        direction=90.0,
        road_segment_id="ROAD-01",
        priority=PriorityLevel.CRITICAL,
        state=RoadEventState.ACTIVE,
        distance_to_vehicle=12.0
    )
    
    # 1. Arrives at Police Halt -> Must hold
    dec1 = engine.evaluate_traffic_rules(
        current_speed_kmh=4.0,
        current_lat=17.4500,
        current_lon=78.3802,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[police_event],
        approaching_events=[],
        upcoming_signal=None,
        current_behavior=VehicleBehaviorState.DECELERATING,
        delta_seconds=0.5
    )
    assert dec1["behavior_state"] == VehicleBehaviorState.WAITING_FOR_POLICE_CLEARANCE
    assert dec1["target_speed_kmh"] == 0.0
    assert dec1["hold_position"] is True
    
    # 2. Advance time until clearance duration (5.0s)
    current_state = VehicleBehaviorState.WAITING_FOR_POLICE_CLEARANCE
    for _ in range(9):
        dec_wait = engine.evaluate_traffic_rules(
            current_speed_kmh=0.0,
            current_lat=17.4500,
            current_lon=78.3802,
            heading=90.0,
            default_corridor_speed_kmh=45.0,
            active_events=[police_event],
            approaching_events=[],
            upcoming_signal=None,
            current_behavior=current_state,
            delta_seconds=0.5
        )
        current_state = dec_wait["behavior_state"]
        
    # On 11th step (5.5s), convoy clears and vehicle resumes!
    dec_final = engine.evaluate_traffic_rules(
        current_speed_kmh=0.0,
        current_lat=17.4500,
        current_lon=78.3802,
        heading=90.0,
        default_corridor_speed_kmh=45.0,
        active_events=[police_event],
        approaching_events=[],
        upcoming_signal=None,
        current_behavior=current_state,
        delta_seconds=0.5
    )
    assert dec_final["behavior_state"] == VehicleBehaviorState.RESUMING
    assert dec_final["target_speed_kmh"] == 45.0
    assert dec_final["hold_position"] is False

def test_detector_classify_roi():
    """Verify manual ROI tracking and classification on arbitrary cropped synthetic image."""
    import numpy as np
    import cv2
    detector = TrafficSignDetector()
    synthetic_img = np.zeros((200, 200, 3), dtype=np.uint8)
    cv2.circle(synthetic_img, (100, 100), 40, (0, 0, 255), -1) # Red circle
    
    res = detector.classify_roi(synthetic_img, bbox=[50, 50, 150, 150])
    assert "primary" in res
    assert "top_5" in res
    assert len(res["top_5"]) <= 5
    assert "latency_ms" in res
    assert "vehicle_action" in res
    assert res["primary"]["class_id"] in detector.classes
