import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldAlert, Zap, BatteryCharging, Radio, 
  AlertTriangle, Navigation, CheckCircle2, Siren, ArrowRight,
  TrendingUp, Clock, MapPin, Gauge, Activity, RefreshCw,
  Search, Sliders, Check, Wind, Eye, Car
} from 'lucide-react';
import { VehicleState, EVChargingStation, TrafficIncident, CorridorTrafficStatus } from '../types';
import { api } from '../services/api';

interface Props {
  vehicle: VehicleState | null;
  onNavigateTab?: (tab: string) => void;
  onControl?: (action: string, params?: any) => void;
}

export const TrafficDeptPortal: React.FC<Props> = ({
  vehicle,
  onNavigateTab,
  onControl
}) => {
  const [corridors, setCorridors] = useState<CorridorTrafficStatus[]>([]);
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [evStations, setEvStations] = useState<EVChargingStation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<EVChargingStation | null>(null);
  const [selectedCorridor, setSelectedCorridor] = useState<string>('COR-01');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [vehicle?.latitude, vehicle?.longitude]);

  const loadData = async () => {
    try {
      const [corrList, incList, stList] = await Promise.all([
        api.getTrafficCorridors(),
        api.getTrafficIncidents(),
        api.getEVStations(vehicle?.latitude, vehicle?.longitude)
      ]);
      setCorridors(corrList || []);
      setIncidents(incList || []);
      setEvStations(stList || []);
      if (stList && stList.length > 0 && !selectedStation) {
        setSelectedStation(stList[0]);
      }
      setLoading(false);
    } catch (e) {
      console.error('Failed to load traffic department data:', e);
      setLoading(false);
    }
  };

  const handleToggleEmergencyPreemption = async () => {
    try {
      const nextState = !emergencyActive;
      const res = await api.triggerEmergencyPreemption('route_hitec_gachibowli', nextState);
      setEmergencyActive(nextState);
      setActionSuccessMessage(res.message);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ================= 1. TRAFFIC DEPARTMENT COMMAND HEADER ================= */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>HYDERABAD METROPOLITAN TRAFFIC COMMAND & CONTROL (ITMS / ATCS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              City Traffic Surveillance & EV Fleet Operations Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Centralized city operations console unifying real-time corridor congestion, ANPR automated enforcement, 
              EV battery charging grid analytics, and Emergency Vehicle Priority (EVP) preemption.
            </p>
          </div>

          {/* Emergency Preemption (EVP) Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleToggleEmergencyPreemption}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black tracking-wide uppercase transition-all shadow-lg cursor-pointer ${
                emergencyActive 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse border border-rose-400 shadow-rose-900/50' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50'
              }`}
            >
              <Siren className="w-4 h-4" />
              <span>{emergencyActive ? 'Disable Emergency Green Wave' : 'Trigger Ambulance / Fire EVP'}</span>
            </button>

            <button
              onClick={loadData}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>

        {/* Action Success Toast */}
        {actionSuccessMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Global Traffic Vital Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80 text-slate-300">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Monitored Vehicles</span>
            <div className="text-xl font-black text-white font-mono">7,580</div>
            <div className="text-[10px] text-emerald-400">● 4 corridors live connected</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400">EV Fleet Penetration</span>
            <div className="text-xl font-black text-cyan-400 font-mono">34.2%</div>
            <div className="text-[10px] text-slate-400">Avg Fleet Battery: 68%</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400">E-Challans Generated Today</span>
            <div className="text-xl font-black text-rose-400 font-mono">₹ 1,42,500</div>
            <div className="text-[10px] text-rose-300 font-mono">82 Violations Logged</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400">Avg Citywide Network Speed</span>
            <div className="text-xl font-black text-white font-mono">46.8 km/h</div>
            <div className="text-[10px] text-emerald-400">Level of Service: LOS B</div>
          </div>
        </div>

      </div>

      {/* ================= 2. EV SMART CHARGING FLEET INTELLIGENCE SECTION ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 font-mono uppercase tracking-wide">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>SMART EV CHARGING GRID INTEGRATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Connected EV Fleet Battery Telemetry & Port Availability
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlates vehicle battery State of Charge (SoC %) with corridor fast-charging hubs to recommend optimal charging ports.
            </p>
          </div>

          {/* Vehicle Battery Live Status Chip */}
          <div className="flex items-center gap-3 p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Simulated Vehicle Battery</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  (vehicle?.battery_soc_pct ?? 74) < 20 ? 'bg-red-500 text-white' : 'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {(vehicle?.battery_soc_pct ?? 74) < 20 ? 'LOW BATTERY ALERT' : 'OPTIMAL'}
                </span>
              </div>
              <div className="text-sm font-black font-mono text-emerald-400">
                {vehicle?.battery_soc_pct?.toFixed(1) ?? '74.5'}% SoC • Range: {vehicle?.estimated_range_km?.toFixed(0) ?? '298'} km
              </div>
            </div>
          </div>
        </div>

        {/* EV Stations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evStations.map((station) => (
            <div
              key={station.station_id}
              onClick={() => setSelectedStation(station)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                selectedStation?.station_id === station.station_id
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-md scale-101'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                    {station.operator} • {station.station_id}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 leading-snug mt-0.5">
                    {station.name}
                  </h3>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  station.available_ports > 3 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : station.available_ports > 0 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {station.available_ports}/{station.total_ports} Available
                </span>
              </div>

              {/* Charger Capabilities & Price */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-slate-600">
                  <span>Fast Charger Power:</span>
                  <b className="text-slate-900">{station.power_kw} kW Ultra-Fast</b>
                </div>
                <div className="flex items-center justify-between font-mono text-slate-600">
                  <span>Price per kWh:</span>
                  <b className="text-slate-900">₹ {station.price_per_kwh}</b>
                </div>
                <div className="flex items-center justify-between font-mono text-slate-600">
                  <span>Estimated Wait Time:</span>
                  <b className={station.wait_time_minutes === 0 ? 'text-emerald-600' : 'text-amber-600'}>
                    {station.wait_time_minutes === 0 ? 'Immediate Slot' : `${station.wait_time_minutes} min wait`}
                  </b>
                </div>
                {station.distance_m && (
                  <div className="flex items-center justify-between font-mono text-slate-600">
                    <span>Corridor Detour:</span>
                    <b className="text-cyan-700 font-bold">{station.distance_m} m</b>
                  </div>
                )}
              </div>

              {/* Supported Connector Badges */}
              <div className="mt-3 flex flex-wrap gap-1">
                {station.charger_types.map((type, idx) => (
                  <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {type}
                  </span>
                ))}
              </div>

              {/* Navigation Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onControl) {
                      onControl('set_route', { route_id: 'route_hitec_gachibowli' });
                    }
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Route Vehicle to this Charger</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ================= 3. CITYWIDE CORRIDOR MONITORING & LEVEL OF SERVICE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Active Corridors Health */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>CORRIDOR SURVEILLANCE & LEVEL OF SERVICE (LoS)</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                Hyderabad Smart Arterial Grid
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              ATCS Cycle: 60s
            </span>
          </div>

          <div className="space-y-3">
            {corridors.map((c) => (
              <div 
                key={c.corridor_id}
                onClick={() => setSelectedCorridor(c.corridor_id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCorridor === c.corridor_id ? 'border-emerald-500 bg-slate-50/80 shadow-xs' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${
                      c.level_of_service === 'LOS_A' ? 'bg-emerald-500 shadow-sm shadow-emerald-500' :
                      c.level_of_service === 'LOS_B' ? 'bg-teal-500' :
                      c.level_of_service === 'LOS_C' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <span className="text-sm font-bold text-slate-900">{c.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                      {c.level_of_service.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                      c.green_wave_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {c.green_wave_active ? '● Green-Wave Active' : 'Adaptive Cycle'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3 text-xs font-mono text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg Speed</span>
                    <b className="text-slate-900 font-bold">{c.average_speed_kmh} km/h</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Active Density</span>
                    <b className="text-slate-900 font-bold">{c.active_vehicle_count} veh/hr</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Incidents</span>
                    <b className={c.incident_count > 0 ? 'text-amber-600 font-bold' : 'text-slate-900'}>{c.incident_count}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Corridor AQI</span>
                    <b className={c.aqi_index > 100 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {c.aqi_index} AQI
                    </b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Live ANPR Violations & Automated E-Challans */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wide font-mono">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>ANPR VIOLATIONS & INCIDENT FEED</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                Automated City Enforcement
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div key={inc.incident_id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">{inc.incident_id}</span>
                  <span className="text-slate-400">{inc.timestamp}</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{inc.location_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Plate: <b className="text-slate-800">{inc.vehicle_plate}</b>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    inc.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    inc.severity === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {inc.incident_type.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs font-mono">
                  <span className="text-slate-500">
                    Status: <b className="text-emerald-700">{inc.status}</b>
                  </span>
                  {inc.fine_amount_inr ? (
                    <span className="text-rose-600 font-bold">
                      Fine: ₹ {inc.fine_amount_inr}
                    </span>
                  ) : (
                    <span className="text-cyan-700 font-bold">Patrol Dispatched</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
