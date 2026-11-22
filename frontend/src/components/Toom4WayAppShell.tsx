import React, { useState, useEffect, useMemo } from 'react';
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
import { CookieSettingsView, PrivacyPolicyView, TermsOfServiceView } from './legal/LegalPages';
import { LoginView, RegisterView, VerifyEmailView, ForgotPasswordView } from './auth/AuthPages';
import { useAuth } from '../contexts/AuthContext';

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
  onNavigate?: (view: string) => void;
  initialView?: string;
}

interface NavItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeStyle?: string;
  active: boolean;
  onClick: (id: string) => void;
  ariaLabel?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  id,
  label,
  icon: Icon,
  badge,
  badgeStyle,
  active,
  onClick,
  ariaLabel,
}) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    aria-label={ariaLabel || label}
    aria-current={active ? 'page' : undefined}
    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
      active
        ? 'bg-gov-navy text-white font-semibold shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
    }`}
  >
    <div className="flex items-center gap-2.5 min-w-0 flex-1">
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className="truncate whitespace-nowrap font-medium text-xs tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className={`shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-tight leading-none ${
        active
          ? 'bg-white/20 text-white'
          : badgeStyle || 'bg-slate-100 text-slate-600'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

export const Toom4WayAppShell: React.FC<AppShellProps> = ({
  vehicle,
  rius,
  signals,
  routes,
  isWsConnected,
  onControl,
  onReload,
  onNavigate,
  initialView
}) => {
  const [currentView, setCurrentView] = useState<string>(initialView || 'operations_overview');
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(PERSONAS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [istTime, setIstTime] = useState<string>('');

  const { user, logout: authLogout } = useAuth();

  useEffect(() => {
    if (initialView && initialView !== currentView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

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

  // Navigation uses the passed onNavigate prop
  const handleNav = (view: string) => {
    if (view === 'home') {
      if (onNavigate) onNavigate('home');
      return;
    }
    setCurrentView(view);
    if (onNavigate) onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Map user role to default view
  const userDefaultView = useMemo(() => {
    if (!user) return 'car_cockpit';
    switch (user.role) {
      case 'enforcement_officer': return 'operations_overview';
      case 'system_admin': return 'traffic_dept';
      case 'fleet_operator': return 'fleet_operations';
      case 'ev_operator': return 'traffic_dept';
      case 'citizen':
      default: return 'car_cockpit';
    }
  }, [user]);

  const handleSelectPersona = (persona: UserPersona) => {
    setSelectedPersona(persona);
    setCurrentView(persona.defaultView);
    if (onNavigate) onNavigate(persona.defaultView);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderNavLinks = () => (
    <>
      {/* 1. PRIMARY OPERATIONS */}
      <nav className="space-y-1">
        <NavItem
          id="operations_overview"
          label="Command Overview"
          icon={Building2}
          badge="LIVE"
          badgeStyle="bg-emerald-100 text-emerald-800"
          active={currentView === 'operations_overview'}
          onClick={handleNav}
        />
        <NavItem
          id="tharun_demo"
          label="Tharun's Story"
          icon={Compass}
          badge="8 SCENES"
          badgeStyle="bg-indigo-100 text-indigo-800"
          active={currentView === 'tharun_demo'}
          onClick={handleNav}
        />
        <NavItem
          id="road_intelligence"
          label="Live Intelligence"
          icon={Navigation}
          badge="4 JUNC"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'road_intelligence'}
          onClick={handleNav}
        />
        <NavItem
          id="car_cockpit"
          label="Vehicle Experience"
          icon={Car}
          badge="GLOSA"
          badgeStyle="bg-emerald-50 text-emerald-700 border border-emerald-200"
          active={currentView === 'car_cockpit'}
          onClick={handleNav}
        />
        <NavItem
          id="home"
          label="Official Home Page"
          icon={Home}
          badge="PORTAL"
          badgeStyle="bg-emerald-50 text-[#00875A] font-bold border border-emerald-200"
          active={currentView === 'home'}
          onClick={handleNav}
        />
        <NavItem
          id="traffic_dept"
          label="Corridors & EVP"
          icon={Activity}
          badge="3 ACTIVE"
          badgeStyle="bg-rose-100 text-rose-800"
          active={currentView === 'traffic_dept'}
          onClick={handleNav}
        />
      </nav>

      {/* 2. VEHICLES & ENFORCEMENT */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Vehicles & Enforcement
        </div>

        <NavItem
          id="vehicle_registry"
          label="Vehicle Registry"
          icon={Car}
          badge="1.4M TS"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'vehicle_registry'}
          onClick={handleNav}
        />

        <NavItem
          id="gvid_registry"
          label="GVID Hardware Hub"
          icon={Cpu}
          badge="V2X"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'gvid_registry'}
          onClick={handleNav}
        />

        <NavItem
          id="evidence_workflow"
          label="Evidence & Challan"
          icon={FileCheck}
          badge="9 CASES"
          badgeStyle="bg-amber-100 text-amber-900"
          active={currentView === 'evidence_workflow'}
          onClick={handleNav}
        />
      </div>

      {/* 3. CITIZEN & TRANSIT */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Citizen & Transit
        </div>

        <NavItem
          id="citizen_portal"
          label="Citizen Portal"
          icon={User}
          badge="ZERO-FEE"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'citizen_portal'}
          onClick={handleNav}
        />

        <NavItem
          id="fleet_operations"
          label="Public Transit"
          icon={Bus}
          badge="42 FLEET"
          badgeStyle="bg-amber-100 text-amber-900"
          active={currentView === 'fleet_operations'}
          onClick={handleNav}
        />
      </div>

      {/* 4. INTELLIGENCE LAB */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Intelligence Lab
        </div>

        <NavItem
          id="camera_tracker"
          label="Camera & Tracking"
          icon={Camera}
          badge="HD 4K"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'camera_tracker'}
          onClick={handleNav}
        />

        <NavItem
          id="cvdv"
          label="AI Vision Lab"
          icon={Cpu}
          badge="YOLOv8"
          badgeStyle="bg-indigo-50 text-indigo-700"
          active={currentView === 'cvdv'}
          onClick={handleNav}
        />

        <NavItem
          id="v_riu"
          label="Virtual RIU"
          icon={Radio}
          badge="4 NODES"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'v_riu'}
          onClick={handleNav}
        />

        <NavItem
          id="decision_engine"
          label="Decision Engine"
          icon={Zap}
          badge="10ms"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'decision_engine'}
          onClick={handleNav}
        />

        <NavItem
          id="ui_ux_debugger"
          label="UI/UX Debugger"
          icon={Layers}
          badge="ISO"
          badgeStyle="bg-slate-100 text-slate-600"
          active={currentView === 'ui_ux_debugger'}
          onClick={handleNav}
        />
      </div>

      {/* 5. RESEARCH */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          Research
        </div>

        <NavItem
          id="literature_research"
          label="Literature & Research"
          icon={BookOpen}
          active={currentView === 'literature_research'}
          onClick={handleNav}
        />

        <NavItem
          id="about_portfolio"
          label="System Architecture"
          icon={Layers}
          active={currentView === 'about_portfolio'}
          onClick={handleNav}
        />
      </div>

      {/* 6. SYSTEM */}
      <div className="space-y-1 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
          System
        </div>

        <NavItem
          id="system_states"
          label="Settings & States"
          icon={Settings}
          active={currentView === 'system_states'}
          onClick={handleNav}
        />

        <NavItem
          id="terms"
          label="Help & Legal"
          icon={HelpCircle}
          active={currentView === 'terms'}
          onClick={handleNav}
        />
      </div>
    </>
  );

  // ================= 1. DEDICATED OFFICIAL PUBLIC HOME PAGE (NO SIDEBAR) =================
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gov-canvas text-gov-slate font-sans">
        <Toom4WayPublicHome
          vehicle={vehicle}
          rius={rius}
          signals={signals}
          onNavigateTab={handleNav}
          onControl={onControl}
          onSelectPersona={(personaId) => {
            const found = PERSONAS.find(p => p.id === personaId);
            if (found) {
              handleSelectPersona(found);
            } else {
              handleNav('operations_overview');
            }
          }}
        />
      </div>
    );
  }

  // ================= 2. DEDICATED SECURE AUTHENTICATION VIEW (NO SIDEBAR) =================
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gov-canvas text-gov-slate flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => handleNav('home')}>
            <RoadSenseLogo size="md" />
          </div>
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            ← Return to Official Home Page
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <LoginView
            onNavigate={handleNav}
            onLoginSuccess={(u) => {
              const found = PERSONAS.find(p => p.name.includes(u.name)) || PERSONAS[0];
              handleSelectPersona(found);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F6F8FB] text-[#0F172A] font-sans antialiased">

      {/* ================= 1. DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#E2E8F0] flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-y-auto">
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
            <div className="text-xs font-bold text-slate-900">Citizen Driver</div>
            <div className="text-[10px] text-slate-500">Vehicle Owner</div>
            <div className="text-[10px] font-mono text-[#0A2540] font-semibold mt-1">Badge: TS 09 EV 4412</div>
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
                aria-label="Search road event, vehicle, plate, or junction"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy text-slate-900 transition-colors"
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

            {/* Return to Official Home Page */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors"
              title="Return to Official Public Portal"
            >
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Official Home</span>
            </button>

            {/* Live Connected Status */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F8F3] rounded-xl text-xs font-semibold text-[#00875A] border border-[#00875A]/20">
              <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
              <span>Live Connected</span>
              <span className="text-[10px] text-slate-600 font-normal pl-1 border-l border-emerald-300">All Systems Online</span>
            </div>

            {/* Alert Notifications */}
            <button
              type="button"
              aria-label="3 Unread Alert Notifications"
              className="relative p-2 text-slate-600 hover:text-slate-900 cursor-pointer rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            {/* Interactive User Profile Dropdown with Logout */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0] cursor-pointer select-none text-left rounded-lg p-1 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
                aria-expanded={profileDropdownOpen}
              >
                <div className={`w-8 h-8 rounded-full ${selectedPersona.badgeColor || 'bg-gov-navy text-white'} font-bold text-xs flex items-center justify-center shadow-xs shrink-0 text-white`}>
                  {selectedPersona.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight whitespace-nowrap">{selectedPersona.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap mt-0.5">{selectedPersona.shortRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-3 space-y-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">

                  {/* User Profile Header */}
                  <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Active Session
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {selectedPersona.role} • {selectedPersona.jurisdiction}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    <div className="p-2.5 rounded-xl border transition-all bg-white text-slate-800">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-7 h-7 rounded-lg ${selectedPersona.badgeColor || 'bg-gov-navy text-white'} flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 text-white`}>
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold leading-tight text-slate-900">
                                {selectedPersona.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800 uppercase">
                                {selectedPersona.category}
                              </span>
                            </div>
                            <div className="text-[11px] font-medium leading-tight mt-0.5 text-slate-600">
                              {selectedPersona.role}
                            </div>
                            <div className="text-[10px] font-medium mt-0.5 text-emerald-700">
                              Badge / ID: {selectedPersona.badge}
                            </div>
                            <div className="text-[10px] mt-0.5 text-slate-400">
                              Jurisdiction: {selectedPersona.jurisdiction}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={async () => {
                          if (authLogout) await authLogout();
                          setProfileDropdownOpen(false);
                          handleNav('home');
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 font-medium flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out to Official Home</span>
                        </span>
                      </button>
                    </div>
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
        <main id="main-content" className="flex-1">
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
              onSelectPersona={(personaId) => {
                const found = PERSONAS.find(p => p.id === personaId);
                if (found) {
                  handleNav(found.defaultView);
                } else {
                  handleNav('operations_overview');
                }
              }}
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
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
              <CarCockpitHMI
                vehicle={vehicle}
                onControl={onControl}
                routes={routes}
                signals={signals}
                rius={rius}
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
            <div className="p-6 max-w-7xl mx-auto">
              <LoginView
                onNavigate={handleNav}
                onLoginSuccess={(u) => {
                  handleNav('car_cockpit');
                }}
              />
            </div>
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