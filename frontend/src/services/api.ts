import {
  VehicleState, VirtualRIU, RoadEvent, TrafficSignal, DetectionResponse, ModelMetrics,
  EVChargingStation, TrafficIncident, CorridorTrafficStatus
} from '../types';

const isBrowser = typeof window !== 'undefined';
const wsProto = isBrowser && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = isBrowser ? window.location.host : 'localhost:5173';

// Dynamic paths allowing multi-device access over LAN and live tunnels
const API_BASE = '/api';
const WS_BASE = `${wsProto}//${host}/ws`;

/**
 * Fetch wrapper with automatic Bearer token injection and 401 session handling.
 * On 401, clears local session and dispatches a session-expired event.
 */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = isBrowser ? localStorage.getItem('roadsense_token') : null;
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (init?.headers) {
    const initHeaders = init.headers as Record<string, string> | Headers | string[][];
    if (initHeaders instanceof Headers) {
      initHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(initHeaders)) {
      initHeaders.forEach(([k, v]) => {
        headers[k] = v;
      });
    } else {
      Object.assign(headers, initHeaders);
    }
  }

  const res = await fetch(input, { ...init, headers });

  // Auto-logout on 401 Unauthorized
  if (res.status === 401 && isBrowser) {
    localStorage.removeItem('roadsense_token');
    localStorage.removeItem('roadsense_user');
    window.dispatchEvent(new CustomEvent('roadsense-auth-expired'));
  }

  return res;
}

// Auth functions
export const authApi = {
  async login(email: string, password: string) {
    const res = await authenticatedFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async logout(token?: string) {
    try {
      await authenticatedFetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      });
    } catch {
      // Ignore — always clear local session
    }
  },

  async me(token: string) {
    const res = await authenticatedFetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('Session invalid');
    }
    return res.json();
  },
};

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

  // EV Smart Charging & Traffic Department Portal
  async getEVStations(lat?: number, lon?: number): Promise<EVChargingStation[]> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    const res = await fetch(`${API_BASE}/ev/stations?${params.toString()}`);
    return res.json();
  },

  async getTrafficCorridors(): Promise<CorridorTrafficStatus[]> {
    const res = await fetch(`${API_BASE}/traffic-dept/corridors`);
    return res.json();
  },

  async getTrafficIncidents(): Promise<TrafficIncident[]> {
    const res = await fetch(`${API_BASE}/traffic-dept/incidents`);
    return res.json();
  },

  async triggerEmergencyPreemption(routeId: string = 'route_hitec_gachibowli', enable: boolean = true): Promise<any> {
    const res = await fetch(`${API_BASE}/traffic-dept/emergency-preemption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route_id: routeId, enable }),
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
