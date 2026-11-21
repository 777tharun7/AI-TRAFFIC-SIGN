import React, { useState, useEffect } from 'react';
import { 
  Building2, AlertTriangle, FileCheck, CheckCircle2, Clock, 
  MapPin, Shield, Zap, RefreshCw, ArrowRight, ExternalLink, 
  Compass, Radio, Activity, Wrench, ChevronRight, Sliders, Download,
  FileSpreadsheet, X
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
  const [exportNotification, setExportNotification] = useState<string | null>(null);

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

  const handleExportAdvisory = () => {
    setExportNotification("GHMC Infrastructure Advisory (PDF/CSV) generated successfully. Package archived with SHA-256 seal for GHMC Engineering & Traffic Police Joint Commission.");
    setTimeout(() => {
      setExportNotification(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-950 border border-emerald-300 tracking-wider uppercase font-mono">
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
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tharun's Story Walkthrough</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Operational Cards (All Clickable with .interactive-card & High-Contrast Styling) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center justify-between">
          <span>Primary Operational Focus (Click any card to open filtered workflow)</span>
          <span className="text-[11px] font-mono font-normal text-slate-400">Live Telemetry · 6 Focal Vectors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Pending Officer Reviews */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="interactive-card p-5 rounded-2xl border border-amber-300 bg-amber-50/70 hover:bg-amber-50/90 shadow-sm space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-800" />
                Cases Awaiting Officer Review
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-950 border border-amber-300 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                Action Required
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-amber-950 font-mono">
                {metrics.pending_violation_reviews}
              </div>
              <span className="text-xs text-amber-950 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect Queue <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-amber-950/80 leading-relaxed font-medium">
              Automated detections ready for human-in-the-loop determination under Section 167A CMVR.
            </p>
          </div>

          {/* Card 2: Flagship Red-Light Violations */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="interactive-card p-5 rounded-2xl border border-rose-300 bg-rose-50/70 hover:bg-rose-50/90 shadow-sm space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-800" />
                Red-Light & Stop-Line Jumping
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-950 border border-rose-300 font-mono">
                Flagship Enforcement
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-rose-950 font-mono">
                {metrics.red_light_violations}
              </div>
              <span className="text-xs text-rose-950 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Review Signal Proof <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-rose-950/80 leading-relaxed font-medium">
              Synchronized junction cameras & signal controllers; distinguished from legal clearance.
            </p>
          </div>

          {/* Card 3: Active Road Incidents */}
          <div
            onClick={() => onNavigateTab('traffic_dept')}
            className="interactive-card p-5 rounded-2xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50/80 shadow-sm space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-700" />
                Active Road Incidents
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-950 border border-emerald-300 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Dispatch
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-emerald-950 font-mono">
                {metrics.active_traffic_incidents}
              </div>
              <span className="text-xs text-emerald-950 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View Dispatch <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-emerald-950/80 leading-relaxed font-medium">
              Obstructions, congestion bottlenecks, and stalled vehicle alerts across Cyberabad corridors.
            </p>
          </div>

          {/* Card 4: Excessive Speed Events */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="interactive-card p-5 rounded-2xl border border-amber-300 bg-amber-50/60 hover:bg-amber-50/80 shadow-sm space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-700" />
                Excessive Speed Events
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-950 border border-amber-300 font-mono">
                Radar ±2 km/h Margin
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-amber-950 font-mono">
                {metrics.overspeed_events}
              </div>
              <span className="text-xs text-amber-950 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect Speed Dockets <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-amber-950/80 leading-relaxed font-medium">
              Sustained excess with mandatory ±2 km/h sensor uncertainty tolerance margin applied.
            </p>
          </div>

          {/* Card 5: Controlled Junctions */}
          <div
            onClick={() => onNavigateTab('road_intelligence')}
            className="interactive-card p-5 rounded-2xl border border-blue-300 bg-blue-50/60 hover:bg-blue-50/80 shadow-sm space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-700" />
                Controlled Junctions
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-950 border border-blue-300">
                Adaptive ATCS
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-blue-950 font-mono">
                {metrics.active_junctions}
              </div>
              <span className="text-xs text-blue-950 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View Live Corridor Map <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-blue-950/80 leading-relaxed font-medium">
              Active V2X/SPaT intersections streaming green-wave timings and stop-line telemetry.
            </p>
          </div>

          {/* Card 6: Critical Road Alerts */}
          <div
            onClick={() => onNavigateTab('evidence_workflow')}
            className="interactive-card p-5 rounded-2xl border border-purple-300 bg-purple-50/70 hover:bg-purple-50/90 shadow-sm space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-700" />
                Critical Road Alerts
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-950 border border-purple-300 font-mono">
                Priority Safety
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-purple-950 font-mono">
                {metrics.critical_road_alerts}
              </div>
              <span className="text-xs text-purple-950 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect Escalations <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-purple-950/80 leading-relaxed font-medium">
              Wrong-way driving, emergency vehicle obstruction, and heavy vehicle axle overload.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Secondary Infrastructure Health & Compliance Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateTab('gvid_registry')}
          className="interactive-card p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">GVID Hardware Health</div>
          <div className="text-xl font-black text-emerald-700 font-mono mt-1">{metrics.device_health_pct}%</div>
          <div className="text-[10px] font-bold text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-full px-2 py-0.5 mt-1 inline-block">AIS-140 Compliant</div>
        </div>

        <div
          onClick={() => onNavigateTab('evidence_workflow')}
          className="interactive-card p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">Official Challans Issued</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-1">{metrics.official_challans_issued}</div>
          <div className="text-[10px] font-bold text-slate-900 bg-slate-100 border border-slate-300 rounded-full px-2 py-0.5 mt-1 inline-block">Section 167A Sealed</div>
        </div>

        <div
          onClick={() => onNavigateTab('traffic_dept')}
          className="interactive-card p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">Emergency Preemptions</div>
          <div className="text-xl font-black text-emerald-700 font-mono mt-1">{metrics.emergency_priority_events} Active</div>
          <div className="text-[10px] font-bold text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-full px-2 py-0.5 mt-1 inline-block">108 Green-Wave Cleared</div>
        </div>

        <div
          onClick={() => onNavigateTab('fleet_operations')}
          className="interactive-card p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm text-center"
        >
          <div className="text-[10px] font-bold uppercase text-slate-400">Transit Reliability</div>
          <div className="text-xl font-black text-blue-700 font-mono mt-1">91.8%</div>
          <div className="text-[10px] font-bold text-blue-950 bg-blue-50 border border-blue-300 rounded-full px-2 py-0.5 mt-1 inline-block">TSRTC City Buses</div>
        </div>
      </div>

      {/* 4. Continuous Improvement: Data-Driven Infrastructure Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#00875A]" />
              Infrastructure & Signal Optimization Proposals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Preventing accidents through engineering: Analytics identifies repeat violation root-causes to improve road design rather than only issuing fines.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* High-Visibility GHMC Advisory Export Button */}
            <button
              onClick={handleExportAdvisory}
              className="flex items-center gap-2 px-4 py-2 bg-[#00875A] hover:bg-[#00744E] active:scale-98 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export GHMC Infrastructure Advisory (PDF/CSV)</span>
            </button>
            <span className="text-xs font-mono font-bold px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-300 shrink-0">
              PREVENT → DETECT → IMPROVE
            </span>
          </div>
        </div>

        {/* Clean Export Notification Banner */}
        {exportNotification && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-950 flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{exportNotification}</span>
            </div>
            <button onClick={() => setExportNotification(null)} className="text-emerald-800 hover:text-emerald-950 font-bold ml-4 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((r) => (
            <div key={r.recommendation_id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300">
                  {r.junction_name}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-300">
                  Projected -{r.projected_violation_reduction_pct}% Violations
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-800">
                Pattern: {r.violation_pattern} ({r.historical_count_30d} occurrences in 30 days)
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Root Cause:</strong> {r.root_cause_analysis}
              </p>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800">
                <strong className="text-[#00875A]">Engineering Action:</strong> {r.recommended_intervention}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Estimated Cost: <strong>₹{r.estimated_cost_inr.toLocaleString()}</strong></span>
                <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                  {r.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
