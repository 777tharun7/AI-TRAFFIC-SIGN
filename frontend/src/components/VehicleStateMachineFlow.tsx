import React from 'react';
import { VehicleState } from '../types';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface Props {
  vehicle: VehicleState | null;
}

export const VehicleStateMachineFlow: React.FC<Props> = ({ vehicle }) => {
  const currentState = vehicle?.behavior_state ?? 'MOVING';

  // State nodes configuration
  const states = [
    { key: 'MOVING', label: 'MOVING', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { key: 'APPROACHING', label: 'APPROACHING EVENT', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
    { key: 'DECELERATING', label: 'DECELERATING', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
    { key: 'STOPPING', label: 'STOPPING', bg: 'bg-orange-100 text-orange-800 border-orange-300' },
    { key: 'STOPPED', label: 'STOPPED', bg: 'bg-red-100 text-red-800 border-red-300' },
    { key: 'WAITING_FOR_GREEN', label: 'WAITING (RED)', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
    { key: 'RESUMING', label: 'RESUMING (GREEN)', bg: 'bg-sky-100 text-sky-800 border-sky-300' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-slate-900">Vehicle State Machine</h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Current: {currentState}
          </span>
        </div>

        {/* State Flow Visual Canvas */}
        <div className="flex flex-col gap-2.5 py-1">
          {/* Row 1: Top Track */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto">
            <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${currentState === 'MOVING' ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300 scale-105 animate-pulse' : 'bg-emerald-100/70 text-emerald-800 border-emerald-300'}`}>
              MOVING
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${currentState === 'APPROACHING_EVENT' ? 'bg-blue-500 text-white border-blue-600 shadow-md ring-2 ring-blue-300 scale-105 animate-pulse' : 'bg-blue-100/70 text-blue-800 border-blue-300'}`}>
              APPROACHING EVENT
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${currentState === 'DECELERATING' ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 scale-105 animate-pulse' : 'bg-amber-100/70 text-amber-800 border-amber-300'}`}>
              DECELERATING
            </div>
          </div>

          {/* Row 2: Middle Track */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto">
            <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${currentState === 'STOPPING' ? 'bg-orange-500 text-white border-orange-600 shadow-md ring-2 ring-orange-300 scale-105 animate-pulse' : 'bg-orange-100/70 text-orange-800 border-orange-300'}`}>
              STOPPING
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${currentState === 'STOPPED' ? 'bg-red-500 text-white border-red-600 shadow-md ring-2 ring-red-300 scale-105 animate-pulse' : 'bg-red-100/70 text-red-800 border-red-300'}`}>
              STOPPED
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
              currentState === 'WAITING_FOR_GREEN' || currentState === 'WAITING_FOR_POLICE_CLEARANCE' || currentState === 'WAITING_AT_STOP_SIGN'
                ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300 scale-105 animate-pulse' 
                : 'bg-rose-100/70 text-rose-800 border-rose-300'
            }`}>
              {currentState === 'WAITING_FOR_POLICE_CLEARANCE' ? 'WAITING (POLICE)' : 'WAITING (RED)'}
            </div>
          </div>

          {/* Row 3: Return Loop */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${currentState === 'RESUMING' ? 'bg-sky-500 text-white border-sky-600 shadow-md ring-2 ring-sky-300 scale-105 animate-pulse' : 'bg-sky-100/70 text-sky-800 border-sky-300'}`}>
              RESUMING (GREEN)
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${currentState === 'MOVING' ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300' : 'bg-emerald-100/70 text-emerald-800 border-emerald-300'}`}>
              MOVING
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[10px] text-slate-400 font-mono text-center border-t border-slate-100">
        Deterministic Finite State Automaton • 0-Latency State Transitions
      </div>
    </div>
  );
};
