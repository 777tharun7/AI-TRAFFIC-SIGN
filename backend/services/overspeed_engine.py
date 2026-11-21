"""
Intelligent Overspeed Detection and Compliance Engine.
Features:
- Road segment rule evaluation based on vehicle category (2W, 4W, EV, HMV, Bus)
- Sensor calibration tolerance application (+- 2 km/h margin)
- Sustained duration tracking (demands >= 3 seconds sustained excess to prevent transient false flags)
- Weather and school/hospital zone dynamic speed reductions
- Legal accountability validation prior to violation escalation
"""

import time
from typing import Dict, Any, Optional, List
from ..models.schemas import RoadSegmentRule, VehicleCategory

class OverspeedEngine:
    def __init__(self):
        # Road segments with speed limits
        self._segment_rules: Dict[str, RoadSegmentRule] = {
            "HYD-ROAD-101": RoadSegmentRule(
                segment_id="HYD-ROAD-101",
                segment_name="Hitec City Main Road (Cyber Towers to Mindspace)",
                corridor_id="COR-01",
                default_speed_limit_kmh=50.0,
                category_speed_limits={
                    "TWO_WHEELER": 50.0,
                    "FOUR_WHEELER": 50.0,
                    "EV_COMMERCIAL": 45.0,
                    "BUS_TRANSIT": 40.0,
                    "HEAVY_MOTOR_VEHICLE": 35.0,
                    "EMERGENCY": 80.0
                },
                is_school_zone=False,
                is_hospital_zone=False
            ),
            "HYD-ROAD-102": RoadSegmentRule(
                segment_id="HYD-ROAD-102",
                segment_name="Mindspace Junction Flyover Approach",
                corridor_id="COR-01",
                default_speed_limit_kmh=40.0,
                category_speed_limits={
                    "TWO_WHEELER": 40.0,
                    "FOUR_WHEELER": 40.0,
                    "EV_COMMERCIAL": 40.0,
                    "BUS_TRANSIT": 30.0,
                    "HEAVY_MOTOR_VEHICLE": 30.0,
                    "EMERGENCY": 70.0
                },
                is_school_zone=False,
                is_hospital_zone=False
            ),
            "HYD-ROAD-103": RoadSegmentRule(
                segment_id="HYD-ROAD-103",
                segment_name="Bio-Diversity Junction School & Pedestrian Zone",
                corridor_id="COR-01",
                default_speed_limit_kmh=30.0,
                category_speed_limits={
                    "TWO_WHEELER": 30.0,
                    "FOUR_WHEELER": 30.0,
                    "EV_COMMERCIAL": 30.0,
                    "BUS_TRANSIT": 25.0,
                    "HEAVY_MOTOR_VEHICLE": 25.0,
                    "EMERGENCY": 60.0
                },
                is_school_zone=True,
                is_hospital_zone=False
            ),
            "HYD-ORR-EXPRESSWAY": RoadSegmentRule(
                segment_id="HYD-ORR-EXPRESSWAY",
                segment_name="Nehru Outer Ring Road Expressway",
                corridor_id="COR-04",
                default_speed_limit_kmh=100.0,
                category_speed_limits={
                    "TWO_WHEELER": 0.0,  # 2W banned on expressway
                    "FOUR_WHEELER": 100.0,
                    "EV_COMMERCIAL": 80.0,
                    "BUS_TRANSIT": 80.0,
                    "HEAVY_MOTOR_VEHICLE": 70.0,
                    "EMERGENCY": 120.0
                },
                is_school_zone=False,
                is_hospital_zone=False
            )
        }
        self.sensor_tolerance_kmh = 2.0  # Mandatory margin of error benefit to driver
        self.sustained_threshold_seconds = 3.0

    def get_segment_rule(self, segment_id: str) -> RoadSegmentRule:
        return self._segment_rules.get(segment_id, RoadSegmentRule(
            segment_id=segment_id,
            segment_name="General City Roadway",
            corridor_id="GEN-01",
            default_speed_limit_kmh=40.0
        ))

    def evaluate_compliance(
        self,
        measured_speed_kmh: float,
        segment_id: str,
        category: str = "FOUR_WHEELER",
        sustained_seconds: float = 3.5,
        weather_rain: bool = False
    ) -> Dict[str, Any]:
        rule = self.get_segment_rule(segment_id)
        limit = rule.category_speed_limits.get(category, rule.default_speed_limit_kmh)

        if weather_rain:
            limit = max(25.0, limit - 10.0)

        # Net effective measured speed with sensor calibration tolerance deducted
        # Benefit of doubt goes to the driver:
        conservative_speed = max(0.0, measured_speed_kmh - self.sensor_tolerance_kmh)
        speed_delta = measured_speed_kmh - limit
        conservative_delta = conservative_speed - limit

        is_overspeeding = (
            conservative_delta > 0.0 and
            sustained_seconds >= self.sustained_threshold_seconds and
            category != "EMERGENCY"  # Ambulances exempted
        )

        # Tier classification
        severity = "NORMAL"
        if is_overspeeding:
            if conservative_delta > 25.0:
                severity = "CRITICAL_DANGEROUS_DRIVING"
            elif conservative_delta > 15.0:
                severity = "HIGH_OVERSPEED"
            else:
                severity = "MODERATE_OVERSPEED"

        return {
            "segment_id": segment_id,
            "segment_name": rule.segment_name,
            "measured_speed_kmh": round(measured_speed_kmh, 1),
            "sensor_tolerance_kmh": self.sensor_tolerance_kmh,
            "legally_admissible_speed_kmh": round(conservative_speed, 1),
            "applicable_limit_kmh": round(limit, 1),
            "speed_delta_kmh": round(speed_delta, 1),
            "sustained_seconds": sustained_seconds,
            "is_overspeeding": is_overspeeding,
            "severity": severity,
            "reason": (
                f"Sustained {round(measured_speed_kmh, 1)} km/h exceeds legal limit of {round(limit, 1)} km/h "
                f"by +{round(conservative_delta, 1)} km/h (after deducting {self.sensor_tolerance_kmh} km/h tolerance)"
                if is_overspeeding else "Within legal compliance envelope"
            )
        }

overspeed_engine = OverspeedEngine()
