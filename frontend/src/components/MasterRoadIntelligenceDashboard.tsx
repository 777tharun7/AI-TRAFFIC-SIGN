import React, { useState } from 'react';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';
import { RealNavigationMap } from './RealNavigationMap';
import { EventDetailsCard } from './EventDetailsCard';
import { LivePerceptionPipelineDeck } from './LivePerceptionPipelineDeck';
import { VehicleBehaviorFlow } from './VehicleBehaviorFlow';
import { VehicleStateMachineFlow } from './VehicleStateMachineFlow';
import { LiveEventTimeline } from './LiveEventTimeline';
import { 
  Navigation, Compass, AlertTriangle, ShieldCheck, Zap, 
  MapPin, Activity, Radio, Cpu, Smartphone, Car, ChevronRight, Gauge,
  HeartPulse, ShieldAlert, Sparkles, CheckCircle2, RotateCcw
} from 'lucide-react';

interface Props {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onControl?: (action: string, params?: any) => void;
}

export const MasterRoadIntelligenceDashboard: React.FC<Props> = ({
  vehicle,
  rius,
  signals,
  onControl
}) => {
  const [deviceDisplayMode, setDeviceDisplayMode] = useState<'cockpit' | 'bike'>('cockpit');
  const [activeScenarioName, setActiveScenarioName] = useState<string>('Normal Flow (GLOSA)');
  const [scenarioNotice, setScenarioNotice] = useState<string | null>(null);

  const handleInjectScenario = (name: string, action?: string, params?: any, noticeMsg?: string) => {
    setActiveScenarioName(name);
    if (noticeMsg) {
      setScenarioNotice(noticeMsg);
      setTimeout(() => setScenarioNotice(null), 6000);
    }
    if (onControl && action) {
      onControl(action, params);
    }
  };

  const currentSpeed = vehicle?.speed_kmh ?? 42;
  const behaviorState = vehicle?.behavior_state ?? 'MOVING';
  const effectiveSignal = vehicle?.active_signal || (signals.length > 0 ? signals[0] : null);
  const signalState = effectiveSignal?.state ?? 'RED';
  const timeRemaining = effectiveSignal?.remaining_time ?? 15;
  const distanceToEvent = Math.round(vehicle?.distance_to_stop_line_m ?? vehicle?.distance_to_event_m ?? 80);
  const speedLimit = vehicle?.target_speed_kmh ?? 50;
  
  // Dynamic color coding for automotive glanceability
  const isOverspeed = currentSpeed > speedLimit + 5;
  const isStopping = behaviorState === 'DECELERATING' || behaviorState === 'STOPPING' || behaviorState === 'WAITING_FOR_GREEN' || behaviorState === 'STOPPED';
  const speedColor = isOverspeed ? '#ef4444' : isStopping ? '#f59e0b' : '#10b981';

  return (
    <div className="space-y-6 text-left">
      
      {/* ================= INTERACTIVE CORRIDOR EVENT & BEHAVIOR SIMULATOR RIBBON ================= */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700/80 p-4 shadow-xl text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-xs font-black uppercase font-mono tracking-wider text-emerald-400">
              Interactive Corridor Scenario &amp; Telemetry Injector
            </h3>
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              (Live CAN-Bus &amp; Behavior Kinematics Sandbox)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">Active Preset:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              {activeScenarioName}
            </span>
          </div>
        </div>

        {/* Live Scenario Injector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleInjectScenario(
              'Green Wave Sync (42 km/h)',
              'speed_up',
              { delta_speed: 0 },
              'GLOSA Green Wave Locked: Optimal 42 km/h advisory broadcast. Signals held green through corridor.'
            )}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeScenarioName.includes('Green Wave')
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Green Wave (42 km/h)</span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectScenario(
              'School Zone (30 km/h)',
              'slow_down',
              { delta_speed: 10 },
              'IRC:67 School Zone Ingested: Target speed throttled to 30 km/h. Pedestrian crosswalk radar active.'
            )}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeScenarioName.includes('School Zone')
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>School Zone (30 km/h)</span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectScenario(
              'Speed Breaker (20 km/h)',
              'slow_down',
              { delta_speed: 15 },
              'Speed Breaker Ahead: Smooth deceleration curve engaged to 20 km/h to prevent chassis damage.'
            )}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeScenarioName.includes('Speed Breaker')
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-300" />
            <span>Speed Breaker (20 km/h)</span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectScenario(
              'Police VIP Escort Halt',
              'pause',
              undefined,
              'Police VIP Convoy / Section 179 MVA Halt: Emergency vehicle hold active. Route cleared for priority transit.'
            )}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeScenarioName.includes('Police')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-300" />
            <span>Police VIP Halt</span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectScenario(
              'Medical Transit (MVA Sec 194)',
              'speed_up',
              { delta_speed: 15 },
              'MVA Sec 194 Emergency Medical Transit Active: AIG Hospitals ER Bay locked. Automatic statutory penalty waiver engaged.'
            )}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeScenarioName.includes('Medical Transit')
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                : 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-white" />
            <span>Medical Transit (Sec 194)</span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectScenario(
              'Normal Flow (GLOSA)',
              'play',
              undefined,
              'Corridor reset to standard free-flow parameters.'
            )}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-transparent hover:bg-white/5 border border-dashed border-white/20 transition-all cursor-pointer ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Live Notification Bar */}
        {scenarioNotice && (
          <div className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{scenarioNotice}</span>
          </div>
        )}
      </div>

      {/* ================= ZONE 1: INTELLIGENCE CORRIDOR HERO (MAP + INSPECTOR) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 7 Cols: Real Navigation Map Engine */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex-1 flex flex-col">
            <RealNavigationMap
              vehicle={vehicle}
              rius={rius}
              signals={signals}
              onControl={onControl}
              showPipelineDeck={true}
            />
          </div>
        </div>

        {/* Right 5 Cols: Active Event Details & Connected In-Vehicle Advisory */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          
          {/* Card 1: Active Road Event & Signal Inspector */}
          <EventDetailsCard
            vehicle={vehicle}
            signal={effectiveSignal}
          />

          {/* Card 2: Connected In-Vehicle Advisory Cluster (Spacious, Zero-Squish) */}
          <div className="bg-[#0A111F] rounded-2xl border border-slate-800 shadow-xl p-5 text-white flex-1 flex flex-col justify-between relative overflow-hidden">
            
            {/* Header & Device Mode Toggle */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">In-Cabin Driver Telemetry</h4>
                  <span className="text-[10px] text-slate-400 font-mono">TS 09 EV 4412 • GVID Link</span>
                </div>
              </div>

              {/* Toggle Automotive vs Mobile Mode */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[10px] font-mono">
                <button
                  onClick={() => setDeviceDisplayMode('cockpit')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    deviceDisplayMode === 'cockpit' ? 'bg-[#00875A] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Car className="w-3 h-3" />
                  <span>Car HMI</span>
                </button>
                <button
                  onClick={() => setDeviceDisplayMode('bike')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    deviceDisplayMode === 'bike' ? 'bg-[#00875A] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile 6.7"</span>
                </button>
              </div>
            </div>

            {/* Core Instrument Cluster */}
            <div className="py-4 grid grid-cols-12 gap-4 items-center">
              
              {/* Left 5 Cols: Speedometer Gauge */}
              <div className="col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke={speedColor} 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="251" 
                      strokeDashoffset={Math.max(0, 251 - (251 * (currentSpeed / 120)))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black font-mono leading-none tracking-tight text-white">{currentSpeed.toFixed(0)}</span>
                    <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider mt-0.5">KM / H</span>
                  </div>
                </div>

                {/* Speed Limit & Status Pill */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[9px] font-mono text-slate-400">Limit:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold">
                    {Math.round(speedLimit)} km/h
                  </span>
                </div>
              </div>

              {/* Right 7 Cols: Tactical Guidance & Warning Envelope */}
              <div className="col-span-7 space-y-2.5">
                
                {/* Active Behavior Status */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Vehicle State</span>
                    <span className="text-xs font-bold text-white font-mono">{behaviorState.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Stop Line</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">{distanceToEvent} meters</span>
                  </div>
                </div>

                {/* Road Corridor Guidance */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
                  <Navigation className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Active Segment</span>
                    <span className="text-xs font-bold text-slate-200 truncate block font-sans">
                      {vehicle?.current_road || 'HITEC City Main Road'}
                    </span>
                  </div>
                </div>

                {/* GLOSA Green-Wave Advisory Band */}
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="text-[10px] leading-tight">
                    <span className="font-bold text-emerald-300">Green-Wave Band: </span>
                    <span className="text-white font-mono font-medium">38–44 km/h for zero stop</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Notice */}
            <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>CAN-BUS 500k Synchronized</span>
              </div>
              <span className="text-slate-500">Ahead: Speed Breaker (250m)</span>
            </div>

          </div>

        </div>

      </div>

      {/* ================= ZONE 2: 5-STAGE PERCEPTION & SENSOR FUSION PIPELINE (FULL 12 COLS) ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-900 tracking-wider uppercase font-mono">
                EDGE AI INFERENCE & SENSOR FUSION
              </span>
              <span className="text-xs text-slate-400 font-mono">PIPELINE TRACE</span>
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              5-Stage Edge AI Perception & Actuation Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time sequence: 720p 30fps camera feed → YOLO/EfficientNet recognition → Dual-band RTK GNSS context → 10ms rule arbitration → CAN-bus actuation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
              CAMERA 30 FPS
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 font-mono text-[11px] font-bold border border-emerald-300">
              AI 96.3%
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 font-mono text-[11px] font-bold border border-blue-300">
              V2X SPaT LIVE
            </span>
          </div>
        </div>

        {/* Full-Width 5-Card Grid */}
        <LivePerceptionPipelineDeck
          vehicle={vehicle}
          speedKmh={currentSpeed}
          timeRemaining={timeRemaining}
        />
      </div>

      {/* ================= ZONE 3: VEHICLE BEHAVIOR KINEMATICS LIFECYCLE (FULL 12 COLS) ================= */}
      <VehicleBehaviorFlow vehicle={vehicle} />

      {/* ================= ZONE 4: FINITE STATE MACHINE & EVENT TIMELINE (6 COLS : 6 COLS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Module 1: Vehicle State Machine (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <VehicleStateMachineFlow vehicle={vehicle} />
        </div>

        {/* Module 2: Live Event Timeline (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <LiveEventTimeline vehicle={vehicle} />
        </div>

      </div>

    </div>
  );
};
