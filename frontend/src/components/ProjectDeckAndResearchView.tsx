import React from 'react';
import { 
  Presentation, ExternalLink, ShieldCheck, Sparkles, 
  Layers, Brain, Radio, Gauge, FileText, CheckCircle2, 
  ArrowRight, Download, Eye, Compass, Workflow, Play
} from 'lucide-react';

export const ProjectDeckAndResearchView: React.FC = () => {
  const canvaLink = "https://canva.link/f4unp9d63d98kzb";

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto font-sans">
      
      {/* 1. HERO BANNER: PROJECT DEFINITION & OFFICIAL CANVA PPT */}
      <section className="relative rounded-3xl bg-[#0B151C] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-8 lg:p-12 overflow-hidden border border-slate-800 shadow-2xl">
        {/* Glow Ambient */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md text-emerald-400 text-xs font-semibold">
            <Presentation className="w-4 h-4" />
            <span>Official Project Presentation & Master Deck</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            RoadSense AI: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
              Project Architecture & Master Flow Deck
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-2xl">
            This presentation covers the entire project lifecycle, architectural pipeline, problem formulation for Indian traffic conditions, 
            PyTorch CNN perception models, Virtual Roadside Units (V-RIUs), and vehicle behavior kinematics.
          </p>

          {/* Direct Action Link to Canva PPT */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={canvaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              <span>Open Project PPT (Canva Deck)</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            <a
              href={canvaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <span>View Slides Online</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          <div className="pt-2 text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Master Presentation Link:</span>
            <a 
              href={canvaLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 underline hover:text-emerald-300 truncate max-w-md"
            >
              {canvaLink}
            </a>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE ARE DOING (PROJECT OVERVIEW & CORE PROBLEM) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Summary</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            What is RoadSense AI Doing?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Transforming Indian road infrastructure, physical traffic signs, signals, and dynamic roadside events 
            into machine-readable road intelligence for autonomous driving and connected driver assistance systems (ADAS) — 
            without relying on costly roadside physical hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">Zero-Hardware Digital Twin</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Virtual Roadside Units (V-RIUs) broadcast speed limits, speed breakers, school zones, and emergency halts purely via software geofencing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">99.39% Optical Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              PyTorch CNN neural network trained on 43 traffic sign classes, delivering sub-12ms inference with confidence validation and multi-condition robustness.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">Kinematic Vehicle Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Physics rules engine calculating braking curves, 8m stop lines before traffic signals, mandatory 3-second stop signs, and green wave speed advisories.
            </p>
          </div>
        </div>
      </section>

      {/* 3. STRUCTURE OF FLOW (END-TO-END SYSTEM PIPELINE) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <Workflow className="w-3.5 h-3.5" />
            <span>End-to-End System Pipeline</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Structure of Flow: How the System Operates
          </h2>
          <p className="text-xs text-slate-500">Chronological flow from optical sign observation to vehicle actuation</p>
        </div>

        {/* Step-by-step Flow Diagram */}
        <div className="space-y-4">
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs shrink-0">
              Stage 1 • Perception
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Optical Sign Recognition (PyTorch CNN)</h4>
              <p className="text-xs text-slate-600">
                Front vehicle camera captures road imagery → CNN classifies sign class (e.g. Speed Limit 40, Stop, No Entry) with bounding box & confidence score.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs shrink-0">
              Stage 2 • Infrastructure
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Virtual Roadside Units (V-RIU Broadcast)</h4>
              <p className="text-xs text-slate-600">
                Digital twin micro-beacons broadcast geo-referenced road rules, signal phases (SPaT), speed bumps, and VIP convoy police halts.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs shrink-0">
              Stage 3 • Geospatial Filter
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Heading & Direction Gate</h4>
              <p className="text-xs text-slate-600">
                Calculates along-track distance and verifies vehicle bearing angle (±40° threshold) to discard events from opposite or cross lanes.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-mono font-bold text-xs shrink-0">
              Stage 4 • Decision Engine
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Traffic Rules & Priority Arbitration</h4>
              <p className="text-xs text-slate-600">
                Arbitrates between competing events (e.g. Red Signal &gt; Speed Limit &gt; Road Work) and determines vehicle target state (STOP, DECEL, RESUME).
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-mono font-bold text-xs shrink-0">
              Stage 5 • Kinematics & Physics
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Vehicle Behavior Controller</h4>
              <p className="text-xs text-slate-600">
                Smoothly executes deceleration curves, brings vehicle to complete rest 8m before the signal stop line, and automatically accelerates when green.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-mono font-bold text-xs shrink-0">
              Stage 6 • Driver Experience (HMI)
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Car Cockpit HUD & Bike Glanceable Display</h4>
              <p className="text-xs text-slate-600">
                Renders real-time telemetry, red signal countdown timers, upcoming road hazard timeline, and green wave speed bands.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PPT SLIDES BREAKDOWN & TOPICS INCLUDED */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Presentation Slide Deck Contents</h2>
            <p className="text-xs text-slate-400">Structured sections covered inside the master Canva presentation</p>
          </div>
          <a
            href={canvaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
          >
            <span>Launch Presentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Slides 1–4</span>
            <h4 className="text-sm font-bold text-white">Problem & Motivation</h4>
            <p className="text-xs text-slate-400">Indian traffic conditions, physical infrastructure bottlenecks, and connected vehicle challenges.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Slides 5–8</span>
            <h4 className="text-sm font-bold text-white">AI Vision & CNN Pipeline</h4>
            <p className="text-xs text-slate-400">43-class dataset, 99.39% validation accuracy, loss curves, confusion matrix, and degradation robustness.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Slides 9–12</span>
            <h4 className="text-sm font-bold text-white">Virtual RIU Architecture</h4>
            <p className="text-xs text-slate-400">Zero-hardware beacon simulation, geofencing radii, and SPaT traffic signal timing synchronization.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Slides 13–16</span>
            <h4 className="text-sm font-bold text-white">Kinematics & Cockpit HMI</h4>
            <p className="text-xs text-slate-400">Braking kinematics equations, 8m stop line physics, Car Cockpit HUD, and Bike 6.7" displays.</p>
          </div>
        </div>
      </section>

    </div>
  );
};
