import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { 
  Navigation, Compass, Layers, CheckSquare, Square, Locate, Plus, Minus,
  AlertTriangle, Radio, ShieldCheck, MapPin, Gauge, Eye, Camera, Cpu, Cog,
  ArrowRight, Sparkles, CheckCircle2, ChevronDown
} from 'lucide-react';
import { VehicleState, VirtualRIU, TrafficSignal, SignalState } from '../types';
import { LivePerceptionPipelineDeck } from './LivePerceptionPipelineDeck';

interface Props {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  onControl?: (action: string, params?: any) => void;
  showPipelineDeck?: boolean;
}

// Hussain Sagar Lake & Connected Corridor Route Geometry (GeoJSON coordinates)
const HYDERABAD_CORRIDOR_COORDS: [number, number][] = [
  [78.4410, 17.4120], // 0. Banjara Hills (Taj Krishna Road No. 1)
  [78.4500, 17.4180], // 1. Panjagutta Junction
  [78.4550, 17.4220], // 2. Somajiguda (Raj Bhavan Rd)
  [78.4630, 17.4270], // 3. Necklace Road Entrance (Khairatabad Flyover)
  [78.4700, 17.4290], // 4. Necklace Road Waterfront (People's Plaza)
  [78.4750, 17.4230], // 5. NTR Gardens / Tank Bund South
  [78.4820, 17.4280], // 6. Tank Bund Waterfront Promenade
  [78.4850, 17.4350], // 7. Kavadiguda / Sailing Club
  [78.4865, 17.4410]  // 8. Secunderabad / Paradise Junction
];

export const RealNavigationMap: React.FC<Props> = ({
  vehicle,
  rius,
  signals,
  onControl,
  showPipelineDeck = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Markers Refs
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const signalMarkersRef = useRef<maplibregl.Marker[]>([]);
  const eventMarkersRef = useRef<maplibregl.Marker[]>([]);
  const stopLineMarkersRef = useRef<maplibregl.Marker[]>([]);

  // UI States
  const [mapMode, setMapMode] = useState<'2D' | '3D'>('2D');
  const [isFollowing, setIsFollowing] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showLayersMenu, setShowLayersMenu] = useState<boolean>(false);
  const [viewFormat, setViewFormat] = useState<'interactive' | 'schematic'>('interactive');

  // Independent Layer Toggles
  const [layers, setLayers] = useState({
    baseMap: true,
    roadNetwork: true,
    route: true,
    vehicle: true,
    signals: true,
    stopLines: true,
    signs: true,
    events: true,
    rius: false
  });

  const [mapStyleType, setMapStyleType] = useState<'voyager' | 'dark' | 'osm' | 'satellite'>('voyager');

  const handleStyleChange = (type: 'voyager' | 'dark' | 'osm' | 'satellite') => {
    setMapStyleType(type);
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    let tiles = [
      'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
    ];
    
    if (type === 'dark') {
      tiles = [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      ];
    } else if (type === 'osm') {
      tiles = [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ];
    } else if (type === 'satellite') {
      tiles = [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ];
    }

    const source = map.getSource('osm-tiles') as any;
    if (source && source.setTiles) {
      source.setTiles(tiles);
    }
  };

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSpeed = vehicle?.speed_kmh ?? 42;
  const heading = vehicle?.heading ?? 65;
  const currentRoad = vehicle?.current_road ?? 'Necklace Road Waterfront';
  const behaviorState = vehicle?.behavior_state ?? 'DECELERATING';
  const distanceToEvent = Math.round(vehicle?.distance_to_event_m ?? 80);
  const activeSignal = signals.length > 0 ? signals[0] : null;
  const signalState = activeSignal?.state ?? 'RED';
  const timeRemaining = activeSignal?.remaining_time ?? 15;

  // Initialize Clean MapLibre 2D Navigation Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || viewFormat === 'schematic') return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap, CartoDB'
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [vehicle ? vehicle.longitude : 78.4410, vehicle ? vehicle.latitude : 17.4120],
      zoom: 14.2,
      pitch: 0,
      bearing: 0
    });

    mapRef.current = map;

    setTimeout(() => { map.resize(); }, 150);
    setTimeout(() => { map.resize(); }, 600);

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    map.on('dragstart', () => {
      setIsFollowing(false);
    });

    map.on('load', () => {
      map.resize();

      // 1. Add Planned Corridor Route Geometry
      map.addSource('full-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: HYDERABAD_CORRIDOR_COORDS
          }
        }
      });

      // Outer Route Glow / Halo Ribbon
      map.addLayer({
        id: 'route-halo-layer',
        type: 'line',
        source: 'full-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#06b6d4',
          'line-width': 14,
          'line-opacity': 0.45,
          'line-blur': 4
        }
      });

      // Main Navigation Cyan / Turquoise Corridor Ribbon
      map.addLayer({
        id: 'route-main-layer',
        type: 'line',
        source: 'full-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#0284c7',
          'line-width': 7,
          'line-opacity': 0.95
        }
      });

      // Inner Guideway Dashed Line
      map.addLayer({
        id: 'route-dash-layer',
        type: 'line',
        source: 'full-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#10b981',
          'line-width': 2.5,
          'line-dasharray': [2, 3],
          'line-opacity': 0.9
        }
      });

      // Stop Line GeoJSON Layer
      map.addSource('stop-lines', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { id: 'stop-line-tank-bund', name: 'Tank Bund South Stop Line' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [78.4746, 17.4234],
                  [78.4754, 17.4226]
                ]
              }
            }
          ]
        }
      });

      map.addLayer({
        id: 'stop-lines-visual',
        type: 'line',
        source: 'stop-lines',
        layout: { 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 6,
          'line-opacity': 0.95
        }
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [viewFormat]);

  // Update 2D / 3D Mode
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapMode === '3D') {
      mapRef.current.easeTo({
        pitch: 52,
        bearing: vehicle?.heading ?? 65,
        duration: 800
      });
    } else {
      mapRef.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 800
      });
    }
  }, [mapMode]);

  // Update Dynamic Vehicle Marker
  useEffect(() => {
    if (!mapRef.current || !vehicle || viewFormat === 'schematic') return;
    const map = mapRef.current;
    const lng = vehicle.longitude;
    const lat = vehicle.latitude;

    if (!vehicleMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'relative flex items-center justify-center cursor-pointer';
      el.innerHTML = `
        <div id="veh-radar-ring" class="absolute w-20 h-20 rounded-full bg-cyan-500/20 animate-ping"></div>
        <div id="veh-halo" class="absolute w-14 h-14 rounded-full bg-cyan-500/30 border-2 border-cyan-400"></div>
        
        <!-- Directional Car Body with Arrow -->
        <div id="veh-body" class="relative z-10 w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white font-black" style="transform: rotate(${vehicle.heading}deg); transition: transform 0.2s ease;">
          <svg class="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 20L12 16L20 20L12 2Z" />
          </svg>
        </div>

        <!-- Overhead Speed Badge -->
        <div class="absolute -top-7 px-2 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[10px] font-black border border-slate-700 shadow-md whitespace-nowrap">
          <span id="veh-speed-text">${Math.round(vehicle.speed_kmh)} km/h</span>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);

      vehicleMarkerRef.current = marker;
    } else {
      vehicleMarkerRef.current.setLngLat([lng, lat]);
      const vehEl = vehicleMarkerRef.current.getElement();
      const vehBody = (vehEl?.querySelector('#veh-body') || document.getElementById('veh-body')) as HTMLElement | null;
      const vehSpeed = (vehEl?.querySelector('#veh-speed-text') || document.getElementById('veh-speed-text')) as HTMLElement | null;

      if (vehBody) vehBody.style.transform = `rotate(${vehicle.heading}deg)`;
      if (vehSpeed) vehSpeed.innerText = `${Math.round(vehicle.speed_kmh)} km/h`;
    }

    if (isFollowing) {
      map.easeTo({
        center: [lng, lat],
        bearing: mapMode === '3D' ? vehicle.heading : 0,
        duration: 350,
        easing: (t) => t
      });
    }
  }, [vehicle?.latitude, vehicle?.longitude, vehicle?.heading, vehicle?.speed_kmh, isFollowing, mapMode, viewFormat]);

  // Update Callouts, Traffic Signals & Road Events
  useEffect(() => {
    if (!mapRef.current || viewFormat === 'schematic') return;
    const map = mapRef.current;

    signalMarkersRef.current.forEach(m => m.remove());
    signalMarkersRef.current = [];
    eventMarkersRef.current.forEach(m => m.remove());
    eventMarkersRef.current = [];
    stopLineMarkersRef.current.forEach(m => m.remove());
    stopLineMarkersRef.current = [];

    // 1. Render Traffic Signal Poles along Corridor
    if (layers.signals) {
      const corridorSignals = [
        { id: 'sig-banjara', name: 'Banjara Hills Junction', lat: 17.4120, lon: 78.4410, state: 'GREEN', remaining: 25 },
        { id: 'sig-somajiguda', name: 'Somajiguda Raj Bhavan', lat: 17.4220, lon: 78.4550, state: 'RED', remaining: 30 },
        { id: 'sig-necklace', name: 'Necklace Road Khairatabad', lat: 17.4270, lon: 78.4630, state: 'GREEN', remaining: 18 },
        { id: 'sig-tankbund', name: 'NTR Gardens / Tank Bund South', lat: 17.4230, lon: 78.4750, state: 'RED', remaining: timeRemaining },
        { id: 'sig-kavadiguda', name: 'Tank Bund Promenade', lat: 17.4280, lon: 78.4820, state: 'GREEN', remaining: 17 },
        { id: 'sig-secunderabad', name: 'Secunderabad Paradise', lat: 17.4410, lon: 78.4865, state: 'RED', remaining: 20 }
      ];

      corridorSignals.forEach((sig) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group select-none transition-transform hover:scale-110';
        const isRed = sig.state === 'RED';
        const isGreen = sig.state === 'GREEN';

        el.innerHTML = `
          <div class="flex items-center gap-1.5 bg-white/95 text-slate-900 px-2 py-1 rounded-xl shadow-md border-2 ${isRed ? 'border-red-500' : 'border-emerald-500'} backdrop-blur-md">
            <div class="w-3.5 h-8 rounded bg-black flex flex-col items-center justify-between p-0.5">
              <span class="w-1.5 h-1.5 rounded-full ${isRed ? 'bg-red-500 animate-pulse shadow-sm shadow-red-500' : 'bg-red-500/20'}"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400/20"></span>
              <span class="w-1.5 h-1.5 rounded-full ${isGreen ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500' : 'bg-emerald-500/20'}"></span>
            </div>
            <div class="text-left font-mono">
              <span class="text-[9px] font-bold block leading-none ${isRed ? 'text-red-600' : 'text-emerald-600'}">${sig.state}</span>
              <span class="text-[10px] font-black text-slate-900 leading-tight">${sig.remaining}s</span>
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          setSelectedEvent({
            type: 'TRAFFIC_SIGNAL',
            title: sig.name,
            state: sig.state,
            remaining: sig.remaining,
            distance: distanceToEvent,
            road: 'Necklace Road Corridor',
            action: isRed ? 'DECELERATING / STOPPING' : 'CRUISING ON GREEN'
          });
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([sig.lon, sig.lat])
          .addTo(map);

        signalMarkersRef.current.push(marker);
      });
    }

    // 2. Render Exact Callout Cards Matching User Reference Screenshot
    if (layers.signs) {
      const callouts = [
        {
          id: 'callout-speed-50',
          lon: 78.4520,
          lat: 17.4200,
          html: `
            <div class="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 cursor-pointer transition-transform hover:scale-105">
              <div class="w-6 h-6 rounded-full border-2 border-red-600 bg-white flex items-center justify-center font-black text-[10px] text-slate-900">
                50
              </div>
              <div class="text-left">
                <div class="text-[10px] font-bold text-slate-900 leading-tight">Speed Limit</div>
                <div class="text-[9px] text-slate-500 font-mono">50 km/h</div>
              </div>
            </div>
          `
        },
        {
          id: 'callout-ped-120',
          lon: 78.4580,
          lat: 17.4240,
          html: `
            <div class="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 cursor-pointer transition-transform hover:scale-105">
              <div class="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center text-xs">
                🚶
              </div>
              <div class="text-left">
                <div class="text-[10px] font-bold text-slate-900 leading-tight">Pedestrian Crossing</div>
                <div class="text-[9px] text-slate-500 font-mono">120 m</div>
              </div>
            </div>
          `
        },
        {
          id: 'callout-red-signal',
          lon: 78.4750,
          lat: 17.4230,
          html: `
            <div class="flex items-center gap-2 bg-red-50/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl border-2 border-red-500 cursor-pointer transition-transform hover:scale-105 animate-pulse">
              <div class="w-4 h-8 bg-black rounded p-0.5 flex flex-col items-center justify-between shrink-0">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              </div>
              <div class="text-left">
                <div class="text-[10px] font-black text-red-600 leading-tight">Red signal</div>
                <div class="text-[9px] text-red-700 font-mono font-bold">80 m ahead - ${timeRemaining} s</div>
              </div>
            </div>
          `
        },
        {
          id: 'callout-road-work',
          lon: 78.4835,
          lat: 17.4310,
          html: `
            <div class="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 cursor-pointer transition-transform hover:scale-105">
              <div class="w-6 h-6 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center text-xs">
                ⚠️
              </div>
              <div class="text-left">
                <div class="text-[10px] font-bold text-slate-900 leading-tight">Road Work</div>
                <div class="text-[9px] text-slate-500 font-mono">300 m ahead</div>
              </div>
            </div>
          `
        }
      ];

      callouts.forEach((c) => {
        const el = document.createElement('div');
        el.className = 'select-none';
        el.innerHTML = c.html;

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([c.lon, c.lat])
          .addTo(map);

        eventMarkersRef.current.push(marker);
      });
    }
  }, [signals, layers, distanceToEvent, timeRemaining, viewFormat]);

  const handleRecenter = () => {
    if (!mapRef.current || !vehicle) return;
    setIsFollowing(true);
    mapRef.current.flyTo({
      center: [vehicle.longitude, vehicle.latitude],
      zoom: 15.2,
      duration: 600
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
      
      {/* 1. TOP HEADER BAR (Exact Match with Reference: Live Hyderabad Corridor Simulation) */}
      <div className="p-3 px-5 border-b border-slate-200 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-20">
        
        {/* Left: Corridor Title & Speed */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] animate-pulse" />
            <span>Live Hyderabad Corridor Simulation</span>
          </div>

          <div className="bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-slate-700">
            Speed: {Math.round(currentSpeed)} km/h
          </div>

          {onControl && (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => onControl(vehicle?.is_running ? 'pause' : 'play')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  vehicle?.is_running
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
                title={vehicle?.is_running ? "Pause vehicle movement" : "Resume vehicle movement"}
              >
                {vehicle?.is_running ? '⏸ Pause' : '▶ Play'}
              </button>
              <button
                onClick={() => onControl('reset')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer shadow-2xs"
                title="Reset vehicle to start of corridor"
              >
                ↺ Reset
              </button>
            </div>
          )}
        </div>

        {/* Right: V2X & AI Vision Status Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00875A]" />
            <span>V2X: Connected</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>AI Vision: 43-Class Active</span>
          </div>
        </div>

      </div>

      {/* 2. INNER TOOLBAR & FILTER CONTROLS */}
      <div className="p-2.5 px-5 border-b border-slate-100 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 z-20 text-xs">
        
        {/* Left Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl font-bold text-slate-800 border border-slate-200 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Hyderabad Connected Corridor</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E6F8F3] text-[#00875A] font-semibold border border-[#00875A]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
            <span>Live Navigation</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          
          {/* Follow Vehicle */}
          <button
            onClick={() => {
              setIsFollowing(!isFollowing);
              if (!isFollowing) handleRecenter();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              isFollowing 
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Locate className="w-3.5 h-3.5" />
            <span>Follow Vehicle</span>
          </button>

          {/* View Mode: Interactive MapLibre vs High-Res Schematic Map */}
          <div className="p-0.5 rounded-xl bg-slate-200/70 border border-slate-200 flex items-center text-[11px] font-bold">
            <button
              onClick={() => { setViewFormat('interactive'); handleStyleChange('voyager'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewFormat === 'interactive' && mapStyleType === 'voyager' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => { setViewFormat('interactive'); handleStyleChange('dark'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewFormat === 'interactive' && mapStyleType === 'dark' ? 'bg-slate-900 text-emerald-400 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => { setViewFormat('interactive'); handleStyleChange('osm'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewFormat === 'interactive' && mapStyleType === 'osm' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OSM
            </button>
            <button
              onClick={() => { setViewFormat('interactive'); handleStyleChange('satellite'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewFormat === 'interactive' && mapStyleType === 'satellite' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setViewFormat(viewFormat === 'schematic' ? 'interactive' : 'schematic')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewFormat === 'schematic' ? 'bg-[#00875A] text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Toggle HD Illustrated Corridor Map"
            >
              Schematic
            </button>
          </div>

          {/* 2D / 3D Toggle */}
          <div className="p-0.5 rounded-xl bg-slate-200/70 border border-slate-200 flex items-center text-xs font-bold">
            <button
              onClick={() => setMapMode('2D')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapMode === '2D' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setMapMode('3D')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapMode === '3D' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D
            </button>
          </div>

          {/* Layers Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLayersMenu(!showLayersMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 shadow-2xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>

            {showLayersMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 space-y-2 text-xs">
                <div className="font-extrabold text-slate-900 pb-1 border-b border-slate-100">
                  Map Layers
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none" onClick={() => toggleLayer('route')}>
                  {layers.route ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
                  <span>Current Route</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none" onClick={() => toggleLayer('vehicle')}>
                  {layers.vehicle ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
                  <span>Vehicle Marker</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none" onClick={() => toggleLayer('signals')}>
                  {layers.signals ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
                  <span>Traffic Signals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none" onClick={() => toggleLayer('signs')}>
                  {layers.signs ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-300" />}
                  <span>Road Signs & Events</span>
                </label>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 3. MAIN MAP CANVAS AREA */}
      <div className="relative w-full h-[480px] min-h-[480px] bg-slate-100 overflow-hidden">
        
        {viewFormat === 'interactive' ? (
          <div ref={mapContainer} className="w-full h-full min-h-[480px]" />
        ) : (
          /* HD Illustrated Corridor Background Mode */
          <div className="relative w-full h-full">
            <img 
              src="/images/route_map_bg.jpg" 
              alt="Hyderabad Hussain Sagar Connected Corridor Map" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Right Minimal Zoom Controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
          <div className="flex flex-col rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md overflow-hidden text-slate-700">
            <button 
              onClick={() => mapRef.current?.zoomIn()}
              className="p-2 hover:bg-slate-100 active:bg-slate-200 transition-colors"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-200" />
            <button 
              onClick={() => mapRef.current?.zoomOut()}
              className="p-2 hover:bg-slate-100 active:bg-slate-200 transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRecenter}
            className="p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
            title="Recenter Vehicle"
          >
            <Locate className="w-4 h-4" />
          </button>
        </div>

        {/* Scale Legend (1 km) */}
        <div className="absolute right-4 bottom-4 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-[10px] text-slate-700 font-bold shadow-xs">
          1 km
        </div>

      </div>

      {/* 4. LOWER TELEMETRY STRIP (5 Hardware Modules) */}
      <div className="p-3.5 px-6 bg-white border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
        
        {/* Module 1: Camera */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Camera</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
              <span>Active</span>
              <span className="text-slate-400 font-normal font-mono text-[11px]">30 FPS</span>
            </div>
          </div>
        </div>

        {/* Module 2: GPS */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">GPS</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
              <span>Locked</span>
              <span className="text-slate-400 font-normal font-mono text-[11px]">±6 m</span>
            </div>
          </div>
        </div>

        {/* Module 3: V2X / SPaT */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">V2X / SPaT</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
              <span>Connected</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Signal data received</div>
          </div>
        </div>

        {/* Module 4: AI Model */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">AI Model</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
              <span>Running</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">EfficientNet-B0</div>
          </div>
        </div>

        {/* Module 5: Decision Engine */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Cog className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Decision Engine</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
              <span>Active</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Processing rules</div>
          </div>
        </div>

      </div>

      {/* 5. 5-CARD LIVE PERCEPTION & ACTUATION PIPELINE DECK */}
      {showPipelineDeck && (
        <div className="p-4 px-6 bg-[#F8FAFC] border-t border-slate-200">
          <LivePerceptionPipelineDeck
            vehicle={vehicle}
            speedKmh={currentSpeed}
            timeRemaining={timeRemaining}
          />
        </div>
      )}

    </div>
  );
};
