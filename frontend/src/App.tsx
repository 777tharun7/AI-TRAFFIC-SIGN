import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';

const Toom4WayAppShell = lazy(() => import('./components/Toom4WayAppShell').then(m => ({ default: m.Toom4WayAppShell })));
const MasterRoadIntelligenceDashboard = lazy(() => import('./components/MasterRoadIntelligenceDashboard').then(m => ({ default: m.MasterRoadIntelligenceDashboard })));
const CarCockpitHMI = lazy(() => import('./components/CarCockpitHMI').then(m => ({ default: m.CarCockpitHMI })));
const TrafficDeptPortal = lazy(() => import('./components/TrafficDeptPortal').then(m => ({ default: m.TrafficDeptPortal })));
const UIUXLayoutStudio = lazy(() => import('./components/UIUXLayoutStudio').then(m => ({ default: m.UIUXLayoutStudio })));
const TharunDemonstrationStudio = lazy(() => import('./components/TharunDemonstrationStudio').then(m => ({ default: m.TharunDemonstrationStudio })));
const AboutPortfolioView = lazy(() => import('./components/AboutPortfolioView').then(m => ({ default: m.AboutPortfolioView })));
const ProjectDeckAndResearchView = lazy(() => import('./components/ProjectDeckAndResearchView').then(m => ({ default: m.ProjectDeckAndResearchView })));
const CVDVStudio = lazy(() => import('./components/CVDVStudio').then(m => ({ default: m.CVDVStudio })));
const CameraSignCaptureTracker = lazy(() => import('./components/CameraSignCaptureTracker').then(m => ({ default: m.CameraSignCaptureTracker })));
const DecisionEngineStudio = lazy(() => import('./components/DecisionEngineStudio').then(m => ({ default: m.DecisionEngineStudio })));
const VirtualRIUStudio = lazy(() => import('./components/VirtualRIUStudio').then(m => ({ default: m.VirtualRIUStudio })));
const AIModelCenter = lazy(() => import('./components/AIModelCenter').then(m => ({ default: m.AIModelCenter })));
const SystemStateInventoryView = lazy(() => import('./components/states/SystemStateInventoryView').then(m => ({ default: m.SystemStateInventoryView })));
const VehicleRegistryView = lazy(() => import('./components/VehicleRegistryView').then(m => ({ default: m.VehicleRegistryView })));
const GVIDRegistryView = lazy(() => import('./components/GVIDRegistryView').then(m => ({ default: m.GVIDRegistryView })));
const EvidenceChallanWorkflowView = lazy(() => import('./components/EvidenceChallanWorkflowView').then(m => ({ default: m.EvidenceChallanWorkflowView })));
const CitizenPortalView = lazy(() => import('./components/CitizenPortalView').then(m => ({ default: m.CitizenPortalView })));
const FleetOperationsView = lazy(() => import('./components/FleetOperationsView').then(m => ({ default: m.FleetOperationsView })));
const Toom4WayPublicHome = lazy(() => import('./components/Toom4WayPublicHome').then(m => ({ default: m.Toom4WayPublicHome })));

import { LoginView, RegisterView, ForgotPasswordView, VerifyEmailView } from './components/auth/AuthPages';
import { CookieSettingsView, PrivacyPolicyView, TermsOfServiceView } from './components/legal/LegalPages';
import { CookieConsentModal } from './components/states/CookieConsentModal';
import { NetworkStatusBanner } from './components/states/NetworkStatusBanner';
import { SystemErrorModal, SystemErrorInfo } from './components/states/SystemErrorModal';
import { StateInspectorDrawer } from './components/states/StateInspectorDrawer';
import { api } from './services/api';
import { VehicleState, VirtualRIU, TrafficSignal } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
    <div className="animate-pulse text-xl flex items-center gap-3">
      <span className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span>Loading module...</span>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

const AuthenticatedAppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, restoreSession, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthExpired = () => {
      if (!isAuthenticated && !isLoading) {
        console.log("Auth session expired. Redirecting to login.");
        logout();
        navigate('/login');
      }
    };
    window.addEventListener('roadsense-auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('roadsense-auth-expired', handleAuthExpired);
    };
  }, [isAuthenticated, isLoading, navigate, logout]);

  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      let defaultView = 'car_cockpit';
      if (user.role === 'enforcement_officer') {
        defaultView = 'operations_overview';
      } else if (user.role === 'system_admin') {
        defaultView = 'traffic_dept';
      }
      if (window.location.pathname === '/' || window.location.pathname === '/login') {
        navigate('/' + defaultView);
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const [vehicle, setVehicle] = useState<VehicleState | null>(null);
  const [rius, setRius] = useState<VirtualRIU[]>([]);
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  const [isWsConnected, setIsWsConnected] = useState<boolean>(true);
  const [activeError, setActiveError] = useState<SystemErrorInfo | null>(null);
  const [forcedOffline, setForcedOffline] = useState<boolean>(false);
  const [showCookieModal, setShowCookieModal] = useState<boolean>(false);

  const loadInitialData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connectWs = () => {
      try {
        ws = api.createVehicleWebSocket('VEH-HYD-001', (updatedState) => {
          setVehicle(updatedState);
          setIsWsConnected(true);
        });
        ws.onclose = () => {
          setIsWsConnected(false);
          reconnectTimer = setTimeout(connectWs, 2000);
        };
        ws.onerror = () => {
          setIsWsConnected(false);
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setIsWsConnected(false);
        reconnectTimer = setTimeout(connectWs, 3000);
      }
    };

    loadInitialData();
    connectWs();

    const interval = setInterval(() => {
      api.getSignals().then(setSignals).catch(console.error);
    }, 2000);

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearInterval(interval);
    };
  }, [loadInitialData]);

  const handleControl = useCallback(async (action: string, params?: any) => {
    if (!vehicle || !isAuthenticated) return;
    try {
      const updated = await api.controlVehicle(vehicle.vehicle_id, action, params);
      setVehicle(updated);
    } catch (e) {
      console.error(e);
    }
  }, [vehicle, isAuthenticated]);

  const handleNavigate = useCallback((view: string) => {
    navigate('/' + view);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#0F172A] font-sans relative antialiased selection:bg-[#00875A] selection:text-white">
      <NetworkStatusBanner
        isWsConnected={isWsConnected}
        forcedOffline={forcedOffline}
        onRetryConnection={loadInitialData}
      />
      <CookieConsentModal />
      <SystemErrorModal
        error={activeError}
        onClose={() => setActiveError(null)}
      />
      <StateInspectorDrawer
        onTriggerError={setActiveError}
        onToggleForcedOffline={setForcedOffline}
        onOpenCookieModal={() => setShowCookieModal(true)}
        onNavigateTab={handleNavigate}
        isForcedOffline={forcedOffline}
      />

      <Suspense fallback={<Loader />}>
        <Toom4WayAppShell
          vehicle={vehicle}
          rius={rius}
          signals={signals}
          routes={routes}
          isWsConnected={isWsConnected}
          onControl={handleControl}
          onReload={loadInitialData}
          onNavigate={handleNavigate}
        />
      </Suspense>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginView onNavigate={(view) => { window.location.href = '/' + view; }} />} />
          <Route path="/register" element={<RegisterView onNavigate={(view) => { window.location.href = '/' + view; }} />} />
          <Route path="/forgot_password" element={<ForgotPasswordView onNavigate={(view) => { window.location.href = '/' + view; }} />} />
          <Route path="/verify_email" element={<VerifyEmailView onNavigate={(view) => { window.location.href = '/' + view; }} />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AuthenticatedAppContent />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;