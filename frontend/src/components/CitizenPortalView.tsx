import React, { useState, useEffect } from 'react';
import { 
  User, Search, FileText, CheckCircle2, Clock, AlertCircle, 
  CreditCard, ShieldCheck, HelpCircle, ExternalLink, RefreshCw, Zap, MapPin
} from 'lucide-react';
import { EChallanRecord } from '../types';

export const CitizenPortalView: React.FC = () => {
  const [plateQuery, setPlateQuery] = useState<string>('TS 09 EV 4412');
  const [challans, setChallans] = useState<EChallanRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState<boolean>(false);
  const [selectedChallanForDispute, setSelectedChallanForDispute] = useState<EChallanRecord | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [citizenContact, setCitizenContact] = useState<string>('+91 98480 12345');

  const searchChallans = async () => {
    setLoading(true);
    try {
      const url = plateQuery.trim()
        ? `/api/v1/challans?plate=${encodeURIComponent(plateQuery.trim())}`
        : '/api/v1/challans';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setChallans(data);
      }
    } catch (err) {
      console.error('Failed to fetch citizen challans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchChallans();
  }, []);

  const handlePay = async (challanId: string) => {
    try {
      const res = await fetch(`/api/v1/challans/${challanId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_mode: 'UPI (GPay / PhonePe)' })
      });
      if (res.ok) {
        const updated = await res.json();
        setPaymentSuccess(`Payment received successfully! Receipt #${updated.payment_receipt_id}. Status updated to PAID.`);
        searchChallans();
      }
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallanForDispute) return;
    try {
      const res = await fetch(`/api/v1/challans/${selectedChallanForDispute.challan_id}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_reason: disputeReason,
          citizen_contact: citizenContact
        })
      });
      if (res.ok) {
        setDisputeModalOpen(false);
        setDisputeReason('');
        searchChallans();
      }
    } catch (err) {
      console.error('Dispute filing failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider uppercase font-mono">
              [SIMULATED DATA] Citizen & Driver e-Services
            </span>
            <span className="text-xs text-slate-400 font-mono">TELANGANA TRAFFIC CITIZEN PORTAL</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-7 h-7 text-[#00875A]" />
            Citizen Traffic Portal & Challan Desk
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Check vehicle traffic violations, view verified evidence snapshots, settle citations securely, or submit legal grievances.
          </p>
        </div>
      </div>

      {/* Plate Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchChallans();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={plateQuery}
              onChange={(e) => setPlateQuery(e.target.value)}
              placeholder="Enter Vehicle Plate (e.g. TS 09 EV 4412)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#00875A]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Check Challans
          </button>
        </form>
      </div>

      {paymentSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{paymentSuccess}</span>
          </div>
          <button onClick={() => setPaymentSuccess(null)} className="text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Challans List */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Traffic Violations & Challan Records ({challans.length})
        </div>

        {challans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
            <div className="text-base font-bold text-slate-800">No Pending Challans Found</div>
            <p className="text-xs text-slate-500">
              Vehicle plate <strong className="font-mono text-slate-700">{plateQuery}</strong> has a completely clean record or no registered violations.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {challans.map((ch) => {
              const isPaid = ch.status === 'PAID';
              const isDisputed = ch.status === 'DISPUTED';

              return (
                <div
                  key={ch.challan_id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-left"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                        {ch.vehicle_reg_num}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Challan #: {ch.challan_number}</span>
                    </div>

                    <div>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          PAID
                        </span>
                      ) : isDisputed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          UNDER GRIEVANCE REVIEW
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          PENDING PAYMENT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Violation Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Violation Type</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{ch.violation_type}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{ch.motor_vehicle_act_section}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Location & Time</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {ch.road_location}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{ch.violation_timestamp}</div>
                    </div>

                    <div className="md:text-right">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Penalty Amount</div>
                      <div className="text-lg font-black text-rose-600 mt-0.5">₹{ch.penalty_amount_inr}</div>
                      <div className="text-[11px] text-slate-400">Due by {ch.due_date}</div>
                    </div>
                  </div>

                  {/* Paid Receipt or Action Buttons */}
                  {isPaid ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-emerald-900">
                      <div>
                        <strong>Payment Receipt ID:</strong> <span className="font-mono">{ch.payment_receipt_id}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1 sm:mt-0">
                        Paid on {ch.payment_timestamp} via {ch.payment_mode}
                      </div>
                    </div>
                  ) : isDisputed ? (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div><strong>Dispute Filed:</strong> {ch.dispute_reason}</div>
                      <div className="text-[11px] text-amber-700">{ch.dispute_resolution_note}</div>
                    </div>
                  ) : (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedChallanForDispute(ch);
                          setDisputeModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Contest / Dispute Challan
                      </button>

                      <button
                        onClick={() => handlePay(ch.challan_id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Online ₹{ch.penalty_amount_inr}</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {disputeModalOpen && selectedChallanForDispute && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              File Citizen Grievance / Contest Citation
            </h3>
            <p className="text-xs text-slate-500">
              Submit an official appeal under Section 167A CMVR for challan <strong>{selectedChallanForDispute.challan_number}</strong>.
            </p>

            <form onSubmit={handleDisputeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Dispute</label>
                <textarea
                  rows={3}
                  required
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Explain why this citation is contested (e.g. In emergency convoy, speed measurement discrepancy, false plate detection)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Citizen Contact Number</label>
                <input
                  type="text"
                  required
                  value={citizenContact}
                  onChange={(e) => setCitizenContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Submit Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
