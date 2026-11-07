import React from 'react';
import { 
  Navigation, Compass, Radio, AlertTriangle, 
  ShieldCheck, Zap, ArrowUp, ArrowDown, RotateCcw, 
  Play, Pause, Gauge 
} from 'lucide-react';
import { VehicleState } from '../types';

interface CarCockpitHMIProps {
  vehicle: VehicleState | null;
  onControl: (action: string, params?: any) => void;
  routes: any[];
}

export const CarCockpitHMI: React.FC<CarCockpitHMIProps> = ({
  vehicle,
  onControl,
  routes
}) => {
  if (!vehicle) return <div className="p-12 text-center text-slate-400">Loading Automotive Cockpit...</div>;

  const currentSpeed = Math.round(vehicle.speed_kmh);
  const upNext = vehicle.active_events[0] || vehicle.approaching_events[0];
  const upcomingSignal = vehicle.active_signal;
  const recSpeed = vehicle.recommended_speed_kmh ? Math.round(vehicle.recommended_speed_kmh) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Automotive Digital Instrument Cluster */}
      <div className="hud-panel rounded-3xl p-6 lg:p-10 text-white relative overflow-hidden">
        {/* Top Status Strip */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white font-semibold">GPS ACTIVE</span>
            <span className="text-slate-500">•</span>
            <span>HYDERABAD CONNECTED</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>{Math.round(vehicle.heading)}°</span>
            </div>
            <span className="text-slate-300 font-semibold">{vehicle.current_road}</span>
          </div>
        </div>

        {/* Cockpit Core: 3-Column Cluster */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-8">
          {/* Left 4 Cols: Tactical Road Guidance */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Lane & Corridor Guidance
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>{vehicle.current_road}</span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div>Corridor Progress: <b className="text-emerald-400 font-mono">{vehicle.progress_pct}%</b></div>
                <div>Active Segment: <b className="text-slate-300 font-mono">{vehicle.road_segment_id}</b></div>
              </div>
            </div>

            {/* Signal Status */}
            {upcomingSignal && (
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Next Intersection</span>
                  <span className="text-xs font-bold text-white">{upcomingSignal.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${
                    upcomingSignal.state === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' :
                    upcomingSignal.state === 'YELLOW' ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' :
                    'bg-rose-500 shadow-[0_0_12px_#ef4444]'
                  }`} />
                  <span className="text-sm font-mono font-bold text-white">{upcomingSignal.remaining_time}s</span>
                </div>
              </div>
            )}
          </div>

          {/* Center 4 Cols: Speedometer Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-52 h-52 rounded-full border border-white/15 bg-black/40 flex flex-col items-center justify-center shadow-2xl">
              {/* Outer Speed Indicator Arc */}
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
              
              <span className="text-7xl font-black tracking-tight text-white font-mono">
                {currentSpeed}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                KM / H
              </span>

              {/* Behavior State Badge */}
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                vehicle.behavior_state === 'WAITING_FOR_GREEN' || vehicle.behavior_state === 'STOPPED' || vehicle.behavior_state === 'WAITING_AT_STOP_SIGN'
                  ? 'bg-red-600/30 border-red-500 text-red-200 animate-pulse'
                  : vehicle.behavior_state === 'DECELERATING' || vehicle.behavior_state === 'STOPPING'
                  ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                  : vehicle.behavior_state === 'RESUMING'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                  : 'bg-white/10 border-white/20 text-slate-300'
              }`}>
                {vehicle.behavior_state ? vehicle.behavior_state.replace('_', ' ') : 'CRUISING'}
              </div>

              {/* Distance to Stop Line if applicable */}
              {vehicle.distance_to_stop_line_m !== null && vehicle.distance_to_stop_line_m !== undefined && (
                <div className="mt-1.5 text-[11px] font-mono text-amber-400 font-semibold">
                  Stop Line: {vehicle.distance_to_stop_line_m}m
                </div>
              )}
            </div>

            {/* Dynamic Recommendation Message & Decision Reason */}
            <div className="mt-4 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-medium text-emerald-300 max-w-sm text-center">
              {vehicle.decision_reason || vehicle.advisory_message}
            </div>
          </div>

          {/* Right 4 Cols: Next Road Event HUD */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Next Road Event
                </span>
                {upNext && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono uppercase">
                    {upNext.state}
                  </span>
                )}
              </div>

              {upNext ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Road Sign Circle */}
                    <div className="w-12 h-12 rounded-full bg-white text-slate-950 border-4 border-red-600 flex items-center justify-center font-black text-base shrink-0 shadow-md">
                      {upNext.value ? upNext.value : '!'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {upNext.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {Math.round(upNext.distance_to_vehicle || 120)}m Ahead
                      </p>
                    </div>
                  </div>

                  {/* Countdown Progress */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Approaching:</span>
                    <span className="text-emerald-400 font-bold">
                      {Math.round(upNext.distance_to_vehicle || 0)} meters
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Corridor Ahead is Clear
                </div>
              )}
            </div>

            {/* Green Wave speed band */}
            {upcomingSignal?.recommended_speed_min && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-300 block">Green-Wave Speed Band</span>
                  <span className="text-white font-mono">
                    Maintain <b>{upcomingSignal.recommended_speed_min}–{upcomingSignal.recommended_speed_max} km/h</b>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Driver Controls */}
        <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onControl(vehicle.is_running ? 'pause' : 'play')}
              className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all flex items-center gap-1.5"
            >
              {vehicle.is_running ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
              {vehicle.is_running ? 'Pause Sim' : 'Resume Sim'}
            </button>
            <button
              onClick={() => onControl('reset')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200"
            >
              Reset Route
            </button>
            <button
              onClick={() => onControl('speed_up', { delta_speed: 5 })}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-400 font-mono font-bold flex items-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" /> +5
            </button>
            <button
              onClick={() => onControl('slow_down', { delta_speed: 5 })}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-400 font-mono font-bold flex items-center gap-1"
            >
              <ArrowDown className="w-3.5 h-3.5" /> -5
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={vehicle.route_id}
              onChange={(e) => onControl('set_route', { route_id: e.target.value })}
              className="bg-black/60 border border-white/20 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
