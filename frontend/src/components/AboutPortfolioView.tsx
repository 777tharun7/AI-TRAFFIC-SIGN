import React from 'react';
import { 
  Cpu, Database, Radio, MapPin, Brain, Car, Gauge, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Activity,
  Layers, Terminal, FileCode2, ExternalLink, Workflow
} from 'lucide-react';

export const AboutPortfolioView: React.FC = () => {
  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>RoadSense AI • System Architecture & Technical Specifications</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Predictive Road Intelligence Platform Architecture
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          RoadSense AI is an autonomous connected mobility platform that fuses Computer Vision (PyTorch CNN), 
          Virtual Roadside Intelligence Units (V-RIUs), and deterministic traffic rule kinematics to deliver 
          predictive road awareness and autonomous vehicle control without physical hardware constraints.
        </p>

        {/* Project Master Deck / Canva PPT Callout */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-500/30 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Official Project Deck & PPT</span>
            </div>
            <h3 className="text-base font-bold text-white">Full RoadSense AI Project Presentation</h3>
            <p className="text-xs text-slate-300">Complete explanation of project motivation, architecture pipeline, model accuracies, and future roadmap.</p>
          </div>
          <a
            href="https://canva.link/f4unp9d63d98kzb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>Open Canva PPT Deck</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>
      </div>

      {/* 1. MASTER 7-STAGE END-TO-END PIPELINE ARCHITECTURE (Matches Official Diagram) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
              <Workflow className="w-3.5 h-3.5" />
              <span>Complete System Data Flow</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              RoadSense AI Architecture & Perception Pipeline
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Offline ML → Real-Time Dual Perception → Physics Rules → Vehicle HMI
          </span>
        </div>

        {/* 7-Step Vertical Master Flow */}
        <div className="space-y-4">
          
          {/* STEP 1: GTSRB DATASET */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border-2 border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                1
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">GTSRB Dataset</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase">
                    Offline – Training Only
                  </span>
                </div>
                {/* Traffic Sign Icons Badges */}
                <div className="flex items-center gap-2 pt-1.5">
                  <span className="w-7 h-7 rounded-full bg-white border-2 border-red-600 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-xs">50</span>
                  <span className="w-7 h-7 rounded bg-white border-2 border-red-600 flex items-center justify-center text-xs shadow-xs">🚸</span>
                  <span className="w-7 h-7 rounded-full bg-blue-600 border border-white flex items-center justify-center text-white text-xs font-black shadow-xs">➔</span>
                  <span className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs">STOP</span>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-700 space-y-1 max-w-md">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>German Traffic Sign Recognition Benchmark (GTSRB)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span><strong>43 traffic-sign classes</strong> &amp; 50,000+ real-world images</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>Different lighting, size, angle, and viewpoint conditions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>Used for offline training, stratified validation &amp; test evaluation</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center -my-2 text-blue-400">
            <ArrowRight className="w-5 h-5 rotate-90 stroke-[3]" />
          </div>

          {/* STEP 2: MODEL TRAINING */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                2
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Model Training</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                    Offline Multi-Architecture
                  </span>
                </div>
                
                {/* 3 Pipeline stages inside Step 2 */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-white border border-emerald-200 text-slate-800">
                    <span className="font-bold block text-emerald-700 text-[10px]">Preprocessing</span>
                    <span>Resize • Norm • Augment</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="p-2 rounded-xl bg-white border border-emerald-200 text-slate-800">
                    <span className="font-bold block text-emerald-700 text-[10px]">Deep Architectures</span>
                    <span>CNN • ResNet • Mobile • Efficient</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="p-2 rounded-xl bg-white border border-emerald-200 text-slate-800">
                    <span className="font-bold block text-emerald-700 text-[10px]">Evaluation</span>
                    <span>F1 • Loss • Accuracy</span>
                  </div>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-700 space-y-1 max-w-md">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Multi-architecture training on 43 distinct traffic-sign classes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Cosine Annealing LR scheduling &amp; early stopping on macro-F1</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Model comparison benchmark &amp; automated best-model selection</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center -my-2 text-emerald-400">
            <ArrowRight className="w-5 h-5 rotate-90 stroke-[3]" />
          </div>

          {/* STEP 3: TRAINED MODEL */}
          <div className="p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                3
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Trained Model</h3>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase">
                    Ready for Real-Time Inference
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 font-mono text-xs text-slate-600">
                  <Brain className="w-4 h-4 text-amber-600" />
                  <span>models/traffic_sign_v1.pt • PyTorch Backbone</span>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-700 space-y-1 max-w-md">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>Best performing model deployed for edge/in-vehicle inference</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>Classifies traffic signs into 43 classes with normalized softmax</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>Outputs predicted class, bounding box confidence score &amp; priority</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center -my-2 text-amber-400">
            <ArrowRight className="w-5 h-5 rotate-90 stroke-[3]" />
          </div>

          {/* STEP 4: LIVE CAMERA / V2X INPUT */}
          <div className="p-6 rounded-2xl bg-rose-50/70 border-2 border-rose-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                4
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Live Camera / V2X Input</h3>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-mono font-bold uppercase">
                    Real-Time Perception Dual Streams
                  </span>
                </div>

                {/* Two Parallel Inputs (Camera vs V2X) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span className="text-sm">📹</span>
                      <span>Camera / Live Video Feed</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Continuous stream → full-frame sign/signal detection → crop ROI → 43-class classifier.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span className="text-sm">📡</span>
                      <span>V2X / SPaT Infrastructure Input</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Signal state (Red/Yellow/Green), remaining seconds, intersection telemetry from controller.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-700 space-y-1 max-w-sm shrink-0">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>Separates object localization from classification</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>Supports Camera Mode, V2X Mode, and Fused Mode</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>Simulated V2X explicitly labeled for transparency</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center -my-2 text-rose-400">
            <ArrowRight className="w-5 h-5 rotate-90 stroke-[3]" />
          </div>

          {/* STEP 5: CONTEXT VALIDATION */}
          <div className="p-6 rounded-2xl bg-purple-50/70 border-2 border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                5
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Context Validation</h3>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-mono font-bold uppercase">
                    Sensor Fusion &amp; Geospatial Gate
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 font-mono text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>GPS Coordinates • Heading Vector (±35° Gate) • Road Segment Match</span>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-700 space-y-1 max-w-md">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                <span>Fuses camera detections and V2X telemetry stream</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                <span>Discards opposite lane signs traveling away from vehicle</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                <span>Resolves sensor conflicts with safety-conservative arbitration</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center -my-2 text-purple-400">
            <ArrowRight className="w-5 h-5 rotate-90 stroke-[3]" />
          </div>

          {/* STEP 6: DECISION ENGINE (MAIN / CORE) */}
          <div className="p-6 rounded-2xl bg-indigo-50/80 border-3 border-indigo-500 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative shadow-md ring-2 ring-indigo-500/20">
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
              ★ Step 6 — Core Intellectual Brain
            </span>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                6
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Decision Engine</h3>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold uppercase">
                    Traffic Rules &amp; Physics Kinematics
                  </span>
                </div>
                <div className="font-mono text-[11px] text-indigo-900 bg-white/90 p-2 rounded-xl border border-indigo-200 space-y-0.5">
                  <div className="font-bold">d_stop = v·t_reaction + (v² / 2a_comfort)</div>
                  <div className="text-slate-600">GLOSA Advisory: v_advisory = d_junction / t_remaining</div>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-700 space-y-1 max-w-md">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                <span>Identifies current signal/sign and calculates junction distance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                <span>Evaluates SPaT timing &amp; Yellow signal dilemma zone</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                <span>Determines required vehicle actuation: Decelerate, Stop, or Proceed</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                <span>Priority arbitration: Critical Red overrides lower-priority alerts</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center -my-2 text-indigo-400">
            <ArrowRight className="w-5 h-5 rotate-90 stroke-[3]" />
          </div>

          {/* STEP 7: VEHICLE HMI / OUTPUT */}
          <div className="p-6 rounded-2xl bg-teal-50/70 border-2 border-teal-200 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                7
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">Vehicle HMI / Output</h3>
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-mono font-bold uppercase">
                    Real-Time Alerts &amp; Actuation
                  </span>
                </div>

                {/* Windshield HMI mockup badge matching diagram */}
                <div className="p-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 font-mono text-[10px] flex items-center gap-3 shadow-inner">
                  <div className="w-2.5 h-6 rounded bg-black flex flex-col items-center justify-between p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                  </div>
                  <div>
                    <span className="text-red-400 font-bold block text-xs leading-none">RED SIGNAL • 18 sec</span>
                    <span className="text-slate-400 text-[9px]">⚠️ 85 m AHEAD</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px] ml-2">STOP</span>
                  </div>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-700 space-y-1 max-w-md">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                <span>Displays detected sign/signal on glanceable Car Cockpit &amp; Bike HUD</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                <span>Shows distance to stop line, remaining time countdown &amp; speed dial</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                <span>Provides driver alerts (STOP / SLOW / PROCEED) &amp; controls braking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                <span>Brings vehicle to complete halt at RED and automatically resumes on GREEN</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 2. DEEP TECH STACK SPECIFICATIONS */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Technology Stack & Engineering Design</h2>
          <p className="text-xs text-slate-500">Core technologies, libraries, and frameworks powering the full stack</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tech 1: Frontend Ecosystem */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Frontend Presentation & Web Layer</h3>
                <span className="text-xs text-slate-400">React 18 • TypeScript • Tailwind CSS • Vite</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span><strong>MapLibre GL JS:</strong> 2D & 3D geospatial vector map rendering, GeoJSON route layers.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span><strong>Tailwind CSS & Vanilla CSS:</strong> Curated automotive HMI design system and glassmorphism.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span><strong>Recharts:</strong> AI training loss and validation accuracy charting.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span><strong>Lucide React Icons:</strong> Semantic mobility, navigation, and telemetry icons.</span>
              </li>
            </ul>
          </div>

          {/* Tech 2: Backend & Physics Simulation */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Backend API & Kinematics Engine</h3>
                <span className="text-xs text-slate-400">FastAPI • Python 3.9 • WebSockets • Pydantic v2</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>FastAPI & Uvicorn:</strong> High-throughput REST API with async request pipelines.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Native WebSockets:</strong> 2Hz telemetry and real-time state broadcast streaming.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Haversine Kinematics:</strong> Great-circle distances and bearing angle calculations.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>PyTest Suite:</strong> 15 automated unit & kinematic behavior verification tests.</span>
              </li>
            </ul>
          </div>

          {/* Tech 3: AI & Machine Learning */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Computer Vision & AI Inference</h3>
                <span className="text-xs text-slate-400">PyTorch • Torchvision • OpenCV • NumPy</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span><strong>PyTorch CNN Classifier:</strong> Deep convolutional network with Batch Normalization and Dropout.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span><strong>43 Classes Dataset:</strong> Trained on standard traffic sign categories with data augmentation.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span><strong>Sub-12ms Inference:</strong> Optimized forward pass with confidence thresholding and NMS.</span>
              </li>
            </ul>
          </div>

          {/* Tech 4: Geospatial & Digital Twin */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Geospatial Intelligence & V-RIU</h3>
                <span className="text-xs text-slate-400">GeoJSON • OpenStreetMap • Digital Twin Beacons</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span><strong>Hyderabad Connected Corridor:</strong> Real geospatial coordinates covering HITEC City to ORR.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span><strong>V-RIU Broadcast Radii:</strong> Dynamic activation, trigger, and validity distance geofencing.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span><strong>Stop Line Calculation:</strong> Geometrically offsets stop lines 8m before signal posts.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. VERIFICATION & QUALITY METRICS */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white">Quality Assurance & Automated Verification</h2>
            <p className="text-xs text-slate-400">Deterministic physics and state-machine validation suite</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            15/15 Tests Passing (100%)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Test Suite</span>
            <span className="text-white font-bold">pytest tests/test_roadsense.py</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Kinematic Rules</span>
            <span className="text-emerald-400 font-bold">Red, Yellow, Green, Stop, Police</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Code Build</span>
            <span className="text-blue-400 font-bold">TypeScript 0-Error Clean Build</span>
          </div>
        </div>
      </section>

    </div>
  );
};
