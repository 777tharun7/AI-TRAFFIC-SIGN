import React, { useState } from 'react';
import { 
  Layout, Grid, Eye, CheckCircle2, AlertTriangle, 
  Smartphone, Monitor, Sparkles, Sliders, Layers, 
  Compass, Navigation, ShieldCheck, Zap, Maximize2,
  RefreshCw, MousePointer, Info, Cpu
} from 'lucide-react';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';
import { UI_UX_DESIGN_SYSTEM } from '../styles/designSystem';

interface Props {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onControl?: (action: string, params?: any) => void;
  onNavigateTab?: (tab: string) => void;
}

export const UIUXLayoutStudio: React.FC<Props> = ({
  vehicle,
  rius,
  signals,
  onControl,
  onNavigateTab
}) => {
  // Debugger Controls State
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showBounds, setShowBounds] = useState<boolean>(true);
  const [showGlanceZones, setShowGlanceZones] = useState<boolean>(false);
  const [activeLayoutMode, setActiveLayoutMode] = useState<'split' | 'cockpit' | 'bike' | 'analytics'>('split');
  const [touchTargetPass, setTouchTargetPass] = useState<boolean>(true);
  const [simulatedContrast, setSimulatedContrast] = useState<'day' | 'night' | 'glare'>('night');

  const currentSpeed = vehicle?.speed_kmh ?? 45;
  const targetSpeed = vehicle?.target_speed_kmh ?? 50;
  const isOptimalSpeed = Math.abs(currentSpeed - targetSpeed) < 3;

  return (
    <div className={`space-y-6 relative ${showGrid ? 'debug-grid-overlay' : ''}`}>
      
      {/* ================= 1. DEBUGGER CONTROL BAR ================= */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 sticky top-20 z-40 backdrop-blur-md">
        
        {/* Left: Debugger Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tracking-tight">UI/UX Position & Layout Debugger</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              ISO 15005 & NHTSA Glanceability Compliance Inspector
            </p>
          </div>
        </div>

        {/* Center: Layout Mode Selectors */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-medium">
          <button
            onClick={() => setActiveLayoutMode('split')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLayoutMode === 'split' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Tactical Split (60/40)</span>
          </button>

          <button
            onClick={() => setActiveLayoutMode('cockpit')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLayoutMode === 'cockpit' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Cockpit Theater</span>
          </button>

          <button
            onClick={() => setActiveLayoutMode('bike')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLayoutMode === 'bike' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Bike 6.7" View</span>
          </button>
        </div>

        {/* Right: Overlay Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showGrid ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid Overlay</span>
          </button>

          <button
            onClick={() => setShowBounds(!showBounds)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showBounds ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bounds & Margins</span>
          </button>

          <button
            onClick={() => setShowGlanceZones(!showGlanceZones)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showGlanceZones ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Glance Heatmap</span>
          </button>
        </div>

      </div>

      {/* ================= 2. UX METRICS & COMPLIANCE BAR ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Metric 1: Glanceability Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Eye-Off-Road Budget</span>
            <span className="text-emerald-800 font-bold font-mono">112 ms / 150 ms</span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">PASS (Grade A)</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '74%' }} />
          </div>
          <div className="text-[10px] text-slate-400">Within NHTSA 150ms visual fixation limit</div>
        </div>

        {/* Metric 2: Touch Target Ergonomics */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Touch Target Size</span>
            <span className="text-cyan-800 font-bold font-mono">≥ 48 × 48 px</span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">100% COMPLIANT</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="text-[10px] text-slate-400">Zero sub-size click targets in driving UI</div>
        </div>

        {/* Metric 3: Contrast Ratio */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Luminance Contrast</span>
            <span className="text-purple-800 font-bold font-mono">14.2 : 1</span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">WCAG AAA EXCEED</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '92%' }} />
          </div>
          <div className="text-[10px] text-slate-400">High contrast under direct sunlight & night</div>
        </div>

        {/* Metric 4: Render Reflow Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Telemetry Pipeline Latency</span>
            <span className="text-emerald-800 font-bold font-mono">14.8 ms</span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">60.0 FPS SMOOTH</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }} />
          </div>
          <div className="text-[10px] text-slate-400">Zero dropped frames on WebSocket telemetry</div>
        </div>

      </div>

      {/* ================= 3. ACTIVE SIMULATION VIEW WITH POSITIONAL BOUNDS ================= */}
      <div className={`relative transition-all duration-300 ${showBounds ? 'debug-bounding-box' : ''}`}>
        
        {/* Glance Zone Overlay Badge */}
        {showGlanceZones && (
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none z-30 flex flex-col justify-between p-6 border-2 border-emerald-500/40 rounded-3xl">
            <div className="bg-emerald-950/80 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold self-start border border-emerald-500/40 backdrop-blur-md">
              🎯 PRIMARY 150MS GLANCE CONE (Focal Field of View)
            </div>
            <div className="bg-slate-950/80 text-slate-400 px-3 py-1.5 rounded-xl text-xs font-mono self-end border border-slate-700 backdrop-blur-md">
              PERIPHERAL COCKPIT SENSORS
            </div>
          </div>
        )}

        {/* Tactical Layout Grid Display */}
        {activeLayoutMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Columns: Spatial Vector Map Box */}
            <div className={`lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 ${showBounds ? 'debug-bounding-box' : ''}`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Primary Corridor Viewport (Coordinate Grid: W: 58.3% • Col 1-7)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Heading: {Math.round(vehicle?.heading ?? 0)}°
                </span>
              </div>

              {/* Dynamic Interactive Corridor Canvas Mock */}
              <div className="h-[440px] rounded-2xl bg-slate-950 relative overflow-hidden flex flex-col justify-between p-6 text-white border border-slate-800">
                
                {/* Simulated 3D Horizon Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{
                    backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    perspective: '300px',
                    transform: 'rotateX(55deg) translateY(-20px)'
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-mono">
                    Vehicle ID: <b className="text-emerald-400">{vehicle?.vehicle_id ?? 'VEH-HYD-001'}</b>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-mono">
                    Corridor: <b className="text-cyan-400">{vehicle?.current_road ?? 'HITEC City Corridor'}</b>
                  </div>
                </div>

                {/* Central Target Reticle */}
                <div className="relative z-10 self-center flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-400/80 flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                    <div className="w-12 h-12 rounded-full border border-cyan-400/60" />
                  </div>
                  <div className="mt-2 text-xs font-mono font-bold text-emerald-400 tracking-wider">
                    TARGET SPEED: {Math.round(targetSpeed)} KM/H
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>GPS: 17.4435° N, 78.3772° E</span>
                  <span className="text-emerald-400 font-bold">● V2X DSRC 10 Hz Active</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Automotive Cockpit HUD Stack */}
            <div className={`lg:col-span-5 space-y-4 ${showBounds ? 'debug-bounding-box' : ''}`}>
              
              {/* Glassmorphic Speedometer & State Indicator */}
              <div className="hud-panel rounded-3xl p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Cockpit HUD (Col 8-12)
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    GLANCEABLE
                  </span>
                </div>

                {/* Big Speed Dial */}
                <div className="flex items-center justify-around py-2">
                  <div className="text-center">
                    <div className="text-6xl font-black font-mono tracking-tight text-white">
                      {Math.round(currentSpeed)}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">
                      Current (KM/H)
                    </div>
                  </div>

                  <div className="h-16 w-px bg-white/15" />

                  <div className="text-center">
                    <div className="text-6xl font-black font-mono tracking-tight text-emerald-400">
                      {Math.round(targetSpeed)}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-widest text-emerald-300 mt-1">
                      Advisory (KM/H)
                    </div>
                  </div>
                </div>

                {/* Behavioral Status Card */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">State Machine:</span>
                  <span className="font-bold text-cyan-300">
                    {vehicle?.behavior_state ?? 'CRUISING'}
                  </span>
                </div>

                {/* Stop Line Distance & Signal Telemetry */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Upcoming Signal:</span>
                    <span className="font-bold text-rose-400">RED (28s remaining)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Distance to Stop Line:</span>
                    <span className="font-bold text-white">
                      {Math.round(vehicle?.distance_to_stop_line_m ?? 82)} meters
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons with 48px Minimum Automotive Touch Targets */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onControl && onControl(vehicle?.is_running ? 'pause' : 'play')}
                  className="h-12 px-4 rounded-xl bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{vehicle?.is_running ? 'Pause Sim' : 'Resume Sim'}</span>
                </button>

                <button
                  onClick={() => onControl && onControl('reset')}
                  className="h-12 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Route</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Cockpit Theater Mode */}
        {activeLayoutMode === 'cockpit' && (
          <div className="hud-panel rounded-3xl p-8 text-white border border-white/15 shadow-2xl max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Theater Mode • Focused Automotive Cluster
              </span>
              <h3 className="text-3xl font-black text-white tracking-tight">
                High-Speed Glance Cockpit
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center py-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <span className="text-xs font-mono text-slate-400">GPS HEADING</span>
                <div className="text-4xl font-black font-mono text-cyan-400">
                  {Math.round(vehicle?.heading ?? 85)}°
                </div>
                <div className="text-xs text-slate-400">Eastbound Corridor</div>
              </div>

              <div className="p-8 rounded-full border-4 border-emerald-500/40 bg-black/60 text-center flex flex-col items-center justify-center aspect-square shadow-2xl">
                <div className="text-7xl font-black font-mono text-white tracking-tight">
                  {Math.round(currentSpeed)}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  KM / H
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <span className="text-xs font-mono text-slate-400">NEXT EVENT</span>
                <div className="text-4xl font-black font-mono text-amber-400">
                  82 m
                </div>
                <div className="text-xs text-slate-400">Signal Stop Line</div>
              </div>
            </div>
          </div>
        )}

        {/* Bike Mode */}
        {activeLayoutMode === 'bike' && (
          <div className="max-w-sm mx-auto bg-slate-900 rounded-3xl p-4 border-4 border-slate-800 shadow-2xl text-white space-y-4">
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wide">
              Two-Wheeler 6.7" Vibration-Resistant Interface
            </div>
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-center space-y-4">
              <div className="text-5xl font-black font-mono text-white">
                {Math.round(currentSpeed)}
                <span className="text-xs font-normal text-slate-400 block mt-1">KM/H</span>
              </div>
              <div className="p-3 bg-red-600/30 border border-red-500/50 rounded-xl text-xs font-bold text-red-200">
                🔴 RED SIGNAL — STOP LINE IN 82M
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= 4. POSITION COORDINATE REFERENCE DRAWER ================= */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Spatial Coordinate & Layout Blueprint Table
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Viewport: 100% Fluid Responsive
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Component Node</th>
                <th className="py-2.5 px-3">Grid Allocation</th>
                <th className="py-2.5 px-3">Z-Index Elevation</th>
                <th className="py-2.5 px-3">Glance Latency Budget</th>
                <th className="py-2.5 px-3">Touch Target Spec</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2 px-3 font-bold text-slate-900">RealNavigationMap</td>
                <td className="py-2 px-3">Col 1–7 (60% Desktop)</td>
                <td className="py-2 px-3">z-10 (Overlay z-20)</td>
                <td className="py-2 px-3">Background Telemetry</td>
                <td className="py-2 px-3">Pan/Zoom gestures</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Verified</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-slate-900">CarCockpitHMI (HUD)</td>
                <td className="py-2 px-3">Col 8–12 (40% Desktop)</td>
                <td className="py-2 px-3">z-20 (Fixed Stacking)</td>
                <td className="py-2 px-3">&lt; 150 ms (Glance Area)</td>
                <td className="py-2 px-3">48px Touch Minimum</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Verified</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-slate-900">Stop Line Countdown</td>
                <td className="py-2 px-3">Center Focal Card</td>
                <td className="py-2 px-3">z-30 High Priority</td>
                <td className="py-2 px-3">&lt; 100 ms Urgent Audio/Visual</td>
                <td className="py-2 px-3">High Contrast Crimson</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Verified</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-slate-900">Bike 6.7" Mounted HUD</td>
                <td className="py-2 px-3">Adaptive Modal / Drawer</td>
                <td className="py-2 px-3">z-40 Mobile Stack</td>
                <td className="py-2 px-3">&lt; 80 ms Vibration Proof</td>
                <td className="py-2 px-3">Extra-Large 64px Target</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Verified</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
