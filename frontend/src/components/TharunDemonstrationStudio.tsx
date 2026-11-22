import React, { useState, useEffect } from 'react';
import { 
  Compass, Play, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, 
  Car, Eye, ShieldCheck, FileCheck, User, Zap, AlertTriangle, 
  MapPin, Clock, ExternalLink, HelpCircle, Activity, HeartPulse,
  Building, ShieldAlert, Award, FileText, Check, Sparkles
} from 'lucide-react';
import { DemoStoryScene } from '../types';
import { FALLBACK_THARUN_SCENES } from '../services/fallbackData';

interface TharunDemonstrationStudioProps {
  onNavigateTab: (tab: string) => void;
}

export const TharunDemonstrationStudio: React.FC<TharunDemonstrationStudioProps> = ({ onNavigateTab }) => {
  // Always initialize with FALLBACK_THARUN_SCENES so it is NEVER empty
  const [scenes, setScenes] = useState<DemoStoryScene[]>(FALLBACK_THARUN_SCENES);
  const [currentScene, setCurrentScene] = useState<DemoStoryScene>(FALLBACK_THARUN_SCENES[0]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchScenes = async () => {
    try {
      const res = await fetch('/api/demo/tharun-journey');
      if (res.ok) {
        const data: DemoStoryScene[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setScenes(data);
          const active = data.find(s => s.is_active) || data[0];
          setCurrentScene(active);
        }
      }
    } catch {
      // Backend not available (e.g. GitHub Pages static host) — local scenes already set!
    }
  };

  useEffect(() => {
    fetchScenes();
  }, []);

  const handleSelectScene = (sceneId: number) => {
    setScenes(prev => {
      const nextScenes = prev.map(s => ({ ...s, is_active: s.scene_id === sceneId }));
      const target = nextScenes.find(s => s.scene_id === sceneId);
      if (target) setCurrentScene(target);
      return nextScenes;
    });

    // Optional background sync with backend
    fetch(`/api/demo/tharun-journey/scene/${sceneId}`, { method: 'POST' }).catch(() => {});
  };

  const handleNext = () => {
    if (currentScene.scene_id < scenes.length) {
      handleSelectScene(currentScene.scene_id + 1);
    }
  };

  const handlePrev = () => {
    if (currentScene.scene_id > 1) {
      handleSelectScene(currentScene.scene_id - 1);
    }
  };

  const handleReset = () => {
    handleSelectScene(1);
    fetch('/api/demo/tharun-journey/reset', { method: 'POST' }).catch(() => {});
  };

  return (
    <div className="space-y-6 text-left">
      {/* Project Vision & Intention Hero Banner */}
      <div 
        style={{ backgroundColor: '#090e17' }}
        className="bg-[#090e17] bg-gradient-to-br from-slate-950 via-[#0a1122] to-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-3xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider font-mono flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                THE ROADSENSE AI MANIFESTO
              </span>
              <span className="text-xs text-slate-400 font-mono">8-Scene Complete Operational Lifecycle</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Compass className="w-8 h-8 text-emerald-400 shrink-0" />
              <span>Tharun's Story: <span className="text-emerald-400">Why RoadSense AI Exists</span></span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Traffic enforcement today is broken: hidden speed traps issue arbitrary fines while drivers remain blind to obscured signs and sudden red lights. 
              <b className="text-emerald-400 font-semibold"> RoadSense AI reimagines road safety as a cooperative ecosystem</b>: in-cockpit computer vision (IRC:67-2012), V2X green wave preemption, and a 
              <b className="text-amber-300 font-semibold"> compassionate emergency overspeed waiver protocol</b> that protects citizens rushing critically ill family members to the hospital.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer shrink-0 self-start md:self-center shadow-md hover:border-slate-600"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Restart Journey (Scene 1)</span>
          </button>
        </div>
      </div>

      {/* 8-Scene Horizontal Stepper Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Operational Journey Stepper</span>
          <span className="text-emerald-600 font-mono">Active: Scene {currentScene.scene_id} of {scenes.length}</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {scenes.map((s) => {
            const isActive = currentScene.scene_id === s.scene_id;
            const isEmergencyScene = s.scene_id >= 3 && s.scene_id <= 6;
            return (
              <button
                key={s.scene_id}
                onClick={() => handleSelectScene(s.scene_id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : isEmergencyScene
                      ? 'bg-amber-50/40 border-amber-200/80 hover:bg-amber-50'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-black ${
                    isActive ? 'text-emerald-700' : isEmergencyScene ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    Scene {s.scene_id}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                  {!isActive && isEmergencyScene && <HeartPulse className="w-3 h-3 text-amber-500/80" />}
                </div>
                <div className={`text-[11px] font-bold mt-1.5 line-clamp-2 leading-tight ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                  {s.title.split('—')[1]?.trim() || s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scene Spotlight Dossier */}
      {currentScene && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* Scene Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-black bg-slate-900 text-white">
                  Scene {currentScene.scene_id} of {scenes.length}
                </span>
                <span className="text-xs text-slate-500 font-mono">Actor: <b className="text-slate-800">{currentScene.actor}</b></span>
                {currentScene.scene_id >= 3 && currentScene.scene_id <= 6 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 font-mono">
                    <HeartPulse className="w-3 h-3 text-red-500" />
                    Medical Emergency Adjudication Protocol
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{currentScene.title}</h2>
              <div className="text-sm font-bold text-emerald-600 mt-0.5">{currentScene.subtitle}</div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentScene.location}</span>
                <span className="text-slate-300">·</span>
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-bold text-slate-700">{currentScene.vehicle_plate}</span>
              </p>
            </div>

            {/* Jump to Interactive Module */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Associated Product Module</span>
              <button
                onClick={() => onNavigateTab(currentScene.primary_view)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Open {currentScene.primary_view.replace(/_/g, ' ').toUpperCase()}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Narrative Overview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Operational Narrative:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{currentScene.description}</p>
          </div>

          {/* SPECIAL SECTION: Emergency Overspeeding Verification & Fine Waiver Protocol */}
          {currentScene.scene_id >= 3 && currentScene.scene_id <= 6 && (
            <div className="p-5 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-emerald-50/60 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 shrink-0">
                    <HeartPulse className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Emergency Over-Speeding Verification Protocol (MVA Section 194 Exception)
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Automated distinction between reckless driving vs. bona fide life-saving emergency
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                    ₹2,000 Fine Waived to ₹0
                  </span>
                </div>
              </div>

              {/* The 4-Step Solution Architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1 • Driver SOS</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  </div>
                  <div className="font-black text-slate-900">In-Cabin SOS Declared</div>
                  <p className="text-[11px] text-slate-500">
                    Tapped SOS button in Cockpit HMI at 00:18 IST. Hazard flashers activated, V2X emergency priority packet broadcast.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2 • Green Corridor</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="font-black text-emerald-700">V2X EVP Green Wave</div>
                  <p className="text-[11px] text-slate-500">
                    Roadside RIU holds 3 upcoming signals green. Radar detects 82 km/h but freezes citation as <i>Verification Pending</i>.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 3 • Anti-Abuse Audit</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="font-black text-blue-700">Hospital Geofence Lock</div>
                  <p className="text-[11px] text-slate-500">
                    RTK GNSS verifies car parked at AIG Emergency Ward. Triage Token <b>#ER-2026-HYD-9941</b> linked via digital gateway.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 4 • Judicial Waiver</span>
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="font-black text-emerald-700">Waiver #EX-HYD-2026-789</div>
                  <p className="text-[11px] text-slate-500">
                    Insp. K. Sridhar reviews digital dossier and approves 100% fine waiver under Section 194 MV Act Good Samaritan rules.
                  </p>
                </div>
              </div>

              {/* Anti-Abuse Protection Note */}
              <div className="p-2.5 bg-amber-100/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <b>Anti-Abuse Safeguard:</b> If telemetry reveals the vehicle diverted to a commercial venue, mall, or residence rather than a registered medical facility, or if no emergency hospital triage slip is generated within 30 minutes, the fine is tripled with a mandatory Section 182 false declaration penalty.
                </span>
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Live Scenario Telemetry & State Proofs
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Object.entries(currentScene.key_metrics).map(([key, val]) => (
                <div key={key} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-1 font-mono break-words">
                    {String(val)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Action Footer & Controls */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs text-emerald-900">
              <strong className="block text-emerald-950 font-bold mb-0.5">System Action in this Scene:</strong>
              {currentScene.operational_action}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentScene.scene_id === 1}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Scene</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentScene.scene_id === scenes.length}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <span>Next Scene</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default TharunDemonstrationStudio;
