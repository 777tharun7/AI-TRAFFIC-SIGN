/**
 * RoadSense AI - Automotive UI & UX Design System Tokens
 * Engineered for Human Cognitive Load Minimization & 150ms Glanceability
 * Compliant with ISO 15005 & NHTSA Driver Distraction Guidelines
 */

export const UI_UX_DESIGN_SYSTEM = {
  // 1. Spatial Layout Grid & Positioning Coordinates
  layout: {
    containerMaxWidth: '1440px',
    hudSafeZonePadding: '24px',
    automotiveTouchTargetMin: '48px', // ISO 15005 minimum touch target for moving vehicles
    glanceableAreaRatio: 0.65, // 65% primary forward vision allocation
    gridColumns: 12,
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      ultrawide: '1440px'
    },
    zIndices: {
      base: 0,
      mapTiles: 1,
      routeOverlay: 5,
      vehicleMarker: 10,
      hudTelemetry: 20,
      stickyHeader: 30,
      alertBanner: 40,
      modalOverlay: 50,
      debuggerInspector: 60
    }
  },

  // 2. High-Contrast Automotive Chromatic Palette
  colors: {
    cockpit: {
      bgDeep: '#050811',
      bgCard: '#0B1120',
      bgCardGlass: 'rgba(11, 17, 32, 0.85)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      borderActive: 'rgba(16, 185, 129, 0.35)',
      glowEmerald: '0 0 24px rgba(16, 185, 129, 0.25)',
      glowAmber: '0 0 24px rgba(245, 158, 11, 0.25)',
      glowRose: '0 0 24px rgba(239, 68, 68, 0.30)'
    },
    telemetry: {
      speedometerArc: '#10B981',
      speedometerCritical: '#EF4444',
      speedometerAdvisory: '#06B6D4',
      speedometerBreaker: '#F59E0B'
    },
    roadEventStates: {
      DISCOVERED: {
        bg: '#F8FAFC',
        text: '#475569',
        border: '#CBD5E1',
        halo: 'rgba(148, 163, 184, 0.2)'
      },
      APPROACHING: {
        bg: '#FEF3C7',
        text: '#B45309',
        border: '#F59E0B',
        halo: 'rgba(245, 158, 11, 0.3)'
      },
      ACTIVE: {
        bg: '#FEE2E2',
        text: '#B91C1C',
        border: '#EF4444',
        halo: 'rgba(239, 68, 68, 0.35)'
      },
      PASSED: {
        bg: '#ECFDF5',
        text: '#047857',
        border: '#10B981',
        halo: 'rgba(16, 185, 129, 0.2)'
      },
      COMPLETED: {
        bg: '#F1F5F9',
        text: '#64748B',
        border: '#94A3B8',
        halo: 'transparent'
      }
    }
  },

  // 3. Human Factor & Cognitive Load Standards
  humanFactors: {
    maxEyeOffRoadTimeMs: 150, // Human reaction safety threshold
    contrastRatioMin: 7.0, // High contrast ratio for daylight driving
    touchFeedbackLatencyMs: 16, // Sub-frame UI latency
    audioVisualSyncToleranceMs: 50
  }
};
