import React from 'react';
import { AlertOctagon, RefreshCw, Home, ServerCrash, ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export interface SystemErrorInfo {
  code: string; // e.g., "RS-503", "RS-500", "RS-404", "RS-CAMERA-DENIED"
  title: string;
  message: string;
  detail?: string;
  actionText?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

interface Props {
  error: SystemErrorInfo | null;
  onClose?: () => void;
}

export const SystemErrorModal: React.FC<Props> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-[#0B151C] border border-slate-800 text-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/40">
          <ServerCrash className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold uppercase border border-rose-500/30">
            Error: {error.code}
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {error.title || 'System Interruption'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {error.message || 'We encountered an unexpected condition while communicating with the RoadSense intelligence backend.'}
          </p>
        </div>

        {error.detail && (
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-left font-mono text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase">
              <Terminal className="w-3 h-3 text-slate-400" />
              <span>Diagnostic Details</span>
            </div>
            <p className="text-slate-400 break-words">{error.detail}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {error.onRetry && (
            <button
              onClick={error.onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{error.actionText || 'Try Again'}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (error.onGoHome) error.onGoHome();
              if (onClose) onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};
