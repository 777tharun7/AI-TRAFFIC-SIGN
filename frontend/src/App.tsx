import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

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

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicHomeRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [vehicle, setVehicle] = useState<VehicleState | null>(null);
  const [rius, setRius] = useState<VirtualRIU[]>([]);
  const [signals, setSignals] = useState<TrafficSignal[]>([]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    Promise.all([
      api.getVehicles().catch(() => []),
      api.getRIUs().catch(() => []),
      api.getSignals().catch(() => [])
    ]).then(([vList, rList, sList]) => {
      if (vList && vList.length > 0) setVehicle(vList[0]);
      if (rList) setRius(rList);
      if (sList) setSignals(sList);
    });

    try {
      ws = api.createVehicleWebSocket('VEH-HYD-001', (updated) => {
        setVehicle(updated);
      });
    } catch (e) {
      console.warn('Public live WS connection not active:', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleNavigateTab = (tabId: string) => {
    if (tabId === 'login') {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      navigate('/' + tabId);
    } else {
      navigate('/login');
    }
  };

  const handleSelectPersona = (personaId: string) => {
    if (isAuthenticated) {
      let dest = 'car_cockpit';
      if (personaId === 'enforcement_officer') dest = 'operations_overview';
      else if (personaId === 'system_admin' || personaId === 'toc_controller') dest = 'traffic_dept';
      else if (personaId === 'transit_dispatcher') dest = 'fleet_operations';
      navigate('/' + dest);
    } else {
      navigate('/login');
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <Toom4WayPublicHome
        vehicle={vehicle}
        rius={rius}
        signals={signals}
        onNavigateTab={handleNavigateTab}
        onControl={() => {}}
        onSelectPersona={handleSelectPersona}
      />
    </Suspense>
  );
};

const AuthenticatedAppContent: React.FC<{ initialView?: string }> = ({ initialView }) => {
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

  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      let defaultView = 'car_cockpit';
      if (user.role === 'enforcement_officer') {
        defaultView = 'operations_overview';
      } else if (user.role === 'system_admin') {
        defaultView = 'traffic_dept';
      }
      if (location.pathname === '/app' || location.pathname === '/login' || location.pathname === '/') {
        navigate('/' + defaultView);
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, location.pathname]);

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
    let isUnmounted = false;
    let lastTelemetryTime = Date.now();
    let watchdogTimer: NodeJS.Timeout | null = null;

    const connectWs = () => {
      if (isUnmounted) return;
      if (ws) {
        ws.close();
        ws = null;
      }
      try {
        ws = api.createVehicleWebSocket('VEH-HYD-001', (updatedState) => {
          if (isUnmounted) return;
          lastTelemetryTime = Date.now();
          setVehicle(updatedState);
          setIsWsConnected(true);
        });
      } catch (err) {
        console.warn('WebSocket connection warning:', err);
      }
    };

    loadInitialData();
    connectWs();

    // Telemetry Watchdog: If no telemetry received for > 5 seconds, reflect disconnected state
    watchdogTimer = setInterval(() => {
      if (isUnmounted) return;
      if (Date.now() - lastTelemetryTime > 5000) {
        setIsWsConnected(false);
      }
    }, 2000);

    const interval = setInterval(() => {
      api.getSignals().then(setSignals).catch(console.error);
    }, 2000);

    return () => {
      isUnmounted = true;
      if (ws) ws.close();
      if (watchdogTimer) clearInterval(watchdogTimer);
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
    if (view === 'home') {
      navigate('/');
    } else {
      navigate('/' + view);
    }
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
          initialView={initialView}
        />
      </Suspense>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Official Homepage without any internal sidebar */}
      <Route path="/" element={<PublicHomeRoute />} />
      <Route path="/home" element={<PublicHomeRoute />} />

      {/* Authentication & Legal Pages */}
      <Route path="/login" element={<LoginView onNavigate={(view) => navigate('/' + view)} />} />
      <Route path="/register" element={<RegisterView onNavigate={(view) => navigate('/' + view)} />} />
      <Route path="/forgot_password" element={<ForgotPasswordView onNavigate={(view) => navigate('/' + view)} />} />
      <Route path="/verify_email" element={<VerifyEmailView onNavigate={(view) => navigate('/' + view)} />} />
      <Route path="/terms" element={<TermsOfServiceView onNavigate={() => navigate('/')} />} />
      <Route path="/privacy" element={<PrivacyPolicyView onNavigate={() => navigate('/')} />} />
      <Route path="/cookies" element={<CookieSettingsView onNavigate={() => navigate('/')} />} />

      {/* Protected Main Operational Consoles (with Toom4WayAppShell & Sidebar) */}
      <Route path="/operations_overview" element={<ProtectedRoute><AuthenticatedAppContent initialView="operations_overview" /></ProtectedRoute>} />
      <Route path="/live_experience" element={<ProtectedRoute><AuthenticatedAppContent initialView="live_experience" /></ProtectedRoute>} />
      <Route path="/car_cockpit" element={<ProtectedRoute><AuthenticatedAppContent initialView="car_cockpit" /></ProtectedRoute>} />
      <Route path="/traffic_dept" element={<ProtectedRoute><AuthenticatedAppContent initialView="traffic_dept" /></ProtectedRoute>} />
      <Route path="/tharun_demo" element={<ProtectedRoute><AuthenticatedAppContent initialView="tharun_demo" /></ProtectedRoute>} />
      <Route path="/road_intelligence" element={<ProtectedRoute><AuthenticatedAppContent initialView="road_intelligence" /></ProtectedRoute>} />
      <Route path="/vehicle_registry" element={<ProtectedRoute><AuthenticatedAppContent initialView="vehicle_registry" /></ProtectedRoute>} />
      <Route path="/gvid_registry" element={<ProtectedRoute><AuthenticatedAppContent initialView="gvid_registry" /></ProtectedRoute>} />
      <Route path="/evidence_workflow" element={<ProtectedRoute><AuthenticatedAppContent initialView="evidence_workflow" /></ProtectedRoute>} />
      <Route path="/citizen_portal" element={<ProtectedRoute><AuthenticatedAppContent initialView="citizen_portal" /></ProtectedRoute>} />
      <Route path="/fleet_operations" element={<ProtectedRoute><AuthenticatedAppContent initialView="fleet_operations" /></ProtectedRoute>} />
      <Route path="/camera_tracker" element={<ProtectedRoute><AuthenticatedAppContent initialView="camera_tracker" /></ProtectedRoute>} />
      <Route path="/cvdv" element={<ProtectedRoute><AuthenticatedAppContent initialView="cvdv" /></ProtectedRoute>} />
      <Route path="/v_riu" element={<ProtectedRoute><AuthenticatedAppContent initialView="v_riu" /></ProtectedRoute>} />
      <Route path="/decision_engine" element={<ProtectedRoute><AuthenticatedAppContent initialView="decision_engine" /></ProtectedRoute>} />
      <Route path="/ui_ux_debugger" element={<ProtectedRoute><AuthenticatedAppContent initialView="ui_ux_debugger" /></ProtectedRoute>} />
      <Route path="/literature_research" element={<ProtectedRoute><AuthenticatedAppContent initialView="literature_research" /></ProtectedRoute>} />
      <Route path="/about_portfolio" element={<ProtectedRoute><AuthenticatedAppContent initialView="about_portfolio" /></ProtectedRoute>} />
      <Route path="/system_states" element={<ProtectedRoute><AuthenticatedAppContent initialView="system_states" /></ProtectedRoute>} />
      <Route path="/app/*" element={<ProtectedRoute><AuthenticatedAppContent /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <GlobalErrorBoundary>
          <AppRoutes />
        </GlobalErrorBoundary>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;