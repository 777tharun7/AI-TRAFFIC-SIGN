import {
  VehicleState, VirtualRIU, RoadEvent, TrafficSignal, DetectionResponse, ModelMetrics,
  EVChargingStation, TrafficIncident, CorridorTrafficStatus
} from '../types';
import {
  FALLBACK_ROUTES, FALLBACK_VEHICLES, FALLBACK_RIUS, FALLBACK_SIGNALS,
  FALLBACK_EVENTS, FALLBACK_METRICS, FALLBACK_TAXONOMY, FALLBACK_CORRIDORS,
  FALLBACK_INCIDENTS, FALLBACK_EV_STATIONS
} from './fallbackData';

const isBrowser = typeof window !== 'undefined';
const wsProto = isBrowser && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = isBrowser ? window.location.host : 'localhost:5173';

// Dynamic paths allowing multi-device access over LAN and live tunnels
const API_BASE = '/api';
const WS_BASE = `${wsProto}//${host}/ws`;

// Module-level persistent vehicle state for resilient digital twin fallback simulation
const activeFallbackVehicle: VehicleState = { ...FALLBACK_VEHICLES[0] };

async function safeJsonFetch<T>(url: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, init);
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      return await res.json();
    }
  } catch {
    // Backend offline / network failure / static GitHub Pages host
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error(`Fetch failed for ${url}`);
}

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
    try {
      const res = await authenticatedFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return {
      access_token: `roadsense_demo_token_${Date.now()}`,
      user: {
        user_id: 'citizen-001',
        email,
        full_name: 'Devanboina Tharun',
        role: 'citizen',
        vehicle_plate: 'TS 09 EV 4412',
      }
    };
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
    try {
      const res = await authenticatedFetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const stored = isBrowser ? localStorage.getItem('roadsense_user') : null;
    return stored ? JSON.parse(stored) : null;
  },
};

export const api = {
  // Vehicle Telemetry
  async getVehicles(): Promise<VehicleState[]> {
    return safeJsonFetch<VehicleState[]>(`${API_BASE}/vehicles`, undefined, FALLBACK_VEHICLES);
  },

  async controlVehicle(vehicleId: string, action: string, params?: { route_id?: string; vehicle_type?: string; delta_speed?: number }): Promise<VehicleState> {
    if (action === 'start') activeFallbackVehicle.is_running = true;
    else if (action === 'stop' || action === 'pause') activeFallbackVehicle.is_running = false;
    else if (action === 'accelerate') activeFallbackVehicle.speed_kmh = Math.min(120, activeFallbackVehicle.speed_kmh + (params?.delta_speed ?? 5));
    else if (action === 'brake') activeFallbackVehicle.speed_kmh = Math.max(0, activeFallbackVehicle.speed_kmh - (params?.delta_speed ?? 5));
    if (params?.vehicle_type) activeFallbackVehicle.vehicle_type = params.vehicle_type as any;

    return safeJsonFetch<VehicleState>(
      `${API_BASE}/vehicles/${vehicleId}/control`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params }),
      },
      { ...activeFallbackVehicle }
    );
  },

  async getRoutes(): Promise<any[]> {
    return safeJsonFetch<any[]>(`${API_BASE}/routes`, undefined, FALLBACK_ROUTES);
  },

  // Virtual RIUs
  async getRIUs(): Promise<VirtualRIU[]> {
    return safeJsonFetch<VirtualRIU[]>(`${API_BASE}/rius`, undefined, FALLBACK_RIUS);
  },

  async createRIU(data: Partial<VirtualRIU>): Promise<VirtualRIU> {
    return safeJsonFetch<VirtualRIU>(
      `${API_BASE}/rius`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      { ...FALLBACK_RIUS[0], ...data, id: `RIU-NEW-${Date.now()}` } as VirtualRIU
    );
  },

  async toggleRIU(riuId: string): Promise<VirtualRIU> {
    return safeJsonFetch<VirtualRIU>(`${API_BASE}/rius/${riuId}/toggle`, { method: 'POST' }, FALLBACK_RIUS[0]);
  },

  async deleteRIU(riuId: string): Promise<any> {
    return safeJsonFetch<any>(`${API_BASE}/rius/${riuId}`, { method: 'DELETE' }, { success: true, deleted: riuId });
  },

  // Road Events & Traffic Signals
  async getEvents(): Promise<RoadEvent[]> {
    return safeJsonFetch<RoadEvent[]>(`${API_BASE}/events`, undefined, FALLBACK_EVENTS);
  },

  async getSignals(): Promise<TrafficSignal[]> {
    return safeJsonFetch<TrafficSignal[]>(`${API_BASE}/signals`, undefined, FALLBACK_SIGNALS);
  },

  // AI Sign Detection
  async detectSigns(formData: FormData): Promise<DetectionResponse> {
    return safeJsonFetch<DetectionResponse>(
      `${API_BASE}/signs/detect`,
      { method: 'POST', body: formData },
      {
        detections: [
          {
            box: [120, 150, 240, 270],
            confidence: 0.982,
            class_id: 2,
            class_name: "Speed limit (50km/h)",
            category: "Mandatory/Regulatory"
          }
        ],
        inference_time_ms: 12.4,
        timestamp: new Date().toISOString()
      } as any
    );
  },

  async getTaxonomy(): Promise<any> {
    return safeJsonFetch<any>(`${API_BASE}/signs`, undefined, FALLBACK_TAXONOMY);
  },

  // Model & Datasets
  async getModelMetrics(): Promise<ModelMetrics> {
    return safeJsonFetch<ModelMetrics>(`${API_BASE}/models`, undefined, FALLBACK_METRICS);
  },

  async getModelEvaluationReport(): Promise<any> {
    return safeJsonFetch<any>(
      `${API_BASE}/models/evaluation`,
      undefined,
      {
        metrics: FALLBACK_METRICS,
        classification_report: {
          accuracy: 0.9942,
          macro_avg: { precision: 0.9915, recall: 0.9928, "f1-score": 0.9921 },
          weighted_avg: { precision: 0.9945, recall: 0.9942, "f1-score": 0.9943 }
        }
      }
    );
  },

  async getDatasetInfo(): Promise<any> {
    return safeJsonFetch<any>(
      `${API_BASE}/datasets`,
      undefined,
      {
        total_samples: 51830,
        train_samples: 39200,
        test_samples: 12630,
        num_classes: 43,
        resolution: "640x640 / 32x32"
      }
    );
  },

  async getAnalytics(): Promise<any> {
    return safeJsonFetch<any>(
      `${API_BASE}/analytics`,
      undefined,
      {
        total_detections: 14280,
        accuracy_rate: 0.994,
        avg_latency_ms: 11.8,
        active_corridors: 4,
        connected_vehicles: 184
      }
    );
  },

  async getHealth(): Promise<any> {
    return safeJsonFetch<any>(
      `${API_BASE}/health`,
      undefined,
      { status: "healthy", version: "2.4.0", timestamp: new Date().toISOString() }
    );
  },

  // CVDV (Computer Vision + Digital Vehicle)
  async getCVDVSigns(): Promise<any[]> {
    return safeJsonFetch<any[]>(
      `${API_BASE}/cvdv/signs`,
      undefined,
      FALLBACK_TAXONOMY.classes
    );
  },

  async inspectCVDV(classId: number, confidence: number = 0.95): Promise<any> {
    return safeJsonFetch<any>(
      `${API_BASE}/cvdv/inspect`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: classId, confidence }),
      },
      {
        class_id: classId,
        confidence,
        status: "VERIFIED",
        validation_timestamp: new Date().toISOString()
      }
    );
  },

  async startDemo(): Promise<any> {
    return safeJsonFetch<any>(`${API_BASE}/demo/start`, { method: 'POST' }, { status: 'started' });
  },

  async classifyROI(imageBase64: string, bbox?: number[]): Promise<any> {
    return safeJsonFetch<any>(
      `${API_BASE}/signs/classify-roi`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: imageBase64, bbox }),
      },
      {
        class_id: 2,
        class_name: "Speed limit (50km/h)",
        confidence: 0.985
      }
    );
  },

  // EV Smart Charging & Traffic Department Portal
  async getEVStations(lat?: number, lon?: number): Promise<EVChargingStation[]> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    return safeJsonFetch<EVChargingStation[]>(
      `${API_BASE}/ev/stations?${params.toString()}`,
      undefined,
      FALLBACK_EV_STATIONS
    );
  },

  async getTrafficCorridors(): Promise<CorridorTrafficStatus[]> {
    return safeJsonFetch<CorridorTrafficStatus[]>(
      `${API_BASE}/traffic-dept/corridors`,
      undefined,
      FALLBACK_CORRIDORS
    );
  },

  async getTrafficIncidents(): Promise<TrafficIncident[]> {
    return safeJsonFetch<TrafficIncident[]>(
      `${API_BASE}/traffic-dept/incidents`,
      undefined,
      FALLBACK_INCIDENTS
    );
  },

  async triggerEmergencyPreemption(routeId: string = 'route_hitec_gachibowli', enable: boolean = true): Promise<any> {
    return safeJsonFetch<any>(
      `${API_BASE}/traffic-dept/emergency-preemption`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ route_id: routeId, enable }),
      },
      { success: true, corridor_cleared: enable }
    );
  },

  // WebSocket creator with graceful client-side vehicle simulation fallback
  createVehicleWebSocket(vehicleId: string, onMessage: (data: VehicleState) => void): WebSocket {
    let ws: WebSocket | null = null;
    let ticker: any = null;
    let isClosed = false;
    let stepIndex = 0;
    const waypoints = FALLBACK_ROUTES[0].waypoints;

    const startFallbackSimulation = () => {
      if (ticker || isClosed) return;
      onMessage({ ...activeFallbackVehicle });
      ticker = setInterval(() => {
        if (isClosed) {
          if (ticker) clearInterval(ticker);
          ticker = null;
          return;
        }
        if (!activeFallbackVehicle.is_running) return;
        stepIndex = (stepIndex + 1) % (waypoints.length * 30);
        const wpIdx = Math.floor(stepIndex / 30) % waypoints.length;
        const nextWpIdx = (wpIdx + 1) % waypoints.length;
        const frac = (stepIndex % 30) / 30;

        const p1 = waypoints[wpIdx];
        const p2 = waypoints[nextWpIdx];

        activeFallbackVehicle.latitude = +(p1.lat + (p2.lat - p1.lat) * frac).toFixed(6);
        activeFallbackVehicle.longitude = +(p1.lon + (p2.lon - p1.lon) * frac).toFixed(6);
        activeFallbackVehicle.current_road = p1.road;
        activeFallbackVehicle.progress_pct = Math.round((stepIndex / (waypoints.length * 30)) * 100);
        activeFallbackVehicle.speed_kmh = +(41 + Math.sin(stepIndex * 0.15) * 4).toFixed(1);

        onMessage({ ...activeFallbackVehicle });
      }, 300);
    };

    const mockWs: any = {
      readyState: 1, // WebSocket.OPEN
      send: (_data: any) => {},
      close: () => {
        isClosed = true;
        if (ws) {
          try { ws.close(); } catch {}
          ws = null;
        }
        if (ticker) {
          clearInterval(ticker);
          ticker = null;
        }
      },
      addEventListener: (_type: string, _listener: any) => {},
      removeEventListener: (_type: string, _listener: any) => {},
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
    };

    const isStaticHost = isBrowser && (
      window.location.hostname.includes('github.io') ||
      window.location.protocol === 'file:'
    );

    if (isStaticHost) {
      // Static hosting environments cannot upgrade to WebSocket connections.
      // Activate seamless Digital Twin kinematics simulation immediately without failed network calls.
      startFallbackSimulation();
      return mockWs as WebSocket;
    }

    try {
      ws = new WebSocket(`${WS_BASE}/vehicle/${vehicleId}`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
          if (typeof mockWs.onmessage === 'function') mockWs.onmessage(event);
        } catch (e) {
          console.error('WS Parse Error:', e);
        }
      };
      ws.onerror = (e) => {
        // Fall back gracefully to Digital Twin kinematics without failing the UI
        startFallbackSimulation();
      };
      ws.onclose = (e) => {
        // Fall back gracefully to Digital Twin kinematics
        startFallbackSimulation();
      };
      ws.onopen = (e) => {
        if (ticker) {
          clearInterval(ticker);
          ticker = null;
        }
        if (typeof mockWs.onopen === 'function') mockWs.onopen(e);
      };
    } catch {
      startFallbackSimulation();
    }

    return mockWs as WebSocket;
  }
};
