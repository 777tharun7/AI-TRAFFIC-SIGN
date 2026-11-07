"""
Data Schemas and Pydantic Models for RoadSense AI.
Covers:
- Detection Request/Response
- Road Event & Event State Machine
- Virtual RIU (V-RIU)
- Traffic Signals
- Vehicle Telemetry & Physics
- Multi-Source Fusion
- Analytics & Metrics
"""

from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field

class RoadEventState(str, Enum):
    DISCOVERED = "DISCOVERED"
    APPROACHING = "APPROACHING"
    ACTIVE = "ACTIVE"
    PASSED = "PASSED"
    COMPLETED = "COMPLETED"

class PriorityLevel(str, Enum):
    INFO = "INFO"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class SignalState(str, Enum):
    RED = "RED"
    YELLOW = "YELLOW"
    GREEN = "GREEN"

class VehicleType(str, Enum):
    CAR = "CAR"
    BIKE = "BIKE"

class EventSource(str, Enum):
    VISION = "VISION"
    SIMULATED_RIU = "SIMULATED_RIU"
    MAP_DATABASE = "MAP_DATABASE"
    FUSION_ENGINE = "FUSION_ENGINE"
    MANUAL_OPERATOR = "MANUAL_OPERATOR"

# ----------------- VIRTUAL RIU SCHEMAS -----------------
class VirtualRIUCreate(BaseModel):
    name: str
    event_type: str
    value: Optional[float] = None
    latitude: float
    longitude: float
    direction: float = Field(..., description="Target heading direction in degrees (0-360)")
    road_segment_id: str
    activation_radius: float = 250.0
    trigger_distance: float = 50.0
    validity_distance: float = 300.0
    priority: PriorityLevel = PriorityLevel.MEDIUM
    status: str = "ACTIVE"
    source: str = "SIMULATED_RIU"

class VirtualRIU(VirtualRIUCreate):
    id: str
    created_at: str
    updated_at: str

# ----------------- ROAD EVENT SCHEMAS -----------------
class RoadEvent(BaseModel):
    event_id: str
    event_type: str
    name: str
    value: Optional[float] = None
    unit: Optional[str] = None
    latitude: float
    longitude: float
    heading: float
    road_segment_id: str
    direction: float
    activation_distance: float = 250.0
    trigger_distance: float = 50.0
    expiry_distance: float = 60.0
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    priority: PriorityLevel = PriorityLevel.MEDIUM
    confidence: float = 1.0
    source: str = "SIMULATED_RIU"
    state: RoadEventState = RoadEventState.DISCOVERED
    distance_to_vehicle: Optional[float] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# ----------------- TRAFFIC SIGNAL SCHEMAS -----------------
class TrafficSignal(BaseModel):
    signal_id: str
    name: str
    latitude: float
    longitude: float
    direction: float
    road_segment_id: str
    state: SignalState = SignalState.GREEN
    cycle_duration: int = 60
    remaining_time: int = 30
    red_duration: int = 30
    yellow_duration: int = 5
    green_duration: int = 25
    elapsed_in_phase: float = 0.0
    recommended_speed_min: Optional[float] = None
    recommended_speed_max: Optional[float] = None

class VehicleBehaviorState(str, Enum):
    MOVING = "MOVING"
    APPROACHING_EVENT = "APPROACHING_EVENT"
    DECELERATING = "DECELERATING"
    STOPPING = "STOPPING"
    STOPPED = "STOPPED"
    WAITING_FOR_GREEN = "WAITING_FOR_GREEN"
    WAITING_AT_STOP_SIGN = "WAITING_AT_STOP_SIGN"
    WAITING_FOR_POLICE_CLEARANCE = "WAITING_FOR_POLICE_CLEARANCE"
    RESUMING = "RESUMING"
    REROUTING = "REROUTING"
    COMPLETED = "COMPLETED"

# ----------------- VEHICLE TELEMETRY SCHEMAS -----------------
class VehicleState(BaseModel):
    vehicle_id: str = "VEH-HYD-001"
    vehicle_type: VehicleType = VehicleType.CAR
    latitude: float = 17.4435
    longitude: float = 78.3772
    speed_kmh: float = 42.0
    target_speed_kmh: float = 45.0
    acceleration_mps2: float = 0.0
    heading: float = 87.0
    current_road: str = "Hitec City Main Road"
    road_segment_id: str = "HYD-ROAD-101"
    route_id: str = "route_hitec_gachibowli"
    progress_pct: float = 0.0
    is_running: bool = False
    
    # Rule-based Behavior State Machine
    behavior_state: VehicleBehaviorState = VehicleBehaviorState.MOVING
    active_rule: Optional[str] = None
    decision_reason: str = "Cruising along corridor path at road design speed"
    distance_to_stop_line_m: Optional[float] = None
    distance_to_event_m: Optional[float] = None
    stop_line_lat: Optional[float] = None
    stop_line_lon: Optional[float] = None
    
    # Active context
    active_events: List[RoadEvent] = []
    approaching_events: List[RoadEvent] = []
    active_signal: Optional[TrafficSignal] = None
    
    # Recommendations & Conflict
    recommended_speed_kmh: Optional[float] = 40.0
    advisory_message: str = "Drive Safe - Speed limit 40 km/h ahead"
    conflict_detected: bool = False
    conflict_details: Optional[str] = None
    
    # Debug & Audit Log
    recent_event_logs: List[Dict[str, Any]] = []
    timestamp: str

# ----------------- FUSION ENGINE SCHEMAS -----------------
class FusedEvent(BaseModel):
    fused_event_id: str
    event_type: str
    name: str
    value: Optional[float] = None
    unit: Optional[str] = None
    confidence: float
    status: RoadEventState
    distance_m: float
    source_count: int
    sources: List[str]
    conflict_detected: bool = False
    conflict_note: Optional[str] = None
    priority: PriorityLevel
    advisory_speed: Optional[float] = None

# ----------------- CV DETECTION SCHEMAS -----------------
class DetectionItem(BaseModel):
    bbox: List[int]
    confidence: float
    class_id: int
    code: str
    name: str
    category: str
    priority: PriorityLevel
    value: Optional[float] = None
    unit: Optional[str] = None

class DetectionResponse(BaseModel):
    detections: List[DetectionItem]
    count: int
    latency_ms: float
    fps: float
    image_size: Dict[str, int]
    annotated_image_base64: Optional[str] = None
    fused_events: Optional[List[FusedEvent]] = None
