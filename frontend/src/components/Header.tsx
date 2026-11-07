import React from 'react';
import { 
  ShieldCheck, Navigation, Gauge, Bike, Cpu, 
  Radio, Database, BarChart3, Play, Pause, RotateCcw, 
  Layers, Signal, Activity, Sparkles, BookOpen, Home
} from 'lucide-react';
import { VehicleState } from '../types';

interface HeaderProps {
  primaryMode: 'control_center' | 'vehicle_experience';
  setPrimaryMode: (mode: 'control_center' | 'vehicle_experience') => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  vehicle: VehicleState | null;
  onControl: (action: string, params?: any) => void;
  onStartDemo: () => void;
  routes: any[];
}

export const Header: React.FC<HeaderProps> = ({
  primaryMode,
  setPrimaryMode,
  activeSubTab,
  setActiveSubTab,
  vehicle,
  onControl,
  onStartDemo,
  routes
}) => {
  const controlCenterTabs = [
    { id: 'home', label: 'Home Overview', icon: Home },
    { id: 'road_intelligence', label: 'Live Map', icon: Navigation },
    { id: 'model_benchmarks', label: 'AI Model Center', icon: Activity },
    { id: 'cvdv', label: 'CVDV Studio', icon: Layers },
    { id: 'v_riu', label: 'Virtual RIU', icon: Radio },
    { id: 'signals', label: 'Traffic Signals', icon: Signal },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about_portfolio', label: 'Architecture & About', icon: BookOpen },
  ];

  const vehicleExperienceTabs = [
    { id: 'car_cockpit', label: 'Car Cockpit HUD', icon: Gauge },
    { id: 'bike_display', label: 'Bike 6.7" Display', icon: Bike },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Experience Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-sans">
                  RoadSense <span className="text-emerald-600">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Hyderabad [Sim]
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Predictive Road Intelligence Platform
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Primary Mode Switcher (Control Center vs Vehicle Experience) */}
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center text-xs font-semibold">
            <button
              onClick={() => {
                setPrimaryMode('control_center');
                setActiveSubTab('road_intelligence');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                primaryMode === 'control_center'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏢 Control Center
            </button>
            <button
              onClick={() => {
                setPrimaryMode('vehicle_experience');
                setActiveSubTab('car_cockpit');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                primaryMode === 'vehicle_experience'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚗 Vehicle Experience
            </button>
          </div>
        </div>

        {/* Sub-Navigation Pills */}
        <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {(primaryMode === 'control_center' ? controlCenterTabs : vehicleExperienceTabs).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Simulation Telemetry & Controls */}
        <div className="flex items-center gap-2">
          {vehicle && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
              <button
                onClick={() => onControl(vehicle.is_running ? 'pause' : 'play')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold shadow-2xs flex items-center gap-1"
                title={vehicle.is_running ? 'Pause Simulation' : 'Play Simulation'}
              >
                {vehicle.is_running ? <Pause className="w-3 h-3 fill-slate-700" /> : <Play className="w-3 h-3 fill-slate-700" />}
                <span className="hidden sm:inline">{vehicle.is_running ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => onControl('reset')}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={onStartDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Run Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
