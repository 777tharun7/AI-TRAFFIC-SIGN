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
