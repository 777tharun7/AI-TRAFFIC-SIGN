import React, { useState } from 'react';
import { Radio, Plus, ToggleLeft, ToggleRight, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { VirtualRIU, PriorityLevel } from '../types';
import { api } from '../services/api';

interface VirtualRIUManagerProps {
  rius: VirtualRIU[];
  onRefresh: () => void;
}

export const VirtualRIUManager: React.FC<VirtualRIUManagerProps> = ({ rius, onRefresh }) => {
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRIU(formData);
      setIsCreating(false);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400" />
            Virtual Roadside Intelligence Unit (V-RIU) Studio
          </h2>
          <p className="text-xs text-slate-400">
            Software-defined roadside beacons broadcasting digital road events across Hyderabad's road network.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Cancel' : 'Deploy New V-RIU'}
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="glass-panel p-6 rounded-3xl border border-brand-500/40 space-y-4">
          <h3 className="text-sm font-bold text-white">Deploy Virtual Roadside Unit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Unit Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Inorbit Mall Speed Zone"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Event Type</label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
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
              <label className="text-slate-400 block mb-1">Value (e.g. km/h)</label>
              <input
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Direction (° Bearing)</label>
              <input
                type="number"
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all"
          >
            Deploy Unit
          </button>
        </form>
      )}

      {/* V-RIUs Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rius.map((riu) => (
          <div key={riu.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {riu.id}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{riu.name}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                riu.status === 'ACTIVE' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30' : 'bg-slate-800 text-slate-500'
              }`}>
                {riu.status}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <div>Event: <b className="text-white">{riu.event_type} {riu.value ? `(${riu.value})` : ''}</b></div>
              <div>Coordinates: {riu.latitude.toFixed(4)}, {riu.longitude.toFixed(4)}</div>
              <div>Heading Target: {riu.direction}° (±30° tolerance)</div>
              <div>Radius: {riu.activation_radius}m • Trigger: {riu.trigger_distance}m</div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handleToggle(riu.id)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
              >
                {riu.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4 text-brand-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                {riu.status === 'ACTIVE' ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={() => handleDelete(riu.id)}
                className="text-slate-500 hover:text-rose-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
