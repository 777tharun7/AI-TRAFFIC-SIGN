import React from 'react';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';
import { RealNavigationMap } from './RealNavigationMap';
import { EventDetailsCard } from './EventDetailsCard';
import { VehicleBehaviorFlow } from './VehicleBehaviorFlow';
import { VehicleStateMachineFlow } from './VehicleStateMachineFlow';
import { LiveEventTimeline } from './LiveEventTimeline';
import { Navigation, Compass, AlertTriangle, CloudSun, MapPin } from 'lucide-react';

interface Props {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onControl?: (action: string, params?: any) => void;
}

export const MasterRoadIntelligenceDashboard: React.FC<Props> = ({
  vehicle,
  rius,
  signals,
  onControl
}) => {
  const currentSpeed = vehicle?.speed_kmh ?? 45;
  const behaviorState = vehicle?.behavior_state ?? 'MOVING';
  const distanceToEvent = Math.round(vehicle?.distance_to_event_m ?? 80);
  const activeSignal = signals.length > 0 ? signals[0] : null;
  const signalState = activeSignal?.state ?? 'RED';
  const timeRemaining = activeSignal?.remaining_time ?? 30;

  return (
    <div className="space-y-6">
      
      {/* Top Grid: Real Geospatial 2D/3D Navigation Map (Left 60%) + Cockpit Experiences (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Real Geospatial Navigation Map Engine */}
        <div className="lg:col-span-7">
          <RealNavigationMap
            vehicle={vehicle}
            rius={rius}
            signals={signals}
            onControl={onControl}
          />
        </div>

        {/* Right 5 Columns: Vehicle Cockpit & Mounted Bike Display & Event Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Car Cockpit HMI (In-Vehicle Interface) */}
          <div className="bg-[#0b101b] rounded-2xl border border-slate-800 shadow-xl p-4 text-white overflow-hidden relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2 mb-3">
              <span className="font-bold text-slate-200">Car Cockpit HMI (In-Vehicle Interface)</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-emerald-400">📶 5G</span>
                <span>10:24 AM</span>
              </div>
            </div>

            {/* In-Vehicle Cluster Visual */}
            <div className="grid grid-cols-12 gap-3 items-center">
              
              {/* Lane & Corridor Guidance */}
              <div className="col-span-4 bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 text-center flex flex-col justify-between h-36">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">HITEC City Road</span>
                  <span className="text-xs font-bold text-blue-400 font-mono">↑ 200 m</span>
                </div>
                {/* 3D Road Lane SVG */}
                <div className="relative h-16 w-full flex justify-center items-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 80">
                    <polygon points="10,80 35,20 65,20 90,80" fill="#1e293b" />
                    <line x1="50" y1="20" x2="50" y2="80" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 6" />
                    <polygon points="50,45 42,60 58,60" fill="#60a5fa" />
                  </svg>
                </div>
              </div>

              {/* Central Dynamic Speedometer */}
              <div className="col-span-4 flex flex-col items-center justify-center relative">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="#ef4444" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="251" 
                      strokeDashoffset={251 - (251 * (currentSpeed / 120))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-mono leading-none tracking-tight">{currentSpeed.toFixed(0)}</span>
                    <span className="text-[9px] font-mono text-slate-400">km/h</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] font-mono text-slate-400">Speed Limit:</span>
                  <div className="w-4 h-4 rounded-full border border-red-500 text-slate-100 flex items-center justify-center text-[8px] font-black">
                    40
                  </div>
                </div>
              </div>

              {/* Active Signal Stop Alert Widget */}
              <div className="col-span-4 space-y-2">
                <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2">
                  <div className="w-3.5 h-8 rounded bg-black flex flex-col items-center justify-between p-0.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-400 block leading-none">Red Signal</span>
                    <span className="text-[11px] font-mono font-black text-white">{distanceToEvent} m</span>
                    <span className="text-[9px] font-mono text-slate-400 block">{timeRemaining} sec</span>
                  </div>
                </div>

                <div className="py-1 px-2 rounded-lg bg-red-600/90 text-white text-[9px] font-bold text-center tracking-wide">
                  Prepare to Stop
                </div>

                <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800/80 flex items-center gap-1.5 text-[9px]">
                  <span className="text-amber-400">⚠️</span>
                  <div>
                    <span className="text-slate-400 block text-[8px]">Next</span>
                    <span className="font-bold text-slate-200">Speed Breaker 250m</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Cockpit Status Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 mt-3 font-mono">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">D READY</span>
                <span>HITEC City Main Road | Hyderabad</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>24°C</span>
              </div>
            </div>
          </div>

          {/* 2. Bike 6.7-inch Display + Event Details Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            
            {/* Left: Mobile-Mounted Bike 6.7" Display Frame */}
            <div className="bg-slate-900 p-3 rounded-3xl border-4 border-slate-800 shadow-xl flex flex-col justify-between text-white relative">
              <div className="text-center mb-2">
                <span className="text-[10px] font-bold text-slate-300">Bike 6.7-inch Display (Mobile Mounted)</span>
              </div>

              {/* Smartphone Screen Simulator */}
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 flex-1 flex flex-col justify-between">
                
                {/* Mobile Top Bar */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span>📍</span> Hyderabad
                  </span>
                  <span>10:24 AM</span>
                </div>

                {/* Main Large Speed Readout */}
                <div className="text-center py-2">
                  <div className="text-3xl font-black font-mono tracking-tight text-white">{currentSpeed.toFixed(0)}</div>
                  <div className="text-[9px] font-mono text-slate-400">km/h</div>
                </div>

                {/* Primary Alert Card */}
                <div className="bg-slate-900/90 rounded-xl p-2 border border-red-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-7 rounded bg-black flex flex-col items-center justify-between p-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-red-400 block leading-none">Red Signal</span>
                        <span className="text-xs font-mono font-black text-white">{distanceToEvent} m</span>
                        <span className="text-[8px] font-mono text-slate-400 block">{timeRemaining} sec</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-0.5 px-1 bg-red-600 rounded text-center text-[9px] font-bold">
                    Prepare to Stop
                  </div>
                </div>

                {/* Upcoming Advisory */}
                <div className="mt-2 bg-slate-900/60 rounded-lg p-1.5 border border-slate-800 flex items-center gap-2 text-[9px]">
                  <span className="text-amber-400">⚠️</span>
                  <div>
                    <span className="text-slate-400 text-[8px] block">Next</span>
                    <span className="font-bold text-slate-200">Speed Breaker 250 m</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Detailed Inspection Event Details Card */}
            <EventDetailsCard
              vehicle={vehicle}
              signal={activeSignal}
            />

          </div>

        </div>

      </div>

      {/* Bottom Row: 3 Linked Vehicle Automation Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Module 1: Vehicle Behavior Flow Storyboard (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <VehicleBehaviorFlow vehicle={vehicle} />
        </div>

        {/* Module 2: Vehicle State Machine (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <VehicleStateMachineFlow vehicle={vehicle} />
        </div>

        {/* Module 3: Live Event Timeline (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <LiveEventTimeline vehicle={vehicle} />
        </div>

      </div>

    </div>
  );
};
