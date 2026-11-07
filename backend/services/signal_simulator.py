"""
Traffic Signal Simulation & Green-Wave Advisory Engine.
Simulates synchronized/semi-actuated traffic lights across Hyderabad intersections.
Calculates Green Wave speed advisory windows to smooth vehicle flow.
"""

import time
from typing import List, Dict, Optional
from ..models.schemas import TrafficSignal, SignalState
from .geospatial import haversine_distance, calculate_along_track_distance, is_heading_aligned

class TrafficSignalSimulator:
    def __init__(self):
        self._signals: Dict[str, TrafficSignal] = {}
        self._last_tick = time.time()
        self._seed_signals()

    def _seed_signals(self):
        seeds = [
            {
                "signal_id": "SIG-HYD-01",
                "name": "Banjara Hills Junction Signal",
                "latitude": 17.4120,
                "longitude": 78.4410,
                "direction": 50.0,
                "road_segment_id": "HYD-ROAD-201",
                "cycle_duration": 60,
                "red_duration": 30,
                "yellow_duration": 5,
                "green_duration": 25,
                "elapsed_in_phase": 10,
                "state": SignalState.GREEN,
                "remaining_time": 15
            },
            {
                "signal_id": "SIG-HYD-02",
                "name": "Somajiguda Raj Bhavan Signal",
                "latitude": 17.4220,
                "longitude": 78.4550,
                "direction": 55.0,
                "road_segment_id": "HYD-ROAD-202",
                "cycle_duration": 60,
                "red_duration": 35,
                "yellow_duration": 5,
                "green_duration": 20,
                "elapsed_in_phase": 5,
                "state": SignalState.RED,
                "remaining_time": 30
            },
            {
                "signal_id": "SIG-HYD-03",
                "name": "Necklace Road Khairatabad Gateway",
                "latitude": 17.4270,
                "longitude": 78.4630,
                "direction": 80.0,
                "road_segment_id": "HYD-ROAD-203",
                "cycle_duration": 60,
                "red_duration": 25,
                "yellow_duration": 5,
                "green_duration": 30,
                "elapsed_in_phase": 12,
                "state": SignalState.GREEN,
                "remaining_time": 18
            },
            {
                "signal_id": "SIG-HYD-04",
                "name": "NTR Gardens / Tank Bund South Signal",
                "latitude": 17.4230,
                "longitude": 78.4750,
                "direction": 65.0,
                "road_segment_id": "HYD-ROAD-204",
                "cycle_duration": 65,
                "red_duration": 35,
                "yellow_duration": 5,
                "green_duration": 25,
                "elapsed_in_phase": 20,
                "state": SignalState.RED,
                "remaining_time": 15
            },
            {
                "signal_id": "SIG-HYD-05",
                "name": "Tank Bund Promenade Signal",
                "latitude": 17.4280,
                "longitude": 78.4820,
                "direction": 40.0,
                "road_segment_id": "HYD-ROAD-205",
                "cycle_duration": 60,
                "red_duration": 30,
                "yellow_duration": 5,
                "green_duration": 25,
                "elapsed_in_phase": 8,
                "state": SignalState.GREEN,
                "remaining_time": 17
            },
            {
                "signal_id": "SIG-HYD-06",
                "name": "Secunderabad Paradise Signal",
                "latitude": 17.4410,
                "longitude": 78.4865,
                "direction": 35.0,
                "road_segment_id": "HYD-ROAD-206",
                "cycle_duration": 70,
                "red_duration": 35,
                "yellow_duration": 5,
                "green_duration": 30,
                "elapsed_in_phase": 15,
                "state": SignalState.RED,
                "remaining_time": 20
            }
        ]
        
        for s in seeds:
            sig = TrafficSignal(**s)
            self._signals[sig.signal_id] = sig

    def tick(self, delta_seconds: float = 1.0):
        """Advances state of all traffic signals."""
        for sig in self._signals.values():
            sig.elapsed_in_phase += delta_seconds
            
            if sig.state == SignalState.GREEN:
                if sig.elapsed_in_phase >= sig.green_duration:
                    sig.state = SignalState.YELLOW
                    sig.elapsed_in_phase = 0.0
                    sig.remaining_time = sig.yellow_duration
                else:
                    sig.remaining_time = max(0, int(round(sig.green_duration - sig.elapsed_in_phase)))
                    
            elif sig.state == SignalState.YELLOW:
                if sig.elapsed_in_phase >= sig.yellow_duration:
                    sig.state = SignalState.RED
                    sig.elapsed_in_phase = 0.0
                    sig.remaining_time = sig.red_duration
                else:
                    sig.remaining_time = max(0, int(round(sig.yellow_duration - sig.elapsed_in_phase)))
                    
            elif sig.state == SignalState.RED:
                if sig.elapsed_in_phase >= sig.red_duration:
                    sig.state = SignalState.GREEN
                    sig.elapsed_in_phase = 0.0
                    sig.remaining_time = sig.green_duration
                else:
                    sig.remaining_time = max(0, int(round(sig.red_duration - sig.elapsed_in_phase)))

    def calculate_green_wave_advisory(
        self, sig: TrafficSignal, distance_m: float, current_speed_kmh: float
    ) -> tuple[Optional[float], Optional[float], str]:
        """
        Calculates recommended speed window to pass the upcoming signal on Green.
        Returns (speed_min_kmh, speed_max_kmh, advisory_text).
        """
        if distance_m <= 10.0 or distance_m > 600.0:
            return None, None, ""
            
        # Target time to arrival
        if sig.state == SignalState.GREEN:
            # If we arrive before green ends:
            time_left_green = sig.remaining_time
            if time_left_green > 3:
                # Minimum speed to arrive before green expires:
                req_speed_ms = distance_m / float(time_left_green)
                req_speed_kmh = req_speed_ms * 3.6
                if 20.0 <= req_speed_kmh <= 60.0:
                    min_spd = max(25.0, round(req_speed_kmh * 0.9, 0))
                    max_spd = min(60.0, round(req_speed_kmh * 1.15, 0))
                    return min_spd, max_spd, f"Maintain {int(min_spd)}-{int(max_spd)} km/h for Green-Wave"
                else:
                    return 35.0, 45.0, "Prepare to pass on green"
            else:
                return None, None, "Signal turning Yellow soon - Slow Down"
                
        elif sig.state == SignalState.RED:
            # Arrive just as it turns green
            time_to_green = sig.remaining_time
            if time_to_green > 2:
                ideal_speed_ms = distance_m / float(time_to_green)
                ideal_speed_kmh = ideal_speed_ms * 3.6
                if 15.0 <= ideal_speed_kmh <= 55.0:
                    min_spd = max(15.0, round(ideal_speed_kmh * 0.85, 0))
                    max_spd = min(50.0, round(ideal_speed_kmh * 1.05, 0))
                    return min_spd, max_spd, f"Coast at {int(min_spd)}-{int(max_spd)} km/h for upcoming Green"
                else:
                    return None, None, f"Red Signal ahead ({sig.remaining_time}s)"
                    
        return None, None, ""

    def get_upcoming_signal(
        self, veh_lat: float, veh_lon: float, veh_heading: float, veh_speed_kmh: float, max_dist_m: float = 450.0
    ) -> Optional[TrafficSignal]:
        """Finds closest approaching traffic signal ahead of vehicle."""
        closest_sig = None
        min_along_dist = max_dist_m
        
        for sig in self._signals.values():
            if not is_heading_aligned(veh_heading, sig.direction, tolerance=40.0):
                continue
                
            along_dist, direct_dist = calculate_along_track_distance(
                veh_lat, veh_lon, veh_heading, sig.latitude, sig.longitude
            )
            
            # Approaching ahead
            if 0 < along_dist < min_along_dist:
                min_along_dist = along_dist
                min_spd, max_spd, _ = self.calculate_green_wave_advisory(sig, along_dist, veh_speed_kmh)
                sig_copy = sig.model_copy()
                sig_copy.recommended_speed_min = min_spd
                sig_copy.recommended_speed_max = max_spd
                closest_sig = sig_copy
                
        return closest_sig

    def get_all_signals(self) -> List[TrafficSignal]:
        return list(self._signals.values())

signal_simulator = TrafficSignalSimulator()
