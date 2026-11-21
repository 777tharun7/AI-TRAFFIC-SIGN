"""
Traffic Department & EV Fleet Management Service for RoadSense AI.
Provides:
- Real-time EV charging hub discovery and SoC battery analytics
- Citywide corridor Level of Service (LoS), congestion index & AQI
- Live ANPR traffic violation detection & E-Challan incident tracking
- Emergency Vehicle Preemption (EVP) Green-Wave Corridor clearance
"""

import time
from typing import List, Dict, Any, Optional
from ..models.schemas import EVChargingStation, TrafficIncident, CorridorTrafficStatus
from .geospatial import haversine_distance

class TrafficDeptService:
    def __init__(self):
        # Hyderabad EV Charging Hubs
        self.charging_stations = [
            EVChargingStation(
                station_id="EV-HUB-HYD-01",
                name="Tata Power EZ Charge - Mindspace IT Park",
                operator="Tata Power",
                latitude=17.4448,
                longitude=17.3815,
                total_ports=8,
                available_ports=5,
                charger_types=["CCS2 (150 kW)", "Type 2 (22 kW)"],
                power_kw=150.0,
                price_per_kwh=19.5,
                wait_time_minutes=0,
                status="AVAILABLE"
            ),
            EVChargingStation(
                station_id="EV-HUB-HYD-02",
                name="Jio-bp pulse Mega Hub - Cyber Towers",
                operator="Jio-bp pulse",
                latitude=17.4505,
                longitude=78.3810,
                total_ports=12,
                available_ports=9,
                charger_types=["CCS2 (180 kW Ultra-Fast)", "Bharat DC-001 (15 kW)"],
                power_kw=180.0,
                price_per_kwh=18.0,
                wait_time_minutes=2,
                status="AVAILABLE"
            ),
            EVChargingStation(
                station_id="EV-HUB-HYD-03",
                name="Statiq Supercharger - Gachibowli Stadium",
                operator="Statiq",
                latitude=17.4265,
                longitude=78.3625,
                total_ports=6,
                available_ports=2,
                charger_types=["CCS2 (120 kW)", "Type 2 (11 kW)"],
                power_kw=120.0,
                price_per_kwh=17.5,
                wait_time_minutes=5,
                status="BUSY"
            ),
            EVChargingStation(
                station_id="EV-HUB-HYD-04",
                name="Ather Grid & ChargePoint - Jubilee Hills Road 36",
                operator="Ather Grid",
                latitude=17.4320,
                longitude=78.4060,
                total_ports=8,
                available_ports=6,
                charger_types=["CCS2 (60 kW)", "Ather Fast 2W (3.3 kW)"],
                power_kw=60.0,
                price_per_kwh=16.0,
                wait_time_minutes=0,
                status="AVAILABLE"
            ),
            EVChargingStation(
                station_id="EV-HUB-HYD-05",
                name="Zeon Fast EV Charging - ORR Nanakramguda Exit",
                operator="Zeon Charging",
                latitude=17.4200,
                longitude=78.3520,
                total_ports=10,
                available_ports=7,
                charger_types=["CCS2 (240 kW Hypercharger)", "CHAdeMO (50 kW)"],
                power_kw=240.0,
                price_per_kwh=21.0,
                wait_time_minutes=0,
                status="AVAILABLE"
            )
        ]

        # Citywide Corridor Monitoring Status
        self.corridors = [
            CorridorTrafficStatus(
                corridor_id="COR-01",
                name="Hitec City to Gachibowli Corridor",
                congestion_level="MODERATE",
                level_of_service="LOS_C",
                average_speed_kmh=38.5,
                active_vehicle_count=1840,
                incident_count=2,
                aqi_index=118,
                green_wave_active=True
            ),
            CorridorTrafficStatus(
                corridor_id="COR-02",
                name="Hussain Sagar & Tank Bund Corridor",
                congestion_level="FLUID",
                level_of_service="LOS_B",
                average_speed_kmh=44.2,
                active_vehicle_count=1220,
                incident_count=1,
                aqi_index=95,
                green_wave_active=True
            ),
            CorridorTrafficStatus(
                corridor_id="COR-03",
                name="Jubilee Hills to Cable Bridge",
                congestion_level="MODERATE",
                level_of_service="LOS_C",
                average_speed_kmh=35.0,
                active_vehicle_count=1540,
                incident_count=0,
                aqi_index=104,
                green_wave_active=False
            ),
            CorridorTrafficStatus(
                corridor_id="COR-04",
                name="Nehru Outer Ring Road (ORR) Expressway",
                congestion_level="FREE_FLOW",
                level_of_service="LOS_A",
                average_speed_kmh=78.6,
                active_vehicle_count=2980,
                incident_count=1,
                aqi_index=72,
                green_wave_active=True
            )
        ]

        # Live Incidents & ANPR Violations
        self.incidents = [
            TrafficIncident(
                incident_id="INC-2026-0891",
                timestamp="11:42:15 PM",
                incident_type="OVERSPEEDING",
                severity="HIGH",
                location_name="Cyber Towers Flyover Approach",
                latitude=17.4502,
                longitude=78.3808,
                vehicle_id="VEH-TS-09-EV-4412",
                vehicle_plate="TS 09 EV 4412",
                status="CITATION_ISSUED",
                speed_kmh=74.5,
                fine_amount_inr=1500
            ),
            TrafficIncident(
                incident_id="INC-2026-0892",
                timestamp="11:40:02 PM",
                incident_type="RED_LIGHT_VIOLATION",
                severity="CRITICAL",
                location_name="Mindspace Roundabout Stop Line",
                latitude=17.4450,
                longitude=78.3818,
                vehicle_id="VEH-AP-28-BX-9011",
                vehicle_plate="AP 28 BX 9011",
                status="CITATION_ISSUED",
                speed_kmh=42.0,
                fine_amount_inr=2000
            ),
            TrafficIncident(
                incident_id="INC-2026-0893",
                timestamp="11:36:48 PM",
                incident_type="ROAD_OBSTRUCTION",
                severity="MEDIUM",
                location_name="Bio-Diversity Park Underpass",
                latitude=17.4325,
                longitude=78.3712,
                vehicle_id="VEH-TS-07-TR-1022",
                vehicle_plate="TS 07 TR 1022",
                status="DISPATCHED",
                speed_kmh=0.0,
                fine_amount_inr=0
            ),
            TrafficIncident(
                incident_id="INC-2026-0894",
                timestamp="11:28:10 PM",
                incident_type="LOW_EV_BATTERY_STRANDED_RISK",
                severity="LOW",
                location_name="Inorbit Mall Outer Road",
                latitude=17.4380,
                longitude=78.3780,
                vehicle_id="VEH-TS-10-EV-8821",
                vehicle_plate="TS 10 EV 8821",
                status="ASSISTANCE_ROUTED",
                speed_kmh=18.0,
                fine_amount_inr=0
            )
        ]

        self.emergency_preemption_active = False
        self.emergency_preemption_route = None

    def get_ev_stations(self, lat: Optional[float] = None, lon: Optional[float] = None) -> List[EVChargingStation]:
        stations = []
        for s in self.charging_stations:
            dist = None
            if lat is not None and lon is not None:
                dist = round(haversine_distance(lat, lon, s.latitude, s.longitude), 1)
            copy_s = s.model_copy()
            copy_s.distance_m = dist
            stations.append(copy_s)
        
        # Sort by distance if coordinates provided
        if lat is not None and lon is not None:
            stations.sort(key=lambda x: x.distance_m or 999999)
        return stations

    def get_corridors_overview(self) -> List[CorridorTrafficStatus]:
        return self.corridors

    def get_incidents(self) -> List[TrafficIncident]:
        return self.incidents

    def trigger_emergency_preemption(self, route_id: str = "route_hitec_gachibowli", enable: bool = True) -> Dict[str, Any]:
        self.emergency_preemption_active = enable
        self.emergency_preemption_route = route_id if enable else None
        return {
            "status": "SUCCESS",
            "emergency_preemption_active": self.emergency_preemption_active,
            "corridor": route_id,
            "action": "CORRIDOR_GREEN_WAVE_FORCE" if enable else "STANDARD_ATCS_RESTORED",
            "message": "Emergency Vehicle Priority (EVP) Activated: Signal cycle cleared to 100% GREEN along route" if enable else "Standard Adaptive Traffic Control restored."
        }

traffic_dept_service = TrafficDeptService()
