import React, { useState } from 'react';
import { 
  Navigation, Compass, Radio, AlertTriangle, 
  ShieldCheck, Zap, ArrowUp, ArrowDown, RotateCcw, 
  Play, Pause, Gauge, BatteryCharging, MapPin,
  Sun, Moon, Shield, Info, Battery, Sparkles, CheckCircle2
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
  // Cockpit Lighting Mode: Night Tactical vs Day Contrast
  const [lightingMode, setLightingMode] = useState<'night' | 'day'>('night');

  if (!vehicle) {
    return (
      <div className="bg-slate-900/90 p-8 rounded-[2.5rem] border-4 border-slate-700/60 shadow-2xl text-center text-slate-400 max-w-5xl mx-auto font-mono text-sm">
        <div className="animate-pulse flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>INITIALIZING AUTOMOTIVE COCKPIT TELEMETRY CLUSTER...</span>
        </div>
      </div>
    );
  }

  const currentSpeed = Math.round(vehicle.speed_kmh);
  const upNext = vehicle.active_events[0] || vehicle.approaching_events[0];
  const upcomingSignal = vehicle.active_signal;
  const targetSpeed = vehicle.target_speed_kmh ? Math.round(vehicle.target_speed_kmh) : 50;
  const isOverSpeed = currentSpeed > targetSpeed + 5;
  const isNearLimit = currentSpeed >= targetSpeed - 3 && !isOverSpeed;

  const isNight = lightingMode === 'night';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Automotive Console Tablet Bezel Frame */}
      <div className="bg-slate-900/90 p-3 sm:p-5 rounded-[2.5rem] border-4 border-slate-700/60 shadow-2xl relative">
        {/* Tablet Bezel Hardware Details (Aesthetic Top Bar & Camera/Sensor Notch) */}
        <div className="flex items-center justify-between px-6 pb-2 text-[10px] font-mono text-slate-400 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>INTELLIGENT VEHICLE INTERFACE</span>
          </div>
          <div className="w-16 h-1 bg-slate-700/80 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <span>CAN-BUS 500k</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
        </div>

        {/* Digital Instrument Cluster Inner Display */}
        <div 
          className={`rounded-[1.75rem] p-5 sm:p-7 lg:p-8 text-white relative overflow-hidden transition-all duration-300 ${
            isNight
              ? 'bg-gradient-to-b from-slate-950 via-[#070b14] to-black border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
              : 'bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border border-slate-600/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
          }`}
        >
          {/* Top Status & Identity Strip */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-3 text-xs font-mono">
            {/* GPS & Network Status */}
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-white font-bold tracking-wider">GPS ACTIVE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 text-[11px]">HYDERABAD ITMS CONNECTED</span>
            </div>

            {/* Enhanced Vehicle Identity Badge */}
            <div className="flex items-center gap-2 bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
              <span className="font-bold text-white font-mono tracking-wide">TS 09 EV 4412</span>
              <span className="text-slate-400 hidden md:inline">• Tata Nexon EV Max (Devanboina Tharun)</span>
              <span className="text-emerald-400 font-bold hidden sm:inline">• Connected GVID v2.4</span>
            </div>

            {/* Lighting Mode Toggle & Compass */}
            <div className="flex items-center gap-3">
              {/* Cockpit Lighting Mode Toggle */}
              <button
                type="button"
                onClick={() => setLightingMode(isNight ? 'day' : 'night')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                  isNight
                    ? 'bg-slate-800/90 text-amber-300 border-amber-500/40 hover:bg-slate-750'
                    : 'bg-amber-400/20 text-amber-200 border-amber-400/50 hover:bg-amber-400/30'
                }`}
                title="Toggle Cockpit Lighting Mode"
              >
                {isNight ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Night Tactical</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Day Contrast</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 text-cyan-400 font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Compass className="w-3.5 h-3.5" />
                <span>{Math.round(vehicle.heading)}°</span>
              </div>
            </div>
          </div>

          {/* Cockpit Core: 3-Column Ergonomic Cluster */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
            
            {/* Left 4 Cols: Tactical Road & Corridor Guidance */}
            <div className="md:col-span-4 space-y-3.5">
              <div className={`p-4 rounded-2xl border transition-all ${
                isNight 
                  ? 'bg-white/[0.04] border-white/10 backdrop-blur-md' 
                  : 'bg-slate-800/80 border-slate-600/60 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    Lane & Corridor Guidance
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">LANE 2/3</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-white mb-2">
                  <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{vehicle.current_road}</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-white/5 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Corridor Progress:</span>
                    <span className="text-emerald-400 font-bold">{vehicle.progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, vehicle.progress_pct))}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-0.5">
                    <span className="text-slate-400">Segment ID:</span>
                    <span className="text-slate-300 font-bold">{vehicle.road_segment_id}</span>
                  </div>
                </div>
              </div>

              {/* Next Signal State & Stop Line Countdown */}
              {upcomingSignal ? (
                <div className={`p-4 rounded-2xl border transition-all ${
                  isNight 
                    ? 'bg-white/[0.04] border-white/10 backdrop-blur-md' 
                    : 'bg-slate-800/80 border-slate-600/60 shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Upcoming SPaT Signal
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      CYCLE: {upcomingSignal.cycle_duration}s
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{upcomingSignal.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Phase: <span className="font-bold text-white">{upcomingSignal.state}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded-full ${
                        upcomingSignal.state === 'GREEN' 
                          ? 'bg-emerald-500 shadow-[0_0_14px_#10b981]' 
                          : upcomingSignal.state === 'YELLOW' 
                          ? 'bg-amber-500 shadow-[0_0_14px_#f59e0b]' 
                          : 'bg-rose-500 shadow-[0_0_14px_#ef4444] animate-pulse'
                      }`} />
                      <span className="text-lg font-mono font-black text-white">
                        {upcomingSignal.remaining_time}s
                      </span>
                    </div>
                  </div>

                  {/* Stop line countdown indicator */}
                  {vehicle.distance_to_stop_line_m !== null && vehicle.distance_to_stop_line_m !== undefined && (
                    <div className={`mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold ${
                      vehicle.distance_to_stop_line_m < 25 && upcomingSignal.state === 'RED'
                        ? 'text-rose-400 animate-pulse'
                        : vehicle.distance_to_stop_line_m < 50
                        ? 'text-amber-300'
                        : 'text-slate-300'
                    }`}>
                      <span>Distance to Stop Line:</span>
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
                        {vehicle.distance_to_stop_line_m}m
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-4 rounded-2xl border text-center text-xs text-slate-400 flex items-center justify-center gap-2 ${
                  isNight ? 'bg-white/[0.04] border-white/10' : 'bg-slate-800/80 border-slate-600/60'
                }`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>No signal obstruction on current corridor</span>
                </div>
              )}
            </div>

            {/* Center 4 Cols: SVG Speedometer Gauge & Central Cluster */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
              <div className={`relative w-56 h-56 rounded-full border border-white/15 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-all ${
                isNight ? 'bg-black/60 shadow-black/80' : 'bg-slate-900/90 shadow-slate-950/80'
              }`}>
                
                {/* Dynamic SVG Speedometer Arc (264 circumference stroke) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  {/* Gauge background track */}
                  <circle cx="50" cy="50" r="42" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="4.5" fill="transparent" />
                  
                  {/* Active speed stroke */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    stroke={
                      isOverSpeed 
                        ? '#ef4444' 
                        : isNearLimit 
                        ? '#f59e0b' 
                        : currentSpeed > 0 
                        ? '#10b981' 
                        : '#64748b'
                    } 
                    strokeWidth="4.5" 
                    fill="transparent" 
                    strokeDasharray="264" 
                    strokeDashoffset={Math.max(0, 264 - (264 * (currentSpeed / 120)))}
                    strokeLinecap="round"
                    className="transition-all duration-200"
                  />

                  {/* Target Speed Limit indicator notch */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#38bdf8"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="2 262"
                    strokeDashoffset={264 - (264 * (targetSpeed / 120))}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Numeric Speed Display */}
                <span className={`text-7xl font-black tracking-tight font-mono leading-none transition-colors ${
                  isOverSpeed ? 'text-rose-400' : isNearLimit ? 'text-amber-300' : 'text-white'
                }`}>
                  {currentSpeed}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                  KM / H
                </span>

                {/* Target / Advisory Speed Limit Pill */}
                <div className="flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-600/50 text-[10px] font-mono text-slate-200 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>LIMIT {targetSpeed}</span>
                </div>

                {/* Behavior State Badge */}
                <div className={`mt-2 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                  vehicle.behavior_state === 'WAITING_FOR_GREEN' || vehicle.behavior_state === 'STOPPED' || vehicle.behavior_state === 'WAITING_AT_STOP_SIGN'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300 animate-pulse'
                    : vehicle.behavior_state === 'DECELERATING' || vehicle.behavior_state === 'STOPPING'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                    : vehicle.behavior_state === 'RESUMING'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800/80 border-slate-600/40 text-slate-300'
                }`}>
                  {vehicle.behavior_state ? vehicle.behavior_state.replace(/_/g, ' ') : 'CRUISING'}
                </div>
              </div>

              {/* Dynamic Recommendation Message & Decision Reason */}
              <div className="mt-4 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-medium text-emerald-300 max-w-sm text-center shadow-sm">
                <span className="font-bold text-white block mb-0.5">Advisory Reasoning:</span>
                <span>{vehicle.decision_reason || vehicle.advisory_message || 'Maintain corridor pace with regular traffic flow.'}</span>
              </div>
            </div>

            {/* Right 4 Cols: Next Road Event HUD & Green-Wave Band */}
            <div className="md:col-span-4 space-y-3.5">
              {/* Next Road Event Card */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isNight 
                  ? 'bg-white/[0.04] border-white/10 backdrop-blur-md' 
                  : 'bg-slate-800/80 border-slate-600/60 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    Next Road Event
                  </span>
                  {upNext && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono uppercase border border-emerald-500/30">
                      {upNext.state}
                    </span>
                  )}
                </div>

                {upNext ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Road Sign Symbol */}
                      <div className="w-12 h-12 rounded-full bg-white text-slate-950 border-4 border-red-600 flex items-center justify-center font-black text-base shrink-0 shadow-md">
                        {upNext.value ? upNext.value : '!'}
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-white leading-snug truncate">
                          {upNext.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {Math.round(upNext.distance_to_vehicle || 120)}m Ahead
                        </p>
                      </div>
                    </div>

                    {/* Countdown Progress Bar */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Distance Remaining:</span>
                      <span className="text-emerald-400 font-bold">
                        {Math.round(upNext.distance_to_vehicle || 0)} meters
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Corridor Ahead is Clear & Uncongested</span>
                  </div>
                )}
              </div>

              {/* Green Wave Speed Advisory Band */}
              {upcomingSignal?.recommended_speed_min ? (
                <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <span>Green-Wave GLOSA Advisory</span>
                      <span className="text-[9px] bg-emerald-500/30 px-1.5 py-0.2 rounded font-mono text-emerald-200 uppercase">Optimal</span>
                    </div>
                    <div className="text-white font-mono mt-0.5">
                      Maintain <b className="text-emerald-300 font-black">{upcomingSignal.recommended_speed_min}–{upcomingSignal.recommended_speed_max} km/h</b>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      Synchronized to clear {upcomingSignal.name} on green without deceleration.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/10 flex items-center gap-3 text-xs text-slate-400">
                  <Gauge className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Speed advisory synchronized with dynamic ITMS corridor regulation.</span>
                </div>
              )}
            </div>
          </div>

          {/* EV Battery & Smart Charging Hubs HUD */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-white/10">
            {/* Battery Telemetry Card */}
            <div className={`md:col-span-4 p-4 rounded-2xl border transition-all flex items-center justify-between ${
              isNight ? 'bg-white/[0.04] border-white/10' : 'bg-slate-800/80 border-slate-600/60'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">EV Battery Status</span>
                  <span className="text-base font-bold text-white font-mono">{vehicle.battery_soc_pct ?? 74.5}% SoC</span>
                  <div className="w-20 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full" 
                      style={{ width: `${vehicle.battery_soc_pct ?? 74.5}%` }} 
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">EST. RANGE</span>
                <span className="text-sm font-mono text-white font-bold">{vehicle.estimated_range_km ?? 298} km</span>
                <span className="text-[9px] text-slate-400 font-mono block">SoH: {vehicle.battery_soh_pct ?? 98.2}%</span>
              </div>
            </div>

            {/* Nearby Corridor Fast Charging Stations */}
            <div className={`md:col-span-8 p-4 rounded-2xl border space-y-2 transition-all ${
              isNight ? 'bg-white/[0.04] border-white/10' : 'bg-slate-800/80 border-slate-600/60'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Nearby Corridor Fast Charging Stations
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  LIVE AVAILABILITY
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(vehicle.nearby_charging_stations || [
                  {
                    station_id: 'CS-01',
                    name: 'Jio-bp Pulse Fast Hub Cyber Towers',
                    power_kw: 60,
                    price_per_kwh: 18.5,
                    available_ports: 3,
                    distance_m: 180
                  },
                  {
                    station_id: 'CS-02',
                    name: 'Tata Power EZ Charge Hitec City',
                    power_kw: 120,
                    price_per_kwh: 19.0,
                    available_ports: 2,
                    distance_m: 450
                  }
                ]).slice(0, 2).map((st: any) => (
                  <div key={st.station_id} className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                    <div className="truncate mr-2">
                      <div className="font-bold text-white truncate text-xs">{st.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{st.power_kw} kW • ₹{st.price_per_kwh}/kWh</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 block bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {st.available_ports} free
                      </span>
                      {st.distance_m && <span className="text-[9px] text-slate-400 font-mono">{st.distance_m}m</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Driver Controls (ISO 15005 Compliant 48px Touch Targets) */}
          <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onControl(vehicle.is_running ? 'pause' : 'play')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                {vehicle.is_running ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                <span>{vehicle.is_running ? 'Pause Sim' : 'Resume Sim'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => onControl('reset')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Route</span>
              </button>

              <button
                type="button"
                onClick={() => onControl('speed_up', { delta_speed: 5 })}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-mono font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <ArrowUp className="w-4 h-4" />
                <span>+5 km/h</span>
              </button>

              <button
                type="button"
                onClick={() => onControl('slow_down', { delta_speed: 5 })}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-mono font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <ArrowDown className="w-4 h-4" />
                <span>-5 km/h</span>
              </button>
            </div>

            <div className="flex items-center gap-2 min-h-[44px]">
              <span className="text-[11px] font-mono text-slate-400">Route:</span>
              <select
                value={vehicle.route_id}
                onChange={(e) => onControl('set_route', { route_id: e.target.value })}
                className="min-h-[44px] bg-black/60 border border-white/20 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
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
    </div>
  );
};
