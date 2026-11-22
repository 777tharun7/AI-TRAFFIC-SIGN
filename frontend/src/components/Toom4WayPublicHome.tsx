import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, ArrowRight, ShieldCheck, Cpu, Radio, MapPin, 
  Zap, Layers, BookOpen, CheckCircle2, ChevronRight, 
  Activity, Sparkles, Navigation, Gauge, Eye, Sliders,
  HelpCircle, ExternalLink, AlertTriangle, Crosshair, Check,
  Download, Maximize2, FileText, Compass, Award, Building2, Camera, Car,
  LogIn, UserCheck, ShieldAlert, Scale, Clock, Bus, Smartphone, RefreshCw, X
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
  onSelectPersona?: (personaId: string) => void;
}

export type HomePageTab = 'overview' | 'enforcement' | 'architecture' | 'roles' | 'compliance';

export const Toom4WayPublicHome: React.FC<Props> = ({
  vehicle,
  rius,
  signals,
  onNavigateTab,
  onControl,
  onSelectPersona
}) => {
  const [activeTab, setActiveTab] = useState<HomePageTab>('overview');
  const [selectedProcessStep, setSelectedProcessStep] = useState<number>(1);
  const [selectedSpecTab, setSelectedSpecTab] = useState<'perception' | 'v2x' | 'localization' | 'safety'>('perception');
  const [enforcementFilter, setEnforcementFilter] = useState<'all' | 'automated' | 'officer' | 'safety'>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Animated Traffic Light State Machine
  const [signalPhase, setSignalPhase] = useState<'RED' | 'AMBER' | 'GREEN'>('RED');
  const [countdown, setCountdown] = useState<number>(20);
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(true);

  // Auto-cycle traffic light phases: Red (20s) -> Amber (4s) -> Green (20s)
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (signalPhase === 'RED') {
            setSignalPhase('GREEN');
            return 22;
          } else if (signalPhase === 'GREEN') {
            setSignalPhase('AMBER');
            return 4;
          } else {
            setSignalPhase('RED');
            return 20;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoCycle, signalPhase]);

  const handleManualPhase = (phase: 'RED' | 'AMBER' | 'GREEN') => {
    setIsAutoCycle(false);
    setSignalPhase(phase);
    setCountdown(phase === 'RED' ? 25 : phase === 'AMBER' ? 4 : 25);
  };

  const handlePersonaLogin = (personaId: string) => {
    if (onSelectPersona) {
      onSelectPersona(personaId);
    } else {
      onNavigateTab('operations_overview');
    }
  };

  // 15 Comprehensive Enforcement & Safety Scenarios Data
  const enforcementScenarios = [
    {
      id: 1,
      title: 'Red-Light Jumping',
      category: 'automated',
      mvaSection: 'Sec 184 MVA / 167A CMVR',
      penalty: '₹1,000 – ₹5,000',
      evidenceType: 'Signal Phase Synced Video + 3D Bounding Box',
      confidenceRequired: '95% Optical + SPaT Match',
      desc: 'Synchronises intersection ANPR cameras with actual signal controller phases. Detects entry into conflict zone post-amber threshold.'
    },
    {
      id: 2,
      title: 'Stop Line Crossing on Red',
      category: 'automated',
      mvaSection: 'Sec 177 / 119 MVA',
      penalty: '₹500',
      evidenceType: 'Dual High-Speed Optical Stop-Line Crop',
      confidenceRequired: '92% Front-Axle Gating',
      desc: 'Calibrated virtual induction line detects vehicle tyres crossing the marked stop line while the phase is red, distinguishing legal clearance.'
    },
    {
      id: 3,
      title: 'Blocking Pedestrian Crossings',
      category: 'officer',
      mvaSection: 'Sec 119 MVA / Rule 11 RR',
      penalty: '₹500',
      evidenceType: 'Pedestrian Phase Synchronization + ANPR',
      confidenceRequired: '88% Occupancy Dwell',
      desc: 'Detects vehicles occupying zebra markings during active walk phases, protecting vulnerable road users and pedestrians.'
    },
    {
      id: 4,
      title: 'Wrong-Side / Counter-Flow Driving',
      category: 'automated',
      mvaSection: 'Sec 184(c) Dangerous Driving',
      penalty: '₹2,000 – ₹5,000',
      evidenceType: 'Continuous Motion Vector Tracking (6 Frames)',
      confidenceRequired: '98% Trajectory Vector',
      desc: 'Analyzes travel direction against authorized one-way or divided carriageway vectors, preventing lethal head-on collisions.'
    },
    {
      id: 5,
      title: 'Overspeeding & Speed Governance',
      category: 'automated',
      mvaSection: 'Sec 183 MVA',
      penalty: '₹1,000 – ₹2,000',
      evidenceType: 'Calibrated Radar / Optical Time-Over-Distance',
      confidenceRequired: '96% ±2 km/h Accuracy',
      desc: 'Compares verified vehicle speed against segment-specific limits (e.g. 50 km/h urban, 40 km/h school zone), generating automated e-challan evidence.'
    },
    {
      id: 6,
      title: 'No Helmet (Rider & Pillion)',
      category: 'automated',
      mvaSection: 'Sec 194D MVA',
      penalty: '₹1,000 + 3-Mo Disqualification',
      evidenceType: 'Dual-Head YOLO Optical Crop',
      confidenceRequired: '93% Headgear Classification',
      desc: 'Edge AI detects riders and pillion passengers without certified protective headgear on two-wheelers with crystal-clear facial exclusion.'
    },
    {
      id: 7,
      title: 'No Seat Belt Non-Compliance',
      category: 'officer',
      mvaSection: 'Sec 194B MVA',
      penalty: '₹1,000',
      evidenceType: 'High-Contrast Windscreen Diagonal Scan',
      confidenceRequired: '85% (Requires Officer Verification)',
      desc: 'Scans front driver and passenger compartment for visible seat-belt usage where ambient light and camera angle satisfy evidentiary thresholds.'
    },
    {
      id: 8,
      title: 'Mobile Phone Use While Driving',
      category: 'officer',
      mvaSection: 'Sec 184(c) MVA',
      penalty: '₹1,500 – ₹5,000',
      evidenceType: 'Temporal Pose & Hand-to-Ear Detection',
      confidenceRequired: '86% (Flagged for Officer Review)',
      desc: 'Flags suspected handheld mobile phone usage and distracted driving postures for verification before statutory notice issuance.'
    },
    {
      id: 9,
      title: 'Illegal Parking & Bus-Bay Stopping',
      category: 'automated',
      mvaSection: 'Sec 122 / 177 MVA',
      penalty: '₹500 – ₹1,500 + Towing',
      evidenceType: 'Geofenced Dwell Timer (3+ Minutes)',
      confidenceRequired: '96% Stationary Dwell',
      desc: 'Monitors no-parking stretches, bus rapid-transit stops, and emergency vehicle access ways to eliminate bottlenecks.'
    },
    {
      id: 10,
      title: 'Wrong-Lane & Dedicated Bus-Lane Violation',
      category: 'automated',
      mvaSection: 'Sec 177 MVA',
      penalty: '₹500 – ₹1,000',
      evidenceType: 'Lane Demarcation Cross-Association',
      confidenceRequired: '91% Lane Trajectory',
      desc: 'Enforces dedicated bus corridors, multi-lane heavy transport restrictions, and unauthorized commercial vehicle lane use.'
    },
    {
      id: 11,
      title: 'Emergency Vehicle Obstruction (Ambulance/Fire)',
      category: 'safety',
      mvaSection: 'Sec 194E MVA',
      penalty: '₹10,000 + Statutory Impound',
      evidenceType: 'Siren Acoustic + Emergency RF Preemption',
      confidenceRequired: '97% Failure-to-Yield Vector',
      desc: 'Identifies vehicles failing to yield to approaching emergency services broadcasted via DSRC 5.9 GHz preemption signals.'
    },
    {
      id: 12,
      title: 'Overloaded Commercial Goods Vehicles',
      category: 'safety',
      mvaSection: 'Sec 194 MVA',
      penalty: '₹20,000 + ₹2,000/extra tonne',
      evidenceType: 'Weigh-in-Motion (WIM) + ANPR Axle Match',
      confidenceRequired: '99% Certified WIM Sensors',
      desc: 'Integrates weigh-in-motion roadbed scales with overhead ANPR to automatically cite overloaded freight haulers.'
    },
    {
      id: 13,
      title: 'Illegal & Blind-Curve Overtaking',
      category: 'officer',
      mvaSection: 'Sec 184 MVA',
      penalty: '₹1,000 – ₹2,000',
      evidenceType: 'Solid Line Crossing on Curves',
      confidenceRequired: '89% (Requires Officer Verification)',
      desc: 'Detects unsafe overtaking over solid white/yellow lines on flyover ramps, blind bends, and bridge approaches.'
    },
    {
      id: 14,
      title: 'Restricted-Entry / No-Entry Time Violations',
      category: 'automated',
      mvaSection: 'Sec 115 / 194 MVA',
      penalty: '₹2,000',
      evidenceType: 'Time-Gated ANPR Vehicle Class Match',
      confidenceRequired: '98% VAHAN Class Match',
      desc: 'Enforces peak-hour heavy vehicle bans in central urban grids through VAHAN registration class lookup and ANPR.'
    },
    {
      id: 15,
      title: 'Intersection Obstruction (Yellow Box Gridlock)',
      category: 'safety',
      mvaSection: 'Sec 177 MVA',
      penalty: '₹500 – ₹1,000',
      evidenceType: 'Yellow-Box Dwell & Exit Blockage Check',
      confidenceRequired: '90% Blockage Analysis',
      desc: 'Detects vehicles entering a junction when downstream lanes are congested, preventing entire intersections from locking up.'
    }
  ];

  const filteredScenarios = enforcementScenarios.filter(item => {
    if (enforcementFilter === 'all') return true;
    return item.category === enforcementFilter;
  });

  return (
    <div className="min-h-screen bg-gov-canvas text-gov-slate font-sans selection:bg-[#00875A] selection:text-white">
      
      {/* ================= 0. OFFICIAL GOVERNMENT TOP BANNER ================= */}
      <div className="bg-[#0A2540] text-slate-300 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>🇮🇳</span>
              <span>GOVERNMENT OF TELANGANA</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Transport & Traffic Police Department</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-emerald-400 font-mono">Sec 167A CMVR Compliant</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">Emergency: <strong className="text-white">112</strong></span>
            <span className="text-slate-400">Traffic Helpline: <strong className="text-white">040-2345-7701</strong></span>
            <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/10 text-white font-sans text-[10px]">
              English / తెలుగు
            </span>
          </div>
        </div>
      </div>

      {/* ================= 1. PREMIER TOP SUB-PAGE NAVIGATION ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <RoadSenseLogo size="md" />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875A] text-[10px] font-mono font-bold border border-emerald-200">
              GOV TECH TS
            </span>
          </div>

          {/* Sub-Page Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Corridors
            </button>
            <button
              onClick={() => setActiveTab('enforcement')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'enforcement'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>15 Violations</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${activeTab === 'enforcement' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700'}`}>
                15
              </span>
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Edge AI & V2X
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'roles'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Operating Consoles
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'compliance'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sec 167A CMVR
            </button>
          </nav>

          {/* Quick Login & Direct Console Launch */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handlePersonaLogin('enforcement_officer')}
              className="flex items-center gap-2 px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Officer Login</span>
            </button>

            <button
              onClick={() => onNavigateTab('operations_overview')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>Launch Operations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-bold overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 rounded ${activeTab === 'overview' ? 'text-[#00875A] bg-emerald-50' : 'text-slate-600'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('enforcement')}
            className={`px-2.5 py-1 rounded ${activeTab === 'enforcement' ? 'text-[#00875A] bg-emerald-50' : 'text-slate-600'}`}
          >
            15 Violations
          </button>
          <button 
            onClick={() => setActiveTab('architecture')}
            className={`px-2.5 py-1 rounded ${activeTab === 'architecture' ? 'text-[#00875A] bg-emerald-50' : 'text-slate-600'}`}
          >
            AI & V2X
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`px-2.5 py-1 rounded ${activeTab === 'roles' ? 'text-[#00875A] bg-emerald-50' : 'text-slate-600'}`}
          >
            Roles
          </button>
          <button 
            onClick={() => setActiveTab('compliance')}
            className={`px-2.5 py-1 rounded ${activeTab === 'compliance' ? 'text-[#00875A] bg-emerald-50' : 'text-slate-600'}`}
          >
            Legal
          </button>
        </div>
      </header>

      {/* ================= 2. PAGE 1: OVERVIEW & INTERACTIVE HERO ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-16 pb-20">
          
          {/* Hero Section */}
          <section className="relative pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
            <div className="text-center space-y-5 max-w-3xl mx-auto">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#00875A] text-xs font-bold tracking-wider uppercase border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
                <span>Government of Telangana • Predictive Traffic Operations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gov-slate tracking-tight leading-[1.08]">
                Intelligent Road & Traffic <br />
                <span className="bg-gradient-to-r from-[#00875A] via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Enforcement Platform
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
                RoadSense AI transforms routine traffic enforcement from manual manpower policing to autonomous,
                cryptographically verified violation detection, GLOSA green-waves, and statutory Section 167A CMVR compliance.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handlePersonaLogin('enforcement_officer')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Enter Enforcement Center (Insp. Sridhar)</span>
                </button>

                <button
                  onClick={() => setActiveTab('enforcement')}
                  className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Inspect 15 Enforcement Rules</span>
                </button>

                <button
                  onClick={() => handlePersonaLogin('citizen_driver')}
                  className="flex items-center gap-2 px-5 py-3.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold text-sm rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>Citizen Cockpit & Dispute Portal</span>
                </button>
              </div>

              {/* Hardware & Standard Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-slate-500">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>NVIDIA Jetson Orin Edge (14.8 ms p50)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  <Radio className="w-3.5 h-3.5 text-blue-600" />
                  <span>DSRC 5.9 GHz / C-V2X Rel. 16</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dual-Band RTK GNSS (±0.4 m)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>IRC:67-2012 Certified</span>
                </span>
              </div>

            </div>

            {/* ================= TRAFFIC LIGHT INTERACTIVE ANIMATION HERO WIDGET ================= */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] animate-pulse" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      Live Traffic Signal State Machine & Kinematics Synchronizer
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time synchronization between junction signal controllers, optical stop-line cameras, and vehicle deceleration.
                  </p>
                </div>

                {/* Phase Control Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-mono font-bold">
                  <button
                    onClick={() => handleManualPhase('RED')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      signalPhase === 'RED' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Red Phase</span>
                  </button>
                  <button
                    onClick={() => handleManualPhase('AMBER')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      signalPhase === 'AMBER' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-300" />
                    <span>Amber Phase</span>
                  </button>
                  <button
                    onClick={() => handleManualPhase('GREEN')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      signalPhase === 'GREEN' ? 'bg-[#00875A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    <span>Green Phase</span>
                  </button>
                  <button
                    onClick={() => setIsAutoCycle(true)}
                    title="Auto-Cycle State Machine"
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isAutoCycle ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAutoCycle ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Dynamic Traffic Light & Multi-Lane Roadway Visualizer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* 3-Lens Traffic Light Housing */}
                <div className="lg:col-span-4 bg-slate-950 rounded-2xl p-6 text-white flex flex-col items-center justify-between border border-slate-800 shadow-xl relative overflow-hidden">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2">
                    HITEC JUNCTION 01 • SPaT CONTROLLER
                  </span>

                  {/* Physical Traffic Signal Housing */}
                  <div className="w-24 bg-black border-4 border-slate-800 rounded-3xl p-3 flex flex-col items-center gap-3.5 shadow-2xl relative">
                    
                    {/* RED LENS */}
                    <div className="relative flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center ${
                        signalPhase === 'RED'
                          ? 'bg-red-500 shadow-lg shadow-red-500/80 ring-4 ring-red-400/40'
                          : 'bg-red-950/40 opacity-30'
                      }`}>
                        {signalPhase === 'RED' && (
                          <span className="text-white font-mono font-black text-sm">{countdown}s</span>
                        )}
                      </div>
                    </div>

                    {/* AMBER LENS */}
                    <div className="relative flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center ${
                        signalPhase === 'AMBER'
                          ? 'bg-amber-400 shadow-lg shadow-amber-400/80 ring-4 ring-amber-300/40'
                          : 'bg-amber-950/40 opacity-30'
                      }`}>
                        {signalPhase === 'AMBER' && (
                          <span className="text-slate-900 font-mono font-black text-sm">{countdown}s</span>
                        )}
                      </div>
                    </div>

                    {/* GREEN LENS */}
                    <div className="relative flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center ${
                        signalPhase === 'GREEN'
                          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/80 ring-4 ring-emerald-400/40'
                          : 'bg-emerald-950/40 opacity-30'
                      }`}>
                        {signalPhase === 'GREEN' && (
                          <span className="text-white font-mono font-black text-sm">{countdown}s</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Live Operational Status Banner */}
                  <div className="mt-4 text-center space-y-1">
                    <div className={`text-xs font-mono font-bold px-3 py-1 rounded-full border inline-block ${
                      signalPhase === 'RED' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                      signalPhase === 'AMBER' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {signalPhase === 'RED' ? 'STOP-LINE ENFORCEMENT ARMED' :
                       signalPhase === 'AMBER' ? 'DILEMMA ZONE VECTORING' :
                       'GLOSA GREEN-WAVE PROPAGATION'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {signalPhase === 'RED' ? 'Auto-citation on stop line breach' :
                       signalPhase === 'AMBER' ? 'Deceleration curve thresholding' :
                       'Optimal speed advisory: 42 km/h'}
                    </div>
                  </div>
                </div>

                {/* Roadway Kinematics & Connected Vehicle Strip */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  
                  {/* Road Canvas */}
                  <div className="relative w-full h-44 rounded-2xl bg-slate-900 border border-slate-800 p-4 overflow-hidden flex flex-col justify-between">
                    
                    {/* Road Surface Markings */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between border-t border-b border-dashed border-slate-700/80 py-4 px-6 pointer-events-none">
                      <span className="text-[9px] font-mono text-slate-600">LANE 1 (FAST)</span>
                      <span className="text-[9px] font-mono text-slate-600">LANE 2 (BUS)</span>
                      <span className="text-[9px] font-mono text-slate-600">LANE 3 (TURNING)</span>
                    </div>

                    {/* Calibrated Stop Line */}
                    <div className="absolute right-28 inset-y-0 w-2 bg-white shadow-md flex items-center justify-center">
                      <span className="rotate-90 text-[8px] font-mono text-slate-900 font-bold tracking-widest whitespace-nowrap">
                        STOP LINE
                      </span>
                    </div>

                    {/* Pedestrian Zebra Crossing Area */}
                    <div className="absolute right-8 inset-y-0 w-16 bg-[repeating-linear-gradient(0deg,#ffffff,#ffffff_10px,transparent_10px,transparent_20px)] opacity-30" />

                    {/* Overhead Optical Camera Cone */}
                    <div className="absolute right-24 top-2 flex items-center gap-1.5 bg-slate-800/90 text-slate-200 px-2 py-0.5 rounded border border-slate-700 text-[10px] font-mono">
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ANPR Camera #44</span>
                    </div>

                    {/* Approaching Vehicle Simulation */}
                    <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 flex items-center gap-2 ${
                      signalPhase === 'RED' ? 'left-1/3' : signalPhase === 'AMBER' ? 'left-1/2' : 'left-3/4'
                    }`}>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-md">
                          <Car className="w-6 h-6" />
                        </div>
                        {/* Radar scanning pulse */}
                        <span className="absolute inset-0 rounded-xl bg-emerald-400/30 animate-ping" />
                      </div>

                      <div className="bg-slate-950/90 border border-slate-700 p-1.5 rounded-lg text-white font-mono text-[10px] space-y-0.5">
                        <div className="font-bold text-emerald-400">TS 09 EV 4412</div>
                        <div className="text-slate-300">
                          {signalPhase === 'RED' ? 'Speed: 0 km/h (Stopped)' :
                           signalPhase === 'AMBER' ? 'Decel: -2.8 m/s²' :
                           'Speed: 42 km/h (Cruising)'}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Ticker */}
                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>DSRC 5.9GHz SPaT Synchronized (10 Hz)</span>
                      </div>
                      <span>Distance to Stop Line: {signalPhase === 'RED' ? '2.1 m' : signalPhase === 'AMBER' ? '34.5 m' : '82.0 m'}</span>
                    </div>

                  </div>

                  {/* 3 Telemetry Feature Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <ShieldCheck className="w-4 h-4 text-[#00875A]" />
                        <span>Zero False Positive</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Fused SPaT controller log ensures citations are only generated when phase is red before vehicle crosses.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span>GLOSA Speed Band</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Advises vehicles on exact speed (38–44 km/h) to hit green signals consecutively without stop-and-go idle.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Scale className="w-4 h-4 text-indigo-600" />
                        <span>Section 167A CMVR</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Generates certified electronic records with SHA-256 cryptographic hashes admissible under Sec 65B Evidence Act.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= INTERACTIVE HERO NAVIGATION MAP ================= */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] animate-pulse" />
                    <span className="text-sm font-bold text-slate-900">Hyderabad Connected Corridor Map Simulation</span>
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
                    ● Esri Map: Clean Basemap
                  </span>
                </div>
              </div>

              <div className="relative w-full h-[460px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <RealNavigationMap
                  vehicle={vehicle}
                  rius={rius}
                  signals={signals}
                  onControl={onControl}
                  showPipelineDeck={false}
                />
              </div>
            </div>

          </section>

          {/* Real Project Imagery Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold text-[#00875A] uppercase tracking-wider font-mono">
                VERIFIED PROJECT DEPLOYMENTS & FIELD ASSETS
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Hyderabad Intelligent Transport Network
              </h2>
              <p className="text-sm text-slate-600">
                Actual field imagery and system architecture deployed along Hyderabad's primary tech and transit corridors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Image 1: HITEC Corridor */}
              <div 
                onClick={() => setPreviewImage('/images/hitec_corridor.jpg')}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src="/images/hitec_corridor.jpg" 
                    alt="HITEC City Smart Mobility Corridor" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                    HITEC City
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">HITEC Smart Corridor</h4>
                  <p className="text-[11px] text-slate-500">
                    Multi-junction camera array synchronized with V2X roadside units.
                  </p>
                </div>
              </div>

              {/* Image 2: Behavior Storyboard */}
              <div 
                onClick={() => setPreviewImage('/images/behavior_storyboard.jpg')}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src="/images/behavior_storyboard.jpg" 
                    alt="Vehicle Behavior Kinematics Flow" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                    Kinematics
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Behavior Deceleration Flow</h4>
                  <p className="text-[11px] text-slate-500">
                    6-stage physical vehicle behavior from 120m detection to green resumption.
                  </p>
                </div>
              </div>

              {/* Image 3: UI Mockup */}
              <div 
                onClick={() => setPreviewImage('/images/roadsense_ui_mockup.jpg')}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src="/images/roadsense_ui_mockup.jpg" 
                    alt="RoadSense AI Operations Console" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                    Operations
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Officer Operations Console</h4>
                  <p className="text-[11px] text-slate-500">
                    Unified adjudication workflow: Detect → Verify → Decide → Notify.
                  </p>
                </div>
              </div>

              {/* Image 4: Urban Arterial */}
              <div 
                onClick={() => setPreviewImage('/images/charminar_hyderabad.jpg')}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src="/images/charminar_hyderabad.jpg" 
                    alt="Hyderabad Urban Traffic Network" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                    Old City Grid
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">High-Density Urban Grid</h4>
                  <p className="text-[11px] text-slate-500">
                    Mixed-traffic coordination across vulnerable road users and transit corridors.
                  </p>
                </div>
              </div>

            </div>
          </section>

        </div>
      )}

      {/* ================= 3. PAGE 2: 15 ENFORCEMENT & SAFETY SCENARIOS ================= */}
      {activeTab === 'enforcement' && (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>15 ENFORCEMENT & ROAD SAFETY SCENARIOS</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Predictive Traffic Offence Detection Matrix
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl">
                Ground in India's electronic enforcement framework (Section 167A CMVR). Clear distinction between automatic challan issuance and officer-verified evidentiary workflows.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setEnforcementFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  enforcementFilter === 'all' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (15)
              </button>
              <button
                onClick={() => setEnforcementFilter('automated')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  enforcementFilter === 'automated' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Auto Challan
              </button>
              <button
                onClick={() => setEnforcementFilter('officer')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  enforcementFilter === 'officer' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Officer Verification
              </button>
              <button
                onClick={() => setEnforcementFilter('safety')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  enforcementFilter === 'safety' ? 'bg-rose-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Transit & Safety
              </button>
            </div>
          </div>

          {/* 15 Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredScenarios.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                      #{item.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.category === 'automated' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      item.category === 'officer' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
                      'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {item.category === 'automated' ? 'Direct Auto-Challan' :
                       item.category === 'officer' ? 'Officer Verification' :
                       'Critical Transit Safety'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Technical Evidence Metadata Rows */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>MVA Statutory:</span>
                    <span className="font-bold text-slate-900">{item.mvaSection}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Penalty Tier:</span>
                    <span className="font-bold text-rose-700">{item.penalty}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Evidentiary Standard:</span>
                    <span className="font-bold text-emerald-700">{item.confidenceRequired}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Action to Jump to Evidence Review */}
          <div className="p-6 rounded-3xl bg-gov-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Review Live Violations in Officer Adjudication Center</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Inspect high-confidence optical crops, cryptographic hashes, and issue certified e-challans.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('evidence_workflow')}
              className="px-5 py-3 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              Open Evidence Workflow Console →
            </button>
          </div>

        </div>
      )}

      {/* ================= 4. PAGE 3: EDGE AI & V2X ARCHITECTURE ================= */}
      {activeTab === 'architecture' && (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 pb-20">
          
          <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold font-mono">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>5-STAGE EDGE PERCEPTION & ACTUATION</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Deterministic Sensor Fusion Pipeline
            </h2>
            <p className="text-sm text-slate-600">
              Sub-12ms inference pipeline combining optical computer vision (YOLOv8 + PyTorch CNN), DSRC 5.9 GHz V2X SPaT messages, and 6-DOF vehicle kinematics.
            </p>
          </div>

          {/* 7-Step Horizontal Pipeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {[
              { step: '1. Ingest', desc: 'Dual-stream 720p 30fps feeds & 5.9 GHz V2X packets', icon: Camera },
              { step: '2. Detect', desc: 'YOLOv8 multi-scale ROI bounding box localization', icon: Crosshair },
              { step: '3. Classify', desc: 'PyTorch CNN feature tensor across 43 IRC sign classes', icon: Cpu },
              { step: '4. Localize', desc: 'RTK GNSS + 6-axis IMU corridor path projection', icon: MapPin },
              { step: '5. Fuse', desc: 'Deterministic camera vs SPaT discrepancy resolution', icon: Zap },
              { step: '6. Decide', desc: 'Calculates stopping distance (d_stop) & GLOSA speed', icon: Sliders },
              { step: '7. Deliver', desc: 'CAN-bus governor & Cockpit HUD alerts', icon: Car }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedProcessStep(idx + 1)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedProcessStep === idx + 1
                      ? 'bg-white border-[#00875A] shadow-md ring-2 ring-[#00875A]/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2 text-[#00875A]">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">{item.step}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Detailed Hardware Spec Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">NVIDIA Jetson Orin Nano</h4>
                  <span className="text-xs text-slate-500 font-mono">Edge AI Compute Engine</span>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 font-mono">
                <li>• 40 TOPS INT8 sparse tensor compute</li>
                <li>• 14.8 ms p50 inference latency</li>
                <li>• Sub-15W automotive envelope</li>
                <li>• PyTorch + TensorRT FP16 acceleration</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Quectel C-V2X Module</h4>
                  <span className="text-xs text-slate-500 font-mono">DSRC / 3GPP Rel. 16</span>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 font-mono">
                <li>• 5.9 GHz ITS safety band broadcast</li>
                <li>• 10 Hz SPaT & MAP telemetry</li>
                <li>• 300m direct RF range</li>
                <li>• ECDSA P-256 message signing</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Dual-Band RTK GNSS</h4>
                  <span className="text-xs text-slate-500 font-mono">Centimeter Localization</span>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 font-mono">
                <li>• L1/L5 dual frequency tracking</li>
                <li>• ±0.4 m CEP horizontal accuracy</li>
                <li>• 6-axis IMU dead-reckoning</li>
                <li>• Lane-level corridor association</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* ================= 5. PAGE 4: OPERATING CONSOLES & 1-CLICK LOGINS ================= */}
      {activeTab === 'roles' && (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 pb-20">
          
          <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-mono">
              <UserCheck className="w-3.5 h-3.5 text-[#00875A]" />
              <span>4 DEDICATED OPERATIONAL ENVIRONMENTS</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Role-Based Operating Workspaces
            </h2>
            <p className="text-sm text-slate-600">
              RoadSense AI provides tailored workflows for traffic police, city controllers, citizens, and public transit fleets. Select a role below to launch their active workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ROLE 1: Traffic Enforcement Incharge */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center font-black">
                    KS
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    ENFORCEMENT INCHARGE
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Insp. K. Sridhar, TPS</h3>
                  <span className="text-xs text-slate-500 font-mono">Badge: TS-HYD-7701 • Cyberabad Div II</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Responsible for statutory violation adjudication. Operates the 6-stage workflow: Detect → Verify → Prioritise → Assign → Decide → Notify under Section 167A CMVR.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono space-y-1">
                  <div>• Primary Console: Command Overview & Evidence Review</div>
                  <div>• Active Queue: 9 Pending Adjudications</div>
                  <div>• Statutory Auth: Certified e-Challan Issuance</div>
                </div>
              </div>

              <button
                onClick={() => handlePersonaLogin('enforcement_officer')}
                className="w-full py-3 bg-[#0A2540] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Launch Enforcement Console as Insp. Sridhar</span>
              </button>
            </div>

            {/* ROLE 2: ATCS TOC Controller */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-black">
                    PV
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold font-mono">
                    TOC DIRECTOR
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Dr. P. Venkatesh</h3>
                  <span className="text-xs text-slate-500 font-mono">Badge: TOC-DIR-04 • ATCS Hyderabad</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Oversees city-wide signal coordination, Level of Service (LoS) optimization, corridor green-waves, and Emergency Vehicle Preemption (EVP) dispatch.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono space-y-1">
                  <div>• Primary Console: Corridors, ATCS & EV Charging Grid</div>
                  <div>• Active Corridors: 3 Corridors (HITEC, Tank Bund, Financial Dist)</div>
                  <div>• Preemption: Active Siren/RF Emergency Clearances</div>
                </div>
              </div>

              <button
                onClick={() => handlePersonaLogin('toc_controller')}
                className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <LogIn className="w-4 h-4 text-indigo-300" />
                <span>Launch TOC Console as Dr. Venkatesh</span>
              </button>
            </div>

            {/* ROLE 3: Citizen Driver */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black">
                    DT
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    CITIZEN DRIVER
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Devanboina Tharun</h3>
                  <span className="text-xs text-slate-500 font-mono">Plate: TS 09 EV 4412 • Tata Nexon EV Max</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  In-cabin driver experience featuring real-time Head-Up Display (HUD), GLOSA green-wave speed advisories, and a zero-fee dispute portal for Section 167A appeals.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono space-y-1">
                  <div>• Primary Console: Car Cockpit HMI & Citizen Portal</div>
                  <div>• Connected Telemetry: GVID Hardware Connected via CAN-BUS</div>
                  <div>• Rights: Statutory Appeals under Rule 167A CMVR</div>
                </div>
              </div>

              <button
                onClick={() => handlePersonaLogin('citizen_driver')}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <LogIn className="w-4 h-4 text-emerald-300" />
                <span>Launch Citizen Cockpit as Tharun</span>
              </button>
            </div>

            {/* ROLE 4: Transit Fleet Dispatcher */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center font-black">
                    SR
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                    FLEET DISPATCHER
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">S. Rama Rao</h3>
                  <span className="text-xs text-slate-500 font-mono">Badge: TSRTC-FLEET-90 • Heavy Transport</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Controls commercial bus and heavy vehicle operations. Monitors dedicated bus lane adherence, battery state-of-charge for EV buses, and depot turnaround times.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono space-y-1">
                  <div>• Primary Console: Public Transit Fleet Manager</div>
                  <div>• Fleet Size: 42 Active Electric Buses</div>
                  <div>• Bus-Lane Gating: DSRC Green Priority at Junctions</div>
                </div>
              </div>

              <button
                onClick={() => handlePersonaLogin('transit_dispatcher')}
                className="w-full py-3 bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Launch Transit Dispatcher Console as Rama Rao</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ================= 6. PAGE 5: STATUTORY COMPLIANCE & LEGAL ================= */}
      {activeTab === 'compliance' && (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 pb-20">
          
          <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold font-mono">
              <Scale className="w-3.5 h-3.5 text-[#00875A]" />
              <span>STATUTORY ELECTRONIC ENFORCEMENT CHARTER</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Section 167A Central Motor Vehicles Rules (CMVR)
            </h2>
            <p className="text-sm text-slate-600">
              RoadSense AI strictly adheres to the statutory mandates governing electronic enforcement devices as notified by the Ministry of Road Transport and Highways (MoRTH).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
                <span>15-Day Statutory Notice Rule (Sec 167A(4))</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Under Rule 167A(4), any notice of electronic enforcement must be dispatched to the registered vehicle owner within fifteen days of occurrence via registered post or digital SMS notice.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
                <span>Section 65B Electronic Record Admissibility</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every camera frame, radar speed record, and SPaT signal phase log is bound with a SHA-256 cryptographic hash and an ISO 8601 NTP timestamp, satisfying the Indian Evidence Act.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
                <span>Zero-Fee Statutory Appeal & Dispute Mechanism</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizens are empowered to file statutory appeals under 7 grounds: Cloned/Fraudulent Number Plate, Emergency Medical Vehicle, Permitted by Police Officer on Duty, Sensor Misclassification, Vehicle Sold Prior to Offence, Green Signal Clearance, and Road Works Diversion.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
                <span>Tamper-Evident Immutable Audit Log</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All officer review actions (Approve, Reject, Request Secondary Verification) are logged in an append-only cryptographic ledger with the reviewing officer's IPS/TPS badge number and IP address.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ================= OFFICIAL GOVERNMENT FOOTER ================= */}
      <footer className="bg-[#0A1828] text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-base">
                <RoadSenseLogo size="sm" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Autonomous Road & Traffic Management Ecosystem. Deployed across Hyderabad smart corridors to reduce accident fatalities and automate Section 167A electronic enforcement.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider font-mono">Enforcement Portals</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => handlePersonaLogin('enforcement_officer')} className="hover:text-white cursor-pointer">Police Enforcement Console</button></li>
                <li><button onClick={() => handlePersonaLogin('toc_controller')} className="hover:text-white cursor-pointer">ATCS Corridor Controller</button></li>
                <li><button onClick={() => handlePersonaLogin('citizen_driver')} className="hover:text-white cursor-pointer">Citizen e-Challan Dispute</button></li>
                <li><button onClick={() => handlePersonaLogin('transit_dispatcher')} className="hover:text-white cursor-pointer">TSRTC Public Transit Fleet</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider font-mono">Statutory Acts & Standards</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li>Section 167A, Central Motor Vehicles Rules 1989</li>
                <li>Motor Vehicles (Amendment) Act 2019</li>
                <li>Section 65B, Indian Evidence Act 1872</li>
                <li>IRC:67-2012 Code of Practice for Road Signs</li>
                <li>AIS-140 Intelligent Transportation Systems</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider font-mono">Traffic Control Center</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cyberabad Traffic Police Headquarters, Gachibowli, Hyderabad, Telangana 500032.
              </p>
              <div className="pt-1 text-[11px] font-mono text-emerald-400">
                NTP ±2ms Synced • SHA-256 Ledger Active
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 RoadSense AI • Government of Telangana & Cyberabad Traffic Police. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>National Informatics Centre (NIC) Integration Standard</span>
              <span>•</span>
              <span>Parivahan e-Challan Certified</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={previewImage} 
              alt="Enlarged Project Asset" 
              className="w-full max-h-[80vh] object-contain" 
            />
          </div>
        </div>
      )}

    </div>
  );
};
