import React, { useState, useEffect } from 'react';
import { 
  Car, Search, ShieldCheck, AlertTriangle, FileText, CheckCircle2, 
  XCircle, Clock, Zap, Cpu, Filter, ExternalLink, RefreshCw, Key
} from 'lucide-react';
import { VehicleRegistryRecord, VehicleCategory, DocumentStatus } from '../types';

interface VehicleRegistryViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const VehicleRegistryView: React.FC<VehicleRegistryViewProps> = ({ onNavigateTab }) => {
  const [vehicles, setVehicles] = useState<VehicleRegistryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRegistryRecord | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      let url = '/api/v1/vehicles/registry';
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
        if (data.length > 0 && !selectedVehicle) {
          setSelectedVehicle(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch vehicle registry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  const getDocBadge = (status: DocumentStatus) => {
    if (status === 'VALID') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Valid
        </span>
      );
    }
    if (status === 'EXPIRING_SOON') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3" /> Expiring Soon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3 h-3" /> Expired
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider uppercase font-mono">
              [SIMULATED DATA] Government RTO Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">TG-RTO-INTEG-V2</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Car className="w-7 h-7 text-[#00875A]" />
            National Vehicle Registry & Compliance
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time verification of vehicle registration (RC), insurance, pollution (PUC), and connected GVID device status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchVehicles}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh RTO Records</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Plate Number (e.g. TS 09 EV 4412), Owner, or GVID ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'FOUR_WHEELER', 'EV_COMMERCIAL', 'BUS_TRANSIT', 'HEAVY_MOTOR_VEHICLE', 'EMERGENCY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Classes' : cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Vehicle List & Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of Vehicles */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Registered Fleet Vehicles ({vehicles.length})
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.registration_number === v.registration_number;
              return (
                <div
                  key={v.registration_number}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {v.registration_number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.compliance_badge === 'FULLY_COMPLIANT'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {v.compliance_badge.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-bold text-slate-800">{v.make_model}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                    <span>Owner: {v.owner_name}</span>
                    <span className="font-mono text-slate-400">{v.fuel_type}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">GVID Device:</span>
                    {v.gvid_device_id ? (
                      <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> {v.gvid_device_id}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Not Installed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Document & Compliance Dossier */}
        <div className="lg:col-span-7">
          {selectedVehicle ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="font-mono text-lg font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                    {selectedVehicle.registration_number}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-2">{selectedVehicle.make_model}</h2>
                  <p className="text-xs text-slate-500">Registered at {selectedVehicle.registered_rto}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Compliance Status</div>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      {selectedVehicle.compliance_badge.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ownership & Vehicle Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Registered Owner</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedVehicle.owner_name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedVehicle.owner_contact_masked}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Vehicle Category</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedVehicle.vehicle_category.replace(/_/g, ' ')}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedVehicle.fuel_type} Powered</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Chassis VIN (Masked)</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1">{selectedVehicle.chassis_number_masked}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{selectedVehicle.is_commercial ? 'Commercial Permit' : 'Private Use'}</div>
                </div>
              </div>

              {/* Legal Document Status Checklist (RC, Insurance, PUC, Fitness) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Statutory Motor Vehicle Compliance (CMVR)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* RC */}
                  <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Registration Certificate (RC)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Valid until: {selectedVehicle.rc_valid_until}</div>
                    </div>
                    {getDocBadge(selectedVehicle.rc_status)}
                  </div>

                  {/* Insurance */}
                  <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Motor Insurance Policy</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Policy: {selectedVehicle.insurance_policy_number}</div>
                    </div>
                    {getDocBadge(selectedVehicle.insurance_status)}
                  </div>

                  {/* PUC */}
                  <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Pollution Certificate (PUC)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Cert: {selectedVehicle.puc_certificate_number}</div>
                    </div>
                    {getDocBadge(selectedVehicle.puc_status)}
                  </div>

                  {/* Fitness */}
                  <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Fitness Certification</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Valid until: {selectedVehicle.fitness_valid_until || 'Exempt / Lifetime'}</div>
                    </div>
                    {getDocBadge(selectedVehicle.fitness_status)}
                  </div>

                </div>
              </div>

              {/* GVID Device Integration Card */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      Government Intelligence Device (GVID)
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {selectedVehicle.gvid_device_id ? `Linked Unit: ${selectedVehicle.gvid_device_id}` : 'No GVID installed on this vehicle'}
                    </div>
                  </div>
                </div>

                {selectedVehicle.gvid_device_id && onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('gvid_registry')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    <span>View Telemetry</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a vehicle to inspect full registration & compliance dossier.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
