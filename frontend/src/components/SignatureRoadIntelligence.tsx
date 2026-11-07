import React, { useState } from 'react';
import { 
  Navigation, Radio, ShieldCheck, AlertTriangle, 
  ArrowRight, Compass, CheckCircle2, Zap, AlertCircle,
  Activity, Gauge, CornerDownRight, Clock, ShieldAlert, Bug
} from 'lucide-react';
import { HeroMap } from './HeroMap';
import { VehicleState, VirtualRIU, TrafficSignal, RoadEvent } from '../types';

interface SignatureRoadIntelligenceProps {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onSelectRIU?: (riu: VirtualRIU) => void;
}

export const SignatureRoadIntelligence: React.FC<SignatureRoadIntelligenceProps> = ({
  vehicle,
  rius,
  signals,
  onSelectRIU
}) => {
  const [showDebug, setShowDebug] = useState<boolean>(true);

  const currentSpeed = vehicle ? Math.round(vehicle.speed_kmh) : 0;
  const currentRoad = vehicle?.current_road || 'Hitec City Main Road';
  const heading = vehicle ? Math.round(vehicle.heading) : 90;

  // Behavior state & active rules
  const behaviorState = vehicle?.behavior_state || 'MOVING';
  const isStopped = behaviorState === 'STOPPED' || behaviorState === 'WAITING_FOR_GREEN' || behaviorState === 'WAITING_AT_STOP_SIGN' || currentSpeed === 0;
  const isDecelerating = behaviorState === 'DECELERATING' || behaviorState === 'STOPPING';

  // Active / Approaching events
  const upNextEvent = vehicle?.active_events[0] || vehicle?.approaching_events[0];
  const upcomingSignal = vehicle?.active_signal;
  const secondaryCondition = vehicle?.approaching_events[1] || null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Live Road Intelligence & Behavior Simulator
            </h2>
            <span className="text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Rule-Based Physics Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time vehicle physics, traffic signal stop-line adherence, and multi-event rule arbitration.
          </p>
        </div>

        {/* Current Vehicle Context Tag */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentRoad}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-slate-600">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>{heading}° Heading</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className={`font-bold font-mono px-2 py-0.5 rounded-lg ${
            isStopped ? 'bg-red-100 text-red-800 animate-pulse' :
            isDecelerating ? 'bg-amber-100 text-amber-800' :
            'bg-emerald-100 text-emerald-800'
          }`}>
            {currentSpeed} km/h
          </div>
        </div>
      </div>

      {/* Main Flagship Grid: 65% Map + 35% Road Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 65%: Large Hero Map */}
        <div className="lg:col-span-8 h-[640px]">
          <HeroMap
            vehicle={vehicle}
            rius={rius}
            signals={signals}
            activeEvents={vehicle?.active_events || []}
            onSelectRIU={onSelectRIU}
          />
        </div>

        {/* Right 35%: Driver-First Road Intelligence Card & Rule Controller */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: PRIMARY VEHICLE BEHAVIOR & DECISION STATE */}
          <div className="mobility-card p-6 border-slate-200/90 shadow-sm relative overflow-hidden">
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              isStopped ? 'bg-red-500' :
              isDecelerating ? 'bg-amber-500' :
              behaviorState === 'RESUMING' ? 'bg-emerald-500' : 'bg-slate-900'
            }`} />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-mono uppercase font-bold text-slate-400 tracking-wider">
                Vehicle Behavior State
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                isStopped ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' :
                isDecelerating ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                behaviorState === 'RESUMING' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {behaviorState.replace('_', ' ')}
              </span>
            </div>

            {/* Decision Reason & Actionable Explanation */}
            <div className="py-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isStopped ? 'bg-red-50 text-red-600 border border-red-200' :
                  isDecelerating ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  {isStopped ? <ShieldAlert className="w-6 h-6" /> : <Gauge className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {vehicle?.decision_reason || 'Cruising clear along corridor'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Active Rule: <span className="font-bold text-slate-800">{vehicle?.active_rule || 'CRUISE_CORRIDOR'}</span>
                  </p>
                </div>
              </div>

              {/* Kinematics Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Current / Target</span>
                  <span className="text-sm font-bold text-slate-900">
                    {currentSpeed} / {vehicle ? Math.round(vehicle.target_speed_kmh) : 45} km/h
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Stop Line Dist</span>
                  <span className={`text-sm font-bold ${
                    vehicle?.distance_to_stop_line_m !== null && vehicle?.distance_to_stop_line_m !== undefined && vehicle.distance_to_stop_line_m <= 15
                      ? 'text-red-700' : 'text-slate-900'
                  }`}>
                    {vehicle?.distance_to_stop_line_m !== null && vehicle?.distance_to_stop_line_m !== undefined 
                      ? `${vehicle.distance_to_stop_line_m}m` 
                      : 'None Ahead'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: UPCOMING TRAFFIC SIGNAL ADVISORY */}
          {upcomingSignal && (
            <div className="mobility-card p-5 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Upcoming Signal State
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  upcomingSignal.state === 'RED' ? 'bg-red-100 text-red-800' :
                  upcomingSignal.state === 'YELLOW' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {upcomingSignal.state} Phase ({upcomingSignal.remaining_time}s)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{upcomingSignal.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {upcomingSignal.state === 'RED' ? 'Braking to Stop Line' : 'Green-Wave Corridor'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-black text-slate-900 block">
                    {upcomingSignal.remaining_time}s
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Countdown</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 3: UP NEXT ROAD HAZARDS / SPEED LIMITS */}
          {upNextEvent && (
            <div className="mobility-card p-5 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Corridor Event Context
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {upNextEvent.distance_to_vehicle ? `${Math.round(upNextEvent.distance_to_vehicle)}m ahead` : 'Active Zone'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{upNextEvent.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{upNextEvent.event_type}</p>
                </div>
                {upNextEvent.value && (
                  <span className="text-base font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {upNextEvent.value} km/h
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DEVELOPER DECISION & TELEMETRY DEBUG PANEL */}
      <div className="mobility-card p-5 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
            <Bug className="w-4 h-4 text-emerald-600" />
            Vehicle Behavior Engine Debug Log & Decision Audit Stream
          </h3>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
            Real-time Kinematic Telemetry
          </span>
        </div>

        {/* Live Log Stream Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400">
              <tr>
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Behavior State</th>
                <th className="py-2 px-3">Active Rule</th>
                <th className="py-2 px-3">Decision Reason</th>
                <th className="py-2 px-3 text-right">Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicle?.recent_event_logs && vehicle.recent_event_logs.length > 0 ? (
                vehicle.recent_event_logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 text-slate-500">{log.timestamp}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.behavior_state.includes('STOP') || log.behavior_state.includes('WAITING') ? 'bg-red-100 text-red-800' :
                        log.behavior_state.includes('DECELERATING') ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.behavior_state}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-700 font-semibold">{log.rule}</td>
                    <td className="py-2 px-3 text-slate-900">{log.decision}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">{log.speed_kmh} km/h</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-3 text-center text-slate-400">
                    Vehicle behavior engine active — awaiting next state transition event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
