# 🎨 RoadSense AI — UI & UX Design System Specification

> **Engineering Design System for Automotive Connected Mobility & Glanceable Cockpit Telemetry**  
> Compliant with **ISO 15005** (Ergonomic Aspects of Transport Information and Control Systems) and **NHTSA Driver Distraction Guidelines** (< 150 ms glance budget).

---

## 1. Executive Summary & Design Vision

In high-speed automotive and two-wheeler environments, **visual cognitive load directly governs human reaction time**. Traditional web layouts fail inside vehicles because small fonts, low contrast, and nested hierarchies force drivers to take their eyes off the road for > 0.5 seconds, significantly increasing collision risk.

RoadSense AI's UI/UX architecture is engineered from the ground up for **sub-150ms visual comprehension**:
1. **High-Contrast Dark-Mode Cockpit Glassmorphism**: Minimizes glare in night driving while sustaining daylight readability (WCAG 2.1 AAA luminance ratio > 14:1).
2. **Tactical 12-Column Spatial Grid**: Dynamically allocates 58.3% (Col 1–7) to forward 3D perception and 41.7% (Col 8–12) to focal decision-state clusters.
3. **Deterministic 3-Color Halo Coding**:
   - 🟢 **Emerald (#10B981)**: Safe forward corridor, compliant speed, Green-Wave GLOSA band.
   - 🟡 **Amber (#F59E0B)**: Deceleration advisory, upcoming speed breaker, yellow phase.
   - 🔴 **Crimson (#EF4444)**: Mandatory stop line, red SPaT signal, hazard zone.

---

## 2. Spatial Layout & Positioning Coordinates

| UI Component Node | Desktop Layout Allocation | Z-Index Elevation | Glance Latency Target | Touch Target Size |
| :--- | :--- | :--- | :--- | :--- |
| **RealNavigationMap** | Columns 1–7 (58.3% viewport) | `z-10` | Peripheral / Continuous | Interactive Pan/Zoom |
| **CarCockpitHMI** | Columns 8–12 (41.7% viewport) | `z-20` | < 150 ms (Direct Focal) | ≥ 48 × 48 px |
| **Speedometer Gauge** | Center of Right Cluster (Col 10) | `z-20` | < 80 ms (Instantaneous) | Passive Readout |
| **SPaT Stop Line Countdown** | Top-Right Tactical Overlay | `z-30` | < 100 ms (High-Priority Alert) | High Contrast Badge |
| **Two-Wheeler 6.7" HUD** | Centered Mobile Modal / Drawer | `z-40` | < 80 ms (Vibration Resistant) | ≥ 64 × 64 px |
| **UI/UX Position Debugger** | Top Sticky Control Ribbon | `z-50` | Developer / Testing Tool | ≥ 48 × 48 px |

---

## 3. Human Factor & Cognitive Load Engineering

### 3.1. 150ms Eye-Off-Road Glance Budget
- **Primary Driving Information**: Speed, Stop Line Distance, Signal State are confined within a tight 120px circular gaze radius.
- **Font Scale Hierarchy**: Speed numbers use `font-mono` at `text-6xl` to `text-7xl` (60px–72px), legible from a driver seating position 80 cm from the dashboard.

### 3.2. Automotive Touch Target Ergonomics (ISO 15005)
- All interactive controls (`Resume Sim`, `Reset Route`, `+5 km/h`, `-5 km/h`) maintain a minimum physical touch target of **48 × 48 px** to prevent mis-clicks during vehicle vibration.

### 3.3. Dual Vehicle Form-Factor Adaptations
1. **Automotive Cockpit HUD (Widescreen 16:9 / 21:9)**:
   - Optimized for dashboard horizontal eye span.
   - Integrated with Green-Wave speed band visualizer.
2. **Bike Glanceable Display (6.7" Vertical Smartphone / Handlebar Mount)**:
   - High-contrast card with oversized typography.
   - Single-glance red/green full-card edge tinting for vibration resistance.

---

## 4. UI Design Tokens Reference (`src/styles/designSystem.ts`)

```typescript
export const UI_UX_DESIGN_SYSTEM = {
  layout: {
    containerMaxWidth: '1440px',
    hudSafeZonePadding: '24px',
    automotiveTouchTargetMin: '48px',
    glanceableAreaRatio: 0.65,
    gridColumns: 12
  },
  colors: {
    cockpit: {
      bgDeep: '#050811',
      bgCard: '#0B1120',
      borderActive: 'rgba(16, 185, 129, 0.35)',
      glowEmerald: '0 0 24px rgba(16, 185, 129, 0.25)',
      glowAmber: '0 0 24px rgba(245, 158, 11, 0.25)',
      glowRose: '0 0 24px rgba(239, 68, 68, 0.30)'
    }
  }
};
```
