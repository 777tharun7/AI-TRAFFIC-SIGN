import React, { useState } from 'react';
import { 
  Radio, Plus, ToggleLeft, ToggleRight, Trash2, 
  MapPin, CheckCircle2, ShieldAlert, ArrowRight, Info 
} from 'lucide-react';
import { VirtualRIU, PriorityLevel } from '../types';
import { api } from '../services/api';

interface VirtualRIUStudioProps {
  rius: VirtualRIU[];
  onRefresh: () => void;
}

export const VirtualRIUStudio: React.FC<VirtualRIUStudioProps> = ({ rius, onRefresh }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    event_type: 'SPEED_LIMIT',
    value: 50,
    latitude: 17.4435,
    longitude: 78.3772,
    direction: 90,
    road_segment_id: 'HYD-ROAD-NEW',
    activation_radius: 250,
    trigger_distance: 50,
    validity_distance: 300,
    priority: 'MEDIUM' as PriorityLevel
  });

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRIU(formData);
      setIsDeploying(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.toggleRIU(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteRIU(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600" />
            Virtual RIU Infrastructure Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Software-defined Roadside Intelligence Units broadcasting digital road events and geofenced advisories.
          </p>
        </div>

        <button
          onClick={() => setIsDeploying(!isDeploying)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isDeploying ? 'Cancel' : 'Deploy Virtual RIU Beacon'}</span>
        </button>
      </div>

      {/* Deployment Form */}
      {isDeploying && (
        <form onSubmit={handleDeploy} className="mobility-card p-6 border-emerald-300 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Configure New Roadside Unit (V-RIU)</h3>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Hyderabad Network
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Unit Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Inorbit Mall Curve Speed Zone"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Event Type</label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value="SPEED_LIMIT">SPEED_LIMIT</option>
                <option value="SPEED_BREAKER">SPEED_BREAKER</option>
                <option value="STOP">STOP</option>
                <option value="PEDESTRIAN_CROSSING">PEDESTRIAN_CROSSING</option>
                <option value="NO_ENTRY">NO_ENTRY</option>
                <option value="ROAD_WORK">ROAD_WORK</option>
                <option value="GIVE_WAY">GIVE_WAY</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Value (e.g. speed km/h)</label>
              <input
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Applicable Heading (°)</label>
              <input
                type="number"
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeploying(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Publish Digital Event
            </button>
          </div>
        </form>
      )}

      {/* Virtual RIU Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rius.map((riu) => {
          const isActive = riu.status === 'ACTIVE';
          return (
            <div key={riu.id} className="mobility-card p-5 border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {riu.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                    {riu.name}
                  </h4>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {riu.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 font-mono">
                <div>Event: <b className="text-slate-900">{riu.event_type} {riu.value ? `(${riu.value})` : ''}</b></div>
                <div>Position: {riu.latitude.toFixed(4)}, {riu.longitude.toFixed(4)}</div>
                <div>Heading Target: {riu.direction}° (±30° tolerance)</div>
                <div>Radius: {riu.activation_radius}m • Trigger: {riu.trigger_distance}m</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggle(riu.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-medium"
                >
                  {isActive ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                  <span>{isActive ? 'Active Beacon' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => handleDelete(riu.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Delete Beacon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
