import React, { useState, useEffect } from 'react';
import { 
  Home, Navigation, Gauge, Cpu, Radio, Play, 
  Settings, HelpCircle, BookOpen, Layers, Search, MapPin, 
  Bell, ChevronDown, Check, Maximize2, Plus, Minus, 
  Compass, ArrowRight, AlertTriangle, Activity, Zap, RefreshCw,
  Camera, Sliders, Car, Crosshair, Sparkles, CheckCircle2,
  LogIn, User, Shield, Menu, X, LogOut, Building2,
  FileCheck, Bus, FileText, ShieldAlert, CreditCard, Clock,
  ArrowUpRight, Award, ExternalLink
} from 'lucide-react';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';
import { RoadSenseLogo } from './RoadSenseLogo';
import { Toom4WayPublicHome } from './Toom4WayPublicHome';
import { MasterRoadIntelligenceDashboard } from './MasterRoadIntelligenceDashboard';
import { CameraSignCaptureTracker } from './CameraSignCaptureTracker';
import { DecisionEngineStudio } from './DecisionEngineStudio';
import { CVDVStudio } from './CVDVStudio';
import { VirtualRIUStudio } from './VirtualRIUStudio';
import { CarCockpitHMI } from './CarCockpitHMI';
import { AboutPortfolioView } from './AboutPortfolioView';
import { ProjectDeckAndResearchView } from './ProjectDeckAndResearchView';
import { AIModelCenter } from './AIModelCenter';
import { SystemStateInventoryView } from './states/SystemStateInventoryView';
import { UIUXLayoutStudio } from './UIUXLayoutStudio';
import { TrafficDeptPortal } from './TrafficDeptPortal';
import { TrafficOperationsOverview } from './TrafficOperationsOverview';
import { TharunDemonstrationStudio } from './TharunDemonstrationStudio';
import { VehicleRegistryView } from './VehicleRegistryView';
import { GVIDRegistryView } from './GVIDRegistryView';
import { EvidenceChallanWorkflowView } from './EvidenceChallanWorkflowView';
import { CitizenPortalView } from './CitizenPortalView';
import { FleetOperationsView } from './FleetOperationsView';
import { LoginView, RegisterView, VerifyEmailView, ForgotPasswordView } from './auth/AuthPages';
import { CookieSettingsView, PrivacyPolicyView, TermsOfServiceView } from './legal/LegalPages';

export interface UserPersona {
  id: string;
  role: string;
  shortRole: string;
  name: string;
  badge: string;
  vehicle?: string;
  jurisdiction: string;
  defaultView: string;
  category: 'Enforcement' | 'Operations' | 'Citizen' | 'Transit';
  badgeColor: string;
}

export const PERSONAS: UserPersona[] = [
  {
    id: 'enforcement_officer',
    role: 'Enforcement Adjudication Officer',
    shortRole: 'Enforcement Incharge',
    name: 'Insp. K. Sridhar, TPS',
    badge: 'TS-HYD-7701',
    jurisdiction: 'Cyberabad Traffic Ops (Div II)',
    defaultView: 'operations_overview',
    category: 'Enforcement',
    badgeColor: 'bg-[#0A2540] text-white'
  },
  {
    id: 'toc_controller',
    role: 'Traffic Operations Center (TOC) Controller',
    shortRole: 'ATCS Director',
    name: 'Dr. P. Venkatesh',
    badge: 'TOC-DIR-04',
    jurisdiction: 'Hyderabad ATCS & Corridors',
    defaultView: 'traffic_dept',
    category: 'Operations',
    badgeColor: 'bg-indigo-900 text-white'
  },
  {
    id: 'citizen_driver',
    role: 'Citizen Driver & Vehicle Custodian',
    shortRole: 'Vehicle Owner',
    name: 'Devanboina Tharun',
    badge: 'TS 09 EV 4412',
    vehicle: 'Tata Nexon EV Max',
    jurisdiction: 'Registered Motorist',
    defaultView: 'car_cockpit',
    category: 'Citizen',
    badgeColor: 'bg-emerald-800 text-white'
  },
  {
    id: 'transit_dispatcher',
    role: 'Transit & Commercial Fleet Dispatcher',
    shortRole: 'Fleet Dispatcher',
    name: 'S. Rama Rao',
    badge: 'TSRTC-FLEET-90',
    jurisdiction: 'Public Transit & Heavy Transport',
    defaultView: 'fleet_operations',
    category: 'Transit',
    badgeColor: 'bg-amber-800 text-white'
  }
];

interface AppShellProps {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  routes: any[];
  isWsConnected: boolean;
  onControl: (action: string, params?: any) => void;
  onReload: () => void;
}

export const Toom4WayAppShell: React.FC<AppShellProps> = ({
  vehicle,
  rius,
  signals,
  routes,
  isWsConnected,
  onControl,
  onReload
}) => {
  const [currentView, setCurrentView] = useState<string>('operations_overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(PERSONAS[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [istTime, setIstTime] = useState<string>('');

  // Live NTP-synchronized IST Clock (UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setIstTime(timeStr);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNav = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPersona = (persona: UserPersona) => {
    setSelectedPersona(persona);
    setCurrentView(persona.defaultView);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderNavLinks = () => (
    <>
      {/* 1. PRIMARY OPERATIONS */}
      <nav className="space-y-1">
        <button
          onClick={() => handleNav('operations_overview')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'operations_overview'
              ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Building2 className={`w-4 h-4 ${currentView === 'operations_overview' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Command Overview</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            currentView === 'operations_overview'
              ? 'bg-emerald-500 text-white'
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            LIVE
          </span>
        </button>

        <button
          onClick={() => handleNav('tharun_demo')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'tharun_demo'
              ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Compass className={`w-4 h-4 ${currentView === 'tharun_demo' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Tharun's Story</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            currentView === 'tharun_demo'
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-indigo-100 text-indigo-800'
          }`}>
            [8 SCENES]
          </span>
        </button>

        <button
          onClick={() => handleNav('road_intelligence')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'road_intelligence'
              ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Navigation className={`w-4 h-4 ${currentView === 'road_intelligence' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Live Intelligence</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            currentView === 'road_intelligence' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            [4 JUNC]
          </span>
        </button>

        <button
          onClick={() => handleNav('car_cockpit')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'car_cockpit'
              ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Car className={`w-4 h-4 ${currentView === 'car_cockpit' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Vehicle Experience</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            currentView === 'car_cockpit' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            GLOSA
          </span>
        </button>

        <button
          onClick={() => handleNav('home')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'home'
              ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Home className={`w-4 h-4 ${currentView === 'home' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Product Briefing</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${
            currentView === 'home' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            PUBLIC
          </span>
        </button>

        <button
          onClick={() => handleNav('traffic_dept')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'traffic_dept'
              ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Activity className={`w-4 h-4 ${currentView === 'traffic_dept' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Corridors & EVP</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            currentView === 'traffic_dept'
              ? 'bg-rose-500 text-white'
              : 'bg-rose-100 text-rose-800'
          }`}>
            [3 ACTIVE]
          </span>
        </button>
      </nav>

      {/* 2. VEHICLES & ENFORCEMENT */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Vehicles & Enforcement
        </div>

        <button
          onClick={() => handleNav('vehicle_registry')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'vehicle_registry'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Car className={`w-4 h-4 ${currentView === 'vehicle_registry' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Vehicle Registry</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'vehicle_registry' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            [1.4M TS]
          </span>
        </button>

        <button
          onClick={() => handleNav('gvid_registry')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'gvid_registry'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Cpu className={`w-4 h-4 ${currentView === 'gvid_registry' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>GVID Hardware Hub</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'gvid_registry' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            [V2X]
          </span>
        </button>

        <button
          onClick={() => handleNav('evidence_workflow')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'evidence_workflow'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileCheck className={`w-4 h-4 ${currentView === 'evidence_workflow' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Evidence & e-Challan</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            currentView === 'evidence_workflow'
              ? 'bg-amber-400 text-slate-900'
              : 'bg-amber-100 text-amber-900'
          }`}>
            [9]
          </span>
        </button>
      </div>

      {/* 3. CITIZEN & TRANSIT */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Citizen & Transit
        </div>

        <button
          onClick={() => handleNav('citizen_portal')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'citizen_portal'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <User className={`w-4 h-4 ${currentView === 'citizen_portal' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Citizen Portal & Pay</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'citizen_portal' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            ZERO-FEE
          </span>
        </button>

        <button
          onClick={() => handleNav('fleet_operations')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'fleet_operations'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bus className={`w-4 h-4 ${currentView === 'fleet_operations' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Public Transit Fleet</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            currentView === 'fleet_operations' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
          }`}>
            [42 BUSES]
          </span>
        </button>
      </div>

      {/* 4. INTELLIGENCE LAB */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Intelligence Lab
        </div>

        <button
          onClick={() => handleNav('camera_tracker')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'camera_tracker'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Camera className={`w-4 h-4 ${currentView === 'camera_tracker' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Live Camera & Tracking</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'camera_tracker' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            HD 4K
          </span>
        </button>

        <button
          onClick={() => handleNav('cvdv')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'cvdv'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Cpu className={`w-4 h-4 ${currentView === 'cvdv' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>AI Vision Lab</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'cvdv' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
          }`}>
            [YOLOv8]
          </span>
        </button>

        <button
          onClick={() => handleNav('v_riu')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'v_riu'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Radio className={`w-4 h-4 ${currentView === 'v_riu' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>Virtual RIU</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'v_riu' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            [4 NODES]
          </span>
        </button>

        <button
          onClick={() => handleNav('decision_engine')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'decision_engine'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Zap className={`w-4 h-4 ${currentView === 'decision_engine' ? 'text-white' : 'text-[#00875A]'}`} />
            <span>Decision Engine (Pt 6)</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'decision_engine' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            [10ms]
          </span>
        </button>

        <button
          onClick={() => handleNav('ui_ux_debugger')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'ui_ux_debugger'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <div className="flex items-center gap-3">
            <Layers className={`w-4 h-4 ${currentView === 'ui_ux_debugger' ? 'text-white' : 'text-emerald-600'}`} />
            <span>UI/UX Position Debugger</span>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            currentView === 'ui_ux_debugger' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            [ISO]
          </span>
        </button>
      </div>

      {/* 5. RESEARCH */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Research
        </div>

        <button
          onClick={() => handleNav('literature_research')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'literature_research'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${currentView === 'literature_research' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>Literature & Research</span>
        </button>

        <button
          onClick={() => handleNav('about_portfolio')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'about_portfolio'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <Layers className={`w-4 h-4 ${currentView === 'about_portfolio' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>System Architecture</span>
        </button>
      </div>

      {/* 6. SYSTEM */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          System
        </div>

        <button
          onClick={() => handleNav('system_states')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
            currentView === 'system_states'
              ? 'bg-[#0A2540] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
          }`}
        >
          <Settings className={`w-4 h-4 ${currentView === 'system_states' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>Settings & States</span>
        </button>

        <button
          onClick={() => handleNav('terms')}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Legal</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F6F8FB] text-[#0F172A] font-sans antialiased">
      
      {/* ================= 1. DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E2E8F0] flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 space-y-4">
          
          {/* Logo / Brand Header */}
          <div className="cursor-pointer py-1" onClick={() => handleNav('home')}>
            <RoadSenseLogo size="md" />
          </div>

          {/* Render All Navigation Items */}
          {renderNavLinks()}

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50 text-[11px] font-mono text-slate-400 text-center flex flex-col gap-0.5">
          <span className="font-semibold text-slate-600">RoadSense AI • Connected Mobility</span>
          <span className="text-[10px] text-slate-400">Gov. of Telangana • ATCS Hyderabad</span>
        </div>
      </aside>

      {/* ================= MOBILE MENU DRAWER ================= */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside className={`fixed top-0 bottom-0 left-0 w-72 bg-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-200 lg:hidden overflow-y-auto ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => handleNav('home')}>
              <RoadSenseLogo size="sm" />
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Persona Switcher Quick Trigger */}
          <div className="p-3 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Active Role Profile
            </div>
            <div className="text-xs font-bold text-slate-900">{selectedPersona.name}</div>
            <div className="text-[10px] text-slate-500">{selectedPersona.role}</div>
            <div className="text-[10px] font-mono text-[#0A2540] font-semibold mt-1">Badge: {selectedPersona.badge}</div>
          </div>

          {renderNavLinks()}
        </div>
      </aside>

      {/* ================= 2. MAIN APPLICATION WORKSPACE ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          
          {/* Left: Mobile Menu Toggle & Search Bar with Guaranteed Min Width */}
          <div className="flex items-center gap-3 flex-1 max-w-sm sm:max-w-md min-w-[200px]">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search road event, vehicle, plate, or junction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540] text-slate-900 transition-colors"
              />
            </div>
          </div>

          {/* Right: Live NTP Clock, Location, Live Status, Profile */}
          <div className="flex items-center gap-3">
            
            {/* Live NTP-Synchronized IST Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#F1F5F9] rounded-xl text-xs font-mono border border-[#E2E8F0] text-slate-700 select-none">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-[#0F172A]">{istTime || '00:00:00'} IST</span>
              <span className="text-[10px] text-slate-500 px-1 py-0.2 bg-white rounded border border-slate-200">
                UTC+5:30
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#00875A] font-semibold pl-1 border-l border-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] animate-pulse" />
                NTP ±2ms Synced
              </span>
            </div>

            {/* Jurisdiction Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] rounded-xl text-xs font-medium text-slate-700 border border-[#E2E8F0]">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Hyderabad, TS</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Live Connected Status */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F8F3] rounded-xl text-xs font-semibold text-[#00875A] border border-[#00875A]/20">
              <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
              <span>Live Connected</span>
              <span className="text-[10px] text-slate-600 font-normal pl-1 border-l border-emerald-300">All Systems Online</span>
            </div>

            {/* Alert Notifications */}
            <div className="relative p-2 text-slate-600 hover:text-slate-900 cursor-pointer rounded-xl hover:bg-slate-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </div>

            {/* Interactive 4-Tier Role Switcher & Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0] cursor-pointer select-none text-left rounded-lg p-1 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20"
                aria-expanded={profileDropdownOpen}
              >
                <div className={`w-8 h-8 rounded-full ${selectedPersona.badgeColor} font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                  {selectedPersona.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight whitespace-nowrap">{selectedPersona.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap mt-0.5">{selectedPersona.shortRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Popover Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-3 space-y-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  
                  {/* Persona Switcher Header */}
                  <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Operational Persona & Role
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Switch perspective to change active dashboard & credentials
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                      4 ROLES
                    </span>
                  </div>

                  {/* 4 Personas List */}
                  <div className="space-y-1.5 max-h-80 overflow-y-auto">
                    {PERSONAS.map((p) => {
                      const isSelected = selectedPersona.id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelectPersona(p)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-sm'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <div className={`w-7 h-7 rounded-lg ${isSelected ? 'bg-white/20 text-white' : p.badgeColor} flex items-center justify-center font-bold text-xs shrink-0 mt-0.5`}>
                                {p.category === 'Enforcement' && <Shield className="w-4 h-4" />}
                                {p.category === 'Operations' && <Activity className="w-4 h-4" />}
                                {p.category === 'Citizen' && <Car className="w-4 h-4" />}
                                {p.category === 'Transit' && <Bus className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {p.name}
                                  </span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {p.badge}
                                  </span>
                                </div>
                                <div className={`text-[11px] font-medium leading-tight mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                                  {p.role}
                                </div>
                                {p.vehicle && (
                                  <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                    🚗 Vehicle: {p.vehicle}
                                  </div>
                                )}
                                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                  Jurisdiction: {p.jurisdiction}
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <span className="p-1 rounded-full bg-emerald-500 text-white shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* System Actions Divider */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNav('system_states');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium text-slate-700 flex items-center justify-between"
                    >
                      <span>System Diagnostic Inventory</span>
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNav('cookie_settings');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium text-slate-700 flex items-center justify-between"
                    >
                      <span>Privacy & Consent Preferences</span>
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </header>

        {/* Subview Back Banner (When in nested views) */}
        {currentView !== 'home' && (
          <div className="bg-[#0A2540] text-white px-6 py-2.5 flex items-center justify-between sticky top-16 z-20 shadow-xs border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNav('home')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs shadow-xs transition-all cursor-pointer border border-white/15"
              >
                <span>← Public Portal</span>
              </button>
              <span className="text-slate-400 text-xs">|</span>
              <span className="font-semibold text-xs tracking-tight text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>RoadSense AI</span>
                <span className="text-slate-400">•</span>
                <span className="capitalize text-slate-200 font-normal">{currentView.replace(/_/g, ' ')}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onControl(vehicle?.is_running ? 'pause' : 'play')}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer border border-white/10 transition-colors"
              >
                {vehicle?.is_running ? '⏸ Pause Simulation' : '▶ Play Simulation'}
              </button>
            </div>
          </div>
        )}

        {/* View Router Main Body */}
        <main className="flex-1">
          {currentView === 'operations_overview' && (
            <div className="p-6 max-w-7xl mx-auto">
              <TrafficOperationsOverview onNavigateTab={handleNav} />
            </div>
          )}

          {currentView === 'tharun_demo' && (
            <div className="p-6 max-w-7xl mx-auto">
              <TharunDemonstrationStudio onNavigateTab={handleNav} />
            </div>
          )}

          {currentView === 'home' && (
            <Toom4WayPublicHome
              vehicle={vehicle}
              rius={rius}
              signals={signals}
              onNavigateTab={handleNav}
              onControl={onControl}
            />
          )}

          {currentView === 'road_intelligence' && (
            <div className="p-6 max-w-7xl mx-auto">
              <MasterRoadIntelligenceDashboard
                vehicle={vehicle}
                rius={rius}
                signals={signals}
                onControl={onControl}
              />
            </div>
          )}

          {currentView === 'camera_tracker' && (
            <div className="p-6 max-w-7xl mx-auto">
              <CameraSignCaptureTracker />
            </div>
          )}

          {currentView === 'decision_engine' && (
            <div className="p-6 max-w-7xl mx-auto">
              <DecisionEngineStudio
                vehicle={vehicle}
                signals={signals}
                onControl={onControl}
              />
            </div>
          )}

          {currentView === 'car_cockpit' && (
            <div className="p-6 max-w-7xl mx-auto">
              <CarCockpitHMI
                vehicle={vehicle}
                onControl={onControl}
                routes={routes}
              />
            </div>
          )}

          {currentView === 'cvdv' && (
            <div className="p-6 max-w-7xl mx-auto">
              <CVDVStudio />
            </div>
          )}

          {currentView === 'v_riu' && (
            <div className="p-6 max-w-7xl mx-auto">
              <VirtualRIUStudio
                rius={rius}
                onRefresh={onReload}
              />
            </div>
          )}

          {currentView === 'model_benchmarks' && (
            <div className="p-6 max-w-7xl mx-auto">
              <AIModelCenter />
            </div>
          )}

          {currentView === 'literature_research' && (
            <div className="p-6 max-w-7xl mx-auto">
              <ProjectDeckAndResearchView />
            </div>
          )}

          {currentView === 'about_portfolio' && (
            <div className="p-6 max-w-7xl mx-auto">
              <AboutPortfolioView />
            </div>
          )}

          {currentView === 'system_states' && (
            <div className="p-6 max-w-7xl mx-auto">
              <SystemStateInventoryView />
            </div>
          )}

          {currentView === 'traffic_dept' && (
            <div className="p-6 max-w-7xl mx-auto">
              <TrafficDeptPortal
                vehicle={vehicle}
                onControl={onControl}
                onNavigateTab={handleNav}
              />
            </div>
          )}

          {currentView === 'ui_ux_debugger' && (
            <div className="p-6 max-w-7xl mx-auto">
              <UIUXLayoutStudio
                vehicle={vehicle}
                rius={rius}
                signals={signals}
                onControl={onControl}
                onNavigateTab={handleNav}
              />
            </div>
          )}

          {currentView === 'vehicle_registry' && (
            <div className="p-6 max-w-7xl mx-auto">
              <VehicleRegistryView onNavigateTab={handleNav} />
            </div>
          )}

          {currentView === 'gvid_registry' && (
            <div className="p-6 max-w-7xl mx-auto">
              <GVIDRegistryView />
            </div>
          )}

          {currentView === 'evidence_workflow' && (
            <div className="p-6 max-w-7xl mx-auto">
              <EvidenceChallanWorkflowView />
            </div>
          )}

          {currentView === 'citizen_portal' && (
            <div className="p-6 max-w-7xl mx-auto">
              <CitizenPortalView />
            </div>
          )}

          {currentView === 'fleet_operations' && (
            <div className="p-6 max-w-7xl mx-auto">
              <FleetOperationsView />
            </div>
          )}

          {/* Auth Views */}
          {currentView === 'login' && (
            <LoginView
              onNavigate={handleNav}
              onLoginSuccess={(u) => {
                const found = PERSONAS.find(p => p.name.includes(u.name)) || PERSONAS[0];
                setSelectedPersona(found);
              }}
            />
          )}

          {currentView === 'register' && (
            <RegisterView onNavigate={handleNav} />
          )}

          {currentView === 'verify_email' && (
            <VerifyEmailView onNavigate={handleNav} />
          )}

          {currentView === 'forgot_password' && (
            <ForgotPasswordView onNavigate={handleNav} />
          )}

          {/* Legal Views */}
          {currentView === 'cookie_settings' && (
            <CookieSettingsView onNavigate={handleNav} />
          )}

          {currentView === 'privacy' && (
            <PrivacyPolicyView onNavigate={handleNav} />
          )}

          {currentView === 'terms' && (
            <TermsOfServiceView onNavigate={handleNav} />
          )}
        </main>

      </div>

    </div>
  );
};
