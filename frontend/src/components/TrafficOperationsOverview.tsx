import React, { useState, useEffect } from 'react';
import { 
  Building2, AlertTriangle, FileCheck, CheckCircle2, Clock, 
  MapPin, Shield, Zap, RefreshCw, ArrowRight, ExternalLink, 
  Compass, Radio, Activity, Wrench, ChevronRight, Sliders
} from 'lucide-react';
import { InfrastructureRecommendation } from '../types';

interface TrafficOperationsOverviewProps {
  onNavigateTab: (tab: string, filterParams?: any) => void;
}

export const TrafficOperationsOverview: React.FC<TrafficOperationsOverviewProps> = ({ onNavigateTab }) => {
  const [metrics, setMetrics] = useState<any>({
    active_traffic_incidents: 3,
    pending_violation_reviews: 9,
    red_light_violations: 2,
    overspeed_events: 1,
    active_junctions: 8,
    critical_road_alerts: 2,
    device_health_pct: 98.4,
    official_challans_issued: 14,
    emergency_priority_events: 2
  });
  const [recommendations, setRecommendations] = useState<InfrastructureRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [mRes, rRes] = await Promise.all([
        fetch('/api/violations/metrics/operational'),
        fetch('/api/violations/infrastructure/recommendations')
      ]);
      if (mRes.ok) setMetrics(await mRes.json());
      if (rRes.ok) setRecommendations(await rRes.json());
    } catch (err) {
      console.error('Failed to load operations metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  return (
    <div className="space-y-6 text-left">
      {/* 1. Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider uppercase font-mono">
              [SIMULATED DATA] Hyderabad City Traffic Branch
            </span>
            <span className="text-xs text-slate-400 font-mono">INTELLIGENT TRANSPORTATION COMMAND</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-[#00875A]" />
            Traffic Operations & Enforcement Command
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Calm, evidence-first operational dashboard. Real-time visibility into traffic flow, pending officer decisions, and road safety improvements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('tharun_demo')}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tharun's Story Walkthrough</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Operational Cards (All Clickable!) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Primary Operational Focus (Click any card to open filtered workflow)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Pending Officer Reviews */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer shadow-xs space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-700" />
                Cases Awaiting Officer Review
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-amber-950 font-mono">
                {metrics.pending_violation_reviews}
              </div>
              <span className="text-xs text-amber-800 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect Queue <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 leading-relaxed">
              Automated detections ready for human-in-the-loop determination under Section 167A CMVR.
            </p>
          </div>

          {/* Card 2: Flagship Red-Light Violations */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-xs space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                Red-Light & Stop-Line Jumping
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-200 text-rose-900 font-mono">
                Flagship
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-rose-950 font-mono">
                {metrics.red_light_violations}
              </div>
              <span className="text-xs text-rose-800 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Review Signal Proof <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-rose-800/80 leading-relaxed">
              Synchronized junction cameras & signal controllers; distinguished from legal clearance.
            </p>
          </div>

          {/* Card 3: Active Incidents */}
          <div
            onClick={() => onNavigateTab('traffic_dept')}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer shadow-xs space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-slate-500" />
                Active Traffic Incidents
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900 font-mono">
                {metrics.active_traffic_incidents}
              </div>
              <span className="text-xs text-slate-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View Dispatch <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Obstructions, congestion bottlenecks, and stalled vehicle alerts across Cyberabad corridors.
            </p>
          </div>

          {/* Card 4: Overspeed Events */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer shadow-xs space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Excessive Speed Events
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900 font-mono">
                {metrics.overspeed_events}
              </div>
              <span className="text-xs text-slate-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect Speed Dockets <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sustained excess with mandatory ±2 km/h sensor uncertainty tolerance margin applied.
            </p>
          </div>

          {/* Card 5: Monitored Junctions */}
          <div
            onClick={() => onNavigateTab('road_intelligence')}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer shadow-xs space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Signalised Controlled Junctions
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Adaptive ATCS
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900 font-mono">
                {metrics.active_junctions}
              </div>
              <span className="text-xs text-slate-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View Live Corridor Map <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Active V2X/SPaT intersections streaming green-wave timings and stop-line telemetry.
            </p>
          </div>

          {/* Card 6: Critical Escalations */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer shadow-xs space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-700" />
                Critical Road & Safety Alerts
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-purple-950 font-mono">
                {metrics.critical_road_alerts}
              </div>
              <span className="text-xs text-purple-800 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect Escalations <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-purple-800/80 leading-relaxed">
              Wrong-way driving, emergency vehicle obstruction, and heavy vehicle axle overload.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Secondary Infrastructure Health & Compliance Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateTab('gvid_registry')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer shadow-xs text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">GVID Hardware Health</div>
          <div className="text-xl font-black text-emerald-700 font-mono mt-1">{metrics.device_health_pct}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">AIS-140 Compliant</div>
        </div>

        <div
          onClick={() => onNavigateTab('evidence_workflow')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer shadow-xs text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">Official Challans Issued</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-1">{metrics.official_challans_issued}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Section 167A Sealed</div>
        </div>

        <div
          onClick={() => onNavigateTab('traffic_dept')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer shadow-xs text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">Emergency Preemptions</div>
          <div className="text-xl font-black text-emerald-700 font-mono mt-1">{metrics.emergency_priority_events} Active</div>
          <div className="text-[10px] text-slate-400 mt-0.5">108 Green-Wave Cleared</div>
        </div>

        <div
          onClick={() => onNavigateTab('fleet_operations')}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer shadow-xs text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">Transit Reliability</div>
          <div className="text-xl font-black text-blue-700 font-mono mt-1">91.8%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">TSRTC City Buses</div>
        </div>
      </div>

      {/* 4. Continuous Improvement: Data-Driven Infrastructure Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#00875A]" />
              Infrastructure & Signal Optimization Proposals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Preventing accidents through engineering: Analytics identifies repeat violation root-causes to improve road design rather than only issuing fines.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            PREVENT → DETECT → IMPROVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((r) => (
            <div key={r.recommendation_id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                  {r.junction_name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Projected -{r.projected_violation_reduction_pct}% Violations
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-800">
                Pattern: {r.violation_pattern} ({r.historical_count_30d} occurrences in 30 days)
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Root Cause:</strong> {r.root_cause_analysis}
              </p>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800">
                <strong className="text-[#00875A]">Engineering Action:</strong> {r.recommended_intervention}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Estimated Cost: <strong>₹{r.estimated_cost_inr.toLocaleString()}</strong></span>
                <span className="font-mono text-[10px] text-slate-400">{r.status.replace(/_/g, ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
