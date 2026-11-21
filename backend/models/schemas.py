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

# ----------------- EV FLEET & CHARGING SCHEMAS -----------------
class EVChargingStation(BaseModel):
    station_id: str
    name: str
    operator: str
    latitude: float
    longitude: float
    distance_m: Optional[float] = None
    total_ports: int = 6
    available_ports: int = 4
    charger_types: List[str] = ["CCS2 (150 kW)", "Type 2 (22 kW)"]
    power_kw: float = 150.0
    price_per_kwh: float = 18.5
    wait_time_minutes: int = 0
    status: str = "AVAILABLE"

# ----------------- TRAFFIC DEPARTMENT COMMAND SCHEMAS -----------------
class TrafficIncident(BaseModel):
    incident_id: str
    timestamp: str
    incident_type: str
    severity: str
    location_name: str
    latitude: float
    longitude: float
    vehicle_id: str
    vehicle_plate: str
    status: str
    speed_kmh: Optional[float] = None
    fine_amount_inr: Optional[int] = None

class CorridorTrafficStatus(BaseModel):
    corridor_id: str
    name: str
    congestion_level: str
    level_of_service: str
    average_speed_kmh: float
    active_vehicle_count: int
    incident_count: int
    aqi_index: int
    green_wave_active: bool

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
    
    # EV Fleet Telemetry
    is_ev: bool = True
    battery_soc_pct: float = 74.0
    battery_soh_pct: float = 98.4
    estimated_range_km: float = 296.0
    battery_temp_c: float = 31.5
    energy_consumption_kwh: float = 15.2
    low_battery_alert: bool = False
    nearby_charging_stations: List[EVChargingStation] = []
    
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

# =====================================================================
# MASTER ITMS & VEHICLE INTELLIGENCE EXPANSION SCHEMAS
# =====================================================================

class VehicleCategory(str, Enum):
    TWO_WHEELER = "TWO_WHEELER"
    FOUR_WHEELER = "FOUR_WHEELER"
    EV_COMMERCIAL = "EV_COMMERCIAL"
    BUS_TRANSIT = "BUS_TRANSIT"
    HEAVY_MOTOR_VEHICLE = "HEAVY_MOTOR_VEHICLE"
    EMERGENCY = "EMERGENCY"

class DocumentStatus(str, Enum):
    VALID = "VALID"
    EXPIRING_SOON = "EXPIRING_SOON"
    EXPIRED = "EXPIRED"

class ComplianceBadge(str, Enum):
    FULLY_COMPLIANT = "FULLY_COMPLIANT"
    DOCUMENT_EXPIRED = "DOCUMENT_EXPIRED"
    UNREGISTERED_DEVICE = "UNREGISTERED_DEVICE"
    ACTIVE_VIOLATIONS = "ACTIVE_VIOLATIONS"

class VehicleRegistryRecord(BaseModel):
    registration_number: str
    owner_name: str
    owner_contact_masked: str
    vehicle_category: VehicleCategory
    make_model: str
    fuel_type: str  # "EV", "PETROL", "DIESEL", "CNG"
    rc_valid_until: str
    rc_status: DocumentStatus = DocumentStatus.VALID
    insurance_policy_number: str
    insurance_valid_until: str
    insurance_status: DocumentStatus = DocumentStatus.VALID
    puc_certificate_number: str
    puc_valid_until: str
    puc_status: DocumentStatus = DocumentStatus.VALID
    fitness_valid_until: Optional[str] = None
    fitness_status: DocumentStatus = DocumentStatus.VALID
    gvid_device_id: Optional[str] = None
    compliance_badge: ComplianceBadge = ComplianceBadge.FULLY_COMPLIANT
    is_commercial: bool = False
    chassis_number_masked: str
    registered_rto: str = "TG-09 (Hyderabad Central)"
    is_simulated_data: bool = True

class GVIDTamperStatus(str, Enum):
    SECURE = "SECURE"
    TAMPER_ALERT = "TAMPER_ALERT"
    ENCLOSURE_BREACH = "ENCLOSURE_BREACH"
    ANTENNA_DISCONNECTED = "ANTENNA_DISCONNECTED"

class GVIDCanSource(str, Enum):
    OBD_II_CAN_BUS = "OBD_II_CAN_BUS"
    WHEEL_SPEED_SENSOR = "WHEEL_SPEED_SENSOR"
    GNSS_GPS_HYBRID = "GNSS_GPS_HYBRID"

class GVIDDeviceRecord(BaseModel):
    device_id: str
    vehicle_reg_num: str
    hardware_serial: str
    firmware_version: str
    hardware_model: str = "GVID-GovSec-Gen3"
    can_source: GVIDCanSource = GVIDCanSource.OBD_II_CAN_BUS
    tamper_status: GVIDTamperStatus = GVIDTamperStatus.SECURE
    calibration_date: str
    calibration_valid_until: str
    speed_sensor_uncertainty_kmh: float = 1.0  # ISO calibration accuracy (+- 1 km/h)
    offline_buffered_packets: int = 0
    signal_strength_dbm: int = -68
    last_heartbeat: str
    status: str = "ACTIVE"
    is_simulated_data: bool = True

class GVIDTelemetryPacket(BaseModel):
    device_id: str
    vehicle_reg_num: str
    timestamp: str
    gnss_latitude: float
    gnss_longitude: float
    gnss_speed_kmh: float
    can_wheel_speed_kmh: float
    fused_speed_kmh: float
    heading_deg: float
    road_segment_id: str
    odometer_km: float
    tamper_status: GVIDTamperStatus = GVIDTamperStatus.SECURE

class RoadSegmentRule(BaseModel):
    segment_id: str
    segment_name: str
    corridor_id: str
    default_speed_limit_kmh: float
    category_speed_limits: Dict[str, float] = {
        "TWO_WHEELER": 50.0,
        "FOUR_WHEELER": 60.0,
        "EV_COMMERCIAL": 50.0,
        "BUS_TRANSIT": 40.0,
        "HEAVY_MOTOR_VEHICLE": 40.0,
        "EMERGENCY": 80.0
    }
    is_school_zone: bool = False
    is_hospital_zone: bool = False
    active_variable_limit_kmh: Optional[float] = None
    weather_adjustment_active: bool = False
    reduced_limit_kmh: Optional[float] = None

class EvidenceStatus(str, Enum):
    PENDING_REVIEW = "PENDING_REVIEW"
    OFFICER_APPROVED = "OFFICER_APPROVED"
    OFFICER_DISMISSED = "OFFICER_DISMISSED"
    CHALLAN_ISSUED = "CHALLAN_ISSUED"

class ViolationEvidencePackage(BaseModel):
    evidence_id: str
    vehicle_reg_num: str
    vehicle_category: VehicleCategory
    gvid_device_id: Optional[str] = None
    road_segment_id: str
    location_name: str
    latitude: float
    longitude: float
    timestamp: str
    speed_measured_kmh: float
    speed_limit_applicable_kmh: float
    speed_uncertainty_kmh: float = 1.5  # Calibration margin
    speed_delta_kmh: float
    sustained_duration_seconds: float
    anpr_confidence_pct: float
    anpr_plate_snapshot_url: str
    telemetry_hash_sha256: str
    evidence_seal_sha256: str
    status: EvidenceStatus = EvidenceStatus.PENDING_REVIEW
    officer_id: Optional[str] = None
    officer_name: Optional[str] = None
    officer_notes: Optional[str] = None
    review_timestamp: Optional[str] = None
    section_167a_certified: bool = True
    is_simulated_data: bool = True

class ChallanStatus(str, Enum):
    DRAFT = "DRAFT"
    EVIDENCE_VERIFIED = "EVIDENCE_VERIFIED"
    OFFICER_APPROVED = "OFFICER_APPROVED"
    ISSUED = "ISSUED"
    PAID = "PAID"
    DISPUTED = "DISPUTED"
    DISPUTE_REJECTED = "DISPUTE_REJECTED"
    CANCELLED = "CANCELLED"

class EChallanRecord(BaseModel):
    challan_id: str
    challan_number: str
    vehicle_reg_num: str
    owner_name: str
    violation_type: str
    motor_vehicle_act_section: str
    road_location: str
    violation_timestamp: str
    speed_detected_kmh: Optional[float] = None
    speed_limit_kmh: Optional[float] = None
    penalty_amount_inr: int
    evidence_package_id: str
    evidence_seal_sha256: str
    status: ChallanStatus = ChallanStatus.ISSUED
    due_date: str
    payment_receipt_id: Optional[str] = None
    payment_timestamp: Optional[str] = None
    payment_mode: Optional[str] = None
    dispute_reason: Optional[str] = None
    dispute_filed_date: Optional[str] = None
    dispute_resolution_note: Optional[str] = None
    issuing_authority: str = "Hyderabad City Police - Traffic Branch"
    is_simulated_data: bool = True

class ChallanPaymentRequest(BaseModel):
    payment_mode: str = "UPI"  # "UPI", "CREDIT_CARD", "NET_BANKING"
    transaction_reference: Optional[str] = None

class ChallanDisputeRequest(BaseModel):
    dispute_reason: str
    evidence_description: Optional[str] = None
    citizen_contact: str

class PublicTransportBus(BaseModel):
    bus_id: str
    route_number: str
    route_name: str
    depot: str
    current_driver: str
    driver_rating: float
    current_lat: float
    current_lon: float
    speed_kmh: float
    is_ev: bool = True
    battery_soc_pct: float = 68.0
    passenger_load_pct: int = 62
    schedule_delay_minutes: int = 2  # positive = delayed, negative = early
    next_stop_name: str
    eta_next_stop_seconds: int = 140
    status: str = "ON_ROUTE"
    is_simulated_data: bool = True

class PublicTransportRoute(BaseModel):
    route_id: str
    route_number: str
    origin: str
    destination: str
    total_stops: int
    active_buses_count: int
    average_headway_minutes: int
    corridor_reliability_pct: float

