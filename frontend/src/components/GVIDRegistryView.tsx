import React, { useState, useEffect } from 'react';
import { 
  Cpu, Shield, ShieldCheck, AlertOctagon, Activity, Radio, 
  RefreshCw, CheckCircle2, Clock, Hash, Zap, Compass, Layers
} from 'lucide-react';
import { GVIDDeviceRecord } from '../types';

export const GVIDRegistryView: React.FC = () => {
  const [devices, setDevices] = useState<GVIDDeviceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDevice, setSelectedDevice] = useState<GVIDDeviceRecord | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/gvid/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
        if (data.length > 0 && !selectedDevice) {
          setSelectedDevice(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch GVID devices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider uppercase font-mono">
              [SIMULATED DATA] Government Vehicle Intelligence Device (GVID)
            </span>
            <span className="text-xs text-slate-400 font-mono">AIS-140 / ISO 15005 CERTIFIED</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-7 h-7 text-[#00875A]" />
            GVID Hardware & Telemetry Command
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Continuous in-vehicle intelligence, CAN bus wheel-speed sync, calibration tracking, and cryptographic anti-tamper security.
          </p>
        </div>

        <button
          onClick={fetchDevices}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#00875A] hover:bg-[#00744E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Poll Live Devices</span>
        </button>
      </div>

      {/* Main Grid: Device Roster & Hardware Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Device Roster */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Connected Devices ({devices.length})
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {devices.map((d) => {
              const isSelected = selectedDevice?.device_id === d.device_id;
              return (
                <div
                  key={d.device_id}
                  onClick={() => setSelectedDevice(d)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {d.device_id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {d.tamper_status}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Vehicle: <strong className="font-mono text-slate-900">{d.vehicle_reg_num}</strong></span>
                    <span className="text-[11px] text-slate-400 font-mono">{d.signal_strength_dbm} dBm</span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>CAN: {d.can_source.replace(/_/g, ' ')}</span>
                    <span className="text-slate-400">Heartbeat: {d.last_heartbeat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hardware Security & Calibration Dossier */}
        <div className="lg:col-span-7">
          {selectedDevice ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              
              {/* Device Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                      {selectedDevice.device_id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Serial: {selectedDevice.hardware_serial}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-2">{selectedDevice.hardware_model}</h2>
                  <p className="text-xs text-slate-500 font-mono">Firmware: {selectedDevice.firmware_version}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Anti-Tamper Integrity</div>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      SECURE & SEALED
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware Specs & CAN Bus Ingest */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Sensor Interface</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedDevice.can_source.replace(/_/g, ' ')}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Direct ECU Tap</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Calibration Accuracy</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">± {selectedDevice.speed_sensor_uncertainty_kmh} km/h</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Certified Metrology Margin</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Offline Buffer</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedDevice.offline_buffered_packets} Packets</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Non-volatile Flash Sync</div>
                </div>
              </div>

              {/* Statutory Calibration Validity */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Metrology Calibration Certificate</span>
                  <span className="text-emerald-700 font-bold text-[11px]">Valid until {selectedDevice.calibration_valid_until}</span>
                </div>
                <p className="text-xs text-slate-500">
                  Last calibrated on <strong>{selectedDevice.calibration_date}</strong> under Government Metrology Standard AIS-140. 
                  Enables legally admissible speed measurement for Section 167A CMVR enforcement.
                </p>
              </div>

              {/* Live CAN + GNSS Simulated Pulse */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Sensor Telemetry Stream</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">ONLINE • 20 Hz</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center pt-1 font-mono">
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <div className="text-[10px] text-slate-400">GNSS SPEED</div>
                    <div className="text-base font-black text-white mt-0.5">42.5 km/h</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <div className="text-[10px] text-slate-400">CAN WHEEL SPEED</div>
                    <div className="text-base font-black text-white mt-0.5">42.0 km/h</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20">
                    <div className="text-[10px] text-emerald-400">FUSED SPEED</div>
                    <div className="text-base font-black text-emerald-300 mt-0.5">42.2 km/h</div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a GVID device to inspect telemetry & hardware health.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
