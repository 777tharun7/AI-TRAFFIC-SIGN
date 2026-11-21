export type RoadEventState = "DISCOVERED" | "APPROACHING" | "ACTIVE" | "PASSED" | "COMPLETED";
export type PriorityLevel = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type SignalState = "RED" | "YELLOW" | "GREEN";
export type VehicleType = "CAR" | "BIKE";

export interface VirtualRIU {
  id: string;
  name: string;
  event_type: string;
  value: number | null;
  latitude: number;
  longitude: number;
  direction: number;
  road_segment_id: string;
  activation_radius: number;
  trigger_distance: number;
  validity_distance: number;
  priority: PriorityLevel;
  status: string;
  source: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoadEvent {
  event_id: string;
  event_type: string;
  name: string;
  value: number | null;
  unit: string | null;
  latitude: number;
  longitude: number;
  heading: number;
  road_segment_id: string;
  direction: number;
  activation_distance: number;
  trigger_distance: number;
  expiry_distance: number;
  priority: PriorityLevel;
  confidence: number;
  source: string;
  state: RoadEventState;
  distance_to_vehicle?: number;
}

export interface TrafficSignal {
  signal_id: string;
  name: string;
  latitude: number;
  longitude: number;
  direction: number;
  road_segment_id: string;
  state: SignalState;
  cycle_duration: number;
  remaining_time: number;
  red_duration: number;
  yellow_duration: number;
  green_duration: number;
  recommended_speed_min?: number;
  recommended_speed_max?: number;
}

export type VehicleBehaviorState = 
  | "MOVING" 
  | "APPROACHING_EVENT" 
  | "DECELERATING" 
  | "STOPPING" 
  | "STOPPED" 
  | "WAITING_FOR_GREEN" 
  | "WAITING_AT_STOP_SIGN" 
  | "WAITING_FOR_POLICE_CLEARANCE"
  | "RESUMING" 
  | "REROUTING" 
  | "COMPLETED";

export interface VehicleEventLog {
  timestamp: string;
  vehicle_id: string;
  behavior_state: VehicleBehaviorState;
  rule: string;
  decision: string;
  speed_kmh: number;
}

export interface EVChargingStation {
  station_id: string;
  name: string;
  operator: string;
  latitude: number;
  longitude: number;
  distance_m?: number | null;
  total_ports: number;
  available_ports: number;
  charger_types: string[];
  power_kw: number;
  price_per_kwh: number;
  wait_time_minutes: number;
  status: string;
}

export interface TrafficIncident {
  incident_id: string;
  timestamp: string;
  incident_type: string;
  severity: string;
  location_name: string;
  latitude: number;
  longitude: number;
  vehicle_id: string;
  vehicle_plate: string;
  status: string;
  speed_kmh?: number | null;
  fine_amount_inr?: number | null;
}

export interface CorridorTrafficStatus {
  corridor_id: string;
  name: string;
  congestion_level: string;
  level_of_service: string;
  average_speed_kmh: number;
  active_vehicle_count: number;
  incident_count: number;
  aqi_index: number;
  green_wave_active: boolean;
}

export interface VehicleState {
  vehicle_id: string;
  vehicle_type: VehicleType;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  target_speed_kmh: number;
  acceleration_mps2?: number;
  heading: number;
  current_road: string;
  road_segment_id: string;
  route_id: string;
  progress_pct: number;
  is_running: boolean;
  
  // EV Fleet & Battery Telemetry
  is_ev?: boolean;
  battery_soc_pct?: number;
  battery_soh_pct?: number;
  estimated_range_km?: number;
  battery_temp_c?: number;
  energy_consumption_kwh?: number;
  low_battery_alert?: boolean;
  nearby_charging_stations?: EVChargingStation[];
  
  // Rule-based Behavior State Machine
  behavior_state?: VehicleBehaviorState;
  active_rule?: string | null;
  decision_reason?: string;
  distance_to_stop_line_m?: number | null;
  distance_to_event_m?: number | null;
  stop_line_lat?: number | null;
  stop_line_lon?: number | null;

  active_events: RoadEvent[];
  approaching_events: RoadEvent[];
  active_signal: TrafficSignal | null;
  recommended_speed_kmh: number | null;
  advisory_message: string;
  conflict_detected: boolean;
  conflict_details?: string | null;
  recent_event_logs?: VehicleEventLog[];
  timestamp: string;
}

export interface FusedEvent {
  fused_event_id: string;
  event_type: string;
  name: string;
  value: number | null;
  unit: string | null;
  confidence: number;
  status: RoadEventState;
  distance_m: number;
  source_count: number;
  sources: string[];
  conflict_detected: boolean;
  conflict_note?: string | null;
  priority: PriorityLevel;
  advisory_speed?: number | null;
}

export interface DetectionItem {
  bbox: [number, number, number, number];
  confidence: number;
  class_id: number;
  code: string;
  name: string;
  category: string;
  priority: PriorityLevel;
  value: number | null;
  unit: string | null;
}

export interface DetectionResponse {
  detections: DetectionItem[];
  count: number;
  latency_ms: number;
  fps: number;
  image_size: { width: number; height: number };
  annotated_image_base64?: string | null;
  fused_events?: FusedEvent[];
}

export interface ModelMetrics {
  model_name: string;
  version: string;
  timestamp?: string;
  best_val_acc: number;
  mAP50: number;
  mAP50_95?: number;
  final_precision: number;
  final_recall: number;
  final_f1?: number;
  inference_latency_ms: number;
  fps: number;
  history?: Array<{
    epoch: number;
    train_loss: number;
    train_acc: number;
    val_loss: number;
    val_acc: number;
    precision: number;
    recall: number;
    f1: number;
    mAP50: number;
  }>;
  confusion_matrix?: number[][];
}

// ----------------- MASTER ITMS & VEHICLE INTELLIGENCE TYPES -----------------
export type VehicleCategory = 
  | "TWO_WHEELER" 
  | "FOUR_WHEELER" 
  | "EV_COMMERCIAL" 
  | "BUS_TRANSIT" 
  | "HEAVY_MOTOR_VEHICLE" 
  | "EMERGENCY";

export type DocumentStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED";
export type ComplianceBadge = "FULLY_COMPLIANT" | "DOCUMENT_EXPIRED" | "UNREGISTERED_DEVICE" | "ACTIVE_VIOLATIONS";
export type EvidenceStatus = "PENDING_REVIEW" | "OFFICER_APPROVED" | "OFFICER_DISMISSED" | "CHALLAN_ISSUED";

export interface VehicleRegistryRecord {
  registration_number: string;
  owner_name: string;
  owner_contact_masked: string;
  vehicle_category: VehicleCategory;
  make_model: string;
  fuel_type: string;
  rc_valid_until: string;
  rc_status: DocumentStatus;
  insurance_policy_number: string;
  insurance_valid_until: string;
  insurance_status: DocumentStatus;
  puc_certificate_number: string;
  puc_valid_until: string;
  puc_status: DocumentStatus;
  fitness_valid_until?: string | null;
  fitness_status: DocumentStatus;
  gvid_device_id?: string | null;
  compliance_badge: ComplianceBadge;
  is_commercial: boolean;
  chassis_number_masked: string;
  registered_rto: string;
  is_simulated_data: boolean;
}

export interface GVIDDeviceRecord {
  device_id: string;
  vehicle_reg_num: string;
  hardware_serial: string;
  firmware_version: string;
  hardware_model: string;
  can_source: string;
  tamper_status: "SECURE" | "TAMPER_ALERT" | "ENCLOSURE_BREACH" | "ANTENNA_DISCONNECTED";
  calibration_date: string;
  calibration_valid_until: string;
  speed_sensor_uncertainty_kmh: number;
  offline_buffered_packets: number;
  signal_strength_dbm: number;
  last_heartbeat: string;
  status: string;
  is_simulated_data: boolean;
}

export interface ViolationEvidencePackage {
  evidence_id: string;
  vehicle_reg_num: string;
  vehicle_category: VehicleCategory;
  gvid_device_id?: string | null;
  road_segment_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed_measured_kmh: number;
  speed_limit_applicable_kmh: number;
  speed_uncertainty_kmh: number;
  speed_delta_kmh: number;
  sustained_duration_seconds: number;
  anpr_confidence_pct: number;
  anpr_plate_snapshot_url: string;
  telemetry_hash_sha256: string;
  evidence_seal_sha256: string;
  status: "PENDING_REVIEW" | "OFFICER_APPROVED" | "OFFICER_DISMISSED" | "CHALLAN_ISSUED";
  officer_id?: string | null;
  officer_name?: string | null;
  officer_notes?: string | null;
  review_timestamp?: string | null;
  section_167a_certified: boolean;
  is_simulated_data: boolean;
}

export interface EChallanRecord {
  challan_id: string;
  challan_number: string;
  vehicle_reg_num: string;
  owner_name: string;
  violation_type: string;
  motor_vehicle_act_section: string;
  road_location: string;
  violation_timestamp: string;
  speed_detected_kmh?: number | null;
  speed_limit_kmh?: number | null;
  penalty_amount_inr: number;
  evidence_package_id: string;
  evidence_seal_sha256: string;
  status: "DRAFT" | "EVIDENCE_VERIFIED" | "OFFICER_APPROVED" | "ISSUED" | "PAID" | "DISPUTED" | "CANCELLED";
  due_date: string;
  payment_receipt_id?: string | null;
  payment_timestamp?: string | null;
  payment_mode?: string | null;
  dispute_reason?: string | null;
  dispute_filed_date?: string | null;
  dispute_resolution_note?: string | null;
  issuing_authority: string;
  is_simulated_data: boolean;
}

export interface PublicTransportBus {
  bus_id: string;
  route_number: string;
  route_name: string;
  depot: string;
  current_driver: string;
  driver_rating: number;
  current_lat: number;
  current_lon: number;
  speed_kmh: number;
  is_ev: boolean;
  battery_soc_pct: number;
  passenger_load_pct: number;
  schedule_delay_minutes: number;
  next_stop_name: string;
  eta_next_stop_seconds: number;
  status: string;
  is_simulated_data: boolean;
}

export interface PublicTransportRoute {
  route_id: string;
  route_number: string;
  origin: string;
  destination: string;
  total_stops: number;
  active_buses_count: number;
  average_headway_minutes: number;
  corridor_reliability_pct: number;
}

