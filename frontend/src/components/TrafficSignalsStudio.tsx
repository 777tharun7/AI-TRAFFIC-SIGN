import React from 'react';
import { Signal, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { TrafficSignal } from '../types';

interface TrafficSignalsStudioProps {
  signals: TrafficSignal[];
}

export const TrafficSignalsStudio: React.FC<TrafficSignalsStudioProps> = ({ signals }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Signal className="w-5 h-5 text-amber-600" />
          Traffic Signals & Green-Wave Corridor Synchronization
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Simulated intelligent signal phase controllers with predictive speed-window advisory.
        </p>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {signals.map((sig) => {
          const isRed = sig.state === 'RED';
          const isYellow = sig.state === 'YELLOW';
          const badgeClass = isRed 
            ? 'bg-rose-100 text-rose-800 border-rose-200' 
            : isYellow 
            ? 'bg-amber-100 text-amber-800 border-amber-200' 
            : 'bg-emerald-100 text-emerald-800 border-emerald-200';

          return (
            <div key={sig.signal_id} className="mobility-card p-6 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {sig.signal_id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {sig.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Road Segment: {sig.road_segment_id}
                  </p>
                </div>

                {/* State Bulb & Countdown */}
                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm ${badgeClass}`}>
                  <span className={`w-3 h-3 rounded-full ${
                    isRed ? 'bg-rose-500 animate-pulse' : isYellow ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span>{sig.state} • {sig.remaining_time}s</span>
                </div>
              </div>

              {/* Phase Durations */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Red Phase</span>
                  <b className="text-rose-700">{sig.red_duration}s</b>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Yellow Phase</span>
                  <b className="text-amber-700">{sig.yellow_duration}s</b>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Green Phase</span>
                  <b className="text-emerald-700">{sig.green_duration}s</b>
                </div>
              </div>

              {/* Green Wave Window */}
              {sig.recommended_speed_min && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2 text-emerald-900">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Recommended Green-Wave Window:</span>
                    <span>Maintain <b>{sig.recommended_speed_min} – {sig.recommended_speed_max} km/h</b> for zero-stop progression.</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
