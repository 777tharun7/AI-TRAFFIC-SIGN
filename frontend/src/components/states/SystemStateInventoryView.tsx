import React, { useState } from 'react';
import { 
  ShieldCheck, Layers, AlertTriangle, Wifi, Camera, MapPin, 
  Radio, Brain, Zap, CheckCircle2, Sliders, ExternalLink,
  ChevronDown, ChevronRight, Lock, Cookie, ServerCrash, Clock,
  Inbox, HelpCircle, Activity, Play
} from 'lucide-react';

export const SystemStateInventoryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  const inventory = [
    {
      id: 1,
      name: '1. 🌐 Core Navigable Pages (20 Pages)',
      count: 20,
      badge: 'Core Pages',
      color: 'blue',
      states: [
        { code: 'PAGE-01', name: 'Landing / Home', desc: 'Product showcase, high-contrast hero banner, interactive 7-step architecture flow.' },
        { code: 'PAGE-02', name: 'About RoadSense', desc: 'Detailed technical specification and zero-hardware digital twin explanations.' },
        { code: 'PAGE-03', name: 'Live Intelligence', desc: 'Real-time multi-modal road intelligence: Camera ROI, V2X, MapLibre 2D/3D tracking.' },
        { code: 'PAGE-04', name: 'Vehicle Digital Twin', desc: 'Car Cockpit HMI cluster with dynamic speedometer, heading cone, and lane guide.' },
        { code: 'PAGE-05', name: 'Bike Cockpit Display', desc: 'Glanceable 6.7" high-contrast smartphone display for two-wheelers.' },
        { code: 'PAGE-06', name: 'AI Vision Lab (CVDV)', desc: 'Computer Vision + Digital Vehicle translation studio with 43-sign taxonomy.' },
        { code: 'PAGE-07', name: 'AI Model Benchmarks', desc: 'GTSRB multi-architecture comparison (CNN, ResNet-50, MobileNetV3, EfficientNet-B0).' },
        { code: 'PAGE-08', name: 'AI Single-Image Test', desc: 'Upload testing interface for offline single-sign model validation.' },
        { code: 'PAGE-09', name: 'V2X Intelligence & SPaT', desc: 'Direct intersection infrastructure feed with live countdowns.' },
        { code: 'PAGE-10', name: 'Virtual RIU Studio', desc: 'Digital roadside beacons broadcasting geo-fenced limits, breakers, and school zones.' },
        { code: 'PAGE-11', name: 'Decision Engine (Point 6)', desc: 'Traffic rules processor, GLOSA green-wave calculator, and dilemma zone physics.' },
        { code: 'PAGE-12', name: 'Simulation Lab', desc: 'Full Hyderabad connected corridor autonomous kinematics simulation.' },
        { code: 'PAGE-13', name: 'Research & Literature', desc: 'Official Project Presentation deck (Canva), problem formulation, and whitepaper.' },
        { code: 'PAGE-14', name: 'System Architecture', desc: 'Master 7-step perception-to-actuation pipeline and engineering stack.' },
        { code: 'PAGE-15', name: 'Dataset Management', desc: 'GTSRB dataset metadata, class distribution, and 50,000+ image catalog.' },
        { code: 'PAGE-16', name: 'Live Telemetry Stream', desc: '2Hz WebSocket stream broadcasting vehicle kinematics and events.' },
        { code: 'PAGE-17', name: 'Road Events Catalog', desc: 'Active, approaching, passed, and completed road event logs.' },
        { code: 'PAGE-18', name: 'Settings & Configurations', desc: 'Geofence activation radiuses, heading gate tolerances (±35°), and thresholds.' },
        { code: 'PAGE-19', name: 'Account & Profiles', desc: 'Role-based access (Driver, Traffic Engineer, Fleet Operator, Researcher).' },
        { code: 'PAGE-20', name: 'Privacy Policy & Legal', desc: 'Cookie preferences, ISO 22737 compliance, and data governance.' }
      ]
    },
    {
      id: 2,
      name: '2. 🔐 Authentication & Session States',
      count: 11,
      badge: 'Security',
      color: 'purple',
      states: [
        { code: 'AUTH-01', name: 'Login Active', desc: 'Authenticated session with active JWT token.' },
        { code: 'AUTH-02', name: 'Registration / Onboarding', desc: 'Fleet operator and researcher account provisioning.' },
        { code: 'AUTH-03', name: 'Session Expired', desc: 'JWT token invalid/expired; prompts re-authentication without losing state.' },
        { code: 'AUTH-04', name: 'Unauthorized (401)', desc: 'Attempted access to protected V-RIU configuration endpoints.' },
        { code: 'AUTH-05', name: 'Account Disabled', desc: 'Account suspended by traffic authority administrator.' },
        { code: 'AUTH-06', name: 'Rate Limit (429)', desc: 'Too many authentication attempts; backoff timer enforced.' },
        { code: 'AUTH-07', name: 'Logout Confirmation', desc: 'Clean termination of WebSocket subscriptions and local tokens.' }
      ]
    },
    {
      id: 3,
      name: '3. 🍪 Cookie & Privacy Consent States',
      count: 11,
      badge: 'Privacy',
      color: 'emerald',
      states: [
        { code: 'COOK-01', name: 'First-Time Consent Modal', desc: 'Prompt displayed on first visit before loading heavy telemetry.' },
        { code: 'COOK-02', name: 'Essential Cookies Active', desc: 'Core session tokens, MapLibre tile caching, and telemetry buffers.' },
        { code: 'COOK-03', name: 'Analytics Consent Enabled', desc: 'Inference latency and green-wave compliance reporting active.' },
        { code: 'COOK-04', name: 'Performance Cache Enabled', desc: 'High-speed IndexedDB caching of vector road geometry.' },
        { code: 'COOK-05', name: 'Consent Preferences Saved', desc: 'Persistent local storage state synced with user choices.' }
      ]
    },
    {
      id: 4,
      name: '4. 📡 Network & Connectivity States',
      count: 13,
      badge: 'Network',
      color: 'indigo',
      states: [
        { code: 'NET-01', name: 'Connected (Online)', desc: 'High-bandwidth bi-directional WebSocket and HTTP/2 connection active.' },
        { code: 'NET-02', name: 'Slow Connection Warning', desc: 'Latency > 250ms; reduces telemetry broadcast frequency.' },
        { code: 'NET-03', name: 'Connection Lost (Offline)', desc: 'Network severed; amber banner displayed, dead-reckoning fallback active.' },
        { code: 'NET-04', name: 'Reconnecting State', desc: 'Exponential backoff attempting automatic WebSocket reconnection.' },
        { code: 'NET-05', name: 'WebSocket Re-Established', desc: 'State synchronization re-aligned without page reload.' }
      ]
    },
    {
      id: 5,
      name: '5. 🖥️ Server & HTTP Error States',
      count: 15,
      badge: 'Server',
      color: 'rose',
      states: [
        { code: 'RS-503', name: 'Service Unavailable', desc: 'FastAPI backend under maintenance; graceful error dialog with retry CTA.' },
        { code: 'RS-500', name: 'Internal Server Error', desc: 'Unhandled exception caught gracefully by global error boundary.' },
        { code: 'RS-404', name: 'Route / Resource Not Found', desc: 'Requested signal or RIU ID does not exist in database.' },
        { code: 'RS-422', name: 'Validation Error', desc: 'Pydantic schema mismatch on ingested V2X payload.' },
        { code: 'RS-408', name: 'Request Timeout', desc: 'Inference model took >3000ms; falls back to cached bounding boxes.' }
      ]
    },
    {
      id: 6,
      name: '6. ⏳ Loading & Initialization States',
      count: 14,
      badge: 'Loading',
      color: 'amber',
      states: [
        { code: 'LOAD-01', name: 'Initial Platform Boot', desc: 'Loads road corridor GeoJSON and initializes MapLibre canvas.' },
        { code: 'LOAD-02', name: 'PyTorch Model Weight Loading', desc: 'Allocates GPU/MPS tensors and loads 43-class model weights.' },
        { code: 'LOAD-03', name: 'Webcam Stream Initialization', desc: 'Acquires user video stream with optimal resolution (640x480).' },
        { code: 'LOAD-04', name: 'V2X SPaT Handshake', desc: 'Connects to intersection signal controller telemetry channel.' },
        { code: 'LOAD-05', name: 'Model Inference In-Progress', desc: 'Pulsing indicator during real-time image processing.' }
      ]
    },
    {
      id: 7,
      name: '7. 📭 Empty States',
      count: 11,
      badge: 'Empty State',
      color: 'slate',
      states: [
        { code: 'EMPTY-01', name: 'No Active Road Events', desc: 'No speed limits, breakers, or signals in current vehicle corridor.' },
        { code: 'EMPTY-02', name: 'No V2X Broadcast Received', desc: 'Vehicle is outside intersection DSRC range (250m radius).' },
        { code: 'EMPTY-03', name: 'No Optical Detections Found', desc: 'Camera frame clear of recognized traffic signs.' },
        { code: 'EMPTY-04', name: 'No Test Experiments Saved', desc: 'Prompts researcher to run model training benchmark.' }
      ]
    },
    {
      id: 8,
      name: '8. 🤖 AI & Perception States',
      count: 15,
      badge: 'AI Perception',
      color: 'teal',
      states: [
        { code: 'AI-01', name: 'High-Confidence Detection (≥90%)', desc: 'Green confidence badge; sign immediately accepted by context engine.' },
        { code: 'AI-02', name: 'Uncertain Detection (70% - 90%)', desc: 'Amber badge; requires V-RIU or multi-frame temporal confirmation.' },
        { code: 'AI-03', name: 'Low-Confidence Rejected (<70%)', desc: 'Suppressed by Non-Maximum Suppression (NMS) to prevent false alerts.' },
        { code: 'AI-04', name: 'Hardware Acceleration (MPS/CUDA)', desc: 'Deep classifier executing on GPU backend.' },
        { code: 'AI-05', name: 'CPU Inference Fallback', desc: 'Graceful execution on CPU if GPU memory is constrained.' }
      ]
    },
    {
      id: 9,
      name: '9. 📷 Camera & Hardware States',
      count: 14,
      badge: 'Camera',
      color: 'cyan',
      states: [
        { code: 'CAM-01', name: 'Continuous Stream Active', desc: 'Live webcam / uploaded video processing at 25-30 FPS.' },
        { code: 'CAM-02', name: 'Permission Required', desc: 'Browser prompt requesting access to webcam.' },
        { code: 'CAM-03', name: 'Permission Denied Fallback', desc: 'Shows file upload or simulated driving video option.' },
        { code: 'CAM-04', name: 'Sign Occluded / Poor Lighting', desc: 'Flags partial visibility and relies on V2X digital twin.' }
      ]
    },
    {
      id: 10,
      name: '10. 📍 GPS & Context Fusion States',
      count: 12,
      badge: 'Geospatial',
      color: 'violet',
      states: [
        { code: 'GPS-01', name: 'RTK D-GPS Fixed', desc: 'Sub-meter accuracy (±1.2m) with road segment alignment.' },
        { code: 'GPS-02', name: 'Heading Gate Valid (±35°)', desc: 'Forward sign applies directly to vehicle trajectory.' },
        { code: 'GPS-03', name: 'Heading Gate Discarded', desc: 'Sign is facing opposite lane; discarded to prevent phantom braking.' },
        { code: 'GPS-04', name: 'Sensor Conflict Detected', desc: 'Vision and V2X differ; enforces safety-conservative override.' }
      ]
    },
    {
      id: 11,
      name: '11. 🚦 Decision Engine States',
      count: 14,
      badge: 'Decision Engine',
      color: 'emerald',
      states: [
        { code: 'DEC-01', name: 'Decelerate to Stop', desc: 'Red signal / stop line detected; applies comfort braking (2.5 m/s²).' },
        { code: 'DEC-02', name: 'GLOSA Green Wave Cruise', desc: 'Calculates recommended cruise speed to pass green without stopping.' },
        { code: 'DEC-03', name: 'Yellow Dilemma Zone Clearance', desc: 'Stopping impossible safely; commands safe junction clearance.' },
        { code: 'DEC-04', name: 'Speed Limit Damping', desc: 'Caps throttle to 40 km/h without stopping vehicle.' },
        { code: 'DEC-05', name: 'Mandatory 3s Stop Hold', desc: 'Brings velocity to 0.0 km/h and enforces 3.0s countdown.' }
      ]
    },
    {
      id: 12,
      name: '12. 🚗 Vehicle Digital Twin Kinematics',
      count: 12,
      badge: 'Digital Twin',
      color: 'sky',
      states: [
        { code: 'VEH-01', name: 'MOVING (Cruising)', desc: 'Normal autonomous or manual velocity tracking.' },
        { code: 'VEH-02', name: 'APPROACHING_EVENT', desc: 'Within 150m of upcoming restriction.' },
        { code: 'VEH-03', name: 'STOPPING (Braking Curve)', desc: 'Physics deceleration d = v²/(2a).' },
        { code: 'VEH-04', name: 'STOPPED (At Stop Line)', desc: 'Zero speed locked 8m before signal post.' },
        { code: 'VEH-05', name: 'RESUMING (Green Acceleration)', desc: 'Smooth acceleration back to corridor limit.' }
      ]
    }
  ];

  const currentCat = inventory.find(c => c.id === selectedCategory) || inventory[0];

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[#0B151C] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold font-mono uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Production Quality Specification</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            RoadSense AI — Complete State &amp; Screen Inventory
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            A production-grade connected mobility system handles not only happy-path pages, but all 
            <strong className="text-white font-semibold"> 80+ distinct machine, failure, network, sensor, and permission states</strong> across 
            12 critical operational categories.
          </p>
        </div>
      </div>

      {/* Main Grid: Category Selector + States Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 4 Cols: Category Index */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              12 State Categories
            </h2>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              80+ States Total
            </span>
          </div>

          <div className="space-y-1">
            {inventory.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-emerald-500/40'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: State Details & Behavior Specifications */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Category {currentCat.id} Deep Dive
                </span>
                <h3 className="text-lg font-black text-slate-900">{currentCat.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                {currentCat.states.length} Active State Handlers
              </span>
            </div>

            {/* States List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentCat.states.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {st.code}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">
                    {st.name}
                  </h4>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
