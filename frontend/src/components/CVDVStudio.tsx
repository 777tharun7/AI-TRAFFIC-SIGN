import React, { useState, useEffect } from 'react';
import { 
  Eye, Cpu, Car, Radio, ArrowRight, Sparkles, 
  Layers, CheckCircle2, AlertTriangle, ShieldCheck, 
  Database, RefreshCw, Compass, Gauge, BarChart3, Search, Filter
} from 'lucide-react';
import { api } from '../services/api';

export const CVDVStudio: React.FC = () => {
  const [signs, setSigns] = useState<any[]>([]);
  const [selectedSign, setSelectedSign] = useState<any | null>(null);
  const [inspectionData, setInspectionData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const data = await api.getCVDVSigns();
      setSigns(data || []);
      if (data && data.length > 0) {
        handleSelectSign(data[14] || data[0]); // Default to Stop sign (Class 14) or first
      }
    } catch (e) {
      console.error('Failed to load CVDV signs:', e);
    }
  };

  const handleSelectSign = async (sign: any) => {
    setSelectedSign(sign);
    setLoading(true);
    try {
      const res = await api.inspectCVDV(sign.class_id, 0.98);
      setInspectionData(res);
    } catch (e) {
      console.error('Inspection error:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredSigns = signs.filter((s) => {
    const matchesSearch = s.sign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.class_id.toString().includes(searchQuery);
    const matchesCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold tracking-wider uppercase">
              Connected Vision & Digital Vehicle (CVDV)
            </span>
            <span className="text-xs font-mono text-slate-400">Dataset: 51,841 samples / 43 classes</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            CVDV Architectural Fusion & Dataset Explorer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bridging raw optical Computer Vision (CV) with Digital Vehicle (DV) spatial telemetry and real-time ADAS Cockpit alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-[11px] font-mono text-slate-500 px-2 font-semibold">Active Classes:</span>
            <span className="px-2.5 py-1 bg-white rounded-lg text-emerald-700 font-bold shadow-2xs font-mono">
              {signs.length} / 43
            </span>
          </div>
        </div>
      </div>

      {/* 4-STAGE CVDV PIPELINE ARCHITECTURE CARD */}
      <div className="mobility-card p-6 border-slate-200 shadow-sm bg-gradient-to-br from-white via-slate-50 to-emerald-50/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            End-to-End CVDV Processing Pipeline
          </h3>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full font-bold">
            Zero Hardware • Software-Simulated Digital Twin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Stage 1 */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">STAGE 01</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Eye className="w-4 h-4 text-blue-600 shrink-0" />
              <h4>Optical Perception</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Camera frame acquisition, bounding box proposals (ROI extraction) from test stream.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
              Src: data/Train.csv (39.2k)
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">STAGE 02</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
              <h4>Deep Classification</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              PyTorch CNN multi-scale feature tensor maps sign to 43-class universal taxonomy.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
              Taxonomy: data/signnames.csv
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">STAGE 03</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
              <h4>DV Spatial Twin</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Fuses with Virtual RIU beacons, computes along-track distance & heading gates.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
              Engine: Context Fusion 500m
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">STAGE 04</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Gauge className="w-4 h-4 text-amber-600 shrink-0" />
              <h4>ADAS HUD Telemetry</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dispatches cockpit speed advisory, green-wave timing, and motorcycle glanceable cards.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
              Target: Car HUD / 6.7" Bike
            </div>
          </div>
        </div>
      </div>

      {/* LIVE INTERACTIVE INSPECTOR SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Selected Sign Details & Real Transformation */}
        <div className="lg:col-span-5 space-y-5">
          <div className="mobility-card p-5 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                {selectedSign && (
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden">
                    <img 
                      src={selectedSign.meta_image} 
                      alt={selectedSign.sign_name} 
                      className="w-full h-full object-contain"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = '/data/Meta/0.png';
                      }}
                    />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    CLASS ID #{selectedSign?.class_id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {selectedSign?.sign_name || 'Select a Sign'}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Category: {selectedSign?.category} • Priority: {selectedSign?.priority}
                  </p>
                </div>
              </div>

              {loading && <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />}
            </div>

            {/* CVDV Telemetry Breakdown */}
            {inspectionData ? (
              <div className="space-y-3">
                {/* CV Stage */}
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      1. Optical CV Perception
                    </span>
                    <span className="font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                      {(inspectionData.cv_perception.confidence_score * 100).toFixed(1)}% Conf
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 font-mono">
                    <div>ROI BBox: [{inspectionData.cv_perception.bbox.join(', ')}]</div>
                    <div>Source: {inspectionData.cv_perception.dataset_source}</div>
                  </div>
                </div>

                {/* DV Twin Stage */}
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-600" />
                      2. DV Digital Twin & Spatial Gate
                    </span>
                    <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      {inspectionData.dv_digital_twin.geofence_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 font-mono">
                    <div>Road: {inspectionData.dv_digital_twin.road_segment}</div>
                    <div>Heading: {inspectionData.dv_digital_twin.applicable_heading}</div>
                  </div>
                </div>

                {/* ADAS HUD Stage */}
                <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-amber-600" />
                      3. Cockpit ADAS Advisory Action
                    </span>
                    <span className="font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-bold">
                      {inspectionData.hud_advisory.driver_alert_level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 font-mono">
                    <span>Target Speed: <strong className="text-slate-900">{inspectionData.hud_advisory.target_speed_advisory_kmh} km/h</strong></span>
                    <span>Urgency: <strong className="text-slate-900">{inspectionData.hud_advisory.hazard_urgency}</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-slate-400 text-xs">
                Select any sign to view live CVDV telemetry pipeline
              </div>
            )}
          </div>

          {/* Quick Real Image Samples from Dataset */}
          <div className="mobility-card p-5 border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-600" />
              Dataset Quick-Test Shortcuts
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 0, label: '20 km/h' },
                { id: 1, label: '30 km/h' },
                { id: 13, label: 'Yield' },
                { id: 14, label: 'Stop' },
                { id: 17, label: 'No Entry' },
                { id: 25, label: 'Road Work' },
                { id: 27, label: 'Pedestrian' },
                { id: 38, label: 'Keep Right' }
              ].map((shortcut) => {
                const s = signs.find((x) => x.class_id === shortcut.id);
                const isSelected = selectedSign?.class_id === shortcut.id;
                return (
                  <button
                    key={shortcut.id}
                    onClick={() => s && handleSelectSign(s)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-500 shadow-2xs' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img 
                      src={`/data/Meta/${shortcut.id}.png`} 
                      alt={shortcut.label} 
                      className="w-8 h-8 mx-auto object-contain mb-1"
                    />
                    <span className="text-[10px] font-bold text-slate-800 block truncate">{shortcut.label}</span>
                    <span className="text-[9px] font-mono text-slate-400">#{shortcut.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: 43-Class Interactive Sign Grid */}
        <div className="lg:col-span-7 mobility-card p-5 border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                43-Class Dataset Catalog (data/signnames.csv)
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any real traffic sign template to run instant CV perception & DV twin binding.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'REGULATORY', 'WARNING', 'MANDATORY'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search sign by name or class ID (e.g. 'Speed', 'Stop', '14')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sign Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[500px] overflow-y-auto p-1">
            {filteredSigns.map((sign) => {
              const isSelected = selectedSign?.class_id === sign.class_id;
              return (
                <div
                  key={sign.class_id}
                  onClick={() => handleSelectSign(sign)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      #{sign.class_id}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      sign.category === 'REGULATORY' ? 'bg-red-50 text-red-700' :
                      sign.category === 'MANDATORY' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {sign.category}
                    </span>
                  </div>

                  <div className="w-12 h-12 mx-auto my-1 flex items-center justify-center">
                    <img
                      src={sign.meta_image}
                      alt={sign.sign_name}
                      className="max-w-full max-h-full object-contain drop-shadow-xs"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = '/data/Meta/0.png';
                      }}
                    />
                  </div>

                  <h5 className="text-[11px] font-bold text-slate-900 text-center line-clamp-2 mt-1 min-h-[32px] flex items-center justify-center">
                    {sign.sign_name}
                  </h5>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
