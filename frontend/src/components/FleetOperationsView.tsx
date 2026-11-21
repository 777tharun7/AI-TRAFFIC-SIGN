import React, { useState, useEffect } from 'react';
import { 
  Bus, Clock, Zap, Users, Shield, RefreshCw, CheckCircle2, 
  AlertTriangle, Navigation, MapPin, Gauge
} from 'lucide-react';
import { PublicTransportBus, PublicTransportRoute } from '../types';

export const FleetOperationsView: React.FC = () => {
  const [buses, setBuses] = useState<PublicTransportBus[]>([]);
  const [routes, setRoutes] = useState<PublicTransportRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransitData = async () => {
    setLoading(true);
    try {
      const [busRes, routeRes] = await Promise.all([
        fetch('/api/v1/transit/buses'),
        fetch('/api/v1/transit/routes')
      ]);
      if (busRes.ok) setBuses(await busRes.json());
      if (routeRes.ok) setRoutes(await routeRes.json());
    } catch (err) {
      console.error('Failed to fetch transit fleet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransitData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider uppercase font-mono">
              [SIMULATED DATA] TSRTC Urban Transit Control
            </span>
            <span className="text-xs text-slate-400 font-mono">INTELLIGENT FLEET CAD/AVL</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="w-7 h-7 text-[#00875A]" />
            Public Transit & Bus Fleet Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time schedule adherence, headway regularity, electric bus battery SoC %, and passenger crowding indices.
          </p>
        </div>

        <button
          onClick={fetchTransitData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Transit Corridor Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((r) => (
          <div key={r.route_id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-mono font-bold text-xs">
                Route {r.route_number}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {r.corridor_reliability_pct}% On-Time
              </span>
            </div>

            <div className="text-sm font-bold text-slate-800">
              {r.origin} → {r.destination}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-100 font-mono">
              <div>
                <div className="text-[10px] text-slate-400">ACTIVE BUSES</div>
                <div className="font-bold text-slate-800 mt-0.5">{r.active_buses_count} Units</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">AVG HEADWAY</div>
                <div className="font-bold text-slate-800 mt-0.5">{r.average_headway_minutes} mins</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">TOTAL STOPS</div>
                <div className="font-bold text-slate-800 mt-0.5">{r.total_stops} Stops</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bus Fleet Roster */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Active Fleet Units ({buses.length})
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {buses.map((b) => {
            const isDelayed = b.schedule_delay_minutes > 0;
            const isAhead = b.schedule_delay_minutes < 0;

            return (
              <div key={b.bus_id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {b.bus_id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDelayed
                      ? 'bg-amber-100 text-amber-800'
                      : isAhead
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isDelayed
                      ? `+${b.schedule_delay_minutes} min Late`
                      : isAhead
                      ? `${Math.abs(b.schedule_delay_minutes)} min Ahead`
                      : 'On Schedule'}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800">{b.route_name}</div>
                <div className="text-[11px] text-slate-500">Driver: {b.current_driver} (★ {b.driver_rating})</div>

                {/* EV Battery & Passenger Load */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-500" /> Battery SoC:
                      </span>
                      <strong className="font-mono text-emerald-700">{b.battery_soc_pct}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${b.battery_soc_pct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3 h-3 text-blue-500" /> Passenger Load:
                      </span>
                      <strong className="font-mono text-slate-800">{b.passenger_load_pct}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${b.passenger_load_pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Next: {b.next_stop_name}
                  </span>
                  <span className="font-mono font-bold text-slate-700">{b.eta_next_stop_seconds}s</span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
