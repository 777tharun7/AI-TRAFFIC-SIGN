import React, { useState, useEffect } from 'react';
import { 
  Home, Navigation, Gauge, Cpu, Radio, Play, 
  Settings, HelpCircle, BookOpen, Layers, Search, MapPin, 
  Bell, ChevronDown, Check, Maximize2, Plus, Minus, 
  Compass, ArrowRight, AlertTriangle, Activity, Zap, RefreshCw,
  Camera, Sliders, Car, Crosshair, Sparkles, CheckCircle2,
  LogIn, User, Shield, Menu, X, LogOut
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
import { LoginView, RegisterView, VerifyEmailView, ForgotPasswordView } from './auth/AuthPages';
import { CookieSettingsView, PrivacyPolicyView, TermsOfServiceView } from './legal/LegalPages';

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
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>({
    name: 'Admin',
    email: 'admin@toom4way.ai'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  const handleNav = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FB] text-[#0F172A] font-sans antialiased">
      
      {/* ================= 1. DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-slate-200/90 flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 space-y-6">
          
          {/* Logo / Brand Header */}
          <div className="cursor-pointer py-1" onClick={() => handleNav('home')}>
            <RoadSenseLogo size="md" />
          </div>

          {/* MAIN Navigation */}
          <nav className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Home className={`w-4 h-4 ${currentView === 'home' ? 'text-[#00875A]' : 'text-slate-400'}`} />
              <span>Home (Product)</span>
            </button>

            <button
              onClick={() => handleNav('road_intelligence')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'road_intelligence'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Navigation className="w-4 h-4 text-slate-400" />
              <span>Live Intelligence</span>
            </button>

            <button
              onClick={() => handleNav('car_cockpit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'car_cockpit'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Car className="w-4 h-4 text-slate-400" />
              <span>Vehicle Experience</span>
            </button>
          </nav>

          {/* INTELLIGENCE LAB */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-3 pb-1">
              Intelligence Lab
            </div>

            <button
              onClick={() => handleNav('camera_tracker')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'camera_tracker'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Camera className="w-4 h-4 text-slate-400" />
              <span>Live Camera & Tracking</span>
            </button>

            <button
              onClick={() => handleNav('cvdv')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'cvdv'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              <span>AI Vision Lab</span>
            </button>

            <button
              onClick={() => handleNav('v_riu')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'v_riu'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Radio className="w-4 h-4 text-slate-400" />
              <span>Virtual RIU</span>
            </button>

            <button
              onClick={() => handleNav('decision_engine')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'decision_engine'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Zap className="w-4 h-4 text-[#00875A]" />
              <span>Decision Engine (Pt 6)</span>
            </button>
          </div>

          {/* RESEARCH */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-3 pb-1">
              Research
            </div>

            <button
              onClick={() => handleNav('literature_research')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'literature_research'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Literature & Research</span>
            </button>

            <button
              onClick={() => handleNav('about_portfolio')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'about_portfolio'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>System Architecture</span>
            </button>
          </div>

          {/* SYSTEM */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-3 pb-1">
              System
            </div>

            <button
              onClick={() => handleNav('system_states')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                currentView === 'system_states'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings & States</span>
            </button>

            <button
              onClick={() => handleNav('terms')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help & Legal</span>
            </button>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 text-xs font-mono text-slate-400 text-center">
          <span>RoadSense AI • Connected Mobility</span>
        </div>
      </aside>

      {/* ================= 2. MAIN APPLICATION WORKSPACE ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          
          {/* Left: Mobile Menu Toggle & Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search location, road event, vehicle, or run simulation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A] text-slate-900"
              />
            </div>
          </div>

          {/* Right: Location, Live Status, Profile */}
          <div className="flex items-center gap-3">
            
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] rounded-xl text-xs font-medium text-slate-700 border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Hyderabad, TS</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F8F3] rounded-xl text-xs font-semibold text-[#00875A] border border-[#00875A]/20">
              <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
              <span>Live Connected</span>
              <span className="text-[10px] text-slate-500 font-normal pl-1 border-l border-emerald-300">All Systems Online</span>
            </div>

            <div className="relative p-2 text-slate-600 hover:text-slate-900 cursor-pointer rounded-xl hover:bg-slate-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </div>

            {/* Profile Avatar / Login Toggle */}
            <div className="relative">
              {currentUser ? (
                <div
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">Research Mode</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00875A] text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-[#00744E] cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 font-mono text-slate-500 truncate">
                    {currentUser.email}
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('system_states');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                  >
                    System Diagnostics
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('cookie_settings');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                  >
                    Cookie Settings
                  </button>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setProfileDropdownOpen(false);
                      handleNav('login');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-600 font-medium flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Subview Back Banner (When in nested views) */}
        {currentView !== 'home' && (
          <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between sticky top-16 z-20 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNav('home')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>← Back to Public Overview</span>
              </button>
              <span className="text-slate-400 text-xs">|</span>
              <span className="font-extrabold text-xs tracking-tight text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#00875A]" />
                RoadSense AI • <span className="capitalize text-slate-300 font-normal">{currentView.replace(/_/g, ' ')}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onControl(vehicle?.is_running ? 'pause' : 'play')}
                className="px-2.5 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold cursor-pointer"
              >
                {vehicle?.is_running ? '⏸ Pause Simulation' : '▶ Play Simulation'}
              </button>
            </div>
          </div>
        )}

        {/* View Router Main Body */}
        <main className="flex-1">
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

          {/* Auth Views */}
          {currentView === 'login' && (
            <LoginView
              onNavigate={handleNav}
              onLoginSuccess={(u) => setCurrentUser(u)}
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
