import React, { useState, useEffect } from 'react';
import { 
  FileCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  RefreshCw, Hash, Lock, UserCheck, Calendar, MapPin, Eye, ExternalLink
} from 'lucide-react';
import { ViolationEvidencePackage, EvidenceStatus } from '../types';

export const EvidenceChallanWorkflowView: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<ViolationEvidencePackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvidence, setSelectedEvidence] = useState<ViolationEvidencePackage | null>(null);
  const [officerNotes, setOfficerNotes] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/evidence/queue');
      if (res.ok) {
        const data = await res.json();
        setEvidenceList(data);
        if (data.length > 0 && !selectedEvidence) {
          setSelectedEvidence(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch evidence queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const handleReview = async (decision: 'APPROVE' | 'DISMISS') => {
    if (!selectedEvidence) return;
    try {
      const res = await fetch(`/api/v1/evidence/${selectedEvidence.evidence_id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          officer_id: 'OFF-TG-4402',
          officer_name: 'Insp. K. Sridhar (Traffic West)',
          notes: officerNotes || undefined
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedEvidence(updated);
        setActionSuccessMessage(
          decision === 'APPROVE'
            ? `Evidence ${updated.evidence_id} APPROVED under Section 167A CMVR. Official e-Challan generated.`
            : `Evidence ${updated.evidence_id} DISMISSED. Case archived with zero penalty.`
        );
        fetchEvidence();
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wider uppercase font-mono">
              [SIMULATED DATA] Section 167A CMVR Verification Desk
            </span>
            <span className="text-xs text-slate-400 font-mono">HUMAN-IN-THE-LOOP AUTHORIZATION</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-[#00875A]" />
            Evidence Integrity & e-Challan Authorization
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Traffic Officer verification queue for automated speed and red-light detections. Certified SHA-256 seal protects legal admissibility.
          </p>
        </div>

        <button
          onClick={fetchEvidence}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Review Queue</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Queue & Evidence Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Review Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Pending Officer Review Queue ({evidenceList.length})
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {evidenceList.map((e) => {
              const isSelected = selectedEvidence?.evidence_id === e.evidence_id;
              return (
                <div
                  key={e.evidence_id}
                  onClick={() => {
                    setSelectedEvidence(e);
                    setOfficerNotes(e.officer_notes || '');
                    setActionSuccessMessage(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {e.vehicle_reg_num}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      e.status === 'PENDING_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : e.status === 'OFFICER_APPROVED' || e.status === 'CHALLAN_ISSUED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {e.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-bold text-slate-800">{e.location_name}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Speed: <strong className="text-rose-600">{e.speed_measured_kmh} km/h</strong> (Limit: {e.speed_limit_applicable_kmh})</span>
                    <span className="text-slate-400 font-mono">+{e.speed_delta_kmh} km/h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Evidence Dossier & Action Form */}
        <div className="lg:col-span-7">
          {selectedEvidence ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                      {selectedEvidence.evidence_id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedEvidence.timestamp}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-2 flex items-center gap-2">
                    Vehicle: <span className="font-mono text-emerald-800">{selectedEvidence.vehicle_reg_num}</span>
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedEvidence.location_name}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">ANPR Confidence</div>
                  <div className="text-base font-black text-emerald-700 font-mono mt-0.5">
                    {selectedEvidence.anpr_confidence_pct}%
                  </div>
                </div>
              </div>

              {/* Side-by-side: Speed Measurement Proof */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Applicable Limit</div>
                  <div className="text-base font-black text-slate-800 mt-1">{selectedEvidence.speed_limit_applicable_kmh} km/h</div>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="text-[10px] font-bold uppercase text-rose-600">Measured Speed</div>
                  <div className="text-base font-black text-rose-700 mt-1">{selectedEvidence.speed_measured_kmh} km/h</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Sensor Margin (±)</div>
                  <div className="text-base font-black text-slate-800 mt-1">± {selectedEvidence.speed_uncertainty_kmh} km/h</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Sustained Excess</div>
                  <div className="text-base font-black text-slate-800 mt-1">{selectedEvidence.sustained_duration_seconds} sec</div>
                </div>
              </div>

              {/* Cryptographic SHA-256 Chain-of-Custody Seal */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cryptographic Evidence Seal (SHA-256)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">TAMPER-PROOF VERIFIED</span>
                </div>
                <div className="bg-slate-800 p-2 rounded text-[11px] font-mono text-slate-300 break-all select-all">
                  {selectedEvidence.evidence_seal_sha256}
                </div>
                <p className="text-[10px] text-slate-400">
                  Cryptographically hashes telemetry readings, camera frame timestamps, and location coordinates to fulfill Section 167A CMVR legal admissibility.
                </p>
              </div>

              {/* Human-in-the-Loop Officer Authorization Form */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#00875A]" />
                  Authorized Traffic Officer Determination
                </div>

                <textarea
                  rows={2}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Officer remarks (e.g. Verified ANPR plate snapshot against vehicle registry. Calibration within threshold.)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReview('APPROVE')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Issue Official e-Challan</span>
                  </button>

                  <button
                    onClick={() => handleReview('DISMISS')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Dismiss Citation (Doubt / Exemption)</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select an evidence item from the queue to inspect and authorize.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
