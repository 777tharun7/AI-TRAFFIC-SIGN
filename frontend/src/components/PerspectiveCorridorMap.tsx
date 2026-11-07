import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, Square, Search, Navigation, Plus, Minus, Layers, 
  MapPin, Gauge, AlertCircle, Play, Pause, RotateCcw
} from 'lucide-react';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';

interface Props {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onControl?: (action: string, params?: any) => void;
}

export const PerspectiveCorridorMap: React.FC<Props> = ({ 
  vehicle, 
  rius, 
  signals,
  onControl 
}) => {
  const [layers, setLayers] = useState({
    route: true,
    vehicle: true,
    signals: true,
    signs: true,
    events: true,
    rius: true,
    geofences: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // SVG Path references for smooth interpolation
  const routePathRef = useRef<SVGPathElement | null>(null);
  const minimapPathRef = useRef<SVGPathElement | null>(null);

  const currentSpeed = vehicle?.speed_kmh ?? 45;
  const behaviorState = vehicle?.behavior_state ?? 'MOVING';
  const distanceToEvent = Math.round(vehicle?.distance_to_event_m ?? 80);
  const activeSignal = signals.length > 0 ? signals[0] : null;
  const signalState = activeSignal?.state ?? 'RED';
  const timeRemaining = activeSignal?.remaining_time ?? 30;

  // Smooth animated vehicle coordinates along 3D corridor
  const [vehPos, setVehPos] = useState<{ x: number; y: number; angle: number; scale: number }>({
    x: 490,
    y: 370,
    angle: -15,
    scale: 0.82
  });

  // Smooth animated minimap coordinates
  const [miniPos, setMiniPos] = useState<{ x: number; y: number }>({ x: 45, y: 45 });

  // Interpolated progress percentage
  const progressTargetRef = useRef<number>(vehicle?.progress_pct ?? 35);
  const currentProgressRef = useRef<number>(vehicle?.progress_pct ?? 35);

  useEffect(() => {
    if (vehicle && typeof vehicle.progress_pct === 'number') {
      progressTargetRef.current = vehicle.progress_pct;
    }
  }, [vehicle?.progress_pct]);

  // Animation Loop for 60fps silky smooth movement
  useEffect(() => {
    let animId: number;

    const animate = () => {
      // 🛑 Signal Stop Line Position on 3D corridor (8m before signal pole)
      const SIGNAL_STOP_LINE_PROGRESS = 31.0;
      const POLICE_STOP_LINE_PROGRESS = 54.0;

      let targetP = progressTargetRef.current;

      // When Signal is RED and vehicle is stopped or approaching stop line:
      if (signalState === 'RED' && (behaviorState === 'WAITING_FOR_GREEN' || behaviorState === 'STOPPED' || behaviorState === 'STOPPING' || currentSpeed === 0)) {
        targetP = SIGNAL_STOP_LINE_PROGRESS;
      } else if (behaviorState === 'WAITING_FOR_POLICE_CLEARANCE') {
        targetP = POLICE_STOP_LINE_PROGRESS;
      }

      // Smooth lerp progress towards target
      const diff = targetP - currentProgressRef.current;
      
      // Handle loop wrap-around (e.g. from 99% to 1%)
      if (Math.abs(diff) > 50) {
        currentProgressRef.current = targetP;
      } else {
        currentProgressRef.current += diff * 0.12;
      }

      const p = Math.max(0, Math.min(100, currentProgressRef.current)) / 100;

      // Calculate position on main 3D corridor curve
      if (routePathRef.current) {
        try {
          const totalLength = routePathRef.current.getTotalLength();
          const targetDist = totalLength * p;
          const pt = routePathRef.current.getPointAtLength(targetDist);
          
          const delta = 3;
          const ptBefore = routePathRef.current.getPointAtLength(Math.max(0, targetDist - delta));
          const ptAfter = routePathRef.current.getPointAtLength(Math.min(totalLength, targetDist + delta));
          
          const angleDeg = Math.atan2(ptAfter.y - ptBefore.y, ptAfter.x - ptBefore.x) * (180 / Math.PI);
          
          // Perspective scale: scale down as car recedes into background (y: 570 -> 130)
          const normY = Math.max(0, Math.min(1, (pt.y - 130) / (570 - 130)));
          const dynamicScale = 0.45 + 0.55 * normY;

          setVehPos({
            x: pt.x,
            y: pt.y,
            angle: angleDeg,
            scale: dynamicScale
          });
        } catch (e) {
          // fallback
        }
      }

      // Calculate position on minimap curve
      if (minimapPathRef.current) {
        try {
          const miniLength = minimapPathRef.current.getTotalLength();
          const miniPt = minimapPathRef.current.getPointAtLength(miniLength * p);
          setMiniPos({ x: miniPt.x, y: miniPt.y });
        } catch (e) {}
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [signalState, behaviorState, currentSpeed]);

  // Derive status banner based on state
  let statusBanner = {
    text: 'Cruising on Route',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: '🚗'
  };

  if (behaviorState === 'APPROACHING_EVENT') {
    statusBanner = {
      text: 'Approaching Traffic Signal',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: '📡'
    };
  } else if (behaviorState === 'DECELERATING') {
    statusBanner = {
      text: 'Decelerating for Stop Line',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '⚠️'
    };
  } else if (behaviorState === 'WAITING_FOR_POLICE_CLEARANCE') {
    statusBanner = {
      text: 'VIP Convoy in Progress — Police Stop',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: '👮‍♂️'
    };
  } else if (behaviorState === 'STOPPING' || behaviorState === 'STOPPED' || behaviorState === 'WAITING_FOR_GREEN' || behaviorState === 'WAITING_AT_STOP_SIGN') {
    statusBanner = {
      text: 'Prepare to Stop / Stopped at Stop Line',
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: '🛑'
    };
  } else if (behaviorState === 'RESUMING') {
    statusBanner = {
      text: 'Signal Green — Resuming Travel',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '🟢'
    };
  }

  // 3D Corridor spline path definition
  const corridorPathData = "M 160 570 C 230 490, 310 395, 490 370 S 760 270, 890 130";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Search and System Status Header */}
      <div className="p-3.5 px-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-white/90 backdrop-blur-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search location, road, or signal ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            defaultValue="HITEC City Main Road, Hyderabad"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System: Operational</span>
          </div>
        </div>
      </div>

      {/* 3D Isometric / Perspective Map Canvas Area */}
      <div className="relative w-full aspect-16/10 min-h-[380px] max-h-[530px] bg-slate-900 overflow-hidden select-none">
        
        {/* Photorealistic 3D Corridor Render as Base */}
        <img 
          src="/images/hitec_corridor.jpg" 
          alt="HITEC City Connected Corridor 3D Digital Twin"
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Ambient Gradient Overlays for Depth */}
        <div className="absolute inset-0 bg-radial from-transparent via-slate-900/5 to-slate-900/35 pointer-events-none" />

        {/* Dynamic SVG Corridor & Animated Route Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            {/* Glowing Route Gradient */}
            <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
            </linearGradient>

            {/* Cyan Guidance Glow */}
            <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Vehicle Radar Aura Filter */}
            <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Sensor Detection Cone Gradient */}
            <linearGradient id="sensorBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Reference path for calculation (invisible) */}
          <path 
            ref={routePathRef}
            d={corridorPathData}
            fill="none"
            stroke="transparent"
            strokeWidth="1"
          />

          {layers.route && (
            <>
              {/* Outer Route Halo */}
              <path 
                d={corridorPathData} 
                fill="none" 
                stroke="#60a5fa" 
                strokeWidth="32" 
                strokeLinecap="round"
                opacity="0.3"
                filter="url(#routeGlow)"
              />
              {/* Route Main Ribbon */}
              <path 
                d={corridorPathData} 
                fill="none" 
                stroke="url(#routeGradient)" 
                strokeWidth="24" 
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Center Animated Dash Line */}
              <path 
                d={corridorPathData} 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="3.5" 
                strokeDasharray="14 14" 
                strokeLinecap="round"
                opacity="0.95"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="28" 
                  to="0" 
                  dur="1.2s" 
                  repeatCount="indefinite" 
                />
              </path>

              {/* 🛑 STOP PATH & VISIBLE STOP LINE BEFORE TRAFFIC SIGNAL */}
              {layers.signals && (
                <g id="stop-line-visual-group">
                  {/* Zebra Pedestrian Crossing before Stop Line */}
                  <g opacity="0.85">
                    <line x1="330" y1="450" x2="365" y2="475" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="4 4" />
                    <line x1="338" y1="442" x2="373" y2="467" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="4 4" />
                  </g>

                  {/* Dynamic Illuminated Stop Path Box */}
                  <rect 
                    x="355" 
                    y="410" 
                    width="48" 
                    height="16" 
                    rx="4"
                    transform="rotate(-25, 375, 418)"
                    fill={signalState === 'RED' ? '#ef4444' : '#10b981'} 
                    opacity="0.5"
                    className={signalState === 'RED' ? 'animate-pulse' : ''}
                  />

                  {/* Solid White Stop Line Bar (8m Before Signal) */}
                  <line 
                    x1="358" 
                    y1="408" 
                    x2="396" 
                    y2="430" 
                    stroke="#ffffff" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                  />

                  {/* "STOP LINE" Road Marking Text */}
                  <text 
                    x="385" 
                    y="442" 
                    fill="#ffffff" 
                    fontSize="9" 
                    fontWeight="bold" 
                    fontFamily="ui-monospace, monospace" 
                    letterSpacing="1"
                    transform="rotate(-22, 385, 442)"
                    opacity="0.9"
                  >
                    STOP LINE
                  </text>
                </g>
              )}
            </>
          )}

          {/* 🚗 DYNAMIC LIVE ANIMATED VEHICLE & ADAS RADAR SENSORS */}
          {layers.vehicle && (
            <g 
              transform={`translate(${vehPos.x}, ${vehPos.y}) scale(${vehPos.scale})`}
              className="transition-transform duration-75 ease-out"
            >
              {/* 1. Pulsing Outer Safety Radar Wave (LiDAR/V2X Range) */}
              <ellipse 
                cx="0" 
                cy="0" 
                rx="75" 
                ry="45" 
                fill="#10b981" 
                opacity="0.2" 
                className="animate-ping" 
                style={{ transformOrigin: '0 0', animationDuration: '2.5s' }}
              />

              {/* 2. Concentric Active Radar Rings */}
              <ellipse 
                cx="0" 
                cy="0" 
                rx="60" 
                ry="36" 
                fill="#10b981" 
                opacity="0.18" 
                filter="url(#radarGlow)"
              />
              <ellipse 
                cx="0" 
                cy="0" 
                rx="44" 
                ry="26" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.85"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </ellipse>

              {/* 3. Rotated Vehicle & Forward LiDAR Sensing Beam */}
              <g transform={`rotate(${vehPos.angle})`}>
                
                {/* Forward Perception Cone (LiDAR / Camera Field of View) */}
                <path 
                  d="M 25 0 L 140 -45 L 140 45 Z" 
                  fill="url(#sensorBeam)" 
                  opacity="0.65"
                />
                <line x1="25" y1="0" x2="140" y2="0" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />

                {/* Ground Shadow */}
                <ellipse cx="2" cy="3" rx="30" ry="15" fill="#000000" opacity="0.6" filter="url(#radarGlow)" />

                {/* 3D Realistic White Autonomous Sedan Graphic */}
                {/* Wheels */}
                <rect x="-20" y="-16" width="10" height="4" rx="1.5" fill="#1e293b" />
                <rect x="14" y="-16" width="10" height="4" rx="1.5" fill="#1e293b" />
                <rect x="-20" y="12" width="10" height="4" rx="1.5" fill="#1e293b" />
                <rect x="14" y="12" width="10" height="4" rx="1.5" fill="#1e293b" />

                {/* Chassis / Car Body */}
                <rect 
                  x="-26" 
                  y="-14" 
                  width="52" 
                  height="28" 
                  rx="9" 
                  fill="#ffffff" 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5" 
                />

                {/* Metallic Hood & Trunk Highlights */}
                <path d="M 12 -12 L 24 -9 L 24 9 L 12 12 Z" fill="#f1f5f9" />
                <path d="M -24 -9 L -14 -12 L -14 12 L -24 9 Z" fill="#e2e8f0" />

                {/* Dark Tinted Cabin & Windshield */}
                <polygon points="-12,-10 10,-10 16,-7 16,7 10,10 -12,10 -15,7 -15,-7" fill="#0f172a" />
                
                {/* Panoramic Glass Roof */}
                <rect x="-6" y="-7" width="14" height="14" rx="2" fill="#38bdf8" opacity="0.85" />

                {/* Dual Front LED Headlights */}
                <ellipse cx="25" cy="-9" rx="3" ry="2" fill="#38bdf8" />
                <ellipse cx="25" cy="9" rx="3" ry="2" fill="#38bdf8" />

                {/* Dual Rear Red Taillights */}
                <ellipse cx="-25" cy="-8" rx="2" ry="3" fill="#ef4444" />
                <ellipse cx="-25" cy="8" rx="2" ry="3" fill="#ef4444" />

                {/* Autonomous Roof LiDAR Puck */}
                <circle cx="0" cy="0" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                <circle cx="0" cy="0" r="1.5" fill="#38bdf8" className="animate-ping" />
              </g>

              {/* Dynamic Overhead Floating Speed & ID Badge */}
              <g transform="translate(0, -38)">
                <rect 
                  x="-32" 
                  y="-11" 
                  width="64" 
                  height="22" 
                  rx="6" 
                  fill="#0f172a" 
                  stroke="#38bdf8" 
                  strokeWidth="1.2" 
                  opacity="0.95" 
                />
                <text 
                  x="0" 
                  y="4" 
                  fill="#ffffff" 
                  fontSize="11" 
                  fontWeight="900" 
                  fontFamily="ui-monospace, monospace" 
                  textAnchor="middle"
                >
                  {currentSpeed.toFixed(0)} km/h
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* 3D Floating Roadside Event Pins */}
        {layers.signs && (
          <>
            {/* 1. Speed Limit 40 (120m) */}
            <div 
              className="absolute top-[28%] left-[23%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white border-2 border-red-600 flex items-center justify-center font-black text-xs text-slate-900 shadow-2xs">
                40
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-none">Speed Limit</span>
                <span className="text-[9px] font-mono text-slate-500">(120m)</span>
              </div>
            </div>

            {/* 2. Red Signal (30s) 80m */}
            <div 
              className="absolute top-[38%] left-[38%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border-2 border-red-500/80 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-5 h-10 rounded-md bg-slate-900 flex flex-col items-center justify-between p-1 shadow-inner">
                <span className={`w-2.5 h-2.5 rounded-full ${signalState === 'RED' ? 'bg-red-500 shadow-sm shadow-red-500 animate-pulse' : 'bg-red-500/20'}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${signalState === 'YELLOW' ? 'bg-amber-400 shadow-sm shadow-amber-400 animate-pulse' : 'bg-amber-400/20'}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${signalState === 'GREEN' ? 'bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse' : 'bg-emerald-500/20'}`} />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-extrabold text-red-600 block leading-tight">Red Signal</span>
                <span className="text-[10px] font-black text-slate-800 block">({timeRemaining}s)</span>
                <span className="text-[9px] font-mono font-semibold text-slate-500">{distanceToEvent}m ahead</span>
              </div>
            </div>

            {/* 3. Speed Breaker (250m) */}
            <div 
              className="absolute top-[33%] left-[51%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                ⚠️
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-none">Speed Breaker</span>
                <span className="text-[9px] font-mono text-slate-500">(250m)</span>
              </div>
            </div>

            {/* 4. Pedestrian Crossing (400m) */}
            <div 
              className="absolute top-[48%] left-[47%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                🚶
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-none">Pedestrian Crossing</span>
                <span className="text-[9px] font-mono text-slate-500">(400m)</span>
              </div>
            </div>

            {/* 5. No Entry (600m) */}
            <div 
              className="absolute top-[26%] left-[64%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                ⛔
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-none">No Entry</span>
                <span className="text-[9px] font-mono text-slate-500">(600m)</span>
              </div>
            </div>

            {/* 6. VIP Convoy / Traffic Police Manual Stop */}
            <div 
              className="absolute top-[41%] left-[58%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-xl border-2 border-rose-500/80 transition-all hover:scale-105 cursor-pointer animate-pulse"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs relative overflow-hidden">
                <span>👮‍♂️</span>
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-black text-rose-600 block leading-none">VIP Police Halt</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <span className="text-[9px] font-mono text-slate-500">Convoy Clearance</span>
              </div>
            </div>
          </>
        )}

        {/* Road Label Badge */}
        <div className="absolute top-[52%] left-[17%] bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border border-slate-700/60 shadow-lg flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>HITEC City Main Road</span>
        </div>

        {/* Cyber Towers Landmark Label */}
        <div className="absolute top-[55%] left-[9%] text-slate-700/90 bg-white/80 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-xs">
          Cyber Towers
        </div>

        {/* Top-Left Layer Filter Checklist */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 w-36 text-xs space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium select-none" onClick={() => toggleLayer('route')}>
            {layers.route ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[11px]">Route</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium select-none" onClick={() => toggleLayer('vehicle')}>
            {layers.vehicle ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[11px]">Vehicle (You)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium select-none" onClick={() => toggleLayer('signals')}>
            {layers.signals ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[11px]">Traffic Signals</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium select-none" onClick={() => toggleLayer('signs')}>
            {layers.signs ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[11px]">Traffic Signs</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium select-none" onClick={() => toggleLayer('events')}>
            {layers.events ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[11px]">Road Events</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium select-none" onClick={() => toggleLayer('rius')}>
            {layers.rius ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[11px]">Virtual RIUs</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium select-none" onClick={() => toggleLayer('geofences')}>
            {layers.geofences ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[11px]">Geofences</span>
          </label>
        </div>

        {/* Bottom-Left Inset Overview Mini-Map with LIVE Moving Vehicle Dot */}
        <div className="absolute bottom-4 left-4 w-32 h-24 bg-white/95 rounded-xl border border-slate-300 shadow-xl overflow-hidden backdrop-blur-md flex flex-col">
          <div className="relative flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 80">
              <line x1="10" y1="20" x2="90" y2="70" stroke="#cbd5e1" strokeWidth="6" />
              <line x1="20" y1="70" x2="80" y2="10" stroke="#cbd5e1" strokeWidth="4" />
              
              {/* Reference route on minimap */}
              <path 
                ref={minimapPathRef}
                d="M 20 70 C 35 50, 60 40, 85 25" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="4" 
              />
              
              {/* Dynamic live moving vehicle dot on minimap */}
              <circle cx={miniPos.x} cy={miniPos.y} r="5" fill="#ef4444" className="animate-ping" />
              <circle cx={miniPos.x} cy={miniPos.y} r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            </svg>
            <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-slate-600 bg-white/90 px-1 rounded">
              Hyderabad
            </span>
          </div>
        </div>

        {/* Right-Side Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="w-8 h-8 bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-700">
            <Navigation className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button className="flex items-center gap-1 bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md border border-slate-200 hover:bg-slate-50 transition-colors">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Change View</span>
          </button>
          <div className="flex flex-col rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-md overflow-hidden">
            <button className="p-1.5 hover:bg-slate-100 text-slate-700"><Plus className="w-3.5 h-3.5" /></button>
            <div className="h-px bg-slate-200" />
            <button className="p-1.5 hover:bg-slate-100 text-slate-700"><Minus className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Bottom Live Vehicle Status Ribbon */}
      <div className="p-3 px-5 bg-white border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        
        {/* Metric 1: Current Speed */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
            <Gauge className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Current Speed</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900 font-mono">{currentSpeed.toFixed(0)}</span>
              <span className="text-xs text-slate-500 font-semibold">km/h</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Next Event */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-9 rounded bg-slate-900 flex flex-col items-center justify-between p-0.5 shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${signalState === 'RED' ? 'bg-red-500 animate-pulse shadow-sm shadow-red-500' : 'bg-red-500/20'}`} />
            <span className={`w-2 h-2 rounded-full ${signalState === 'YELLOW' ? 'bg-amber-400 animate-pulse shadow-sm shadow-amber-400' : 'bg-amber-400/20'}`} />
            <span className={`w-2 h-2 rounded-full ${signalState === 'GREEN' ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500' : 'bg-emerald-500/20'}`} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Next Event</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-sm font-black ${signalState === 'RED' ? 'text-red-600' : 'text-emerald-600'}`}>
                {signalState} Signal
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">{distanceToEvent} m</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Estimated Stop Time */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Estimated Stop Time</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 font-mono">{timeRemaining}</span>
            <span className="text-xs text-slate-500 font-semibold">sec</span>
          </div>
        </div>

        {/* Action Banner Pill */}
        <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold shadow-2xs transition-all ${statusBanner.bg}`}>
          <span className="text-base">{statusBanner.icon}</span>
          <span>{statusBanner.text}</span>
        </div>

      </div>
    </div>
  );
};
