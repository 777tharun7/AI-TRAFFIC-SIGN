import React, { useState } from 'react';
import { 
  Sliders, ShieldCheck, AlertTriangle, Wifi, WifiOff, Camera, 
  MapPin, Radio, Brain, Zap, Cookie, ServerCrash, RefreshCw, 
  X, Check, Lock, ChevronRight, Layers, Eye, Play, Sparkles
} from 'lucide-react';
import { SystemErrorInfo } from './SystemErrorModal';

interface Props {
  onTriggerError: (error: SystemErrorInfo | null) => void;
  onToggleForcedOffline: (val: boolean) => void;
  onOpenCookieModal: () => void;
  onNavigateTab: (tabId: string) => void;
  isForcedOffline: boolean;
}

export const StateInspectorDrawer: React.FC<Props> = ({
  onTriggerError,
  onToggleForcedOffline,
  onOpenCookieModal,
  onNavigateTab,
  isForcedOffline
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [simulatedAIFailure, setSimulatedAIFailure] = useState<boolean>(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'network', name: '📡 Network & WS' },
    { id: 'server', name: '🖥️ Server & Errors' },
    { id: 'camera', name: '📷 Camera & Perms' },
    { id: 'ai', name: '🤖 AI & Confidence' },
    { id: 'v2x', name: '📡 V2X & SPaT' },
    { id: 'decision', name: '🚦 Decision Engine' },
    { id: 'cookies', name: '🍪 Cookies & Legal' }
  ];

  const stateActions = [
    // 1. Network & Connectivity
    {
      category: 'network',
      name: 'Simulate Offline / Network Lost',
      code: 'NET-OFFLINE',
      desc: 'Triggers top banner and switches vehicle to offline dead-reckoning.',
      action: () => onToggleForcedOffline(!isForcedOffline),
      active: isForcedOffline,
      badge: 'Network'
    },
    // 2. Server Errors
    {
      category: 'server',
      name: 'Trigger RS-503 Service Unavailable',
      code: 'RS-503',
      desc: 'Simulates backend maintenance / intelligence API down.',
      action: () => onTriggerError({
        code: 'RS-503',
        title: 'RoadSense Intelligence Service Unavailable',
        message: 'Could not connect to the real-time kinematic decision stream.',
        detail: 'HTTP 503 Backend Service Down: WebSocket handshake timeout on port 8000',
        actionText: 'Retry Connection',
        onRetry: () => onTriggerError(null)
      }),
      badge: 'Server'
    },
    {
      category: 'server',
      name: 'Trigger RS-429 Rate Limit Exceeded',
      code: 'RS-429',
      desc: 'Simulates rate limiting on public camera perception streams.',
      action: () => onTriggerError({
        code: 'RS-429',
        title: 'Perception Request Rate Limit Exceeded',
        message: 'Too many frame inference calls per second. Throttling active.',
        detail: 'RateLimitViolation: Ingestion rate 62 FPS > Allowed 30 FPS quota',
        actionText: 'Resume Normal Stream',
        onRetry: () => onTriggerError(null)
      }),
      badge: 'Server'
    },
    // 3. Camera & Permissions
    {
      category: 'camera',
      name: 'Simulate Camera Permission Denied',
      code: 'CAM-DENIED',
      desc: 'Displays browser camera access prompt and fallback guidelines.',
      action: () => onTriggerError({
        code: 'RS-CAM-DENIED',
        title: 'Camera Access Denied by User / Browser',
        message: 'RoadSense AI requires camera stream access for live optical perception.',
        detail: 'Navigator.mediaDevices.getUserMedia rejected with NotAllowedError',
        actionText: 'Request Permission Again',
        onRetry: () => onTriggerError(null)
      }),
      badge: 'Camera'
    },
    // 4. AI Confidence & Fallbacks
    {
      category: 'ai',
      name: 'Simulate Low AI Confidence Warning (<0.70)',
      code: 'AI-UNCERTAIN',
      desc: 'Triggers uncertain detection state requiring V2X context confirmation.',
      action: () => onTriggerError({
        code: 'RS-AI-LOW-CONFIDENCE',
        title: 'Low Confidence Perception Event (61.4%)',
        message: 'Optical sign recognition confidence below threshold. Safe fallback enforced.',
        detail: 'Detection: SPEED_LIMIT_40 (Conf: 0.614 < Threshold: 0.700) -> Deferring to V-RIU',
        actionText: 'Accept with V2X Confirmation',
        onRetry: () => onTriggerError(null)
      }),
      badge: 'AI Perception'
    },
    // 5. V2X & SPaT
    {
      category: 'v2x',
      name: 'Simulate SPaT Signal Stale Data',
      code: 'SPAT-STALE',
      desc: 'Signal controller heartbeat missing for >5.0s, switches to camera vision.',
      action: () => onTriggerError({
        code: 'RS-SPAT-TIMEOUT',
        title: 'Infrastructure SPaT Broadcast Stale',
        message: 'Traffic signal countdown timed out. Falling back to camera perception.',
        detail: 'DSRC Channel 172 Heartbeat Loss: Last frame received 6.4s ago',
        actionText: 'Reconnect SPaT Stream',
        onRetry: () => onTriggerError(null)
      }),
      badge: 'V2X'
    },
    // 6. Cookies & Consent
    {
      category: 'cookies',
      name: 'Open Cookie Consent Modal',
      code: 'COOKIE-PREF',
      desc: 'Opens the production privacy preferences & telemetry caching modal.',
      action: onOpenCookieModal,
      badge: 'Privacy'
    }
  ];

  const filtered = activeCategory === 'all' 
    ? stateActions 
    : stateActions.filter(s => s.category === activeCategory);

  return (
    <>
      {/* Floating State Inspector Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-emerald-400 border border-emerald-500/40 font-mono text-xs font-black shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-emerald-500/20"
      >
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>System States (80+ Inventory)</span>
      </button>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0B151C] border-l border-slate-800 text-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">System State Inspector</h2>
                    <span className="text-[10px] font-mono text-slate-400">80+ UI &amp; Machine States</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg shrink-0 font-bold transition-all ${
                      activeCategory === c.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* State List Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Click any interactive state trigger below to test how RoadSense AI gracefully handles failures, edge-cases, and recovery in real-time.
              </p>

              <div className="space-y-2.5 pt-2">
                {filtered.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{item.name}</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-mono font-bold">
                        {item.code}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {item.desc}
                    </p>

                    <button
                      onClick={item.action}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        item.active 
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40' 
                          : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200'
                      }`}
                    >
                      <span>{item.active ? '✓ Simulation Active (Click to Revert)' : 'Simulate This State'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Production Health: NORMAL</span>
              </span>
              <button
                onClick={() => {
                  onTriggerError(null);
                  onToggleForcedOffline(false);
                }}
                className="text-slate-400 hover:text-white underline font-bold"
              >
                Reset All States
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
