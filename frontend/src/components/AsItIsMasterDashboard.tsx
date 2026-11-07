import React, { useState, useEffect } from 'react';
import { 
  Home, Navigation, Gauge, Cpu, Radio, Play, 
  Settings, HelpCircle, BookOpen, Layers, Search, MapPin, 
  Bell, ChevronDown, Check, Maximize2, Plus, Minus, 
  Compass, ArrowRight, AlertTriangle, Activity, Zap, RefreshCw,
  Camera, Sliders, Car, Crosshair, Sparkles, CheckCircle2
} from 'lucide-react';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';
import { RealNavigationMap } from './RealNavigationMap';

interface Props {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onControl: (action: string, params?: any) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const AsItIsMasterDashboard: React.FC<Props> = ({
  vehicle,
  rius,
  signals,
  onControl,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState<'traffic' | 'satellite' | '3d'>('traffic');
  const [timelineTick, setTimelineTick] = useState<number>(15);

  // Dynamic signal timeline animation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimelineTick((prev) => (prev > 1 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FB] text-[#0F172A] font-sans antialiased">
      
      {/* ================= 1. LEFT SIDEBAR NAVIGATION ================= */}
      <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none">
        <div className="p-5 space-y-6">
          
          {/* Brand / Logo: Toom4Way */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNav('home')}>
            <div className="w-9 h-9 rounded-xl bg-[#00875A] flex items-center justify-center text-white shadow-sm">
              {/* Stylized road chevron */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22L9 2M20 22L15 2" stroke="white" strokeWidth="2.5" />
                <path d="M12 5V8M12 12V15M12 19V22" stroke="white" strokeWidth="2" strokeDasharray="1 2" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-lg text-[#0F172A] tracking-tight leading-none">
                Toom4Way
              </div>
              <div className="text-[10px] text-[#00875A] font-medium tracking-tight mt-0.5">
                Predictive Road Intelligence
              </div>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#00875A]' : 'text-slate-400'}`} />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNav('road_intelligence')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'road_intelligence'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Navigation className="w-4 h-4 text-slate-400" />
              <span>Live Intelligence</span>
            </button>

            <button
              onClick={() => handleNav('car_cockpit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'car_cockpit'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Car className="w-4 h-4 text-slate-400" />
              <span>Vehicle Experience</span>
            </button>
          </nav>

          {/* Group: INTELLIGENCE LAB */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-3 pb-1">
              Intelligence Lab
            </div>
            
            <button
              onClick={() => handleNav('camera_tracker')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'camera_tracker'
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
                activeTab === 'cvdv'
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
                activeTab === 'v_riu'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Radio className="w-4 h-4 text-slate-400" />
              <span>Virtual RIU</span>
            </button>

            <button
              onClick={() => handleNav('road_intelligence')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'simulation_lab'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Play className="w-4 h-4 text-slate-400" />
              <span>Simulation Lab</span>
            </button>

            <button
              onClick={() => handleNav('decision_engine')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'decision_engine'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Zap className="w-4 h-4 text-[#00875A]" />
              <span>Decision Engine</span>
            </button>
          </div>

          {/* Group: RESEARCH */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-3 pb-1">
              Research
            </div>

            <button
              onClick={() => handleNav('literature_research')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'literature_research'
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
                activeTab === 'about_portfolio'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>System Architecture</span>
            </button>
          </div>

          {/* Group: SYSTEM */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-3 pb-1">
              System
            </div>

            <button
              onClick={() => handleNav('system_states')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'system_states'
                  ? 'bg-[#E6F8F3] text-[#00875A] font-bold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 font-medium'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => handleNav('system_states')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help & Support</span>
            </button>
          </div>

        </div>
      </aside>

      {/* ================= 2. MAIN WORKSPACE CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top App Header */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search location, road event, vehicle, or run simulation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A] transition-all placeholder:text-slate-400 text-slate-800"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            
            {/* Location Selector */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8FAFC] hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-700 cursor-pointer border border-slate-200 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Hyderabad, TS</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Live Indicator Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F8F3] rounded-xl text-xs font-semibold text-[#00875A] border border-[#00875A]/20">
              <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
              <span>Live Connected</span>
              <span className="text-[10px] text-slate-500 font-normal pl-1 border-l border-emerald-300">All Systems Online</span>
            </div>

            {/* Notification Bell */}
            <div className="relative p-2 text-slate-600 hover:text-slate-900 cursor-pointer rounded-xl hover:bg-slate-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-none">Admin</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Research Mode
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <main className="p-6 space-y-6 flex-1 max-w-[1520px] w-full mx-auto">
          
          {/* ================= 1. HERO SECTION BANNER ================= */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[11px] font-bold text-[#00875A] uppercase tracking-wider">
                WELCOME TO TOOM4WAY
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Smarter Roads. <span className="text-[#00875A]">Safer Journeys.</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Detecting traffic signs, signals and roadside infrastructure to enable safer, smarter and more connected mobility for Indian roads.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button 
                onClick={() => handleNav('road_intelligence')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Live Intelligence</span>
              </button>

              <button 
                onClick={() => onControl('play')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>
                <span>Run Simulation</span>
              </button>

              <button 
                onClick={() => handleNav('about_portfolio')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                <span>Explore Demo</span>
              </button>
            </div>
          </div>

          {/* ================= 2. LIVE INTERACTIVE MAP CARD ================= */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
            
            {/* Map Card Header */}
            <div className="p-3.5 px-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#00875A]" />
                <span className="font-bold text-sm text-slate-900">Live Map</span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer">
                  <span>Hyderabad</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* Map Layer Mode Switcher */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMapLayer('traffic')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mapLayer === 'traffic'
                      ? 'bg-[#00875A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Traffic
                </button>
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mapLayer === 'satellite'
                      ? 'bg-[#00875A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapLayer('3d')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mapLayer === '3d'
                      ? 'bg-[#00875A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  3D
                </button>
              </div>
            </div>

            {/* Real Map Canvas Container with Floating Overlay Callouts */}
            <div className="relative w-full h-[400px] bg-slate-100 overflow-hidden">
              <RealNavigationMap
                vehicle={vehicle}
                rius={rius}
                signals={signals}
              />

              {/* Map Callout 1: Red Signal 80m ahead (Somajiguda / Tank Bund) */}
              <div className="absolute top-12 right-1/4 bg-white/95 backdrop-blur-md border border-red-200 shadow-lg rounded-xl p-2 px-3 flex items-center gap-2 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <div>
                  <div className="text-[11px] font-bold text-red-600 leading-tight">Red signal</div>
                  <div className="text-[10px] text-slate-500 font-mono">80 m ahead - {timelineTick} s</div>
                </div>
              </div>

              {/* Map Callout 2: Speed Limit 50 km/h (Banjara Hills) */}
              <div className="absolute top-32 left-1/3 bg-white/95 backdrop-blur-md border border-slate-200 shadow-md rounded-xl p-1.5 px-2.5 flex items-center gap-2 pointer-events-none">
                <div className="w-6 h-6 rounded-full border-2 border-red-600 bg-white flex items-center justify-center font-bold text-[10px] text-slate-900">
                  50
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">Speed Limit</div>
                  <div className="text-[10px] text-slate-500 font-mono">50 km/h</div>
                </div>
              </div>

              {/* Map Callout 3: Road Work 300 m ahead */}
              <div className="absolute bottom-16 right-1/3 bg-white/95 backdrop-blur-md border border-amber-200 shadow-md rounded-xl p-1.5 px-2.5 flex items-center gap-2 pointer-events-none">
                <div className="p-1 rounded bg-amber-100 text-amber-600 font-bold text-xs">
                  ⚠️
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">Road Work</div>
                  <div className="text-[10px] text-slate-500 font-mono">300 m ahead</div>
                </div>
              </div>

              {/* Floating Map Zoom & Target Controls */}
              <div className="absolute right-4 top-14 flex flex-col gap-1.5 shadow-md">
                <button className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer">
                  <Crosshair className="w-4 h-4 text-slate-600" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer">
                  +
                </button>
                <button className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer">
                  -
                </button>
              </div>

              {/* Map Scale Bar */}
              <div className="absolute bottom-3 right-4 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 border border-slate-300">
                1 km
              </div>
            </div>

            {/* Map Sensor Status Bar (Bottom Strip) */}
            <div className="p-3 px-6 bg-white border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    Camera <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                    <span className="text-[11px] font-normal text-[#00875A]">Active</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">30 FPS</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    GPS <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                    <span className="text-[11px] font-normal text-[#00875A]">Locked</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">±6 m</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    V2X / SPaT <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                    <span className="text-[11px] font-normal text-[#00875A]">Connected</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">Signal data received</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    AI Model <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                    <span className="text-[11px] font-normal text-[#00875A]">Running</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">EfficientNet-B0</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    Decision Engine <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                    <span className="text-[11px] font-normal text-[#00875A]">Active</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">Processing rules</div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= 3. 7-STAGE TOOM4WAY AI PIPELINE FLOW ================= */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Toom4Way AI Pipeline
                </h3>
                <span className="text-xs text-slate-400">— 7-Stage Perception-to-Actuation Flow</span>
              </div>
              <button
                onClick={() => handleNav('about_portfolio')}
                className="text-xs font-semibold text-[#00875A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 7 Interactive Stage Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Stage 1 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">1</span>
                  <span className="text-slate-400">🗄️</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Dataset</div>
                <div className="text-[10px] text-slate-500 font-mono">GTSRB Offline Training</div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">2</span>
                  <span className="text-slate-400">⚙️</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Model Training</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">CNN/ResNet/MobileNet</div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">3</span>
                  <span className="text-slate-400">📦</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Trained Model</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">Real-Time Inference</div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
                </div>
              </div>

              {/* Stage 4 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">4</span>
                  <span className="text-slate-400">📹</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Live Camera / V2X</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">Real-Time Perception</div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </div>
              </div>

              {/* Stage 5 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">5</span>
                  <span className="text-slate-400">📍</span>
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">Context Validation</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">Fusion & Map Match</div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </div>
              </div>

              {/* Stage 6: DECISION ENGINE (Highlighted in green border) */}
              <div 
                onClick={() => handleNav('decision_engine')}
                className="p-3 rounded-xl border-2 border-[#00875A] bg-[#E6F8F3] space-y-1.5 cursor-pointer shadow-sm hover:scale-102 transition-transform"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#00875A] text-white font-bold flex items-center justify-center text-[10px]">6</span>
                  <Zap className="w-3.5 h-3.5 text-[#00875A]" />
                </div>
                <div className="font-bold text-xs text-[#00875A]">Decision Engine</div>
                <div className="text-[10px] text-slate-600 font-mono truncate">Traffic Rules & Physics</div>
                <div className="text-[10px] font-semibold text-[#00875A] flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Processing
                </div>
              </div>

              {/* Stage 7 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">7</span>
                  <span className="text-slate-400">🚗</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Vehicle HMI</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">Alerts & Control</div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </div>
              </div>
            </div>
          </div>

          {/* ================= 4. BOTTOM THREE SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Card 1: Current Road Event (Span 5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Current Road Event
                </h3>
                <button
                  onClick={() => handleNav('road_intelligence')}
                  className="text-xs font-semibold text-[#00875A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-start gap-3.5 pt-1">
                {/* Traffic Light Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 flex items-center justify-center relative">
                  <div className="w-8 h-18 bg-black/90 rounded-lg p-1.5 flex flex-col items-center justify-between border border-slate-700">
                    <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-md shadow-red-500/50" />
                    <span className="w-4 h-4 rounded-full bg-slate-800" />
                    <span className="w-4 h-4 rounded-full bg-slate-800" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold border border-red-200">
                    Traffic Signal
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    Red signal — 80 m ahead
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Remaining time: <strong className="text-red-600 font-bold">{timelineTick} seconds</strong>
                  </p>

                  <div className="p-2 rounded-lg bg-red-50 border border-red-200/80 text-[11px] text-red-800 font-medium flex items-center gap-1.5 mt-2">
                    <span>🛑</span>
                    <span><strong>Prepare to stop:</strong> Decelerate smoothly to stop before the stop line.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <div>Confidence: <strong className="text-slate-900 font-bold">96%</strong></div>
                <div className="flex items-center gap-2">
                  <span>📷 Camera</span>
                  <span>📡 V2X (SPaT)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Signal Timeline (SPaT) (Span 4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Signal Timeline (SPaT)
              </h3>

              <div className="space-y-3 pt-2">
                {/* Multi-segment Progress Bar with Active Needle */}
                <div className="relative h-7 rounded-xl overflow-hidden flex shadow-inner">
                  <div className="bg-red-500 flex items-center justify-center text-white text-[11px] font-bold" style={{ width: '25%' }}>
                    15 s
                  </div>
                  <div className="bg-amber-400 flex items-center justify-center text-slate-900 text-[11px] font-bold" style={{ width: '15%' }}>
                    5 s
                  </div>
                  <div className="bg-emerald-500 flex items-center justify-center text-white text-[11px] font-bold" style={{ width: '60%' }}>
                    40 s
                  </div>
                  
                  {/* Real-time needle indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-md transition-all duration-1000"
                    style={{ left: `${Math.min(24, Math.max(1, (16 - timelineTick) * 1.5))}%` }}
                  />
                </div>

                {/* Timeline labels */}
                <div className="grid grid-cols-3 text-center text-xs font-mono">
                  <div>
                    <span className="block text-red-600 font-bold">15 s</span>
                    <span className="text-[10px] text-slate-500">Red (Current)</span>
                  </div>
                  <div>
                    <span className="block text-amber-500 font-bold">5 s</span>
                    <span className="text-[10px] text-slate-500">Yellow</span>
                  </div>
                  <div>
                    <span className="block text-emerald-600 font-bold">40 s</span>
                    <span className="text-[10px] text-slate-500">Green</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: System Health (Span 3 cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  System Health
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Systems Operational
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono pt-1">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Backend API</span>
                  <span className="text-slate-400">Online 42 ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> WebSocket</span>
                  <span className="text-slate-400">Connected 28 ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Map Service</span>
                  <span className="text-slate-400">Healthy 36 ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> GPS Service</span>
                  <span className="text-slate-400">Locked ±6 m</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> V2X Service</span>
                  <span className="text-slate-400">Receiving 12 ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> AI Model</span>
                  <span className="text-slate-400">Running 18 ms</span>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};
