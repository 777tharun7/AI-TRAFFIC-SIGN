import React from 'react';
import { VehicleState } from '../types';
import { Navigation, ArrowRight, CheckCircle2, Shield, Activity, Car, Clock } from 'lucide-react';

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
  else if (behaviorState === 'STOPPED' || behaviorState === 'WAITING_FOR_GREEN' || behaviorState === 'WAITING_AT_STOP_SIGN' || behaviorState === 'WAITING_FOR_POLICE_CLEARANCE') activeStep = 4;
  else if (behaviorState === 'RESUMING' && speed < 15) activeStep = 5;
  else if (behaviorState === 'RESUMING' || (behaviorState === 'MOVING' && distance > 100)) activeStep = 6;

  const steps = [
    {
      id: 1,
      name: 'Approaching',
      distanceTag: '120 m ahead',
      speedTag: '45 km/h',
      desc: 'Detect signal & calculate distance to stop line',
      signalBadge: '🔴 120m',
      signalColor: 'text-red-400 bg-red-950/80 border-red-800',
      actionPrompt: 'Monitor Signal Phase'
    },
    {
      id: 2,
      name: 'Decelerating',
      distanceTag: '80 → 30 m',
      speedTag: '45 → 20 km/h',
      desc: 'Gradual kinematic braking along corridor profile',
      signalBadge: '🔴 60m',
      signalColor: 'text-amber-400 bg-amber-950/80 border-amber-800',
      actionPrompt: 'Smooth Deceleration'
    },
    {
      id: 3,
      name: 'Stopping',
      distanceTag: '10 → 0 m',
      speedTag: '5 km/h',
      desc: 'Precision stop line alignment (within ±0.5m)',
      signalBadge: '🔴 5m',
      signalColor: 'text-orange-400 bg-orange-950/80 border-orange-800',
      actionPrompt: 'Zero Stop-Line Breach'
    },
    {
      id: 4,
      name: 'Waiting',
      distanceTag: '0 m (Holding)',
      speedTag: '0 km/h',
      desc: 'Hold position while red phase is active',
      signalBadge: '🛑 RED 30s',
      signalColor: 'text-rose-400 bg-rose-950/80 border-rose-800',
      actionPrompt: 'Hold at Stop Line'
    },
    {
      id: 5,
      name: 'Signal Green',
      distanceTag: '0 m (Green)',
      speedTag: '0 km/h',
      desc: 'Signal changes to green via 5.9GHz V2X SPaT',
      signalBadge: '🟢 GREEN',
      signalColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
      actionPrompt: 'Prepare to Resuming'
    },
    {
      id: 6,
      name: 'Resuming',
      distanceTag: 'Cleared',
      speedTag: '0 → 45 km/h',
      desc: 'Accelerate and synchronize with corridor green wave',
      signalBadge: '🟢 GO',
      signalColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
      actionPrompt: 'Corridor Cruising'
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-left">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-900 tracking-wider uppercase font-mono">
              KINEMATICS &amp; CORRIDOR AUTOMATION
            </span>
            <span className="text-xs text-slate-400 font-mono">RED SIGNAL TRAJECTORY</span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-600" />
            Vehicle Behavior Flow (Red Signal Lifecycle)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Autonomous kinematic deceleration, precision stop-line holding, and green-wave resumption across corridor intersections.
          </p>
        </div>

        {/* Active Phase Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-indigo-900 font-bold">Active Phase: Step {activeStep} of 6</span>
            <span className="text-indigo-700 font-semibold">• {steps[activeStep - 1].name}</span>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar linking the 6 steps */}
      <div className="hidden lg:grid grid-cols-6 gap-2 items-center px-1">
        {steps.map((st) => {
          const isPassed = st.id < activeStep;
          const isCurrent = st.id === activeStep;
          return (
            <div key={st.id} className="flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-all ${
                isPassed ? 'bg-indigo-600' : isCurrent ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200'
              }`} />
            </div>
          );
        })}
      </div>

      {/* 6-Card Spacious Layout: 1 col on mobile, 2 on sm, 3 on md, 6 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {steps.map((s) => {
          const isActive = s.id === activeStep;
          const isPassed = s.id < activeStep;

          return (
            <div 
              key={s.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 relative ${
                isActive 
                  ? 'bg-indigo-50/70 border-indigo-400 shadow-md ring-2 ring-indigo-500/20 scale-[1.02]' 
                  : isPassed
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                
                {/* Step Pill & Step Number */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-indigo-600 text-white shadow-xs' : isPassed ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Step {s.id}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    {s.distanceTag}
                  </span>
                </div>

                {/* Step Title */}
                <div>
                  <h4 className={`text-sm font-extrabold leading-tight ${isActive ? 'text-indigo-950 font-black' : 'text-slate-900'}`}>
                    {s.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Target: {s.speedTag}
                  </div>
                </div>

                {/* Road Kinematics Simulator Graphic */}
                <div className="relative w-full h-20 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 p-2 flex flex-col justify-between">
                  {/* Road Centerline */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-0.5 border-b border-dashed border-slate-700" />
                  </div>

                  {/* Signal Indicator Badge (Top Right) */}
                  <div className="self-end z-10">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${s.signalColor}`}>
                      {s.signalBadge}
                    </span>
                  </div>

                  {/* Vehicle Marker on Track */}
                  <div className="relative z-10 flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-600 text-white font-mono text-[10px] font-bold shadow-md">
                      <span>🚗</span>
                      <span>{s.speedTag}</span>
                    </div>
                  </div>
                </div>

                {/* Kinematic Action Description */}
                <p className="text-[11px] text-slate-600 leading-snug">
                  {s.desc}
                </p>

              </div>

              {/* Status Badge Footer */}
              <div className="pt-3 mt-2 border-t border-slate-100">
                {isActive ? (
                  <div className="text-center py-1 px-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>CURRENT STATE</span>
                  </div>
                ) : isPassed ? (
                  <div className="text-center py-1 px-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>PHASE PASSED</span>
                  </div>
                ) : (
                  <div className="text-center py-1 px-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-mono font-semibold uppercase tracking-wider">
                    {s.actionPrompt}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
