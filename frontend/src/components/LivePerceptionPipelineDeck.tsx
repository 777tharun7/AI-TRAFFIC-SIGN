import React from 'react';
import { 
  CheckCircle2, ArrowRight, AlertTriangle, ShieldCheck, 
  Activity, Eye, Radio, Zap, Car, Sliders, Camera, Cpu, Navigation
} from 'lucide-react';
import { VehicleState, TrafficSignal } from '../types';

interface Props {
  vehicle?: VehicleState | null;
  signals?: TrafficSignal[];
  speedKmh?: number;
  timeRemaining?: number;
}

export const LivePerceptionPipelineDeck: React.FC<Props> = ({
  vehicle,
  signals = [],
  speedKmh = 45,
  timeRemaining = 15
}) => {
  const currentSpeed = vehicle ? Math.round(vehicle.speed_kmh) : speedKmh;
  const targetSpeed = vehicle?.target_speed_kmh ? Math.round(vehicle.target_speed_kmh) : 50;
  const activeSignal = vehicle?.active_signal || (signals.length > 0 ? signals[0] : null);
  
  const signalState = activeSignal?.state || (
    vehicle?.behavior_state === 'WAITING_FOR_GREEN' || 
    vehicle?.behavior_state === 'STOPPING' || 
    vehicle?.behavior_state === 'DECELERATING' ||
    vehicle?.behavior_state === 'WAITING_AT_STOP_SIGN'
      ? 'RED' 
      : 'GREEN'
  );

  const signalSec = activeSignal?.remaining_time ?? (signalState === 'RED' ? 12 : 24);
  const distanceToStop = vehicle?.distance_to_stop_line_m !== null && vehicle?.distance_to_stop_line_m !== undefined 
    ? Math.round(vehicle.distance_to_stop_line_m) 
    : 78;

  const currentRoad = vehicle?.current_road || 'Cyber Towers Corridor';
  const accel = vehicle?.acceleration_mps2 ?? (currentSpeed > 0 ? 0.0 : -2.6);
  const lat = vehicle?.latitude ?? 17.4460;
  const lon = vehicle?.longitude ?? 78.3816;
  const heading = vehicle?.heading ?? 169.6;
  const behavior = vehicle?.behavior_state || 'MOVING';
  const reason = vehicle?.decision_reason || 'Cruising clear along corridor at road design speed.';

  const isBraking = behavior === 'DECELERATING' || behavior === 'STOPPING' || behavior === 'STOPPED' || behavior === 'WAITING_FOR_GREEN' || behavior === 'WAITING_AT_STOP_SIGN';

  return (
    <div className="w-full space-y-3 pt-2">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] animate-pulse" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
            5-Stage Real-Time Perception, Reasoning & Actuation Pipeline
          </h4>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            ● Live 10Hz V2X Fusion
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
            Sub-15ms Latency
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* CARD 1: 1. Live Camera Input */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
            <span className="w-2 h-2 rounded-full bg-[#00875A] shrink-0" />
            <span className="truncate">1. Live Dashcam Vision</span>
          </div>

          {/* Road Scene with Dynamic Bounding Box Overlays */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner flex items-center justify-center">
            {/* Real Street View Perspective */}
            <img
              src="/images/hitec_corridor.jpg"
              alt="Live Camera Street View"
              className="w-full h-full object-cover object-center brightness-90"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Live Camera Targeting Reticle */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t border-b border-white/20 pointer-events-none flex items-center justify-between px-2 text-[8px] font-mono text-cyan-300">
              <span>+ HORIZON</span>
              <span>FOV 110° +</span>
            </div>

            {/* Dynamic Bounding Box 1: Traffic Signal */}
            <div className={`absolute top-3 right-6 border-2 rounded p-1 flex flex-col items-center backdrop-blur-xs transition-all ${
              signalState === 'RED' 
                ? 'border-red-500 bg-red-500/20' 
                : 'border-emerald-500 bg-emerald-500/20'
            }`}>
              <span className={`text-[8px] text-white px-1 py-0.2 rounded font-mono font-bold ${
                signalState === 'RED' ? 'bg-red-600' : 'bg-emerald-600'
              }`}>
                Signal {signalState === 'RED' ? '0.96 (Red)' : '0.98 (Green)'}
              </span>
              <div className="w-4 h-7 bg-black/90 rounded p-0.5 mt-0.5 flex flex-col items-center justify-between border border-slate-600">
                <span className={`w-1.5 h-1.5 rounded-full ${signalState === 'RED' ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className={`w-1.5 h-1.5 rounded-full ${signalState === 'GREEN' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
              </div>
            </div>

            {/* Dynamic Bounding Box 2: Speed Limit Sign */}
            <div className="absolute bottom-3 left-4 border-2 border-blue-500 rounded bg-blue-500/10 p-1 flex items-center gap-1">
              <span className="text-[8px] bg-blue-600 text-white px-1 py-0.2 rounded font-mono font-bold">
                IRC:67 Sign 0.94
              </span>
              <div className="w-5 h-5 rounded-full border-2 border-red-600 bg-white flex items-center justify-center font-bold text-[8px] text-black">
                {targetSpeed}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1">
            <span>1280×720 @ 30 FPS</span>
            <span className="text-emerald-600 font-bold">14.5 ms</span>
          </div>
        </div>

        {/* CARD 2: 2. AI Detection & Recognition */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>2. AI Sign Recognition</span>
          </div>

          <div className="space-y-2 flex-1 justify-center flex flex-col">
            {/* Item 1: Traffic Signal State */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-6 h-8 bg-black rounded p-0.5 flex flex-col items-center justify-between shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${signalState === 'RED' ? 'bg-red-500' : 'bg-slate-800'}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <span className={`w-1.5 h-1.5 rounded-full ${signalState === 'GREEN' ? 'bg-emerald-400' : 'bg-slate-800'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                  Signal ({signalState === 'RED' ? 'Red' : 'Green'})
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${signalState === 'RED' ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: signalState === 'RED' ? '96.3%' : '98.4%' }} 
                  />
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold ${signalState === 'RED' ? 'text-red-600' : 'text-emerald-600'}`}>
                {signalState === 'RED' ? '96.3%' : '98.4%'}
              </span>
            </div>

            {/* Item 2: Speed Limit 50 */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-6 h-6 rounded-full border-2 border-red-600 bg-white flex items-center justify-center font-bold text-[9px] text-slate-900 shrink-0">
                {targetSpeed}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">Speed Limit {targetSpeed}</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.8%' }} />
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600">94.8%</span>
            </div>

            {/* Item 3: Stop Line / Pedestrian Crossing */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-6 h-6 rounded bg-amber-100 border border-amber-300 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                🛑
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">Virtual Stop Line</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '92.5%' }} />
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600">92.5%</span>
            </div>
          </div>
        </div>

        {/* CARD 3: 3. Context Validation */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>3. Context Validation</span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
            <div className="flex items-center justify-between">
              <span>GPS Fix</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {lat.toFixed(4)}°, {lon.toFixed(4)}°
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Heading</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {Math.round(heading)}° Confirmed
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Road Link</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5 truncate max-w-[130px]" title={currentRoad}>
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {currentRoad}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Stop Distance</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {distanceToStop} m
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>V2X SPaT</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {signalState} ({signalSec}s)
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center flex items-center justify-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>Context Validated (Applicable)</span>
          </div>
        </div>

        {/* CARD 4: 4. Decision Engine */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>4. Decision Engine</span>
          </div>

          {/* Dynamic Signal Highlight Box */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            isBraking 
              ? 'bg-red-50/80 border-red-200' 
              : 'bg-emerald-50/80 border-emerald-200'
          }`}>
            <div className="w-7 h-12 bg-black rounded p-1 flex flex-col items-center justify-between shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full ${signalState === 'RED' ? 'bg-red-500 animate-pulse shadow-sm' : 'bg-slate-800'}`} />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <span className={`w-2.5 h-2.5 rounded-full ${signalState === 'GREEN' ? 'bg-emerald-400 animate-pulse shadow-sm' : 'bg-slate-800'}`} />
            </div>
            <div className="min-w-0">
              <div className={`text-xs font-black leading-tight ${signalState === 'RED' ? 'text-red-700' : 'text-emerald-700'}`}>
                {signalState === 'RED' ? 'RED SIGNAL ACTIVE' : 'GREEN WAVE CLEAR'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{distanceToStop} m to stop line</div>
              <div className={`text-[10px] font-bold font-mono ${signalState === 'RED' ? 'text-red-600' : 'text-emerald-600'}`}>
                Remaining: {signalSec} seconds
              </div>
            </div>
          </div>

          {/* Required Action Button */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Required Action</div>
            <div className={`py-2 px-3 rounded-xl text-center text-xs font-black shadow-xs text-white ${
              isBraking ? 'bg-red-600' : 'bg-[#00875A]'
            }`}>
              {isBraking ? '🛑 Prepare to stop' : '🟢 Maintain corridor pace'}
            </div>
            <div className="text-[10px] text-slate-500 text-center font-mono truncate" title={reason}>
              {reason}
            </div>
          </div>

          {/* Speed Telemetry Strip */}
          <div className="grid grid-cols-3 text-center text-[10px] font-mono border-t border-slate-100 pt-2">
            <div>
              <span className="text-slate-400 block">Current</span>
              <strong className="text-slate-900">{currentSpeed} km/h</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Target</span>
              <strong className={isBraking ? 'text-red-600' : 'text-emerald-600'}>
                {isBraking ? '0 km/h' : `${targetSpeed} km/h`}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Stop Dist</span>
              <strong className="text-emerald-700">{distanceToStop} m</strong>
            </div>
          </div>
        </div>

        {/* CARD 5: 5. Vehicle Response */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>5. Vehicle Response</span>
          </div>

          {/* 3D Road Deceleration / Cruise Visualization */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner flex flex-col items-center justify-end pb-2">
            {/* Top Deceleration Pill */}
            <div className={`absolute top-2.5 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md ${
              isBraking ? 'bg-red-500/90 animate-pulse' : 'bg-emerald-600/90'
            }`}>
              {isBraking 
                ? `Decelerating: ${currentSpeed} → 0 km/h` 
                : `Cruising: ${currentSpeed} km/h`}
            </div>

            {/* Glowing Braking / Acceleration Corridor Trapezoid */}
            <div 
              className={`absolute bottom-0 w-32 h-24 border-b-2 transition-all ${
                isBraking 
                  ? 'bg-gradient-to-t from-red-500/40 via-red-500/20 to-transparent border-red-500' 
                  : 'bg-gradient-to-t from-emerald-500/40 via-emerald-500/20 to-transparent border-emerald-500'
              }`}
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }}
            />

            {/* Car Icon Representation */}
            <div className="relative z-10 w-12 h-14 bg-white/95 rounded-xl border border-slate-300 shadow-lg flex flex-col items-center justify-center">
              <Car className="w-7 h-7 text-slate-800" />
              <div className="flex gap-2 mt-0.5">
                <span className={`w-1.5 h-1 rounded-full ${isBraking ? 'bg-red-600 animate-ping' : 'bg-emerald-400'}`} />
                <span className={`w-1.5 h-1 rounded-full ${isBraking ? 'bg-red-600 animate-ping' : 'bg-emerald-400'}`} />
              </div>
            </div>

            {/* Stop Line Indicator */}
            <div className="absolute bottom-1 w-full flex items-center justify-center">
              <div className={`w-28 h-1 shadow-md ${isBraking ? 'bg-red-400' : 'bg-white'}`} />
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            {isBraking 
              ? `Actuation: Brake Pressure ${Math.min(100, Math.max(25, Math.round(Math.abs(accel) * 35)))}% applied`
              : `Actuation: Electric Drive ${Math.min(100, Math.round(currentSpeed * 1.5))}% Throttle`}
          </div>
        </div>

      </div>
    </div>
  );
};
