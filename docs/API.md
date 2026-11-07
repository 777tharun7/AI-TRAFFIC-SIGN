# REST & WebSocket API Documentation — RoadSense AI

Base URL: `http://localhost:8000/api`
WebSocket URL: `ws://localhost:8000/ws`

## Endpoints

### 1. Computer Vision & Traffic Signs
- `GET /api/signs`: Returns universal taxonomy and class metadata.
- `POST /api/signs/detect`: Runs real-time detection on image upload / base64 string. Returns bounding boxes, classification, confidence %, latency ms, annotated preview, and multi-source fused event.

### 2. Digital Road Events & V-RIUs
- `GET /api/events`: Catalog of all digital road events.
- `GET /api/events/active`: Real-time active events filtered by vehicle position.
- `GET /api/rius`: List all Virtual RIU software beacons.
- `POST /api/rius`: Deploy a new Virtual RIU beacon.
- `POST /api/rius/{id}/toggle`: Toggle unit active/disabled.
- `DELETE /api/rius/{id}`: Decommission unit.

### 3. Traffic Signals & Green Wave
- `GET /api/signals`: Live state (RED/YELLOW/GREEN), phase countdowns, and speed recommendations.

### 4. Vehicle Simulation & Telemetry
- `GET /api/vehicles`: Current telemetry (speed, heading, GPS, active road).
- `POST /api/vehicles/{id}/control`: Control vehicle (`play`, `pause`, `reset`, `speed_up`, `slow_down`, `set_route`, `set_type`).
- `GET /api/routes`: Hyderabad corridor route definitions.

### 5. WebSockets
- `ws://localhost:8000/ws/vehicle/{id}`: Real-time 2Hz vehicle telemetry & hazard alerts stream.
- `ws://localhost:8000/ws/events`: Broadcast on road event state transitions.
- `ws://localhost:8000/ws/signals`: Broadcast on signal phase updates.
