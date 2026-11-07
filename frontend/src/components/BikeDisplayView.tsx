import React from 'react';
import { Bike, AlertTriangle, ShieldCheck, Navigation, Volume2, Compass } from 'lucide-react';
import { VehicleState } from '../types';

interface BikeDisplayViewProps {
  vehicle: VehicleState | null;
  onControl: (action: string, params?: any) => void;
}

export const BikeDisplayView: React.FC<BikeDisplayViewProps> = ({ vehicle, onControl }) => {
  if (!vehicle) return <div className="p-8 text-center text-slate-400">Loading Bike Telemetry...</div>;

  const currentSpeed = Math.round(vehicle.speed_kmh);
  const recSpeed = vehicle.recommended_speed_kmh ? Math.round(vehicle.recommended_speed_kmh) : null;
  const upcomingEvent = vehicle.active_events[0] || vehicle.approaching_events[0];
  const upcomingSignal = vehicle.active_signal;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* 6.7-inch Mount Device Frame Simulator */}
      <div className="relative w-[340px] sm:w-[380px] h-[720px] rounded-[48px] bg-black p-4 border-[6px] border-slate-700 shadow-2xl flex flex-col justify-between overflow-hidden font-mono">
        {/* Device Top Speaker / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Top Glanceable Bar */}
        <div className="pt-6 pb-2 px-2 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-brand-400 font-bold">
            <Bike className="w-4 h-4" />
            <span>BIKE HMI</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{vehicle.heading}°</span>
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Big Speed HUD */}
        <div className="my-auto text-center space-y-1">
          <div className="text-8xl font-black tracking-tight text-white leading-none">
            {currentSpeed}
          </div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
            KM / H
          </div>

          {recSpeed && (
            <div className="inline-block mt-2 px-4 py-1 rounded-full bg-slate-900 border border-slate-700 text-brand-400 text-sm font-bold">
              LIMIT: {recSpeed} KM/H
            </div>
          )}
        </div>

        {/* Primary Hazard / Road Event Card */}
        <div className="space-y-3">
          {upcomingEvent ? (
            <div className={`p-4 rounded-3xl border-2 text-center transition-all ${
              upcomingEvent.priority === 'CRITICAL'
                ? 'bg-rose-950 border-rose-500 text-white animate-pulse'
                : upcomingEvent.priority === 'HIGH'
                ? 'bg-amber-950/80 border-amber-400 text-amber-100'
                : 'bg-slate-900 border-brand-500 text-white'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80 mb-1">
                {upcomingEvent.state} • {Math.round(upcomingEvent.distance_to_vehicle || 0)}M
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight">
                {upcomingEvent.name}
              </h3>
            </div>
          ) : upcomingSignal ? (
            <div className="p-4 rounded-3xl bg-slate-900 border-2 border-amber-500 text-center text-white">
              <span className="text-xs uppercase font-bold text-amber-400 block mb-1">
                SIGNAL {upcomingSignal.state} • {upcomingSignal.remaining_time}S
              </span>
              <h3 className="text-lg font-bold">
                {upcomingSignal.recommended_speed_min 
                  ? `Maintain ${upcomingSignal.recommended_speed_min}-${upcomingSignal.recommended_speed_max} km/h` 
                  : upcomingSignal.name}
              </h3>
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              PATH CLEAR
            </div>
          )}

          {/* Current Road Indicator */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-900 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-brand-500" />
            <span className="truncate">{vehicle.current_road}</span>
          </div>
        </div>

        {/* Handlebar Mode Bar */}
        <div className="pt-2 pb-1 border-t border-slate-900 text-center">
          <span className="text-[10px] text-slate-600 uppercase tracking-widest font-sans">
            6.7" HIGH-CONTRAST GLANCEABLE CLUSTER
          </span>
        </div>
      </div>
    </div>
  );
};
