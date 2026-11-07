import React from 'react';
import { 
  ShieldCheck, Radio, Navigation, Gauge, Bike, 
  Cpu, Database, BarChart3, Play, AlertTriangle 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onStartDemo: () => void;
  isWsConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onStartDemo,
  isWsConnected
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: Navigation },
    { id: 'car_ui', label: 'Car Cockpit HMI', icon: Gauge },
    { id: 'bike_ui', label: 'Bike 6.7" Display', icon: Bike },
    { id: 'detector', label: 'AI Vision Studio', icon: Cpu },
    { id: 'v_riu', label: 'Virtual RIU Manager', icon: Radio },
    { id: 'model_center', label: 'AI Model & Metrics', icon: Database },
    { id: 'analytics', label: 'Analytics & Health', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & City Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                RoadSense <span className="text-brand-500 font-extrabold">AI</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30">
                Hyderabad [Simulation]
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Predictive Road Intelligence Platform • 100% Software Architecture
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-500 text-slate-950 font-semibold shadow-md shadow-brand-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Actions & Status */}
        <div className="flex items-center gap-3">
          {/* WebSocket Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isWsConnected ? 'bg-brand-500 animate-pulse' : 'bg-rose-500'}`} />
            {isWsConnected ? 'Live V2X Sync' : 'Reconnecting'}
          </div>

          {/* Quick Demo Button */}
          <button
            onClick={onStartDemo}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-brand-500/25 transition-all transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            START DEMO
          </button>
        </div>
      </div>
    </header>
  );
};
