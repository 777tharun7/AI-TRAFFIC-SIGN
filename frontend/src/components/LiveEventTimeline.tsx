import React, { useEffect, useState } from 'react';
import { VehicleState } from '../types';
import { Clock } from 'lucide-react';

interface Props {
  vehicle: VehicleState | null;
}

interface TimelineItem {
  id: string;
  time: string;
  dotColor: string;
  text: string;
}

export const LiveEventTimeline: React.FC<Props> = ({ vehicle }) => {
  const [events, setEvents] = useState<TimelineItem[]>([
    { id: '1', time: '10:23:41', dotColor: 'bg-amber-400', text: 'Approaching red signal (120 m)' },
    { id: '2', time: '10:23:47', dotColor: 'bg-amber-400', text: 'Decelerating (speed: 45 → 25 km/h)' },
    { id: '3', time: '10:23:52', dotColor: 'bg-red-500', text: 'Stopping (5 m)' },
    { id: '4', time: '10:23:53', dotColor: 'bg-red-500', text: 'Vehicle stopped (0 km/h)' },
    { id: '5', time: '10:23:53', dotColor: 'bg-red-500', text: 'Waiting for green (30 sec)' },
    { id: '6', time: '10:24:23', dotColor: 'bg-emerald-500', text: 'Signal turned green' },
    { id: '7', time: '10:24:24', dotColor: 'bg-emerald-500', text: 'Resuming (0 → 20 km/h)' },
    { id: '8', time: '10:24:28', dotColor: 'bg-emerald-500', text: 'Continuing on route' },
  ]);

  // Append new telemetry events when vehicle state changes
  useEffect(() => {
    if (!vehicle) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    let newEntry: TimelineItem | null = null;
    if (vehicle.behavior_state === 'APPROACHING_EVENT') {
      newEntry = { id: Date.now().toString(), time: timeStr, dotColor: 'bg-blue-500', text: `Approaching event (${(vehicle.distance_to_event_m ?? 80).toFixed(0)}m)` };
    } else if (vehicle.behavior_state === 'DECELERATING') {
      newEntry = { id: Date.now().toString(), time: timeStr, dotColor: 'bg-amber-500', text: `Decelerating (${vehicle.speed_kmh.toFixed(0)} km/h)` };
    } else if (vehicle.behavior_state === 'WAITING_FOR_POLICE_CLEARANCE') {
      newEntry = { id: Date.now().toString(), time: timeStr, dotColor: 'bg-rose-500', text: `Traffic Police Halt • Holding for VIP Convoy (0 km/h)` };
    } else if (vehicle.behavior_state === 'WAITING_FOR_GREEN') {
      newEntry = { id: Date.now().toString(), time: timeStr, dotColor: 'bg-red-500', text: `Holding at Signal Stop Line (0 km/h)` };
    } else if (vehicle.behavior_state === 'STOPPING' || vehicle.behavior_state === 'STOPPED' || vehicle.behavior_state === 'WAITING_AT_STOP_SIGN') {
      newEntry = { id: Date.now().toString(), time: timeStr, dotColor: 'bg-red-500', text: `Vehicle Stopped (0 km/h)` };
    } else if (vehicle.behavior_state === 'RESUMING') {
      newEntry = { id: Date.now().toString(), time: timeStr, dotColor: 'bg-emerald-500', text: `Signal Green / Clear • Resuming (${vehicle.speed_kmh.toFixed(0)} km/h)` };
    }

    if (newEntry) {
      setEvents(prev => {
        // avoid immediate duplicate text
        if (prev.length > 0 && prev[prev.length - 1].text === newEntry?.text) return prev;
        return [...prev.slice(-15), newEntry!];
      });
    }
  }, [vehicle?.behavior_state]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-slate-900">Live Event Timeline</h3>
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
            <Clock className="w-3 h-3" />
            <span>UTC+05:30</span>
          </div>
        </div>

        {/* Scrollable Timeline List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs font-mono">
          {events.map((ev) => (
            <div key={ev.id} className="flex items-center gap-2.5 py-0.5 group">
              <span className={`w-2 h-2 rounded-full ${ev.dotColor} shrink-0`} />
              <span className="text-slate-400 text-[11px] shrink-0 font-medium">{ev.time}</span>
              <span className="text-slate-700 font-sans text-[11px] truncate group-hover:text-slate-900">
                {ev.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 text-[10px] text-slate-400 font-mono text-right border-t border-slate-100">
        Streaming from Virtual RIU Telemetry Engine
      </div>
    </div>
  );
};
