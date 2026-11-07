import React from 'react';
import { 
  Gauge, AlertTriangle, ShieldCheck, Play, Pause, 
  RotateCcw, ArrowUp, ArrowDown, Radio, Compass, Navigation 
} from 'lucide-react';
import { VehicleState, VehicleType } from '../types';

interface CarDashboardViewProps {
  vehicle: VehicleState | null;
  onControl: (action: string, params?: any) => void;
  routes: any[];
}

export const CarDashboardView: React.FC<CarDashboardViewProps> = ({
  vehicle,
  onControl,
  routes
}) => {
  if (!vehicle) return <div className="p-8 text-center text-slate-400">Connecting to vehicle simulator...</div>;

  const currentSpeed = Math.round(vehicle.speed_kmh);
  const targetSpeed = Math.round(vehicle.target_speed_kmh);
  const recSpeed = vehicle.recommended_speed_kmh ? Math.round(vehicle.recommended_speed_kmh) : null;
  
  const upcomingEvent = vehicle.active_events[0] || vehicle.approaching_events[0];
  const upcomingSignal = vehicle.active_signal;

  const isSpeedExceeded = recSpeed !== null && currentSpeed > recSpeed + 5;

  return (
    <div className="space-y-6">
      {/* HUD Cockpit Cluster */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800/80 p-6 lg:p-10 shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-brand-500/10 blur-3xl pointer-events-none" />

        {/* Top Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/30 text-xs font-mono font-bold">
              {vehicle.vehicle_id}
            </span>
            <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-brand-500" />
              {vehicle.current_road}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Heading: <b className="text-white">{vehicle.heading}°</b></span>
            </div>
            <div>
              Route Progress: <b className="text-brand-400">{vehicle.progress_pct}%</b>
            </div>
          </div>
        </div>

        {/* Main Cockpit Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-8 pb-4">
          {/* Left: Active Infrastructure & V-RIU Alert */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-400" />
              Upcoming Road Event
            </h3>

            {upcomingEvent ? (
              <div className={`p-5 rounded-2xl border transition-all ${
                upcomingEvent.priority === 'CRITICAL' 
                  ? 'bg-rose-950/40 border-rose-500/50 glow-red' 
                  : upcomingEvent.priority === 'HIGH'
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : 'bg-slate-800/50 border-slate-700/60'
              }`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    upcomingEvent.priority === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-brand-500 text-slate-950'
                  }`}>
                    {upcomingEvent.state}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {Math.round(upcomingEvent.distance_to_vehicle || 0)}m Ahead
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white mb-1">
                  {upcomingEvent.name}
                </h4>
                <p className="text-xs text-slate-300">
                  Source: <b className="text-brand-400">{upcomingEvent.source}</b> • Confidence: {(upcomingEvent.confidence * 100).toFixed(0)}%
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
                No immediate hazards detected on segment.
              </div>
            )}

            {/* Conflict Banner if detected */}
            {vehicle.conflict_detected && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span><b>Data Conflict:</b> {vehicle.conflict_details}</span>
              </div>
            )}
          </div>

          {/* Center: Digital Speedometer HUD */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-56 h-56 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center shadow-inner">
              {/* Outer Speed Ring */}
              <div 
                className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                  isSpeedExceeded ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'border-brand-500/80 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                }`}
                style={{
                  clipPath: `polygon(50% 50%, -50% -50%, ${Math.min(100, currentSpeed)}% 0%, 100% 100%)`
                }}
              />

              <span className="text-6xl font-black tracking-tight text-white font-mono">
                {currentSpeed}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
                km / h
              </span>

              {/* Target & Recommended Speed Badges */}
              <div className="mt-3 flex items-center gap-2">
                {recSpeed && (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isSpeedExceeded ? 'bg-rose-500 text-white font-bold animate-pulse' : 'bg-slate-800 text-brand-400'
                  }`}>
                    Limit: {recSpeed} km/h
                  </span>
                )}
              </div>
            </div>

            {/* Real-time Dynamic Advisory */}
            <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800/80 max-w-sm">
              <p className="text-xs font-medium text-slate-200">
                {vehicle.advisory_message}
              </p>
            </div>
          </div>

          {/* Right: Traffic Signal & Green-Wave Advisory */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              Upcoming Traffic Signal
            </h3>

            {upcomingSignal ? (
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    {upcomingSignal.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${
                      upcomingSignal.state === 'RED' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' :
                      upcomingSignal.state === 'YELLOW' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' :
                      'bg-brand-500 shadow-[0_0_10px_#22c55e]'
                    }`} />
                    <span className="text-xs font-mono font-bold text-white">
                      {upcomingSignal.remaining_time}s
                    </span>
                  </div>
                </div>

                {/* Green-Wave Speed Window */}
                {upcomingSignal.recommended_speed_min && (
                  <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-0.5">
                      Green-Wave Advisory
                    </span>
                    <p className="text-xs font-mono text-white">
                      Recommended: <b className="text-brand-400">{upcomingSignal.recommended_speed_min} - {upcomingSignal.recommended_speed_max} km/h</b>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
                No signal intersection within 450 meters.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Simulation Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onControl(vehicle.is_running ? 'pause' : 'play')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              {vehicle.is_running ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              {vehicle.is_running ? 'Pause Sim' : 'Resume Sim'}
            </button>
            <button
              onClick={() => onControl('reset')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => onControl('speed_up', { delta_speed: 5 })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5 text-brand-400" />
              +5 km/h
            </button>
            <button
              onClick={() => onControl('slow_down', { delta_speed: 5 })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs transition-all"
            >
              <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
              -5 km/h
            </button>
          </div>

          {/* Vehicle Mode & Route Switcher */}
          <div className="flex items-center gap-3">
            <select
              value={vehicle.route_id}
              onChange={(e) => onControl('set_route', { route_id: e.target.value })}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => onControl('set_type', { vehicle_type: vehicle.vehicle_type === 'CAR' ? 'BIKE' : 'CAR' })}
              className="px-3 py-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold"
            >
              Switch to {vehicle.vehicle_type === 'CAR' ? 'BIKE' : 'CAR'} Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
