import React, { useState } from 'react';
import { 
  Bike, Compass, Volume2, VolumeX, ShieldCheck, 
  AlertTriangle, Navigation, ArrowUp, ArrowDown 
} from 'lucide-react';
import { VehicleState } from '../types';

interface BikeGlanceableDisplayProps {
  vehicle: VehicleState | null;
  onControl: (action: string, params?: any) => void;
}

export const BikeGlanceableDisplay: React.FC<BikeGlanceableDisplayProps> = ({
  vehicle,
  onControl
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  if (!vehicle) return <div className="p-8 text-center text-slate-400">Loading Bike Telemetry...</div>;

  const currentSpeed = Math.round(vehicle.speed_kmh);
  const upNext = vehicle.active_events[0] || vehicle.approaching_events[0];
  const upcomingSignal = vehicle.active_signal;
  const recommendedSpeed = vehicle.recommended_speed_kmh 
    ? Math.round(vehicle.recommended_speed_kmh) 
    : (upNext?.value ? Math.round(upNext.value) : 40);

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none">
      {/* 6.7-inch Physical Handlebar Display Mount */}
      <div className="relative w-[340px] sm:w-[370px] h-[680px] rounded-[44px] bg-[#020617] border-[6px] border-slate-700 shadow-2xl p-5 flex flex-col justify-between text-white overflow-hidden font-sans">
        {/* Top Handlebar Glance Bar */}
        <div className="pt-2 pb-3 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Bike className="w-4 h-4" />
            <span>HYDERABAD</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-400">
              <Compass className="w-3.5 h-3.5" />
              {Math.round(vehicle.heading)}°
            </span>
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="text-slate-400 hover:text-white"
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Speed Readout (Extra Large) & Behavior State */}
        <div className="my-auto text-center space-y-1">
          <div className="text-8xl font-black tracking-tight text-white font-mono leading-none">
            {currentSpeed}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
            KM / H
          </div>
          <div className={`mt-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold inline-block border ${
            vehicle.behavior_state === 'WAITING_FOR_GREEN' || vehicle.behavior_state === 'STOPPED' || vehicle.behavior_state === 'WAITING_AT_STOP_SIGN'
              ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
              : vehicle.behavior_state === 'DECELERATING' || vehicle.behavior_state === 'STOPPING'
              ? 'bg-amber-950 border-amber-500 text-amber-300'
              : vehicle.behavior_state === 'RESUMING'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            {vehicle.behavior_state ? vehicle.behavior_state.replace('_', ' ') : 'CRUISING'}
          </div>
          {vehicle.distance_to_stop_line_m !== null && vehicle.distance_to_stop_line_m !== undefined && (
            <div className="text-[10px] font-mono text-amber-400 pt-1">
              Stop Line: {vehicle.distance_to_stop_line_m}m
            </div>
          )}
        </div>

        {/* Next Relevant Road Hazard / Event */}
        <div className="space-y-3">
          {upNext ? (
            <div className={`p-4 rounded-3xl border-2 text-center transition-all ${
              upNext.priority === 'CRITICAL'
                ? 'bg-rose-950 border-rose-500 text-white animate-pulse'
                : upNext.priority === 'HIGH'
                ? 'bg-amber-950/80 border-amber-400 text-amber-100'
                : 'bg-slate-900 border-emerald-500 text-white'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1 text-xs font-bold font-mono uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>{Math.round(upNext.distance_to_vehicle || 120)} M AHEAD</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">
                {upNext.name}
              </h3>
              <div className="mt-2 text-xs font-mono font-bold text-emerald-400 bg-black/40 py-1 px-3 rounded-full inline-block">
                RECOMMENDED: {recommendedSpeed} KM/H
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ROAD CLEAR</span>
            </div>
          )}

          {/* Traffic Signal Peek */}
          {upcomingSignal && (
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">NEXT SIGNAL:</span>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  upcomingSignal.state === 'GREEN' ? 'bg-emerald-500' :
                  upcomingSignal.state === 'YELLOW' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <span className="font-bold text-white uppercase">{upcomingSignal.state} ({upcomingSignal.remaining_time}S)</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Current Road Info */}
        <div className="pt-2 text-center text-[11px] text-slate-500 truncate font-mono border-t border-slate-900">
          {vehicle.current_road}
        </div>
      </div>
    </div>
  );
};
