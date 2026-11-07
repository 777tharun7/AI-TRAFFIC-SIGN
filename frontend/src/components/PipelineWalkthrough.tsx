import React, { useState } from 'react';
import { 
  Database, Cpu, CheckCircle2, Video, Radio, MapPin, 
  Settings, Gauge, ArrowRight, ShieldCheck, Zap, Layers,
  ExternalLink, ChevronRight
} from 'lucide-react';

interface Props {
  activeStep?: number;
  onSelectStep?: (stepId: number) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const PipelineWalkthrough: React.FC<Props> = ({
  activeStep = 6,
  onSelectStep,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState<number>(activeStep);

  const steps = [
    {
      id: 1,
      name: 'GTSRB Dataset',
      stage: 'Offline Training Only',
      color: 'blue',
      badge: 'Step 1',
      icon: '🚸',
      tabTarget: 'model_benchmarks',
      bulletPoints: [
        'German Traffic Sign Recognition Benchmark (GTSRB)',
        '43 traffic-sign classes & 50,000+ real-world images',
        'Different lighting, size, angle, and viewpoint conditions',
        'Group-aware track splitting prevents sequence leakage'
      ]
    },
    {
      id: 2,
      name: 'Model Training',
      stage: 'Offline Multi-Architecture',
      color: 'indigo',
      badge: 'Step 2',
      icon: '⚙️',
      tabTarget: 'model_benchmarks',
      bulletPoints: [
        'Preprocessing: Crop ROI, Resize, Normalization, Noise',
        'Semantic augmentations (No invalid directional flips)',
        'Deep Architectures: CNN Baseline, ResNet, MobileNet, EfficientNet',
        'Early stopping on validation macro-F1 & learning rate scheduling'
      ]
    },
    {
      id: 3,
      name: 'Trained Model',
      stage: 'Ready for Real-Time Inference',
      color: 'amber',
      badge: 'Step 3',
      icon: '🧠',
      tabTarget: 'model_benchmarks',
      bulletPoints: [
        'Best performing model deployed to production registry',
        'Classifies signs into 43 classes with normalized softmax',
        'Outputs predicted class ID, priority, and confidence score',
        'Sub-millisecond inference latency on hardware backends'
      ]
    },
    {
      id: 4,
      name: 'Live Camera / V2X Input',
      stage: 'Real-Time Perception Dual Stream',
      color: 'rose',
      badge: 'Step 4',
      icon: '📹',
      tabTarget: 'ai_vision',
      bulletPoints: [
        'Camera: Full-frame localization → Crop ROI → 43-class classifier',
        'Separates object detection from sign classification',
        'V2X / SPaT: Ingests intersection signal state & remaining seconds',
        'Three modes: Camera Mode, V2X Mode, and Fused Mode'
      ]
    },
    {
      id: 5,
      name: 'Context Validation',
      stage: 'Sensor Fusion & Geospatial Matching',
      color: 'purple',
      badge: 'Step 5',
      icon: '📍',
      tabTarget: 'road_intelligence',
      bulletPoints: [
        'GPS location coordinates & vehicle heading vector (±35°)',
        'Junction & road segment polygon matching',
        'Discards opposing/irrelevant signs away from vehicle path',
        'Conflict resolution between camera perception & V2X broadcast'
      ]
    },
    {
      id: 6,
      name: 'Decision Engine (MAIN)',
      stage: 'Traffic Rules & Physics Processing',
      color: 'emerald',
      badge: 'Step 6 (CORE)',
      icon: '⚡',
      tabTarget: 'decision_engine',
      bulletPoints: [
        'Physics stopping distance: d_stop = v²/(2a) + v·t_reaction',
        'GLOSA Green Wave speed advisory: v_advisory = d / t_remaining',
        'Yellow Dilemma Zone braking threshold evaluation',
        'Deterministic rule matrix for Red, Green, Stop Sign, Breakers, Reroute'
      ]
    },
    {
      id: 7,
      name: 'Vehicle HMI / Output',
      stage: 'Real-Time Driver Alerts & Actuation',
      color: 'teal',
      badge: 'Step 7',
      icon: '🚘',
      tabTarget: 'car_cockpit',
      bulletPoints: [
        'Glanceable Car Cockpit & Mounted Bike HUD displays',
        'Real-time alerts: STOP BEFORE LINE / SLOW / PROCEED',
        'Countdown seconds & distance to stop line bar',
        'Autonomous vehicle stops at RED and resumes on GREEN'
      ]
    }
  ];

  const handleStepClick = (stepId: number, tabTarget?: string) => {
    setCurrentStep(stepId);
    if (onSelectStep) onSelectStep(stepId);
    if (tabTarget && onNavigateTab) {
      // Optional direct navigation
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black uppercase">
              Architecture Overview
            </span>
            <span className="text-xs text-slate-400 font-mono">• 7-Stage End-to-End Pipeline</span>
          </div>
          <h2 className="text-base font-black text-slate-900 mt-1">
            Toom4Way AI Pipeline — 7-Stage Perception-to-Actuation Flow
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 font-bold">
            Interactive Step Navigator
          </span>
        </div>
      </div>

      {/* Horizontal Step Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((s) => {
          const isCurrent = s.id === currentStep;
          const isMain = s.id === 6;

          return (
            <button
              key={s.id}
              onClick={() => handleStepClick(s.id, s.tabTarget)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative ${
                isCurrent 
                  ? 'bg-slate-900 text-white border-slate-800 shadow-lg ring-2 ring-emerald-500 scale-[1.02] z-10' 
                  : isMain
                  ? 'bg-emerald-50/70 border-emerald-300 text-slate-800 hover:bg-emerald-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
              }`}
            >
              {isMain && (
                <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider shadow-sm">
                  ★ Main Core
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono ${
                    isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.id}
                  </span>
                  <span className="text-sm">{s.icon}</span>
                </div>

                <div className={`font-black text-xs leading-tight ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                  {s.name}
                </div>
                <div className={`text-[9px] font-mono mt-0.5 line-clamp-1 ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                  {s.stage}
                </div>
              </div>

              {s.tabTarget && onNavigateTab && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTab(s.tabTarget);
                  }}
                  className={`mt-2 pt-2 border-t text-[10px] font-bold flex items-center justify-between cursor-pointer ${
                    isCurrent ? 'border-slate-800 text-emerald-400 hover:underline' : 'border-slate-200 text-emerald-600 hover:underline'
                  }`}
                >
                  <span>Open Studio</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Inspector */}
      {(() => {
        const sel = steps.find(st => st.id === currentStep) || steps[5];
        return (
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-black">
                  Active Focus: Step {sel.id} — {sel.name}
                </span>
                <span className="text-xs text-slate-400">({sel.stage})</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300 pt-1">
                {sel.bulletPoints.map((bp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {sel.tabTarget && onNavigateTab && (
              <button
                onClick={() => onNavigateTab(sel.tabTarget)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
              >
                <span>Explore Step {sel.id} Deep Dive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
};
