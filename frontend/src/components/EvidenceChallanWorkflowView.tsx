import React, { useState, useEffect } from 'react';
import { 
  FileCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  RefreshCw, Hash, Lock, UserCheck, Calendar, MapPin, Eye, ExternalLink,
  Camera, Clock, ChevronDown, ChevronUp, AlertCircle, ArrowRight,
  Shield, Scale, Check, HelpCircle, Layers, SlidersHorizontal
} from 'lucide-react';
import { 
  ViolationEvidencePackage, EvidenceStatus, ViolationCategory, 
  OperationalCategory, LegalClearanceStatus, OfficerDecisionAction 
} from '../types';

export const EvidenceChallanWorkflowView: React.FC = () => {
  const [cases, setCases] = useState<ViolationEvidencePackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCase, setSelectedCase] = useState<ViolationEvidencePackage | null>(null);
  
  // Operational Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [opCategoryFilter, setOpCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Officer notes & UI states
  const [officerNotes, setOfficerNotes] = useState<string>('');
  const [techDetailsExpanded, setTechDetailsExpanded] = useState<boolean>(false);
  const [decisionFeedback, setDecisionFeedback] = useState<{ type: 'success' | 'info' | 'warning'; text: string } | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') params.append('violation_type', categoryFilter);
      if (opCategoryFilter !== 'ALL') params.append('operational_category', opCategoryFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());

      const res = await fetch(`/api/violations?${params.toString()}`);
      if (res.ok) {
        const data: ViolationEvidencePackage[] = await res.json();
        setCases(data);
        if (data.length > 0) {
          const found = data.find(c => c.evidence_id === selectedCase?.evidence_id);
          setSelectedCase(found || data[0]);
          setOfficerNotes((found || data[0]).officer_notes || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch violation cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [categoryFilter, opCategoryFilter, statusFilter]);

  const handleDecision = async (action: OfficerDecisionAction, noteOverride?: string) => {
    if (!selectedCase) return;
    try {
      const noteToSend = noteOverride || officerNotes;
      const res = await fetch(`/api/violations/${selectedCase.evidence_id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          officer_id: 'OFF-TG-4402',
          officer_name: 'Insp. K. Sridhar (Traffic West)',
          notes: noteToSend || undefined
        })
      });

      if (res.ok) {
        const updated: ViolationEvidencePackage = await res.json();
        setSelectedCase(updated);
        setOfficerNotes(updated.officer_notes || '');
        
        let feedbackText = '';
        let feedbackType: 'success' | 'info' | 'warning' = 'success';

        if (action === 'VERIFY_EVIDENCE') {
          feedbackText = `Evidence package ${updated.evidence_id} verified. Fact of violation confirmed.`;
          feedbackType = 'info';
        } else if (action === 'REQUEST_MORE_EVIDENCE') {
          feedbackText = `Case ${updated.evidence_id} set to "More Evidence Requested". Re-audit requested from camera operator.`;
          feedbackType = 'warning';
        } else if (action === 'REJECT_EVENT') {
          feedbackText = `Event ${updated.evidence_id} dismissed with zero penalty. Case archived.`;
          feedbackType = 'info';
        } else if (action === 'ESCALATE_INVESTIGATION') {
          feedbackText = `Case ${updated.evidence_id} escalated to Senior Traffic Appellate Authority.`;
          feedbackType = 'warning';
        } else if (action === 'APPROVE_CHALLAN') {
          feedbackText = `Official e-Challan authorized for ${updated.vehicle_reg_num} under Section 167A CMVR.`;
          feedbackType = 'success';
        }

        setDecisionFeedback({ type: feedbackType, text: feedbackText });
        fetchCases();
      }
    } catch (err) {
      console.error('Failed to process officer decision:', err);
    }
  };

  const getStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Needs Review</span>;
      case 'EVIDENCE_VERIFIED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Evidence Verified</span>;
      case 'MORE_EVIDENCE_REQUESTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200">Re-Audit Requested</span>;
      case 'ESCALATED_INVESTIGATION':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Escalated</span>;
      case 'OFFICER_APPROVED':
      case 'CHALLAN_ISSUED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Challan Approved</span>;
      case 'OFFICER_DISMISSED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Dismissed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Bar: Professional Government Tech Styling */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              [SIMULATED DATA] Traffic Enforcement Command
            </span>
            <span className="text-xs text-slate-400 font-mono">Cyberabad Traffic Police · West Zone</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#00875A]" />
            Evidence Verification & Case Decision Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational workflow: Detect → Verify → Prioritise → Decide → Notify. Review intersection, speed, and safety compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[11px] font-bold text-slate-800">Officer On Duty: Insp. K. Sridhar</span>
            <span className="text-[10px] text-slate-400 font-mono">Badge #TG-4402 · Sec 167A Authorized</span>
          </div>
          <button
            onClick={fetchCases}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#00875A]' : ''}`} />
            <span>Poll Queue</span>
          </button>
        </div>
      </div>

      {/* Decision Feedback Banner */}
      {decisionFeedback && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          decisionFeedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : decisionFeedback.type === 'warning'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{decisionFeedback.text}</span>
          </div>
          <button onClick={() => setDecisionFeedback(null)} className="text-slate-500 hover:text-slate-800 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* 2. Operational Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Filter:</span>
          
          {/* Violation Types Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
          >
            <option value="ALL">All 15 Violations</option>
            <option value="RED_LIGHT_VIOLATION">🚦 Red Light Jumping (Flagship)</option>
            <option value="STOP_LINE_VIOLATION">🛑 Stop Line Violation</option>
            <option value="PEDESTRIAN_CROSSING_OBSTRUCTION">🚶 Pedestrian Crossing Obstruction</option>
            <option value="WRONG_SIDE_DRIVING">⛔ Wrong-Way Driving</option>
            <option value="OVERSPEEDING">⚡ Overspeeding (GVID + Road)</option>
            <option value="NO_HELMET">🏍️ No Helmet (Rider / Pillion)</option>
            <option value="NO_SEATBELT">🛡️ No Seat Belt</option>
            <option value="MOBILE_PHONE_USE">📱 Handheld Phone Use</option>
            <option value="ILLEGAL_PARKING">🅿️ Illegal Parking / Stopping</option>
            <option value="WRONG_LANE_DRIVING">🛣️ Bus Lane / Restricted Lane</option>
            <option value="EMERGENCY_VEHICLE_OBSTRUCTION">🚑 Emergency Vehicle Obstruction</option>
            <option value="OVERLOADED_GOODS_VEHICLE">⚖️ Overloaded Goods Vehicle (WIM)</option>
            <option value="JUNCTION_BLOCKING_GRIDLOCK">🟡 Yellow Box Junction Blocking</option>
          </select>

          {/* Operational Category */}
          <select
            value={opCategoryFilter}
            onChange={(e) => setOpCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
          >
            <option value="ALL">All Categories</option>
            <option value="ENFORCEMENT">Enforcement Actions</option>
            <option value="TRAFFIC_MANAGEMENT">Traffic Management & Clearances</option>
            <option value="PREVENTION">Preventive Advisories</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
          >
            <option value="ALL">All Case Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="EVIDENCE_VERIFIED">Evidence Verified</option>
            <option value="OFFICER_APPROVED">Challan Approved</option>
            <option value="OFFICER_DISMISSED">Dismissed</option>
          </select>
        </div>

        {/* Quick Search */}
        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Plate (e.g. TS 09 EV 4412)..."
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
          />
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Prioritised Case Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500">
            <span>PRIORITISED QUEUE ({cases.length})</span>
            <span className="text-[11px] font-normal text-slate-400">Order: Most Critical First</span>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {cases.map((c) => {
              const isSelected = selectedCase?.evidence_id === c.evidence_id;
              const isTharun = c.vehicle_reg_num === 'TS 09 EV 4412';
              const isRedLight = c.violation_category === 'RED_LIGHT_VIOLATION';

              return (
                <div
                  key={c.evidence_id}
                  onClick={() => {
                    setSelectedCase(c);
                    setOfficerNotes(c.officer_notes || '');
                    setDecisionFeedback(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-400 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {c.vehicle_reg_num}
                      </span>
                      {isTharun && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                          Demo Persona
                        </span>
                      )}
                    </div>
                    {getStatusBadge(c.status)}
                  </div>

                  <div className="text-xs font-bold text-slate-800 mt-2 line-clamp-1">
                    {c.violation_title}
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{c.location_name}</span>
                    <span className="font-mono text-slate-400 shrink-0">{c.timestamp.split(' ')[1]}</span>
                  </div>

                  {/* Contextual Metric Pill */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    {isRedLight && c.signal_evidence ? (
                      <span className={`font-mono font-bold ${
                        c.signal_evidence.seconds_into_red > 0 ? 'text-rose-600' : 'text-blue-600'
                      }`}>
                        {c.signal_evidence.seconds_into_red > 0 
                          ? `Crossed +${c.signal_evidence.seconds_into_red}s after red` 
                          : 'Clearance: Entered on amber'}
                      </span>
                    ) : c.speed_measured_kmh && c.speed_limit_applicable_kmh ? (
                      <span className="font-mono text-slate-700">
                        Speed: <strong className="text-rose-600">{c.speed_measured_kmh}</strong> / {c.speed_limit_applicable_kmh} km/h
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Camera ANPR: {c.anpr_confidence_pct}%</span>
                    )}

                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {c.operational_category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Evidence Viewer & Decision Workspace (8 cols) */}
        <div className="lg:col-span-8">
          {selectedCase ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5 text-left">
              
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {selectedCase.vehicle_reg_num}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Case #{selectedCase.evidence_id}</span>
                    {getStatusBadge(selectedCase.status)}
                  </div>
                  <h2 className="text-base font-black text-slate-900 mt-1.5">
                    {selectedCase.violation_title}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedCase.location_name}</span>
                    <span className="text-slate-300">·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedCase.timestamp}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Statutory Penalty</div>
                  <div className="text-lg font-black text-slate-900">
                    ₹{selectedCase.legal_rule?.statutory_penalty_inr || 1000}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {selectedCase.legal_rule?.section_code || 'Sec 184 / 119'}
                  </div>
                </div>
              </div>

              {/* Clearance Status Warning or Guidance Banner */}
              {selectedCase.clearance_status === 'CLEAR_VIOLATION' ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Confirmed Disobedience Detected:</strong> Vehicle crossed stop line +{selectedCase.signal_evidence?.seconds_into_red || 1.8}s after active red signal was illuminated. No emergency beacon or hand-signal exemption active.
                  </div>
                </div>
              ) : selectedCase.clearance_status === 'LEGAL_CLEARANCE_GREEN_ENTRY' ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Legal Intersection Clearance (Rule 22 Exemption):</strong> Vehicle entered intersection during amber phase and crossed stop line before red onset. Safe clearance completed. Recommended action: <strong>DISMISS CITATION</strong>.
                  </div>
                </div>
              ) : selectedCase.clearance_status === 'EMERGENCY_EXEMPTION' ? (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Emergency Vehicle Exemption:</strong> Verified emergency response vehicle (108 ALS Ambulance). Statutorily exempt under Section 194E. Action: <strong>DISMISS WITH EXEMPTION</strong>.
                  </div>
                </div>
              ) : null}

              {/* Multi-Frame Evidence Sequence (Before, Crossing, Inside, Plate) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#00875A]" />
                    <span>Synchronized Photographic Evidence Sequence</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <span>ANPR Confidence:</span>
                    <strong className="text-emerald-700 font-bold">{selectedCase.anpr_confidence_pct}%</strong>
                    <span className="text-slate-400">(High Resolution CCTV)</span>
                  </div>
                </div>

                {/* 3-Frame Visual Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Frame 1: Approach */}
                  <div className="bg-slate-900 rounded-xl p-2.5 text-white flex flex-col justify-between border border-slate-800">
                    <div className="h-28 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-center p-2 border border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-1">
                        🟡
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-200">Approach Phase</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">T-1.2s · Amber Signal</div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-300 font-medium leading-tight">
                      {selectedCase.frame_sequence?.frame_approach_label || 'Approaching stop line prior to red'}
                    </div>
                  </div>

                  {/* Frame 2: Crossing */}
                  <div className="bg-slate-900 rounded-xl p-2.5 text-white flex flex-col justify-between border-2 border-rose-500/80 shadow-xs">
                    <div className="h-28 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-center p-2 border border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs mb-1">
                        🔴
                      </div>
                      <div className="text-[11px] font-mono font-black text-rose-400">Stop Line Crossed</div>
                      <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                        +{selectedCase.signal_evidence?.seconds_into_red || 1.8}s into Red
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-rose-300 font-bold leading-tight">
                      {selectedCase.frame_sequence?.frame_crossing_label || 'Crossing stop line during red phase'}
                    </div>
                  </div>

                  {/* Frame 3: Inside Junction */}
                  <div className="bg-slate-900 rounded-xl p-2.5 text-white flex flex-col justify-between border border-slate-800">
                    <div className="h-28 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-center p-2 border border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs mb-1">
                        🚗
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-200">Inside Intersection</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Traversal Phase</div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-300 font-medium leading-tight">
                      {selectedCase.frame_sequence?.frame_junction_label || 'Vehicle traversing junction conflicting with cross-traffic'}
                    </div>
                  </div>

                </div>

                {/* ANPR Plate Crop Strip */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-500">ANPR OCR Snapshot:</span>
                    <span className="font-mono font-black text-sm px-2.5 py-0.5 bg-white border border-slate-300 rounded shadow-2xs text-slate-900">
                      {selectedCase.vehicle_reg_num}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Image Quality: <strong className="text-emerald-700">Optimal (Zero Occlusion)</strong> · Camera ID: <span className="font-mono">{selectedCase.camera_id || 'CAM-04'}</span>
                  </div>
                </div>
              </div>

              {/* Synchronized Signal Controller Phase Transition Graph (For Red Light Cases) */}
              {selectedCase.signal_evidence && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <span>Traffic Signal Controller Phase Synchronization Log</span>
                    </span>
                    <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      {selectedCase.signal_evidence.controller_status}
                    </span>
                  </div>

                  {/* Horizontal Phase Timeline */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="text-[9px] text-slate-400">GREEN PHASE</div>
                      <div className="font-bold text-emerald-700 text-[11px] mt-0.5">{selectedCase.signal_evidence.green_start_time}</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="text-[9px] text-slate-400">AMBER INTERVAL (4.0s)</div>
                      <div className="font-bold text-amber-600 text-[11px] mt-0.5">{selectedCase.signal_evidence.yellow_start_time}</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-rose-300 bg-rose-50/50">
                      <div className="text-[9px] text-rose-700">RED ONSET</div>
                      <div className="font-black text-rose-700 text-[11px] mt-0.5">{selectedCase.signal_evidence.red_start_time}</div>
                    </div>
                    <div className="p-2 bg-rose-600 text-white rounded-lg border border-rose-700 shadow-2xs">
                      <div className="text-[9px] text-rose-200">VEHICLE CROSSED</div>
                      <div className="font-black text-white text-[11px] mt-0.5">{selectedCase.signal_evidence.vehicle_stopline_cross_time}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Stop line position calibrated at <strong>{selectedCase.signal_evidence.stop_line_distance_m}m</strong>. 
                    Signal controller logs demonstrate vehicle crossed stop line <strong>+{selectedCase.signal_evidence.seconds_into_red}s</strong> after amber concluded and red began.
                  </p>
                </div>
              )}

              {/* Statutory Legal Rule Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Applicable Statutory Rule</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedCase.legal_rule?.offence_title || 'Traffic Violation'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {selectedCase.legal_rule?.act_name} — {selectedCase.legal_rule?.section_code}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 sm:text-right">
                  <div>Section 167A CMVR Certified: <strong className="text-emerald-700">YES</strong></div>
                  <div>Human Verification Mandatory: <strong>YES</strong></div>
                </div>
              </div>

              {/* Expandable Technical Metadata (Cryptographic Hash & Calibration Cert) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTechDetailsExpanded(!techDetailsExpanded)}
                  className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Technical Integrity & Cryptographic Evidence Seal (Expandable)</span>
                  </span>
                  {techDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {techDetailsExpanded && (
                  <div className="p-4 bg-white space-y-3 text-xs border-t border-slate-200">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">SHA-256 Tamper-Proof Evidence Seal</div>
                      <div className="p-2 bg-slate-100 rounded font-mono text-[11px] text-slate-800 break-all select-all mt-1">
                        {selectedCase.evidence_seal_sha256}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Camera Calibration Cert</span>
                        <div className="font-mono text-slate-800 text-[11px]">{selectedCase.camera_calibration_cert || 'CERT-AIS140-2025'}</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">GVID Telemetry Unit</span>
                        <div className="font-mono text-slate-800 text-[11px]">{selectedCase.gvid_device_id || 'Not Associated'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Officer Determination Workflow Toolbar */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#00875A]" />
                    <span>Authorized Officer Determination (Section 167A CMVR)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Select One Decision</span>
                </div>

                <textarea
                  rows={2}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Enter officer evaluation notes (e.g. Signal controller graph and stop-line crossing verified. No exemption applicable.)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
                />

                {/* 5 Distinct Safe Officer Decision Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  
                  {/* Action 1: Verify Evidence */}
                  <button
                    onClick={() => handleDecision('VERIFY_EVIDENCE')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 mb-1 text-blue-700" />
                    <span>Verify Evidence</span>
                  </button>

                  {/* Action 2: Request More Evidence */}
                  <button
                    onClick={() => handleDecision('REQUEST_MORE_EVIDENCE')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-orange-200 bg-orange-50/80 hover:bg-orange-100 text-orange-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 mb-1 text-orange-700" />
                    <span>Request Re-Audit</span>
                  </button>

                  {/* Action 3: Dismiss Citation */}
                  <button
                    onClick={() => handleDecision('REJECT_EVENT')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 mb-1 text-slate-600" />
                    <span>Dismiss Event</span>
                  </button>

                  {/* Action 4: Escalate to Senior Inspector */}
                  <button
                    onClick={() => handleDecision('ESCALATE_INVESTIGATION')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-200 bg-purple-50/80 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Scale className="w-4 h-4 mb-1 text-purple-700" />
                    <span>Escalate Case</span>
                  </button>

                  {/* Action 5: Approve for Official Challan */}
                  <button
                    onClick={() => handleDecision('APPROVE_CHALLAN')}
                    className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 mb-1 text-white" />
                    <span>Approve Challan</span>
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a case from the queue to inspect evidence and record decision.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
