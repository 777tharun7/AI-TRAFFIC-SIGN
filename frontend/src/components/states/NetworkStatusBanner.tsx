import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  isWsConnected?: boolean;
  onRetryConnection?: () => void;
  forcedOffline?: boolean;
}

export const NetworkStatusBanner: React.FC<Props> = ({
  isWsConnected = true,
  onRetryConnection,
  forcedOffline = false
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOffline = forcedOffline || !isOnline || !isWsConnected;

  if (!effectiveOffline) return null;

  const handleRetry = () => {
    setIsReconnecting(true);
    if (onRetryConnection) onRetryConnection();
    setTimeout(() => setIsReconnecting(false), 1200);
  };

  return (
    <div className="bg-amber-500/90 backdrop-blur-md text-slate-950 px-4 py-2.5 shadow-lg border-b border-amber-600/30 flex items-center justify-between z-50 sticky top-0 animate-in slide-in-from-top duration-200 text-xs">
      <div className="flex items-center gap-2.5 max-w-2xl">
        <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-extrabold uppercase tracking-wide">
            {!isOnline ? 'Internet Connection Lost' : 'Live WebSocket Telemetry Interrupted'}
          </span>
          <span className="text-slate-900 font-medium ml-2 hidden sm:inline">
            Road intelligence is operating in cached offline simulation mode.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleRetry}
          disabled={isReconnecting}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 text-white font-bold hover:bg-slate-900 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isReconnecting ? 'animate-spin' : ''}`} />
          <span>{isReconnecting ? 'Reconnecting...' : 'Retry Connection'}</span>
        </button>
      </div>
    </div>
  );
};
