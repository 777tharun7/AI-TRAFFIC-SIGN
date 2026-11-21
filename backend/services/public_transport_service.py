"""
Public Transport & Bus Fleet Intelligence Service.
Features:
- TSRTC Hyderabad City Bus fleet monitoring
- Route schedule delay tracking (+/- minutes)
- Electric Bus Battery SoC % and charging health
- Passenger occupancy load estimation
- All demonstration records labeled [SIMULATED DATA]
"""

from typing import List, Dict, Optional
from ..models.schemas import PublicTransportBus, PublicTransportRoute

class PublicTransportService:
    def __init__(self):
        self._buses: Dict[str, PublicTransportBus] = {}
        self._routes: Dict[str, PublicTransportRoute] = {}
        self._init_mock_data()

    def _init_mock_data(self):
        routes_data = [
            PublicTransportRoute(
                route_id="RTC-RT-100",
                route_number="100-EV",
                origin="Mehdipatnam Bus Station",
                destination="Financial District / WaveRock",
                total_stops=18,
                active_buses_count=8,
                average_headway_minutes=7,
                corridor_reliability_pct=94.2
            ),
            PublicTransportRoute(
                route_id="RTC-RT-216",
                route_number="216-W",
                origin="Secunderabad Station",
                destination="Kondapur via Cyber Towers",
                total_stops=24,
                active_buses_count=12,
                average_headway_minutes=5,
                corridor_reliability_pct=89.5
            )
        ]
        for r in routes_data:
            self._routes[r.route_id] = r

        buses_data = [
            PublicTransportBus(
                bus_id="RTC-BUS-8801",
                route_number="100-EV",
                route_name="Mehdipatnam to Financial District",
                depot="Mehdipatnam Green Depot",
                current_driver="M. Anjaneyulu (Badge #4812)",
                driver_rating=4.9,
                current_lat=17.4435,
                current_lon=78.3772,
                speed_kmh=36.0,
                is_ev=True,
                battery_soc_pct=72.0,
                passenger_load_pct=65,
                schedule_delay_minutes=1,  # 1 min delayed
                next_stop_name="Mindspace IT Park Phase 2",
                eta_next_stop_seconds=110
            ),
            PublicTransportBus(
                bus_id="RTC-BUS-8802",
                route_number="100-EV",
                route_name="Mehdipatnam to Financial District",
                depot="Mehdipatnam Green Depot",
                current_driver="K. Venkatesh (Badge #3901)",
                driver_rating=4.7,
                current_lat=17.4320,
                current_lon=78.3610,
                speed_kmh=41.0,
                is_ev=True,
                battery_soc_pct=48.0,
                passenger_load_pct=82,
                schedule_delay_minutes=-2,  # 2 mins ahead of schedule
                next_stop_name="Bio-Diversity Junction",
                eta_next_stop_seconds=80
            ),
            PublicTransportBus(
                bus_id="RTC-BUS-9912",
                route_number="216-W",
                route_name="Secunderabad to Kondapur",
                depot="Ranigunj Depot 1",
                current_driver="P. Srinivas (Badge #6109)",
                driver_rating=4.6,
                current_lat=17.4490,
                current_lon=78.3812,
                speed_kmh=28.0,
                is_ev=True,
                battery_soc_pct=84.0,
                passenger_load_pct=90,
                schedule_delay_minutes=4,  # 4 mins delayed due to traffic
                next_stop_name="Cyber Towers Junction",
                eta_next_stop_seconds=160
            )
        ]
        for b in buses_data:
            self._buses[b.bus_id] = b

    def get_all_buses(self) -> List[PublicTransportBus]:
        return list(self._buses.values())

    def get_all_routes(self) -> List[PublicTransportRoute]:
        return list(self._routes.values())

public_transport_service = PublicTransportService()
