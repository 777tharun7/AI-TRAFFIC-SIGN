import {
  VehicleState, VirtualRIU, RoadEvent, TrafficSignal, DetectionResponse, ModelMetrics
} from '../types';

const isBrowser = typeof window !== 'undefined';
const wsProto = isBrowser && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = isBrowser ? window.location.host : 'localhost:5173';

// Dynamic paths allowing multi-device access over LAN and live tunnels
const API_BASE = '/api';
const WS_BASE = `${wsProto}//${host}/ws`;

export const api = {
  // Vehicle Telemetry
  async getVehicles(): Promise<VehicleState[]> {
    const res = await fetch(`${API_BASE}/vehicles`);
    return res.json();
  },

  async controlVehicle(vehicleId: string, action: string, params?: { route_id?: string; vehicle_type?: string; delta_speed?: number }): Promise<VehicleState> {
    const res = await fetch(`${API_BASE}/vehicles/${vehicleId}/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...params }),
    });
    return res.json();
  },

  async getRoutes(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/routes`);
    return res.json();
  },

  // Virtual RIUs
  async getRIUs(): Promise<VirtualRIU[]> {
    const res = await fetch(`${API_BASE}/rius`);
    return res.json();
  },

  async createRIU(data: Partial<VirtualRIU>): Promise<VirtualRIU> {
    const res = await fetch(`${API_BASE}/rius`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async toggleRIU(riuId: string): Promise<VirtualRIU> {
    const res = await fetch(`${API_BASE}/rius/${riuId}/toggle`, { method: 'POST' });
    return res.json();
  },

  async deleteRIU(riuId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/rius/${riuId}`, { method: 'DELETE' });
    return res.json();
  },

  // Road Events & Traffic Signals
  async getEvents(): Promise<RoadEvent[]> {
    const res = await fetch(`${API_BASE}/events`);
    return res.json();
  },

  async getSignals(): Promise<TrafficSignal[]> {
    const res = await fetch(`${API_BASE}/signals`);
    return res.json();
  },

  // AI Sign Detection
  async detectSigns(formData: FormData): Promise<DetectionResponse> {
    const res = await fetch(`${API_BASE}/signs/detect`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  async getTaxonomy(): Promise<any> {
    const res = await fetch(`${API_BASE}/signs`);
    return res.json();
  },

  // Model & Datasets
  async getModelMetrics(): Promise<ModelMetrics> {
    const res = await fetch(`${API_BASE}/models`);
    return res.json();
  },

  async getModelEvaluationReport(): Promise<any> {
    const res = await fetch(`${API_BASE}/models/evaluation`);
    return res.json();
  },

  async getDatasetInfo(): Promise<any> {
    const res = await fetch(`${API_BASE}/datasets`);
    return res.json();
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
  },

  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // CVDV (Computer Vision + Digital Vehicle)
  async getCVDVSigns(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/cvdv/signs`);
    return res.json();
  },

  async inspectCVDV(classId: number, confidence: number = 0.95): Promise<any> {
    const res = await fetch(`${API_BASE}/cvdv/inspect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: classId, confidence }),
    });
    return res.json();
  },

  async startDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/start`, { method: 'POST' });
    return res.json();
  },

  async classifyROI(imageBase64: string, bbox?: number[]): Promise<any> {
    const res = await fetch(`${API_BASE}/signs/classify-roi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imageBase64, bbox }),
    });
    return res.json();
  },

  // WebSocket creator
  createVehicleWebSocket(vehicleId: string, onMessage: (data: VehicleState) => void): WebSocket {
    const ws = new WebSocket(`${WS_BASE}/vehicle/${vehicleId}`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error('WS Parse Error:', e);
      }
    };
    return ws;
  }
};
