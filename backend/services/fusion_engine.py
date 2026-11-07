"""
Context Fusion Engine for RoadSense AI.
Fuses multi-modal road intelligence:
- Computer Vision (CV) sign detections
- Virtual Roadside Intelligence Unit (V-RIU) broadcasts
- Map & Road Network GIS database
- Traffic Signal cycles & Green-Wave predictions
- Vehicle Telemetry (Speed, Heading, Distance)

Detects data conflicts between camera visual observations and infrastructure broadcasts.
"""

from typing import List, Dict, Optional, Any
from ..models.schemas import FusedEvent, RoadEvent, DetectionItem, TrafficSignal, PriorityLevel, RoadEventState

class ContextFusionEngine:
    def __init__(self):
        pass

    def fuse_events(
        self,
        vision_detections: List[DetectionItem],
        active_road_events: List[RoadEvent],
        approaching_road_events: List[RoadEvent],
        upcoming_signal: Optional[TrafficSignal],
        current_speed_kmh: float
    ) -> List[FusedEvent]:
        """
        Synthesizes visual observations and digital road broadcasts into unified actionable events.
        """
        fused_results: List[FusedEvent] = []
        
        # 1. Process active & approaching infrastructure road events
        infra_events = active_road_events + approaching_road_events
        
        for infra in infra_events:
            matching_vision = None
            for det in vision_detections:
                # Match by event category or speed limit code
                if det.code == infra.event_type or (infra.event_type.startswith("SPEED_LIMIT") and det.code.startswith("SPEED_LIMIT")):
                    matching_vision = det
                    break
                    
            sources = [infra.source]
            confidence = infra.confidence
            conflict_detected = False
            conflict_note = None
            fused_value = infra.value
            
            if matching_vision:
                sources.append("COMPUTER_VISION")
                # Check for value discrepancy (e.g. speed limit mismatch)
                if infra.event_type.startswith("SPEED_LIMIT") and matching_vision.value is not None:
                    if infra.value is not None and abs(infra.value - matching_vision.value) > 5.0:
                        conflict_detected = True
                        conflict_note = f"Discrepancy: Camera detected {int(matching_vision.value)} km/h vs V-RIU {int(infra.value)} km/h"
                        # High caution: prioritize lower speed for safety
                        fused_value = min(infra.value, matching_vision.value)
                        confidence = round((infra.confidence + matching_vision.confidence) / 2.0, 3)
                    else:
                        # Confirmed multi-source agreement!
                        confidence = min(0.99, round(infra.confidence * 0.5 + matching_vision.confidence * 0.5 + 0.05, 3))
                else:
                    confidence = min(0.99, round(infra.confidence * 0.5 + matching_vision.confidence * 0.5 + 0.03, 3))
                    
            advisory_spd = None
            if infra.event_type.startswith("SPEED_LIMIT") and fused_value:
                advisory_spd = fused_value
            elif infra.event_type == "SPEED_BREAKER":
                advisory_spd = 20.0
            elif infra.event_type == "ROAD_WORK":
                advisory_spd = 30.0
            elif infra.event_type == "SCHOOL_ZONE":
                advisory_spd = 25.0
                
            fused = FusedEvent(
                fused_event_id=f"FUSED-{infra.event_id}",
                event_type=infra.event_type,
                name=infra.name,
                value=fused_value,
                unit=infra.unit,
                confidence=confidence,
                status=infra.state,
                distance_m=infra.distance_to_vehicle or 50.0,
                source_count=len(sources),
                sources=sources,
                conflict_detected=conflict_detected,
                conflict_note=conflict_note,
                priority=PriorityLevel.CRITICAL if conflict_detected else infra.priority,
                advisory_speed=advisory_spd
            )
            fused_results.append(fused)
            
        # 2. Process standalone Vision detections not yet in V-RIU radius
        for det in vision_detections:
            already_fused = any("COMPUTER_VISION" in f.sources and (f.event_type == det.code or f.event_type.startswith(det.code)) for f in fused_results)
            if not already_fused:
                fused_results.append(FusedEvent(
                    fused_event_id=f"FUSED-CV-{det.class_id}",
                    event_type=det.code,
                    name=f"Camera Detected: {det.name}",
                    value=det.value,
                    unit=det.unit,
                    confidence=det.confidence,
                    status=RoadEventState.ACTIVE,
                    distance_m=35.0, # Approximate camera sighting distance
                    source_count=1,
                    sources=["COMPUTER_VISION"],
                    conflict_detected=False,
                    conflict_note=None,
                    priority=det.priority,
                    advisory_speed=det.value if det.value else None
                ))
                
        # 3. Process Traffic Signal Advisory
        if upcoming_signal:
            sig_name = f"{upcoming_signal.name} ({upcoming_signal.state.value})"
            fused_results.append(FusedEvent(
                fused_event_id=f"FUSED-{upcoming_signal.signal_id}",
                event_type="TRAFFIC_SIGNAL",
                name=sig_name,
                value=float(upcoming_signal.remaining_time),
                unit="s",
                confidence=0.99,
                status=RoadEventState.APPROACHING,
                distance_m=85.0,
                source_count=1,
                sources=["TRAFFIC_SIGNAL_CONTROLLER"],
                conflict_detected=False,
                conflict_note=None,
                priority=PriorityLevel.HIGH if upcoming_signal.state.value == "RED" else PriorityLevel.MEDIUM,
                advisory_speed=upcoming_signal.recommended_speed_min
            ))
            
        return fused_results

fusion_engine = ContextFusionEngine()
