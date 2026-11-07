import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X, ChevronRight, Lock } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

export const CookieConsentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always active
    analytics: true,
    performance: true,
    marketing: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('roadsense_cookie_consent');
    if (!saved) {
      // Show consent banner on first visit
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    } else {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const all = { essential: true, analytics: true, performance: true, marketing: true };
    setPreferences(all);
    localStorage.setItem('roadsense_cookie_consent', JSON.stringify(all));
    setIsOpen(false);
  };

  const handleRejectNonEssential = () => {
    const min = { essential: true, analytics: false, performance: false, marketing: false };
    setPreferences(min);
    localStorage.setItem('roadsense_cookie_consent', JSON.stringify(min));
    setIsOpen(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('roadsense_cookie_consent', JSON.stringify(preferences));
    setIsOpen(false);
    setIsCustomizing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0B151C] border border-slate-800 text-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cookie className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">RoadSense AI Privacy &amp; Cookies</h3>
              <p className="text-[11px] text-slate-400">Technical telemetry &amp; spatial road caching preferences</p>
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!isCustomizing ? (
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            RoadSense AI uses essential session cookies for real-time WebSocket telemetry, MapLibre tile caching, and offline state recovery. We do not sell data or inject commercial trackers.
          </p>
        ) : (
          <div className="space-y-3 pt-1 text-xs">
            {/* Essential */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5 max-w-sm">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Essential Telemetry &amp; Caching</span>
                </div>
                <p className="text-[10px] text-slate-400">Required for live vehicle kinematics, WebSocket session tokens, and route rendering.</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ALWAYS ACTIVE
              </span>
            </div>

            {/* Analytics */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5 max-w-sm">
                <div className="font-bold text-white">AI Inference &amp; Kinematic Analytics</div>
                <p className="text-[10px] text-slate-400">Aggregates inference latency, FPS, and green-wave compliance metrics.</p>
              </div>
              <button
                onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  preferences.analytics ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {preferences.analytics ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Performance */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5 max-w-sm">
                <div className="font-bold text-white">High-Speed Map Tile Cache</div>
                <p className="text-[10px] text-slate-400">Caches vector and raster road layers locally in browser IndexedDB.</p>
              </div>
              <button
                onClick={() => setPreferences(p => ({ ...p, performance: !p.performance }))}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  preferences.performance ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {preferences.performance ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {!isCustomizing ? (
            <>
              <button
                onClick={() => setIsCustomizing(true)}
                className="text-xs text-slate-400 hover:text-emerald-400 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Customize Preferences</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRejectNonEssential}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsCustomizing(false)}
                className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
