import React from 'react';
import { 
  Camera, Radio, MapPin, Brain, Car, Gauge, 
  ArrowRight, ShieldCheck, Cpu, Smartphone 
} from 'lucide-react';

export const ArchitecturePipelineBar: React.FC = () => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs py-2.5 px-4 lg:px-8 overflow-x-auto select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-[980px]">
        
        {/* Step 1: Real World Sign/Signal */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-red-600 flex items-center justify-center font-black text-[9px] text-slate-900 shadow-2xs">
              40
            </div>
            <div className="w-4 h-7 rounded bg-slate-900 flex flex-col items-center justify-between p-0.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-amber-500/30" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/30" />
            </div>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-800 block leading-tight">Traffic Sign / Signal</span>
            <span className="text-[9px] text-slate-400 font-mono">(Real World)</span>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* Step 2: Computer Vision Model */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-800">Computer Vision</span>
              <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">PyTorch CNN</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">43 Classes • 99.4% Val</span>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* Step 3: Digital Road Event (Virtual RIU) */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Radio className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-800 block leading-tight">Digital Road Event</span>
            <span className="text-[9px] text-emerald-600 font-mono font-semibold">Virtual RIU (Simulated)</span>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* Step 4: Map + GPS + Heading */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-800 block leading-tight">Map + GPS + Heading</span>
            <span className="text-[9px] text-slate-400 font-mono">±30° Heading Gate</span>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* Step 5: Event Fusion & Decision Engine */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Brain className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-800 block leading-tight">Event Fusion & Decision</span>
            <span className="text-[9px] text-purple-600 font-mono font-semibold">Rule & Priority Engine</span>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* Step 6: Vehicle Simulator */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Car className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-800 block leading-tight">Vehicle Simulator</span>
            <span className="text-[9px] text-amber-700 font-mono font-semibold">Stop Line • Physics Kinematics</span>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* Step 7: Driver Interfaces */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="flex items-center gap-1 text-slate-700">
            <Gauge className="w-4 h-4 text-slate-800" />
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-800 block leading-tight">Driver Interfaces</span>
            <span className="text-[9px] text-slate-400 font-mono">Car HMI • Bike 6.7" Display</span>
          </div>
        </div>

      </div>
    </div>
  );
};
