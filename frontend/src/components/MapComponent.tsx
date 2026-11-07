import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { VehicleState, VirtualRIU, TrafficSignal } from '../types';

interface MapComponentProps {
  vehicle: VehicleState | null;
  rius: VirtualRIU[];
  signals: TrafficSignal[];
  routes?: any[];
  onSelectRIU?: (riu: VirtualRIU) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  vehicle,
  rius,
  signals,
  routes = [],
  onSelectRIU
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const riuMarkersRef = useRef<maplibregl.Marker[]>([]);
  const signalMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors, CartoDB'
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
      center: [78.3772, 17.4435], // Hitec City, Hyderabad
      zoom: 13.5,
      pitch: 35,
      bearing: 0
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      // Add Route Polyline
      const routeCoordinates = [
        [78.3750, 17.4520],
        [78.3808, 17.4502],
        [78.3818, 17.4450],
        [78.3780, 17.4380],
        [78.3712, 17.4325],
        [78.3620, 17.4260],
        [78.3540, 17.4215]
      ];

      if (!map.getSource('route-line')) {
        map.addSource('route-line', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates
            }
          }
        });

        // Glow line
        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#22c55e',
            'line-width': 10,
            'line-opacity': 0.25,
            'line-blur': 6
          }
        });

        // Core line
        map.addLayer({
          id: 'route-core',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#22c55e',
            'line-width': 4,
            'line-opacity': 0.85
          }
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Vehicle Marker
  useEffect(() => {
    if (!mapRef.current || !vehicle) return;

    const { latitude, longitude, heading, vehicle_type, speed_kmh } = vehicle;

    if (!vehicleMarkerRef.current) {
      // Create Custom Vehicle Marker Element
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.innerHTML = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(34, 197, 94, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div id="veh-body" style="width: 28px; height: 28px; border-radius: 50%; background: #22c55e; border: 3px solid #ffffff; box-shadow: 0 0 15px rgba(34, 197, 94, 0.8); display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#020617" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
            </svg>
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);

      vehicleMarkerRef.current = marker;
    } else {
      vehicleMarkerRef.current.setLngLat([longitude, latitude]);
      const vehBody = vehicleMarkerRef.current.getElement().querySelector('#veh-body') as HTMLElement;
      if (vehBody) {
        vehBody.style.transform = `rotate(${heading}deg)`;
      }
    }
  }, [vehicle]);

  // Update Virtual RIU Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    riuMarkersRef.current.forEach((m) => m.remove());
    riuMarkersRef.current = [];

    rius.forEach((riu) => {
      const el = document.createElement('div');
      el.className = 'riu-marker cursor-pointer';
      
      const isSpeed = riu.event_type.startsWith('SPEED_LIMIT');
      const isCritical = riu.priority === 'CRITICAL';
      const bgCol = isCritical ? '#ef4444' : isSpeed ? '#3b82f6' : '#f59e0b';

      el.innerHTML = `
        <div style="background: rgba(15, 23, 42, 0.9); border: 2px solid ${bgCol}; border-radius: 8px; padding: 4px 7px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-family: monospace; font-size: 10px; font-weight: bold; color: #ffffff;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: ${bgCol};"></span>
          <span>${riu.event_type.replace('_', ' ')} ${riu.value ? riu.value : ''}</span>
        </div>
      `;

      el.onclick = () => onSelectRIU?.(riu);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([riu.longitude, riu.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div style="color: #0f172a; padding: 4px; font-family: sans-serif;">
              <h3 style="font-weight: bold; font-size: 12px; margin-bottom: 2px;">${riu.name}</h3>
              <p style="font-size: 11px; color: #475569; margin: 0;">Type: <b>${riu.event_type}</b></p>
              <p style="font-size: 11px; color: #475569; margin: 0;">Radius: <b>${riu.activation_radius}m</b></p>
              <p style="font-size: 11px; color: #475569; margin: 0;">Direction: <b>${riu.direction}°</b></p>
              <span style="display: inline-block; margin-top: 4px; padding: 2px 6px; border-radius: 4px; background: #e2e8f0; font-size: 9px; font-weight: bold;">SIMULATED V-RIU</span>
            </div>
          `)
        )
        .addTo(mapRef.current!);

      riuMarkersRef.current.push(marker);
    });
  }, [rius, onSelectRIU]);

  // Update Traffic Signal Markers
  useEffect(() => {
    if (!mapRef.current) return;

    signalMarkersRef.current.forEach((m) => m.remove());
    signalMarkersRef.current = [];

    signals.forEach((sig) => {
      const el = document.createElement('div');
      const isRed = sig.state === 'RED';
      const isYellow = sig.state === 'YELLOW';
      const colorHex = isRed ? '#ef4444' : isYellow ? '#eab308' : '#22c55e';

      el.innerHTML = `
        <div style="background: #090d16; border: 2px solid ${colorHex}; border-radius: 6px; padding: 3px 6px; display: flex; align-items: center; gap: 4px; box-shadow: 0 0 10px ${colorHex}55; color: #fff; font-family: monospace; font-size: 10px; font-weight: bold;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${colorHex}; box-shadow: 0 0 6px ${colorHex};"></span>
          <span>${sig.remaining_time}s</span>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([sig.longitude, sig.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 12 }).setHTML(`
            <div style="color: #0f172a; padding: 4px;">
              <h4 style="font-weight: bold; font-size: 12px; margin: 0;">${sig.name}</h4>
              <p style="font-size: 11px; margin: 2px 0;">State: <b style="color: ${colorHex};">${sig.state}</b> (${sig.remaining_time}s left)</p>
              ${sig.recommended_speed_min ? `<p style="font-size: 10px; color: #16a34a;">Green-Wave: ${sig.recommended_speed_min}-${sig.recommended_speed_max} km/h</p>` : ''}
              <span style="font-size: 9px; background: #e2e8f0; padding: 1px 4px; border-radius: 3px;">SIMULATED SIGNAL</span>
            </div>
          `)
        )
        .addTo(mapRef.current!);

      signalMarkersRef.current.push(marker);
    });
  }, [signals]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* City & Layer Overlay Tag */}
      <div className="absolute top-3 left-3 glass-panel px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        <span className="font-semibold text-white">Hyderabad Connected Corridor</span>
        <span className="text-[10px] text-slate-400 font-mono">MapLibre GL</span>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 glass-panel p-2.5 rounded-xl text-[11px] flex flex-wrap items-center gap-3 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 border border-white" />
          <span className="text-slate-300">Vehicle (Heading)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-blue-500" />
          <span className="text-slate-300">Virtual RIU</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-500" />
          <span className="text-slate-300">Traffic Signal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-brand-500 rounded" />
          <span className="text-slate-300">Simulated Corridor</span>
        </div>
      </div>
    </div>
  );
};
