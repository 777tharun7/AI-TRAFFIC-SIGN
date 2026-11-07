import React, { useEffect, useState } from 'react';
import { Toom4WayAppShell } from './components/Toom4WayAppShell';
import { CookieConsentModal } from './components/states/CookieConsentModal';
import { NetworkStatusBanner } from './components/states/NetworkStatusBanner';
import { SystemErrorModal, SystemErrorInfo } from './components/states/SystemErrorModal';
import { StateInspectorDrawer } from './components/states/StateInspectorDrawer';
import { api } from './services/api';
import { VehicleState, VirtualRIU, TrafficSignal } from './types';

export const App: React.FC = () => {
  const [vehicle, setVehicle] = useState<VehicleState | null>(null);
  const [rius, setRius] = useState<VirtualRIU[]>([]);
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  // Production State Handlers
  const [isWsConnected, setIsWsConnected] = useState<boolean>(true);
  const [activeError, setActiveError] = useState<SystemErrorInfo | null>(null);
  const [forcedOffline, setForcedOffline] = useState<boolean>(false);
  const [showCookieModal, setShowCookieModal] = useState<boolean>(false);

  // Initial Data Fetch & WebSocket Setup
  useEffect(() => {
    loadInitialData();

    // WebSocket Telemetry Connection
    let ws: WebSocket | null = null;
    const connectWs = () => {
      ws = api.createVehicleWebSocket('VEH-HYD-001', (updatedState) => {
        setVehicle(updatedState);
        setIsWsConnected(true);
      });
      ws.onclose = () => {
        setIsWsConnected(false);
        setTimeout(connectWs, 2000);
      };
      ws.onerror = () => {
        setIsWsConnected(false);
      };
    };

    connectWs();

    // Periodic signals poll
    const interval = setInterval(() => {
      api.getSignals().then(setSignals).catch(console.error);
    }, 2000);

    return () => {
      if (ws) ws.close();
      clearInterval(interval);
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const [vList, rList, sList, routeList] = await Promise.all([
        api.getVehicles(),
        api.getRIUs(),
        api.getSignals(),
        api.getRoutes()
      ]);
      if (vList && vList.length > 0) setVehicle(vList[0]);
      setRius(rList || []);
      setSignals(sList || []);
      setRoutes(routeList || []);
      setIsWsConnected(true);
    } catch (e) {
      console.error('Data Load Error:', e);
    }
  };

  const handleControl = async (action: string, params?: any) => {
    if (!vehicle) return;
    try {
      const updated = await api.controlVehicle(vehicle.vehicle_id, action, params);
      setVehicle(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#0F172A] font-sans relative antialiased selection:bg-[#00875A] selection:text-white">
      {/* 1. Global Network / Offline Alert Banner */}
      <NetworkStatusBanner
        isWsConnected={isWsConnected}
        forcedOffline={forcedOffline}
        onRetryConnection={loadInitialData}
      />

      {/* 2. Global Cookie Consent Modal */}
      <CookieConsentModal />

      {/* 3. Global System Error Handler Modal */}
      <SystemErrorModal
        error={activeError}
        onClose={() => setActiveError(null)}
      />

      {/* 4. Live System State Inspector & Simulation Drawer (80+ States) */}
      <StateInspectorDrawer
        onTriggerError={setActiveError}
        onToggleForcedOffline={setForcedOffline}
        onOpenCookieModal={() => setShowCookieModal(true)}
        onNavigateTab={(tab) => {
          // Navigation triggered from drawer
        }}
        isForcedOffline={forcedOffline}
      />

      {/* 5. Complete Toom4Way Application Framework */}
      <Toom4WayAppShell
        vehicle={vehicle}
        rius={rius}
        signals={signals}
        routes={routes}
        isWsConnected={isWsConnected}
        onControl={handleControl}
        onReload={loadInitialData}
      />
    </div>
  );
};

export default App;
