import React, { useState, useRef, useEffect } from 'react';
import { 
  Navigation, Radio, Compass, ZoomIn, ZoomOut, 
  RotateCcw, Layers, MapPin, AlertCircle, Info, Octagon, ShieldAlert
} from 'lucide-react';
import { VehicleState, VirtualRIU, TrafficSignal, RoadEvent } from '../types';

interface HeroMapProps {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  activeEvents?: RoadEvent[];
  onSelectRIU?: (riu: VirtualRIU) => void;
  onMapClickCoordinates?: (lat: number, lon: number) => void;
}

// Bounding box for Hyderabad Hitec City / Gachibowli simulation zone
const MAP_BOUNDS = {
  minLat: 17.4100,
  maxLat: 17.4650,
  minLon: 78.3350,
  maxLon: 78.4200
};

export const HeroMap: React.FC<HeroMapProps> = ({
  vehicle,
  rius,
  signals,
  activeEvents = [],
  onSelectRIU,
  onMapClickCoordinates
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG coordinate transformation
  const projectToSVG = (lat: number, lon: number, width: number = 800, height: number = 600) => {
    const x = ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * width;
    const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height;
    return { x, y };
  };

  const projectFromSVG = (x: number, y: number, width: number = 800, height: number = 600) => {
    const lon = MAP_BOUNDS.minLon + (x / width) * (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon);
    const lat = MAP_BOUNDS.maxLat - (y / height) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
    return { lat, lon };
  };

  // Road network segments of Hyderabad
  const roadNetwork = [
    {
      id: 'hitec_main',
      name: 'Hitec City Main Road',
      points: [
        { lat: 17.4580, lon: 78.3700 },
        { lat: 17.4520, lon: 78.3750 },
        { lat: 17.4502, lon: 78.3808 },
        { lat: 17.4450, lon: 78.3818 },
        { lat: 17.4380, lon: 78.3780 },
        { lat: 17.4325, lon: 78.3712 },
        { lat: 17.4260, lon: 78.3620 },
        { lat: 17.4215, lon: 78.3540 }
      ],
      type: 'arterial',
      lanes: 6
    },
    {
      id: 'jubilee_road36',
      name: 'Jubilee Hills Road No. 36',
      points: [
        { lat: 17.4280, lon: 78.4140 },
        { lat: 17.4310, lon: 78.4080 },
        { lat: 17.4340, lon: 78.4020 },
        { lat: 17.4338, lon: 78.3905 },
        { lat: 17.4370, lon: 78.3840 },
        { lat: 17.4450, lon: 78.3818 }
      ],
      type: 'arterial',
      lanes: 4
    },
    {
      id: 'orr_expressway',
      name: 'Nehru Outer Ring Road (ORR)',
      points: [
        { lat: 17.4600, lon: 78.3450 },
        { lat: 17.4480, lon: 78.3470 },
        { lat: 17.4350, lon: 78.3500 },
        { lat: 17.4215, lon: 78.3540 },
        { lat: 17.4120, lon: 78.3600 }
      ],
      type: 'expressway',
      lanes: 8
    },
    {
      id: 'fin_district',
      name: 'Financial District Loop Road',
      points: [
        { lat: 17.4215, lon: 78.3540 },
        { lat: 17.4170, lon: 78.3420 },
        { lat: 17.4280, lon: 78.3400 },
        { lat: 17.4350, lon: 78.3500 }
      ],
      type: 'secondary',
      lanes: 4
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(0.6, prev * zoomFactor), 4.0));
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;
    const coords = projectFromSVG(clickX, clickY, 800, 600);
    if (onMapClickCoordinates) {
      onMapClickCoordinates(coords.lat, coords.lon);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedEntity(null);
  };

  const vehPos = vehicle ? projectToSVG(vehicle.latitude, vehicle.longitude) : { x: 400, y: 300 };

  const isVehicleStopped = vehicle?.behavior_state === 'STOPPED' || 
                           vehicle?.behavior_state === 'WAITING_FOR_GREEN' || 
                           vehicle?.behavior_state === 'WAITING_AT_STOP_SIGN' ||
                           (vehicle?.speed_kmh === 0);

  const isVehicleDecelerating = vehicle?.behavior_state === 'DECELERATING' || vehicle?.behavior_state === 'STOPPING';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm overflow-hidden select-none"
      onWheel={handleWheel}
    >
      {/* Top Map Context Pill */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold text-xs text-slate-800 tracking-tight">Hyderabad Connected Corridor</span>
        <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">
          100% Rule Engine Physics
        </span>
      </div>

      {/* Vehicle State Live HUD Banner on Map */}
      {vehicle && (
        <div className="absolute top-4 right-16 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-mono">
          <span className="text-slate-500">State:</span>
          <span className={`px-2 py-0.5 rounded-lg font-bold ${
            isVehicleStopped ? 'bg-red-100 text-red-800 animate-pulse' :
            isVehicleDecelerating ? 'bg-amber-100 text-amber-800' :
            vehicle.behavior_state === 'RESUMING' ? 'bg-emerald-100 text-emerald-800' :
            'bg-slate-100 text-slate-800'
          }`}>
            {vehicle.behavior_state || 'MOVING'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-900">{vehicle.speed_kmh} km/h</span>
          {vehicle.distance_to_stop_line_m !== null && vehicle.distance_to_stop_line_m !== undefined && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-amber-700 font-bold">Stop Line: {vehicle.distance_to_stop_line_m}m</span>
            </>
          )}
        </div>
      )}

      {/* Map Control Tools */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.25, 4.0))}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z * 0.8, 0.6))}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main SVG Vector Canvas */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleMapClick}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
          <radialGradient id="geofenceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="stopLineGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        <rect width="800" height="600" fill="#f8fafc" />
        <rect width="800" height="600" fill="url(#grid)" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Water Bodies & Parks (Hyderabad Landmarks) */}
          <path
            d="M 500 280 C 530 270, 560 300, 550 330 C 530 350, 480 340, 500 280 Z"
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />
          <text x="505" y="310" fontSize="9" fontFamily="monospace" fill="#0284c7" fontWeight="600">
            Durgam Cheruvu
          </text>

          <rect x="220" y="380" width="80" height="60" rx="12" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
          <text x="235" y="415" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="600">
            Financial District
          </text>

          <rect x="420" y="160" width="70" height="50" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
          <text x="430" y="190" fontSize="8" fontFamily="sans-serif" fill="#64748b" fontWeight="600">
            Cyber Towers
          </text>

          {/* Road Network Lines */}
          <g className="road-network">
            {roadNetwork.map((road) => {
              const pathData = road.points.reduce((acc, pt, idx) => {
                const { x, y } = projectToSVG(pt.lat, pt.lon);
                return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '');

              return (
                <g key={road.id}>
                  {/* Road Casing */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={road.type === 'expressway' ? 18 : 14}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Road Border */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth={road.type === 'expressway' ? 14 : 10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Road Surface */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth={road.type === 'expressway' ? 11 : 7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Road Center Dotted Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={road.type === 'expressway' ? '#f59e0b' : '#e2e8f0'}
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                </g>
              );
            })}
          </g>

          {/* Active Corridor Trajectory (Simulated Route) */}
          <path
            d="M 444 140 L 468 180 L 472 245 L 444 320 L 398 375 L 340 435 L 290 480"
            fill="none"
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.75"
          />

          {/* V-RIU Infrastructure Units */}
          <g className="virtual-rius">
            {rius.map((riu) => {
              const { x, y } = projectToSVG(riu.latitude, riu.longitude);
              const isActive = activeEvents.some((e) => e.event_id === riu.id || e.name.includes(riu.name));
              const radiusPx = (riu.activation_radius / 500) * 80;

              return (
                <g
                  key={riu.id}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEntity(riu);
                    if (onSelectRIU) onSelectRIU(riu);
                  }}
                >
                  {/* Geofence Activation Ring */}
                  {isActive && (
                    <circle
                      cx={x}
                      cy={y}
                      r={radiusPx}
                      fill="url(#geofenceGlow)"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* V-RIU Beacon Pin */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={isActive ? '#10b981' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="transition-transform group-hover:scale-125"
                  />
                  <circle cx={x} cy={y} r="3" fill="#ffffff" />

                  {/* Clean Label */}
                  <text
                    x={x + 12}
                    y={y + 4}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="700"
                    fill="#1e293b"
                    className="select-none pointer-events-none"
                  >
                    {riu.event_type.replace('_', ' ')} {riu.value ? `(${riu.value})` : ''}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Traffic Signals with VIRTUAL STOP LINES */}
          <g className="traffic-signals">
            {signals.map((sig) => {
              const { x, y } = projectToSVG(sig.latitude, sig.longitude);
              const isRed = sig.state === 'RED';
              const isYellow = sig.state === 'YELLOW';
              const sigColor = isRed ? '#ef4444' : isYellow ? '#f59e0b' : '#10b981';

              // Calculate Stop Line position (8m before signal)
              const stopLineDistPx = 18;
              const rad = (sig.direction * Math.PI) / 180;
              const stopX = x - Math.sin(rad) * stopLineDistPx;
              const stopY = y + Math.cos(rad) * stopLineDistPx;

              // Orthogonal stop line bar
              const barLen = 14;
              const barX1 = stopX - Math.cos(rad) * barLen;
              const barY1 = stopY - Math.sin(rad) * barLen;
              const barX2 = stopX + Math.cos(rad) * barLen;
              const barY2 = stopY + Math.sin(rad) * barLen;

              return (
                <g
                  key={sig.signal_id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEntity(sig);
                  }}
                >
                  {/* Virtual Stop Line Bar on Road */}
                  <line
                    x1={barX1}
                    y1={barY1}
                    x2={barX2}
                    y2={barY2}
                    stroke={isRed ? '#ef4444' : '#64748b'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className={isRed ? 'animate-pulse' : ''}
                  />
                  {isRed && (
                    <circle
                      cx={stopX}
                      cy={stopY}
                      r="20"
                      fill="url(#stopLineGlow)"
                    />
                  )}
                  <text
                    x={stopX + 16}
                    y={stopY + 3}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="800"
                    fill={isRed ? '#dc2626' : '#64748b'}
                  >
                    STOP LINE
                  </text>

                  {/* Signal Post Housing */}
                  <rect
                    x={x - 8}
                    y={y - 12}
                    width="16"
                    height="24"
                    rx="4"
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Glowing Active Bulb */}
                  <circle
                    cx={x}
                    cy={y + (isRed ? -6 : isYellow ? 0 : 6)}
                    r="4"
                    fill={sigColor}
                    className="animate-pulse"
                  />
                  {/* Timer Badge */}
                  <rect
                    x={x + 12}
                    y={y - 8}
                    width="26"
                    height="16"
                    rx="4"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                  />
                  <text
                    x={x + 25}
                    y={y + 4}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="800"
                    fill={sigColor}
                    textAnchor="middle"
                  >
                    {sig.remaining_time}s
                  </text>
                </g>
              );
            })}
          </g>

          {/* Moving Vehicle Marker (HERO) */}
          {vehicle && (
            <g
              className="vehicle-marker transition-all duration-300 ease-out"
              transform={`translate(${vehPos.x}, ${vehPos.y})`}
            >
              {/* Stopped Halo when waiting at RED signal or STOP sign */}
              {isVehicleStopped && (
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className="animate-spin"
                  style={{ animationDuration: '6s' }}
                />
              )}

              {/* Vehicle Outer Pulse */}
              <circle
                cx="0"
                cy="0"
                r="16"
                fill={isVehicleStopped ? '#ef4444' : '#10b981'}
                fillOpacity="0.2"
                className="animate-ping"
              />

              {/* Rotatable Vehicle Chevron Shape */}
              <g transform={`rotate(${vehicle.heading})`}>
                <polygon
                  points="0,-14 11,10 0,6 -11,10"
                  fill={isVehicleStopped ? '#ef4444' : isVehicleDecelerating ? '#f59e0b' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Center Core dot */}
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
              </g>

              {/* Vehicle Floating Status Tag */}
              <g transform="translate(18, -12)">
                <rect
                  x="0"
                  y="0"
                  width={isVehicleStopped ? 110 : 85}
                  height="22"
                  rx="6"
                  fill="#0f172a"
                  fillOpacity="0.9"
                />
                <text x="8" y="14" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#ffffff">
                  {isVehicleStopped ? '🔴 STOPPED (0)' : `${vehicle.speed_kmh} km/h`}
                </text>
              </g>
            </g>
          )}
        </g>
      </svg>

      {/* Selected Entity Popup Inspector */}
      {selectedEntity && (
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{selectedEntity.name}</span>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-slate-400 hover:text-slate-700 font-bold px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {selectedEntity.signal_id ? `Signal Phase: ${selectedEntity.state} (${selectedEntity.remaining_time}s remaining)` : `Geofence Radius: ${selectedEntity.activation_radius}m`}
          </p>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-4 right-4 z-10 hidden md:flex items-center justify-between text-[11px] text-slate-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Vehicle (Heading)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-700" />
            <span>Virtual RIU Beacon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900" />
            <span>Traffic Signal & Stop Line</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-emerald-500 rounded" />
            <span>Corridor Path</span>
          </div>
        </div>
        <span className="font-mono text-slate-400 text-[10px]">OSM GeoJSON • 100% Vector Canvas</span>
      </div>
    </div>
  );
};
