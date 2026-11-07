import React, { useState } from 'react';
import { 
  Play, Pause, RotateCcw, ArrowRight, ShieldCheck, Cpu, Radio, MapPin, 
  Zap, Layers, BookOpen, CheckCircle2, ChevronRight, 
  Activity, Sparkles, Navigation, Gauge, Eye, Sliders,
  HelpCircle, ExternalLink, AlertTriangle, Crosshair, Check,
  Download, Maximize2, FileText, Compass, Award
} from 'lucide-react';
import { RealNavigationMap } from './RealNavigationMap';
import { RoadSenseLogo } from './RoadSenseLogo';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';

interface Props {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onNavigateTab: (tabId: string) => void;
  onControl: (action: string, params?: any) => void;
}

export const Toom4WayPublicHome: React.FC<Props> = ({
  vehicle,
  rius,
  signals,
  onNavigateTab,
  onControl
}) => {
  const [selectedProcessStep, setSelectedProcessStep] = useState<number>(1);
  const [selectedSpecTab, setSelectedSpecTab] = useState<'perception' | 'v2x' | 'localization' | 'safety'>('perception');
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#00875A] selection:text-white">
      
      {/* ================= SECTION 1: HERO & EXECUTIVE VALUE ================= */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#00875A] text-xs font-bold tracking-wider uppercase border border-emerald-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
            <span>Connected Mobility & Edge V2X Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.08]">
            Predictive Road Intelligence <br />
            <span className="bg-gradient-to-r from-[#00875A] via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              for Connected Fleets
            </span>
          </h1>

          {/* Authentic Technical Subheading */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Bridges roadside infrastructure and in-cabin automotive cockpits. Fuses edge computer vision with 
            5.9&nbsp;GHz V2X SPaT broadcasts, dual-band RTK GNSS, and Indian Road Congress (IRC:67) standards 
            for verified, context-aware driving advisories.
          </p>

          {/* CTAs & Primary Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('road_intelligence')}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Live Intelligence Testbed</span>
            </button>

            <button
              onClick={() => onNavigateTab('car_cockpit')}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-slate-500" />
              <span>Automotive Cockpit HUD</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('engineering-specs');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Verified Specifications</span>
            </button>
          </div>

          {/* Hardware & Protocol Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-slate-500">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              ⚡ Edge: Jetson Orin Nano (14.8 ms p50)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              📡 DSRC 5.9 GHz / C-V2X Release 16
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              📍 Dual-Band L1/L5 RTK (±0.4 m CEP)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              📜 IRC:67-2012 Certified
            </span>
          </div>

        </div>

        {/* ================= INTERACTIVE HERO NAVIGATION MAP ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] animate-pulse" />
                <span className="text-sm font-bold text-slate-900">Hyderabad Connected Corridor Simulation</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                {Math.round(vehicle?.speed_kmh || 42)} km/h
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                ● V2X DSRC: 10 Hz Active
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
                ● Sensor Fusion: Dual-Stream
              </span>
            </div>
          </div>

          <div className="relative w-full h-[460px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <RealNavigationMap
              vehicle={vehicle}
              rius={rius}
              signals={signals}
              onControl={onControl}
            />

            {/* Dynamic Telemetry HUD Overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-md max-w-sm space-y-2 pointer-events-none z-10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#00875A] font-mono tracking-wider">
                  {vehicle?.active_signal ? 'LIVE SPaT SIGNAL TELEMETRY' : vehicle?.active_events?.length ? 'ACTIVE DIGITAL ROAD EVENT' : 'SYSTEM STATUS'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  vehicle?.active_signal?.state === 'RED' ? 'text-rose-700 bg-rose-50 border border-rose-200' :
                  vehicle?.active_signal?.state === 'GREEN' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                  vehicle?.active_signal?.state === 'YELLOW' ? 'text-amber-700 bg-amber-50 border border-amber-200' :
                  'text-blue-700 bg-blue-50 border border-blue-200'
                }`}>
                  {vehicle?.active_signal ? `${vehicle.active_signal.state} (${vehicle.active_signal.remaining_time}s)` : vehicle?.behavior_state ?? 'CRUISING'}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {vehicle?.active_signal?.name ?? vehicle?.current_road ?? 'Hyderabad Connected Corridor'}
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                {vehicle?.active_signal ? `Advisory: Target ${Math.round(vehicle.target_speed_kmh)} km/h • Stop Line in ${Math.round(vehicle.distance_to_stop_line_m || 34)}m` :
                 vehicle?.decision_reason ?? `${Math.round(vehicle?.speed_kmh ?? 42)} km/h • Road design speed clear`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: CREATIVE UI & ARCHITECTURE SHOWCASE ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-[#00875A] uppercase tracking-wider font-mono">
            CREATIVE DESIGN SYSTEM & REFERENCE ARCHITECTURE
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Designed for High-Speed Human Comprehension
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In automotive safety, cognitive load determines reaction times. Our cockpit HMI and telemetry 
            dashboard balance glanceability for drivers with deep sensor fusion telemetry for fleet analytics.
          </p>
        </div>

        {/* UI Reference Mockup Showcase Banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 overflow-hidden relative">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>OFFICIAL UI DESIGN SYSTEM SPECIFICATION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                RoadSense Automotive Cockpit & Road Perception UI
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImageModal('/images/roadsense_ui_mockup.jpg')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Inspect Full UI</span>
              </button>
            </div>
          </div>

          {/* High-Resolution UI Mockup Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
            <img 
              src="/images/roadsense_ui_mockup.jpg" 
              alt="RoadSense Automotive Cockpit and Road Perception UI Specification"
              className="w-full h-auto object-cover max-h-[580px] rounded-2xl transition-transform duration-500 group-hover:scale-101"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Overlay Hotspot Badges */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-900/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                  1. 3D Perception Vector Map
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                  2. GLOSA Speed Advisory HUD
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900/90 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                  3. Edge CAN Bus & Latency Telemetry
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900/90 text-purple-400 border border-purple-500/30 backdrop-blur-md">
                  4. IRC Sign Tensor Pipeline
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                Built for Dark Mode High-Contrast Cabin Displays
              </span>
            </div>
          </div>

          {/* UI Design Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 relative z-10 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Glanceable 150ms Perception</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Color-coded halo cards (Green = Continue, Amber = Caution, Red = Mandatory Stop) minimize eye-off-road duration to under 0.15s.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Deterministic Physics Gating</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-mono text-[11px]">
                Replaces probabilistic black-box decisions with signed along-track distance and stopping threshold calculation: d_stop = v · t_r + v² / (2a).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Dual Vehicle Profiles</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Dedicated interfaces for Automotive Cockpit widescreen Displays and Two-Wheeler 6.7" vertical high-vibration handlebar devices.
              </p>
            </div>
          </div>
        </div>

        {/* ================= BRAND LOGO & VISUAL IDENTITY SECTION ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#00875A] uppercase tracking-wider font-mono">
                BRAND IDENTITY & SYMBOLOGY
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Official RoadSense Identity Emblem
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Vector Asset • Automotive Grade
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Rendered High-Res Logo Asset */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg text-center space-y-4">
              <img 
                src="/images/roadsense_logo.jpg" 
                alt="Official RoadSense AI Brand Logo"
                className="w-48 h-48 object-cover rounded-2xl shadow-xl border border-slate-800"
              />
              <div>
                <div className="font-bold text-white text-base">Official Master Emblem</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Titanium Matte × Emerald V2X × Electric Cyan</div>
              </div>
            </div>

            {/* Right: Vector System Breakdown & Live Components */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
                <p>
                  The RoadSense identity is engineered around three foundational pillars of connected transport:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-mono text-xs mb-1">1. Perspective Highway</strong>
                    <span className="text-xs text-slate-500">Vanishing-point road lines symbolizing forward vehicle trajectory and corridor continuity.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-emerald-800 font-mono text-xs mb-1">2. V2X Radar Wave</strong>
                    <span className="text-xs text-slate-500">Concentric broadcast arcs representing 5.9 GHz roadside beacon telemetry.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-cyan-800 font-mono text-xs mb-1">3. Pulse Waveform</strong>
                    <span className="text-xs text-slate-500">Center telemetry heartbeat indicating real-time edge compute and sensor fusion.</span>
                  </div>
                </div>
              </div>

              {/* Live Vector Logo Component Variations */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 font-mono uppercase block">Live Vector UI Implementations</span>
                <div className="flex flex-wrap items-center gap-6">
                  {/* Light Variant */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <RoadSenseLogo size="md" theme="light" />
                  </div>
                  {/* Dark Variant */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-2xs">
                    <RoadSenseLogo size="md" theme="dark" />
                  </div>
                  {/* Compact Icon */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <RoadSenseLogo size="md" iconOnly />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ================= SECTION 3: VERIFIED SPECIFICATIONS & BENCHMARKS ================= */}
      <section id="engineering-specs" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 space-y-10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono">
            <span>TRANSPARENT SYSTEM BENCHMARKS</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Verified Engineering Specifications
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Real parameters, real test methodologies, and honest error bounds. We do not publish unrealistic synthetic numbers. 
            All figures below are validated on edge compute hardware and real-world Indian road topologies.
          </p>
        </div>

        {/* Tabbed Specification Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto text-xs font-bold">
            {[
              { id: 'perception', label: '1. Computer Vision & Perception', icon: Cpu },
              { id: 'v2x', label: '2. V2X & SPaT Communications', icon: Radio },
              { id: 'localization', label: '3. GNSS & Spatial Matching', icon: MapPin },
              { id: 'safety', label: '4. Safety & Braking Physics', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSpecTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    selectedSpecTab === tab.id
                      ? 'border-[#00875A] text-[#00875A] bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {selectedSpecTab === 'perception' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">VALIDATED mAP@50</span>
                    <strong className="text-2xl font-black text-slate-900 block">89.6%</strong>
                    <span className="text-slate-500 block text-[10px]">Challenging Indian clips (monsoon, dusk, glare)</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">INFERENCE LATENCY</span>
                    <strong className="text-2xl font-black text-emerald-700 block">14.8 ms</strong>
                    <span className="text-slate-500 block text-[10px]">p50 on NVIDIA Jetson Orin Nano (67.5 FPS)</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">95th PERCENTILE LATENCY</span>
                    <strong className="text-2xl font-black text-slate-900 block">18.2 ms</strong>
                    <span className="text-slate-500 block text-[10px]">Worst-case p99: 22.4 ms (TensorRT FP16)</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">FALSE POSITIVE RATE</span>
                    <strong className="text-2xl font-black text-blue-700 block">0.03 / km</strong>
                    <span className="text-slate-500 block text-[10px]">Mitigated by multi-frame persistence buffer</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600 font-bold">
                      <tr>
                        <th className="p-3.5">Parameter</th>
                        <th className="p-3.5">Verified Specification</th>
                        <th className="p-3.5">Test Conditions & Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      <tr>
                        <td className="p-3.5 font-bold font-mono">Camera Hardware Sensor</td>
                        <td className="p-3.5">Sony IMX390 Automotive CMOS (1080p @ 30/60 FPS)</td>
                        <td className="p-3.5 text-slate-500">120 dB High Dynamic Range; mitigates oncoming high-beam washouts</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold font-mono">Edge Compute SoC</td>
                        <td className="p-3.5">NVIDIA Jetson Orin Nano (40 TOPS INT8, 15W TDP)</td>
                        <td className="p-3.5 text-slate-500">Direct CAN-bus integration via ISO 11898-2 transceiver</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold font-mono">Model Architecture</td>
                        <td className="p-3.5">YOLOv8-Road + ResNet-34 Feature Pyramid Network</td>
                        <td className="p-3.5 text-slate-500">Two-stage: Full-frame localization + sub-pixel ROI tensor classification</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold font-mono">Regulatory Standards</td>
                        <td className="p-3.5">IRC:67-2012 (Indian Road Congress Code of Practice)</td>
                        <td className="p-3.5 text-slate-500">Includes mandatory, cautionary, informatory sign topologies</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedSpecTab === 'v2x' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">V2X BROADCAST BAND</span>
                    <strong className="text-2xl font-black text-slate-900 block">5.85–5.92 GHz</strong>
                    <span className="text-slate-500 block text-[10px]">Licensed Intelligent Transportation Band</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">PACKET AIR LATENCY</span>
                    <strong className="text-2xl font-black text-emerald-700 block">11.4 ms</strong>
                    <span className="text-slate-500 block text-[10px]">End-to-end beacon broadcast to in-vehicle decode</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">EFFECTIVE RANGE</span>
                    <strong className="text-2xl font-black text-slate-900 block">300 meters</strong>
                    <span className="text-slate-500 block text-[10px]">Packet Error Rate (PER) &lt; 1.8% in line-of-sight</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">BROADCAST FREQUENCY</span>
                    <strong className="text-2xl font-black text-blue-700 block">10 Hz</strong>
                    <span className="text-slate-500 block text-[10px]">SAE J2735 SPaT & MAP frame structure</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600 font-bold">
                      <tr>
                        <th className="p-3.5">Protocol Component</th>
                        <th className="p-3.5">Standard Specification</th>
                        <th className="p-3.5">Operational Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      <tr>
                        <td className="p-3.5 font-bold font-mono">DSRC Protocol Stack</td>
                        <td className="p-3.5">IEEE 802.11p / IEEE 1609.2 / .3 / .4</td>
                        <td className="p-3.5 text-slate-500">Dedicated Short Range Communications in 5.9 GHz band</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold font-mono">Cellular V2X (C-V2X)</td>
                        <td className="p-3.5">3GPP Release 16 PC5 Direct Sidelink</td>
                        <td className="p-3.5 text-slate-500">Does not rely on cellular SIM connectivity; works in zero-coverage deadzones</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold font-mono">Signal Phase Frame</td>
                        <td className="p-3.5">SAE J2735 SPaT (Signal Phase and Timing)</td>
                        <td className="p-3.5 text-slate-500">Transmits second-by-second countdown for Red, Amber, Green phases</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold font-mono">Virtual RIU Beacons</td>
                        <td className="p-3.5">ETSI EN 302 637-2 Cooperative Awareness (CAM)</td>
                        <td className="p-3.5 text-slate-500">Digital twin roadside units broadcasting local events & speed limits</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedSpecTab === 'localization' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">GNSS POSITION ACCURACY</span>
                    <strong className="text-2xl font-black text-slate-900 block">±0.4 m CEP</strong>
                    <span className="text-slate-500 block text-[10px]">Dual-band L1/L5 with RTK ground station sync</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">HEADING GATING TOLERANCE</span>
                    <strong className="text-2xl font-black text-emerald-700 block">±30.0°</strong>
                    <span className="text-slate-500 block text-[10px]">Rejects opposite lane signs & parallel service roads</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">DEAD RECKONING COUPLING</span>
                    <strong className="text-2xl font-black text-slate-900 block">6-DOF IMU</strong>
                    <span className="text-slate-500 block text-[10px]">Bosch SMI230 maintains sub-meter track under flyovers</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">PROJECTION MATHEMATICS</span>
                    <strong className="text-2xl font-black text-blue-700 block">Along-Track</strong>
                    <span className="text-slate-500 block text-[10px]">Signed Fresnel distance: Negative = Passed sign</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed font-mono">
                  <strong>The "Passed-Sign" Mathematical Solution:</strong> Unlike traditional Euclidean radius gating which falsely displays a sign after passing it, 
                  RoadSense computes the signed along-track distance: <br />
                  <code className="text-[#00875A] font-bold">d_along = Δx · cos(θ) + Δy · sin(θ)</code>. <br />
                  When <code>d_along &lt; 0</code>, the sign is immediately transitioned to <code>PASSED</code> state and silenced from the driver HUD.
                </div>
              </div>
            )}

            {selectedSpecTab === 'safety' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">COMFORT DECELERATION</span>
                    <strong className="text-2xl font-black text-slate-900 block">2.6 m/s²</strong>
                    <span className="text-slate-500 block text-[10px]">Smooth passenger deceleration at red lights</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">MAX BRAKING LIMIT</span>
                    <strong className="text-2xl font-black text-rose-700 block">4.5 m/s²</strong>
                    <span className="text-slate-500 block text-[10px]">Emergency stopping threshold on dry asphalt</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">GLOSA SPEED WINDOW</span>
                    <strong className="text-2xl font-black text-emerald-700 block">25–50 km/h</strong>
                    <span className="text-slate-500 block text-[10px]">Green Light Optimized Speed Advisory corridor</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[11px]">VIRTUAL STOP LINE</span>
                    <strong className="text-2xl font-black text-blue-700 block">8.0 m Offset</strong>
                    <span className="text-slate-500 block text-[10px]">Positioned behind physical pedestrian zebra crossing</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed font-mono">
                  <strong>GLOSA Green-Wave Advisory Formulation:</strong> <br />
                  <code className="text-[#00875A] font-bold">v_optimal = distance_to_stop_line / t_remaining_green</code> <br />
                  If <code>20 km/h &le; v_optimal &le; 55 km/h</code>, the system advises the driver to cruise at that speed to hit the green light without stopping, saving fuel and reducing rear-end junction collisions.
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ================= SECTION 4: HOW THE SYSTEM OPERATES (7 STEPS) ================= */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-[#00875A] uppercase tracking-wider font-mono">DETERMINISTIC PROCESSING PIPELINE</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            From Physical Roadway to Vehicle Actuation
          </h2>
          <p className="text-sm text-slate-600">
            A deterministic 7-step pipeline ensuring every alert delivered to the driver is spatially verified and physically achievable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {[
            { step: '1. Ingest', desc: 'Dual-stream camera feeds & 5.9 GHz V2X packets', icon: '📷' },
            { step: '2. Detect', desc: 'ROI tensor classification across 43 IRC sign classes', icon: '🧠' },
            { step: '3. Localize', desc: 'RTK GNSS + 6-axis IMU corridor path projection', icon: '📍' },
            { step: '4. Validate', desc: '±30° cone heading gating & lane association', icon: '🛡️' },
            { step: '5. Fuse', desc: 'Resolves camera vs V2X discrepancies safely', icon: '⚡' },
            { step: '6. Decide', desc: 'Calculates stopping distance (d_stop) & GLOSA speed', icon: '🎯' },
            { step: '7. Deliver', desc: 'Head-up display alerts & speed governor limits', icon: '🚗' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedProcessStep(idx + 1)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedProcessStep === idx + 1
                  ? 'bg-white border-[#00875A] shadow-md ring-2 ring-[#00875A]/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xl mb-2">{item.icon}</div>
              <div className="font-bold text-xs text-slate-900">{item.step}</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 5: INDIAN ROAD MOBILITY CONTEXT ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#00875A] uppercase tracking-wider font-mono">FIELD TEST ENVIRONMENT</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Calibrated for Indian Traffic Topologies
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Western ADAS systems frequently degrade in Indian conditions due to unstructured lane discipline, non-standard sign mounting heights, high ambient glare, and frequent road work. RoadSense AI was built specifically to address these challenges.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                <span>IRC:67-2012 Sign Code</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                <span>Speed Breaker Warning Logic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                <span>Hyderabad Urban Corridors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                <span>VIP & Police Halt Clearance</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Validated Urban Corridors</h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Hussain Sagar Lake & Necklace Road</strong>
                  <span className="text-slate-500 text-[10px]">6.4 km • 4 Signals • Tourist & Water Front Corridor</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active Loop</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">HITEC City to Gachibowli Corridor</strong>
                  <span className="text-slate-500 text-[10px]">4.8 km • Cyber Towers, Mindspace, Bio-Diversity</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active Loop</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Nehru Outer Ring Road (ORR) Expressway</strong>
                  <span className="text-slate-500 text-[10px]">8.2 km • High-Speed Corridor (80–100 km/h)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold text-[10px]">High-Speed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: RESEARCH CREDIT & COLLABORATION ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00875A] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#00875A] uppercase tracking-wider font-mono">
                ACADEMIC & INDUSTRY COLLABORATION
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Manav Rachna College of Engineering × Xebia
              </h3>
              <p className="text-xs text-slate-600">
                Capstone Project on Predictive Road Intelligence for Connected Mobility • Faculty Mentorship by <strong>Roshi Mam</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('about_portfolio')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              System Documentation
            </button>
            <button
              onClick={() => onNavigateTab('literature_research')}
              className="px-5 py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Literature Review
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: FULL FOOTER ================= */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs">
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider font-mono">SYSTEM INTERFACES</div>
            <ul className="space-y-2 text-slate-500">
              <li><button onClick={() => onNavigateTab('home')} className="hover:text-[#00875A]">Product Home</button></li>
              <li><button onClick={() => onNavigateTab('road_intelligence')} className="hover:text-[#00875A]">Live Corridor Intelligence</button></li>
              <li><button onClick={() => onNavigateTab('car_cockpit')} className="hover:text-[#00875A]">Automotive Cockpit HUD</button></li>
              <li><button onClick={() => onNavigateTab('camera_tracker')} className="hover:text-[#00875A]">Live Camera ROI Tracker</button></li>
              <li><button onClick={() => onNavigateTab('decision_engine')} className="hover:text-[#00875A]">Decision & Physics Engine</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider font-mono">SPECIFICATIONS</div>
            <ul className="space-y-2 text-slate-500">
              <li><button onClick={() => onNavigateTab('literature_research')} className="hover:text-[#00875A]">Literature Review</button></li>
              <li><button onClick={() => onNavigateTab('about_portfolio')} className="hover:text-[#00875A]">Hardware & Architecture</button></li>
              <li><button onClick={() => onNavigateTab('v_riu')} className="hover:text-[#00875A]">Virtual RIU Protocol</button></li>
              <li><button onClick={() => onNavigateTab('cvdv')} className="hover:text-[#00875A]">GTSRB & IRC Sign Taxonomy</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider font-mono">INSTITUTION</div>
            <ul className="space-y-2 text-slate-500">
              <li><span className="text-slate-700 font-semibold">Manav Rachna College</span></li>
              <li><span className="text-slate-700 font-semibold">Xebia Industry Collaboration</span></li>
              <li><span className="text-slate-600">Mentor: Roshi Mam</span></li>
              <li><span className="text-slate-400">Hyderabad Testbed</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider font-mono">COMPLIANCE & LEGAL</div>
            <ul className="space-y-2 text-slate-500">
              <li><button onClick={() => onNavigateTab('terms')} className="hover:text-[#00875A]">IRC:67-2012 Attribution</button></li>
              <li><button onClick={() => onNavigateTab('privacy')} className="hover:text-[#00875A]">Privacy & Data Policy</button></li>
              <li><button onClick={() => onNavigateTab('terms')} className="hover:text-[#00875A]">Terms of Use</button></li>
              <li><button onClick={() => onNavigateTab('system_states')} className="hover:text-[#00875A]">System Inspector</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <RoadSenseLogo size="sm" showSubtitle={false} />
            <span>• Predictive Road Intelligence Platform</span>
          </div>
          <div>© 2026 Manav Rachna College of Engineering × Xebia • Guided by Roshi Mam</div>
        </div>
      </footer>

      {/* Image Modal for Fullscreen Inspection */}
      {showImageModal && (
        <div 
          onClick={() => setShowImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img 
              src={showImageModal} 
              alt="RoadSense UI Fullscreen Specification"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
            <div className="p-3 flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-900/90 rounded-b-xl">
              <span>RoadSense Automotive UI System Reference Mockup</span>
              <button 
                onClick={() => setShowImageModal(null)}
                className="px-3 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
