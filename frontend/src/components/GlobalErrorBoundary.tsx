import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RoadSense AI Global Error Boundary intercepted:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => {
            regs.forEach((r) => r.unregister());
          });
        }
        if ('caches' in window) {
          caches.keys().then((keys) => {
            keys.forEach((k) => caches.delete(k));
          });
        }
        window.location.href = window.location.origin + window.location.pathname;
      }
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans antialiased">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                SYSTEM SAFE-MODE ACTIVE
              </span>
              <h2 className="text-xl font-black text-white">RoadSense AI Recovery Desk</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                A localized interface anomaly was intercepted. Tap below to refresh your session cache and restore full operational feeds.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-[11px] font-mono text-slate-400 text-left truncate">
                <span className="text-rose-400 font-bold block mb-0.5">Diagnostic Log:</span>
                {this.state.error.message || 'Interface state sync required'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear Cache &amp; Relaunch</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '/';
                  window.location.reload();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Official Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
