import React from 'react';
import { VehicleState } from '../types';
import { ChevronRight } from 'lucide-react';

interface Props {
  vehicle: VehicleState | null;
}

export const VehicleBehaviorFlow: React.FC<Props> = ({ vehicle }) => {
  const behaviorState = vehicle?.behavior_state ?? 'MOVING';
  const speed = vehicle?.speed_kmh ?? 45;
  const distance = vehicle?.distance_to_event_m ?? 80;

  // Determine active step index (1-6)
  let activeStep = 1;
  if (behaviorState === 'APPROACHING_EVENT') activeStep = 1;
  else if (behaviorState === 'DECELERATING') activeStep = 2;
  else if (behaviorState === 'STOPPING') activeStep = 3;
  else if (behaviorState === 'STOPPED' || behaviorState === 'WAITING_FOR_GREEN' || behaviorState === 'WAITING_AT_STOP_SIGN') activeStep = 4;
  else if (behaviorState === 'RESUMING' && speed < 15) activeStep = 5;
  else if (behaviorState === 'RESUMING' || (behaviorState === 'MOVING' && distance > 100)) activeStep = 6;

  const steps = [
    {
      id: 1,
      title: '1. Approaching',
      sub: '120 m',
      desc: 'Detect signal and calculate distance',
      speedTag: '45 km/h',
      indicator: '🔴 120m',
      iconBg: 'bg-blue-500/10 text-blue-600',
    },
    {
      id: 2,
      title: '2. Decelerating',
      sub: '80 → 30 m',
      desc: 'Gradually reduce speed',
      speedTag: '45 → 20 km/h',
      indicator: '🔴 60m',
      iconBg: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 3,
      title: '3. Stopping',
      sub: '10 → 0 m',
      desc: 'Stop before stop line',
      speedTag: '5 km/h',
      indicator: '🔴 5m',
      iconBg: 'bg-orange-500/10 text-orange-600',
    },
    {
      id: 4,
      title: '4. Waiting',
      sub: '0 km/h',
      desc: 'Remain stopped while signal is red',
      speedTag: '0 km/h',
      indicator: '🛑 30s',
      iconBg: 'bg-red-500/10 text-red-600',
    },
    {
      id: 5,
      title: '5. Signal Green',
      sub: '0 sec',
      desc: 'Signal changes to green',
      speedTag: '0 km/h',
      indicator: '🟢 0s',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      id: 6,
      title: '6. Resuming',
      sub: '0 → 45 km/h',
      desc: 'Accelerate and continue',
      speedTag: '45 km/h',
      indicator: '🟢 GO',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Vehicle Behavior Flow (Red Signal Example)</h3>
          <p className="text-xs text-slate-500">Autonomous kinematics deceleration, precision stop line holding, and green-wave resumption</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
            Active Phase: Step {activeStep} of 6
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((s) => {
          const isActive = s.id === activeStep;
          return (
            <div 
              key={s.id}
              className={`rounded-xl border p-2.5 flex flex-col justify-between transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-500/20 scale-[1.02]' 
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Visual Header */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-bold ${isActive ? 'text-blue-950' : 'text-slate-900'}`}>
                    {s.title}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 font-semibold mb-2">
                  {s.sub}
                </div>

                {/* Road Visual Mock Illustration */}
                <div className="relative w-full h-16 rounded-lg bg-slate-800 overflow-hidden mb-2 border border-slate-700/50 flex flex-col justify-end p-1">
                  {/* Road markings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-full border-r border-dashed border-slate-400 opacity-40" />
                  </div>
                  
                  {/* Traffic Light Mini on Top Right */}
                  <div className="absolute top-1 right-1.5 px-1 py-0.5 rounded bg-slate-900/90 text-[9px] font-black border border-slate-700">
                    {s.indicator}
                  </div>

                  {/* Vehicle Mock on Road */}
                  <div className="relative z-10 self-center px-2 py-0.5 rounded bg-blue-600 text-[9px] font-black text-white shadow-md flex items-center gap-1">
                    <span>🚗</span>
                    <span className="font-mono text-[8px]">{s.speedTag}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-600 leading-tight">
                  {s.desc}
                </p>
              </div>

              {isActive && (
                <div className="mt-2 text-center py-0.5 px-1 bg-blue-600 text-white rounded text-[9px] font-bold uppercase tracking-wider animate-pulse">
                  Current State
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
