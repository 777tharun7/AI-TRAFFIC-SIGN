import React, { useState, useEffect } from 'react';
import { 
  Compass, Play, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, 
  Car, Eye, ShieldCheck, FileCheck, User, Zap, AlertTriangle, 
  MapPin, Clock, ExternalLink, HelpCircle, Activity
} from 'lucide-react';
import { DemoStoryScene } from '../types';

interface TharunDemonstrationStudioProps {
  onNavigateTab: (tab: string) => void;
}

export const TharunDemonstrationStudio: React.FC<TharunDemonstrationStudioProps> = ({ onNavigateTab }) => {
  const [scenes, setScenes] = useState<DemoStoryScene[]>([]);
  const [currentScene, setCurrentScene] = useState<DemoStoryScene | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScenes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo/tharun-journey');
      if (res.ok) {
        const data: DemoStoryScene[] = await res.json();
        setScenes(data);
        const active = data.find(s => s.is_active) || data[0];
        setCurrentScene(active);
      }
    } catch (err) {
      console.error('Failed to load demo journey scenes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes();
  }, []);

  const handleSelectScene = async (sceneId: number) => {
    try {
      const res = await fetch(`/api/demo/tharun-journey/scene/${sceneId}`, { method: 'POST' });
      if (res.ok) {
        const updated: DemoStoryScene = await res.json();
        setCurrentScene(updated);
        setScenes(prev => prev.map(s => ({ ...s, is_active: s.scene_id === sceneId })));
      }
    } catch (err) {
      console.error('Failed to switch scene:', err);
    }
  };

  const handleNext = async () => {
    try {
      const res = await fetch('/api/demo/tharun-journey/next', { method: 'POST' });
      if (res.ok) {
        const updated: DemoStoryScene = await res.json();
        setCurrentScene(updated);
        setScenes(prev => prev.map(s => ({ ...s, is_active: s.scene_id === updated.scene_id })));
      }
    } catch (err) {
      console.error('Failed to advance scene:', err);
    }
  };

  const handlePrev = async () => {
    try {
      const res = await fetch('/api/demo/tharun-journey/prev', { method: 'POST' });
      if (res.ok) {
        const updated: DemoStoryScene = await res.json();
        setCurrentScene(updated);
        setScenes(prev => prev.map(s => ({ ...s, is_active: s.scene_id === updated.scene_id })));
      }
    } catch (err) {
      console.error('Failed to reverse scene:', err);
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch('/api/demo/tharun-journey/reset', { method: 'POST' });
      if (res.ok) {
        const updated: DemoStoryScene = await res.json();
        setCurrentScene(updated);
        setScenes(prev => prev.map(s => ({ ...s, is_active: s.scene_id === 1 })));
      }
    } catch (err) {
      console.error('Failed to reset journey:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 tracking-wider uppercase font-mono">
              [SIMULATED DATA] Guided Operational Walkthrough
            </span>
            <span className="text-xs text-slate-400 font-mono">8-Scene Connected Story</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-7 h-7 text-[#00875A]" />
            Tharun's Journey: End-to-End Operational Lifecycle
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Demonstrates the complete workflow: Preventive In-Cockpit Guidance → Signal Approach → Violation Detection → Officer Verification → Legal e-Challan → Citizen Transparency → Infrastructure Improvement.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Scene 1</span>
        </button>
      </div>

      {/* 8-Scene Horizontal Stepper Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {scenes.map((s) => {
            const isActive = currentScene?.scene_id === s.scene_id;
            return (
              <button
                key={s.scene_id}
                onClick={() => handleSelectScene(s.scene_id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-50 border-[#00875A] ring-2 ring-[#00875A]/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-black ${isActive ? 'text-[#00875A]' : 'text-slate-400'}`}>
                    Scene {s.scene_id}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] animate-pulse" />}
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
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-black bg-slate-900 text-white">
                  Scene {currentScene.scene_id} of 8
                </span>
                <span className="text-xs text-slate-400 font-mono">Actor: {currentScene.actor}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-2">{currentScene.title}</h2>
              <div className="text-sm font-bold text-[#00875A] mt-0.5">{currentScene.subtitle}</div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
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
                className="flex items-center gap-2 px-4 py-2 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Open {currentScene.primary_view.replace(/_/g, ' ').toUpperCase()}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Narrative Overview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#00875A]" />
              <span>Operational Narrative:</span>
            </div>
            <p>{currentScene.description}</p>
          </div>

          {/* Key Metrics Grid */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Live Scenario Telemetry & State Proofs
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              <strong className="block text-emerald-950">System Action in this Scene:</strong>
              {currentScene.operational_action}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentScene.scene_id === 1}
                className="flex items-center gap-1 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev Scene</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentScene.scene_id === 8}
                className="flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
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
