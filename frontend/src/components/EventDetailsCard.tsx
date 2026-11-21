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

        {/* Detailed Attribute Rows - Clean 2-Column Responsive Grid (No Squishing) */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-100 py-3 my-2 font-mono">
          <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Location</span>
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5 font-mono">17.4476, 78.3772</span>
          </div>

          <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Road</span>
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5 truncate font-sans" title="Hitec City Main Road">
              Hitec City Main
            </span>
          </div>

          <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Direction</span>
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">North-East (45°)</span>
          </div>

          <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Stop Line</span>
            <span className="font-bold text-red-600 text-[11px] block mt-0.5">{distance} m before</span>
          </div>

          <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Cycle Time</span>
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">120s (Active)</span>
          </div>

          <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Source</span>
            <span className="font-semibold text-emerald-700 text-[11px] block mt-0.5 truncate">Virtual RIU</span>
          </div>

          <div className="col-span-2 bg-indigo-50/70 border border-indigo-100/80 p-2 px-2.5 rounded-xl flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider">Confidence</span>
            <span className="font-bold text-indigo-700 text-[11px]">98% (PyTorch Fusion)</span>
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
