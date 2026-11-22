import {
  VehicleState, VirtualRIU, RoadEvent, TrafficSignal, ModelMetrics,
  EVChargingStation, TrafficIncident, CorridorTrafficStatus
} from '../types';

export const FALLBACK_ROUTES = [
  {
    id: "route_hussain_sagar_necklace",
    name: "Hussain Sagar Lake & Necklace Road Connected Corridor",
    city: "Hyderabad",
    total_distance_km: 6.4,
    default_speed_kmh: 42.0,
    road_name: "Necklace Road & Tank Bund Connected Corridor",
    waypoints: [
      { lat: 17.4120, lon: 78.4410, road: "Banjara Hills Road No. 1" },
      { lat: 17.4180, lon: 78.4500, road: "Panjagutta Junction" },
      { lat: 17.4220, lon: 78.4550, road: "Somajiguda (Raj Bhavan Road)" },
      { lat: 17.4270, lon: 78.4630, road: "Necklace Road Khairatabad Approach" },
      { lat: 17.4290, lon: 78.4700, road: "Necklace Road Waterfront (People's Plaza)" },
      { lat: 17.4230, lon: 78.4750, road: "NTR Gardens / Tank Bund South" },
      { lat: 17.4280, lon: 78.4820, road: "Tank Bund Promenade" },
      { lat: 17.4350, lon: 78.4850, road: "Kavadiguda / Sailing Club Approach" },
      { lat: 17.4410, lon: 78.4865, road: "Secunderabad Paradise Junction" }
    ]
  },
  {
    id: "route_hitec_gachibowli",
    name: "Hitec City to Gachibowli Corridor",
    city: "Hyderabad",
    total_distance_km: 4.8,
    default_speed_kmh: 45.0,
    road_name: "Hitec City Main Road & Gachibowli Expressway",
    waypoints: [
      { lat: 17.4520, lon: 78.3750, road: "Hitec City Entrance (Cyber Gateway)" },
      { lat: 17.4476, lon: 78.3772, road: "Hitec City Main Road" },
      { lat: 17.4420, lon: 78.3800, road: "Cyber Towers Junction" },
      { lat: 17.4350, lon: 78.3700, road: "Mindspace Madhapur" },
      { lat: 17.4400, lon: 78.3480, road: "Gachibowli Stadium Junction" }
    ]
  }
];

export const FALLBACK_VEHICLES: VehicleState[] = [
  {
    vehicle_id: "VEH-HYD-001",
    vehicle_type: "CAR",
    latitude: 17.4290,
    longitude: 78.4700,
    speed_kmh: 42.0,
    target_speed_kmh: 50.0,
    acceleration_mps2: 0.2,
    heading: 68.0,
    current_road: "Necklace Road Waterfront (People's Plaza)",
    road_segment_id: "SEG-HYD-004",
    route_id: "route_hussain_sagar_necklace",
    progress_pct: 45.2,
    is_running: true,
    is_ev: true,
    battery_soc_pct: 82.4,
    battery_soh_pct: 98.6,
    estimated_range_km: 342,
    battery_temp_c: 28.5,
    energy_consumption_kwh: 14.2,
    low_battery_alert: false,
    behavior_state: "MOVING",
    active_rule: "GLOSA Green Wave Advisory",
    decision_reason: "Maintaining 42 km/h for green signal arrival",
    distance_to_stop_line_m: 80,
    distance_to_event_m: 120,
    stop_line_lat: 17.4230,
    stop_line_lon: 78.4750,
    active_events: [],
    approaching_events: [],
    active_signal: {
      signal_id: "SIG-HYD-001",
      name: "NTR Gardens Junction",
      latitude: 17.4230,
      longitude: 78.4750,
      direction: 72,
      road_segment_id: "SEG-HYD-004",
      state: "GREEN",
      cycle_duration: 90,
      remaining_time: 24,
      red_duration: 45,
      yellow_duration: 5,
      green_duration: 40,
      recommended_speed_min: 38,
      recommended_speed_max: 45,
    },
    recommended_speed_kmh: 42.0,
    advisory_message: "GLOSA Synced: Maintain 42 km/h for Green Corridor",
    conflict_detected: false,
    timestamp: new Date().toISOString(),
  }
];

export const FALLBACK_RIUS: VirtualRIU[] = [
  {
    id: "RIU-HYD-001",
    name: "Hussain Sagar Speed Limit 50 km/h",
    event_type: "SPEED_LIMIT",
    value: 50,
    latitude: 17.4270,
    longitude: 78.4630,
    direction: 68,
    road_segment_id: "SEG-HYD-003",
    activation_radius: 150,
    trigger_distance: 100,
    validity_distance: 400,
    priority: "HIGH",
    status: "ACTIVE",
    source: "Virtual RIU Hub",
  },
  {
    id: "RIU-HYD-002",
    name: "NTR Gardens Signal Gantry",
    event_type: "TRAFFIC_SIGNAL",
    value: null,
    latitude: 17.4230,
    longitude: 78.4750,
    direction: 72,
    road_segment_id: "SEG-HYD-004",
    activation_radius: 200,
    trigger_distance: 120,
    validity_distance: 300,
    priority: "CRITICAL",
    status: "ACTIVE",
    source: "Virtual RIU Hub",
  },
  {
    id: "RIU-HYD-003",
    name: "Tank Bund Pedestrian Crossing",
    event_type: "PEDESTRIAN_CROSSING",
    value: null,
    latitude: 17.4280,
    longitude: 78.4820,
    direction: 45,
    road_segment_id: "SEG-HYD-005",
    activation_radius: 120,
    trigger_distance: 80,
    validity_distance: 150,
    priority: "MEDIUM",
    status: "ACTIVE",
    source: "Virtual RIU Hub",
  }
];

export const FALLBACK_SIGNALS: TrafficSignal[] = [
  {
    signal_id: "SIG-HYD-001",
    name: "NTR Gardens Junction",
    latitude: 17.4230,
    longitude: 78.4750,
    direction: 72,
    road_segment_id: "SEG-HYD-004",
    state: "GREEN",
    cycle_duration: 90,
    remaining_time: 24,
    red_duration: 45,
    yellow_duration: 5,
    green_duration: 40,
    recommended_speed_min: 38,
    recommended_speed_max: 45,
  },
  {
    signal_id: "SIG-HYD-002",
    name: "Panjagutta Main Junction",
    latitude: 17.4180,
    longitude: 78.4500,
    direction: 45,
    road_segment_id: "SEG-HYD-002",
    state: "RED",
    cycle_duration: 120,
    remaining_time: 15,
    red_duration: 65,
    yellow_duration: 5,
    green_duration: 50,
    recommended_speed_min: 0,
    recommended_speed_max: 0,
  }
];

export const FALLBACK_EVENTS: RoadEvent[] = [
  {
    event_id: "EVT-HYD-001",
    event_type: "SPEED_LIMIT",
    name: "IRC:67 Regulatory Speed Limit 50 km/h",
    value: 50,
    unit: "km/h",
    latitude: 17.4270,
    longitude: 78.4630,
    heading: 68,
    road_segment_id: "SEG-HYD-003",
    direction: 68,
    activation_distance: 150,
    trigger_distance: 100,
    expiry_distance: 400,
    priority: "HIGH",
    confidence: 0.984,
    source: "PyTorch Vision Fusion (ResNet-18)",
    state: "ACTIVE",
    distance_to_vehicle: 120,
  }
];

export const FALLBACK_METRICS: ModelMetrics = {
  model_name: "YOLOv8x-RoadSense + ResNet-18 Ensemble",
  version: "2.4.0",
  timestamp: new Date().toISOString(),
  best_val_acc: 0.9942,
  final_precision: 0.9915,
  final_recall: 0.9928,
  final_f1: 0.9921,
  mAP50: 0.9882,
  mAP50_95: 0.8945,
  fps: 84.2,
  inference_latency_ms: 11.8,
  history: [
    { epoch: 1, train_loss: 0.62, train_acc: 0.84, val_loss: 0.45, val_acc: 0.89, precision: 0.88, recall: 0.87, f1: 0.875, mAP50: 0.86 },
    { epoch: 10, train_loss: 0.22, train_acc: 0.94, val_loss: 0.18, val_acc: 0.95, precision: 0.95, recall: 0.94, f1: 0.945, mAP50: 0.93 },
    { epoch: 25, train_loss: 0.08, train_acc: 0.98, val_loss: 0.07, val_acc: 0.985, precision: 0.98, recall: 0.98, f1: 0.980, mAP50: 0.975 },
    { epoch: 50, train_loss: 0.03, train_acc: 0.995, val_loss: 0.025, val_acc: 0.994, precision: 0.992, recall: 0.993, f1: 0.9925, mAP50: 0.9882 }
  ]
};

export const FALLBACK_TAXONOMY = {
  total_classes: 43,
  categories: ["Mandatory/Regulatory", "Cautionary/Warning", "Informatory"],
  classes: [
    { class_id: 0, code: "IRC-00", name: "Speed limit (20km/h)", category: "Mandatory/Regulatory" },
    { class_id: 1, code: "IRC-01", name: "Speed limit (30km/h)", category: "Mandatory/Regulatory" },
    { class_id: 2, code: "IRC-02", name: "Speed limit (50km/h)", category: "Mandatory/Regulatory" },
    { class_id: 3, code: "IRC-03", name: "Speed limit (60km/h)", category: "Mandatory/Regulatory" },
    { class_id: 4, code: "IRC-04", name: "Speed limit (70km/h)", category: "Mandatory/Regulatory" },
    { class_id: 5, code: "IRC-05", name: "Speed limit (80km/h)", category: "Mandatory/Regulatory" },
    { class_id: 14, code: "IRC-14", name: "Stop", category: "Mandatory/Regulatory" },
    { class_id: 15, code: "IRC-15", name: "No vehicles", category: "Mandatory/Regulatory" },
    { class_id: 17, code: "IRC-17", name: "No entry", category: "Mandatory/Regulatory" },
    { class_id: 18, code: "IRC-18", name: "General caution", category: "Cautionary/Warning" },
    { class_id: 25, code: "IRC-25", name: "Road work", category: "Cautionary/Warning" },
    { class_id: 27, code: "IRC-27", name: "Pedestrians", category: "Cautionary/Warning" },
    { class_id: 33, code: "IRC-33", name: "Turn right ahead", category: "Mandatory/Regulatory" },
    { class_id: 34, code: "IRC-34", name: "Turn left ahead", category: "Mandatory/Regulatory" },
    { class_id: 35, code: "IRC-35", name: "Ahead only", category: "Mandatory/Regulatory" },
  ]
};

export const FALLBACK_CORRIDORS: CorridorTrafficStatus[] = [
  {
    corridor_id: "corridor_necklace_road",
    name: "Necklace Road Smart Corridor",
    congestion_level: "LOW",
    level_of_service: "LOS A",
    average_speed_kmh: 42.4,
    active_vehicle_count: 142,
    incident_count: 0,
    aqi_index: 68,
    green_wave_active: true,
  },
  {
    corridor_id: "corridor_hitec_city",
    name: "Hitec City Express Corridor",
    congestion_level: "MODERATE",
    level_of_service: "LOS B",
    average_speed_kmh: 38.6,
    active_vehicle_count: 284,
    incident_count: 1,
    aqi_index: 82,
    green_wave_active: true,
  }
];

export const FALLBACK_INCIDENTS: TrafficIncident[] = [
  {
    incident_id: "INC-HYD-8821",
    timestamp: new Date().toISOString(),
    incident_type: "Over-speeding Alert",
    severity: "MEDIUM",
    location_name: "Necklace Road Waterfront (People's Plaza)",
    latitude: 17.4290,
    longitude: 78.4700,
    vehicle_id: "VEH-HYD-001",
    vehicle_plate: "TS 09 EV 4412",
    status: "RESOLVED",
    speed_kmh: 42.0,
    fine_amount_inr: 0,
  }
];

export const FALLBACK_EV_STATIONS: EVChargingStation[] = [
  {
    station_id: "EV-STN-001",
    name: "TSREDCO Fast Charger - People's Plaza",
    operator: "TSREDCO / Tata Power",
    latitude: 17.4285,
    longitude: 78.4695,
    distance_m: 180,
    total_ports: 8,
    available_ports: 5,
    charger_types: ["CCS2 (60kW)", "Type 2 (22kW)"],
    power_kw: 60,
    price_per_kwh: 16.5,
    wait_time_minutes: 0,
    status: "AVAILABLE",
  },
  {
    station_id: "EV-STN-002",
    name: "Jio-bp Pulse - Tank Bund South",
    operator: "Jio-bp",
    latitude: 17.4235,
    longitude: 78.4760,
    distance_m: 650,
    total_ports: 6,
    available_ports: 2,
    charger_types: ["CCS2 (120kW)", "CHAdeMO (50kW)"],
    power_kw: 120,
    price_per_kwh: 18.0,
    wait_time_minutes: 5,
    status: "AVAILABLE",
  }
];
