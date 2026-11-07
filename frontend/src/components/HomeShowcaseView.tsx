import React from 'react';
import { 
  ShieldCheck, Cpu, Radio, MapPin, Gauge, Brain, 
  ArrowRight, Sparkles, CheckCircle2, Play, Activity, 
  Layers, Compass, Zap, BarChart3, Eye, Smartphone, Navigation
} from 'lucide-react';
import { VehicleState } from '../types';

interface Props {
  onNavigate: (tabId: string) => void;
  onStartDemo: () => void;
  vehicle: VehicleState | null;
}

export const HomeShowcaseView: React.FC<Props> = ({
  onNavigate,
  onStartDemo,
  vehicle
}) => {
  return (
    <div className="space-y-12 py-4">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl bg-[#0B151C] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-8 lg:p-14 overflow-hidden border border-slate-800 shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>RoadSense AI • Autonomous Connected Mobility & AI Perception</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Predictive Road Intelligence <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              For Connected Vehicles
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            A software-only autonomous driving intelligence platform fusing 
            <strong className="text-white font-semibold"> Computer Vision (PyTorch CNN)</strong>, 
            <strong className="text-white font-semibold"> Virtual Roadside Units (V-RIU)</strong>, 
            and <strong className="text-white font-semibold"> Rule-Based Vehicle Kinematics</strong> for zero-hardware road simulation.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('road_intelligence')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Launch Live Navigation Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('model_benchmarks')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Explore AI Models (99.39% Val)</span>
            </button>

            <button
              onClick={onStartDemo}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run Automated Demo</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10 text-slate-300">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white block">99.39%</span>
            <span className="text-xs text-slate-400 font-medium">Validation Accuracy (PyTorch)</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block">43</span>
            <span className="text-xs text-slate-400 font-medium">Traffic Sign Classes</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <span className="text-2xl sm:text-3xl font-black font-mono text-blue-400 block">&lt; 12 ms</span>
            <span className="text-xs text-slate-400 font-medium">Inference Latency</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-400 block">100%</span>
            <span className="text-xs text-slate-400 font-medium">Software Simulation Scope</span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MODULE CARDS (Portfolio Feature Grid) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Platform System Architecture</h2>
          <p className="text-sm text-slate-500">Explore the independent micro-modules powering the RoadSense AI platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: 2D/3D Navigation Map */}
          <div 
            onClick={() => onNavigate('road_intelligence')}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                Real Geospatial Navigation Map
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                2D Top-Down and 3D perspective vector map engine based on MapLibre GL. Real Hyderabad connected corridor road network, vehicle tracking, stop lines, and intersection traffic signals.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
              <span>Launch Navigation Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: AI Vision Models */}
          <div 
            onClick={() => onNavigate('model_benchmarks')}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                AI Models & Benchmarks (99.39%)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PyTorch CNN classifier trained on 43 traffic sign classes, achieving 99.39% validation accuracy with sub-12ms latency, confusion matrix analysis, and optical degradation robustness.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
              <span>View Accuracy & Weights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: CVDV Digital Twin */}
          <div 
            onClick={() => onNavigate('cvdv')}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                CVDV Digital Twin Studio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transforms optical camera video and imagery into structured, machine-actionable digital events with calibrated bounding boxes and priority arbitration.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
              <span>Open CVDV Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Virtual RIU Network */}
          <div 
            onClick={() => onNavigate('v_riu')}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                Virtual Roadside Units (V-RIU)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart digital beacons broadcasting road restrictions, speed limits, speed breakers, stop signs, and VIP Minister Convoy clearance protocols to connected vehicles.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
              <span>Inspect RIU Beacons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: In-Vehicle Cockpit HMIs */}
          <div 
            onClick={() => onNavigate('car_cockpit')}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200 group-hover:scale-110 transition-transform">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors">
                Car Cockpit & Bike 6.7" HMI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tactical automotive instrument cluster and glanceable motorcycle display providing lane guidance, green-wave speed bands, and stop line countdown alerts.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
              <span>View Driver Cockpits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: About & Architecture */}
          <div 
            onClick={() => onNavigate('about_portfolio')}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                Deep Tech Stack & Portfolio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive breakdown of the full-stack architecture, Python FastAPI backend, WebSockets, geospatial math, automated kinematics testing, and engineering highlights.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 pt-4 mt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
              <span>Read Tech Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. PLATFORM CAPABILITY ADVANTAGES */}
      <section className="rounded-3xl bg-slate-100/80 border border-slate-200/80 p-8 lg:p-10">
        <div className="max-w-3xl mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Key Technology Highlights</h2>
          <p className="text-xs text-slate-500 mt-1">Engineered to eliminate physical roadside hardware while maintaining complete ADAS fidelity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">100% Software-in-the-Loop</h4>
            <p className="leading-relaxed text-slate-500">
              Zero dependency on physical roadside units, Raspberry Pis, or custom vehicle microcontrollers. Complete simulation executed seamlessly in software.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Dual Vision & V-RIU Fusion</h4>
            <p className="leading-relaxed text-slate-500">
              When optical cameras degrade in heavy rain or glare, Virtual RIUs provide a deterministic fallback to ensure 100% safety critical compliance.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              🛑
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Sub-Meter Precision Stop Lines</h4>
            <p className="leading-relaxed text-slate-500">
              Kinematics calculate exact deceleration curves, holding vehicles stationary behind intersection stop lines until green signal release.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
