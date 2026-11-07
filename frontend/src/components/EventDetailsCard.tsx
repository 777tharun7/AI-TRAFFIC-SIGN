import React from 'react';
import { TrafficSignal, VehicleState } from '../types';
import { ShieldCheck, Radio, MapPin, Compass, Clock, AlertCircle } from 'lucide-react';

interface Props {
  vehicle: VehicleState | null;
  signal: TrafficSignal | null;
}

export const EventDetailsCard: React.FC<Props> = ({ vehicle, signal }) => {
  const signalState = signal?.state ?? 'RED';
  const timeRemaining = signal?.remaining_time ?? 30;
  const distance = Math.round(vehicle?.distance_to_event_m ?? 80);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
      <div>
        {/* Card Header & Traffic Light Icon */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-14 rounded-lg bg-slate-900 flex flex-col items-center justify-between p-1 shadow-md">
              <span className={`w-3.5 h-3.5 rounded-full ${signalState === 'RED' ? 'bg-red-500 shadow-md shadow-red-500 animate-pulse' : 'bg-red-500/20'}`} />
              <span className={`w-3.5 h-3.5 rounded-full ${signalState === 'YELLOW' ? 'bg-amber-400 shadow-md shadow-amber-400 animate-pulse' : 'bg-amber-400/20'}`} />
              <span className={`w-3.5 h-3.5 rounded-full ${signalState === 'GREEN' ? 'bg-emerald-500 shadow-md shadow-emerald-500 animate-pulse' : 'bg-emerald-500/20'}`} />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">Event Details</span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">HITEC City Signal - 001</h3>
              <span className="text-xs text-slate-500 font-mono font-medium">{distance} meters ahead</span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider">
            {signalState} ({timeRemaining}s)
          </div>
        </div>

        {/* Detailed Attribute Rows */}
        <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3 my-2 font-mono">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Location</span>
            <span className="font-semibold text-slate-800">17.4476, 78.3772</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Road</span>
            <span className="font-semibold text-slate-800 font-sans">Hitec City Main Road</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Direction</span>
            <span className="font-semibold text-slate-800">North-East (45°)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Stop Line</span>
            <span className="font-bold text-red-600">{distance} m before</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Cycle Time</span>
            <span className="font-semibold text-slate-800">120 sec (Simulated)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Source</span>
            <span className="font-semibold text-emerald-700">Virtual RIU + Map</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Confidence</span>
            <span className="font-bold text-indigo-700">98% (PyTorch CNN Fusion)</span>
          </div>
        </div>
      </div>

      {/* Warning Notice Banner */}
      <div className="mt-3 p-2.5 rounded-xl bg-red-50/80 border border-red-200 text-red-700 text-[11px] font-medium flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
        <span>Vehicle will stop automatically at the stop line.</span>
      </div>
    </div>
  );
};
