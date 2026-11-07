import React from 'react';
import { 
  CheckCircle2, ArrowRight, AlertTriangle, ShieldCheck, 
  Activity, Eye, Radio, Zap, Car, Sliders
} from 'lucide-react';
import { VehicleState } from '../types';

interface Props {
  vehicle?: VehicleState | null;
  speedKmh?: number;
  timeRemaining?: number;
}

export const LivePerceptionPipelineDeck: React.FC<Props> = ({
  vehicle,
  speedKmh = 42,
  timeRemaining = 15
}) => {
  const currentSpeed = vehicle ? Math.round(vehicle.speed_kmh) : speedKmh;

  return (
    <div className="w-full space-y-3 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* CARD 1: 1. Live Camera Input */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>1. Live Camera Input</span>
          </div>

          {/* Road Scene with Bounding Box Overlays */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex items-center justify-center">
            {/* Real Street View Perspective */}
            <img
              src="/images/hitec_corridor.jpg"
              alt="Live Camera Street View"
              className="w-full h-full object-cover object-center brightness-90"
              onError={(e) => {
                // Fallback clean canvas styling if image loading is delayed
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Simulated Bounding Box 1: Traffic Signal 0.96 (Red) */}
            <div className="absolute top-4 right-10 border-2 border-red-500 rounded bg-red-500/10 p-1 flex flex-col items-center">
              <span className="text-[8px] bg-red-600 text-white px-1 py-0.2 rounded font-mono font-bold">
                Traffic Signal 0.96
              </span>
              <div className="w-4 h-8 bg-black/90 rounded p-0.5 mt-0.5 flex flex-col items-center justify-between border border-slate-600">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>

            {/* Simulated Bounding Box 2: Speed Limit 0.94 (Blue) */}
            <div className="absolute bottom-4 left-6 border-2 border-blue-500 rounded bg-blue-500/10 p-1 flex items-center gap-1">
              <span className="text-[8px] bg-blue-600 text-white px-1 py-0.2 rounded font-mono font-bold">
                Speed Limit 0.94
              </span>
              <div className="w-6 h-6 rounded-full border-2 border-red-600 bg-white flex items-center justify-center font-bold text-[9px] text-black">
                50
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center">
            Camera feed (1280×720 @ 30 FPS)
          </div>
        </div>

        {/* CARD 2: 2. AI Detection & Recognition */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>2. AI Detection & Recognition</span>
          </div>

          <div className="space-y-2 flex-1 justify-center flex flex-col">
            {/* Item 1: Traffic Signal Red */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-6 h-8 bg-black rounded p-0.5 flex flex-col items-center justify-between shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">Traffic Signal (Red)</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '96.3%' }} />
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-red-600">96.3%</span>
            </div>

            {/* Item 2: Speed Limit 50 */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-6 h-6 rounded-full border-2 border-red-600 bg-white flex items-center justify-center font-bold text-[9px] text-slate-900 shrink-0">
                50
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">Speed Limit</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.1%' }} />
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600">94.1%</span>
            </div>

            {/* Item 3: Pedestrian Crossing */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-6 h-6 rounded bg-amber-100 border border-amber-300 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                🚶
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">Pedestrian Crossing</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '91.8%' }} />
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600">91.8%</span>
            </div>
          </div>
        </div>

        {/* CARD 3: 3. Context Validation */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>3. Context Validation</span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
            <div className="flex items-center justify-between">
              <span>GPS Location</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 12 m to intersection
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Heading</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Correct direction
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Road Segment</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Necklace Road
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Distance</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 80 m
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Event Direction</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Applicable
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>V2X / SPaT</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Signal match (Red)
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center flex items-center justify-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>Context Validated (Applicable)</span>
          </div>
        </div>

        {/* CARD 4: 4. Decision Engine */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>4. Decision Engine</span>
          </div>

          {/* Red Signal Highlight Box */}
          <div className="p-2.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center gap-2.5">
            <div className="w-7 h-12 bg-black rounded p-1 flex flex-col items-center justify-between shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-sm" />
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
            <div>
              <div className="text-xs font-black text-red-700 leading-tight">RED SIGNAL</div>
              <div className="text-[10px] text-slate-500 font-mono">80 m ahead</div>
              <div className="text-[10px] text-red-600 font-bold font-mono">Remaining: {timeRemaining} seconds</div>
            </div>
          </div>

          {/* Required Action Button */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Required Action</div>
            <div className="py-2 px-3 bg-red-600 text-white rounded-xl text-center text-xs font-black shadow-xs">
              🛑 Prepare to stop
            </div>
            <div className="text-[10px] text-slate-500 text-center font-mono">Decelerate smoothly</div>
          </div>

          {/* Speed Telemetry Strip */}
          <div className="grid grid-cols-3 text-center text-[10px] font-mono border-t border-slate-100 pt-2">
            <div>
              <span className="text-slate-400 block">Current</span>
              <strong className="text-slate-900">{currentSpeed} km/h</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Target</span>
              <strong className="text-red-600">0 km/h</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Stop Dist</span>
              <strong className="text-emerald-700">62 m (Safe)</strong>
            </div>
          </div>
        </div>

        {/* CARD 5: 5. Vehicle Response */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>5. Vehicle Response</span>
          </div>

          {/* 3D Road Deceleration Visualization */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex flex-col items-center justify-end pb-2">
            {/* Top Deceleration Pill */}
            <div className="absolute top-2.5 bg-red-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md animate-pulse">
              Decelerating: {currentSpeed} → 0 km/h
            </div>

            {/* Glowing Red Braking Corridor Trapezoid */}
            <div 
              className="absolute bottom-0 w-32 h-24 bg-gradient-to-t from-red-500/40 via-red-500/20 to-transparent border-b-2 border-red-500"
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }}
            />

            {/* Car Icon Representation */}
            <div className="relative z-10 w-12 h-14 bg-white/95 rounded-xl border border-slate-300 shadow-lg flex flex-col items-center justify-center">
              <Car className="w-7 h-7 text-slate-800" />
              <div className="flex gap-2 mt-0.5">
                <span className="w-1.5 h-1 bg-red-600 rounded-full animate-ping" />
                <span className="w-1.5 h-1 bg-red-600 rounded-full animate-ping" />
              </div>
            </div>

            {/* Stop Line Indicator */}
            <div className="absolute bottom-1 w-full flex items-center justify-center">
              <div className="w-24 h-1 bg-white shadow-md" />
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            Actuation: Brake Pressure 42% applied
          </div>
        </div>

      </div>
    </div>
  );
};
