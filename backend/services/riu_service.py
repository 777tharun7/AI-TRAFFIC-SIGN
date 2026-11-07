"""
Virtual Roadside Intelligence Unit (V-RIU) Service.
Simulates roadside digital event broadcast units across Hyderabad's road network.
"""

import time
import uuid
from typing import List, Optional, Dict
from ..models.schemas import VirtualRIU, VirtualRIUCreate, PriorityLevel

class VirtualRIUService:
    def __init__(self):
        self._rius: Dict[str, VirtualRIU] = {}
        self._seed_hyderabad_rius()

    def _seed_hyderabad_rius(self):
        seeds = [
            {
                "id": "RIU-HYD-001",
                "name": "Cyber Towers Speed Zone V-RIU",
                "event_type": "SPEED_LIMIT",
                "value": 40.0,
                "latitude": 17.4502,
                "longitude": 78.3808,
                "direction": 92.0,
                "road_segment_id": "HYD-ROAD-101",
                "activation_radius": 250.0,
                "trigger_distance": 50.0,
                "validity_distance": 300.0,
                "priority": PriorityLevel.MEDIUM,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-002",
                "name": "Mindspace Tech Junction Speed Breaker V-RIU",
                "event_type": "SPEED_BREAKER",
                "value": 20.0,
                "latitude": 17.4428,
                "longitude": 78.3820,
                "direction": 105.0,
                "road_segment_id": "HYD-ROAD-102",
                "activation_radius": 200.0,
                "trigger_distance": 45.0,
                "validity_distance": 180.0,
                "priority": PriorityLevel.HIGH,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-003",
                "name": "Gachibowli Stadium Pedestrian Crossing V-RIU",
                "event_type": "PEDESTRIAN_CROSSING",
                "value": None,
                "latitude": 17.4370,
                "longitude": 78.3610,
                "direction": 130.0,
                "road_segment_id": "HYD-ROAD-103",
                "activation_radius": 220.0,
                "trigger_distance": 50.0,
                "validity_distance": 200.0,
                "priority": PriorityLevel.HIGH,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-004",
                "name": "Bio-Diversity Junction Stop Sign V-RIU",
                "event_type": "STOP",
                "value": 0.0,
                "latitude": 17.4325,
                "longitude": 78.3712,
                "direction": 145.0,
                "road_segment_id": "HYD-ROAD-104",
                "activation_radius": 180.0,
                "trigger_distance": 40.0,
                "validity_distance": 150.0,
                "priority": PriorityLevel.HIGH,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-005",
                "name": "ORR Gachibowli Expressway Speed Zone V-RIU",
                "event_type": "SPEED_LIMIT",
                "value": 80.0,
                "latitude": 17.4215,
                "longitude": 78.3540,
                "direction": 185.0,
                "road_segment_id": "HYD-ROAD-105",
                "activation_radius": 350.0,
                "trigger_distance": 70.0,
                "validity_distance": 500.0,
                "priority": PriorityLevel.MEDIUM,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-006",
                "name": "Jubilee Hills Road 36 Road Work V-RIU",
                "event_type": "ROAD_WORK",
                "value": 30.0,
                "latitude": 17.4340,
                "longitude": 78.4050,
                "direction": 78.0,
                "road_segment_id": "HYD-ROAD-106",
                "activation_radius": 280.0,
                "trigger_distance": 60.0,
                "validity_distance": 300.0,
                "priority": PriorityLevel.HIGH,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-007",
                "name": "Durgam Cheruvu Restricted Slipway V-RIU",
                "event_type": "NO_ENTRY",
                "value": None,
                "latitude": 17.4338,
                "longitude": 78.3905,
                "direction": 270.0,
                "road_segment_id": "HYD-ROAD-107",
                "activation_radius": 200.0,
                "trigger_distance": 40.0,
                "validity_distance": 150.0,
                "priority": PriorityLevel.CRITICAL,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-008",
                "name": "Financial District Circle Yield V-RIU",
                "event_type": "GIVE_WAY",
                "value": None,
                "latitude": 17.4170,
                "longitude": 78.3420,
                "direction": 110.0,
                "road_segment_id": "HYD-ROAD-108",
                "activation_radius": 190.0,
                "trigger_distance": 45.0,
                "validity_distance": 160.0,
                "priority": PriorityLevel.HIGH,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            },
            {
                "id": "RIU-HYD-009",
                "name": "HITEC Corridor VIP Minister Convoy & Police Stop V-RIU",
                "event_type": "POLICE_HALT",
                "value": 0.0,
                "latitude": 17.4470,
                "longitude": 78.3812,
                "direction": 165.0,
                "road_segment_id": "HYD-ROAD-102",
                "activation_radius": 240.0,
                "trigger_distance": 50.0,
                "validity_distance": 220.0,
                "priority": PriorityLevel.CRITICAL,
                "status": "ACTIVE",
                "source": "SIMULATED_RIU"
            }
        ]
        
        now = time.strftime("%Y-%m-%d %H:%M:%S")
        for s in seeds:
            riu = VirtualRIU(
                id=s["id"],
                name=s["name"],
                event_type=s["event_type"],
                value=s["value"],
                latitude=s["latitude"],
                longitude=s["longitude"],
                direction=s["direction"],
                road_segment_id=s["road_segment_id"],
                activation_radius=s["activation_radius"],
                trigger_distance=s["trigger_distance"],
                validity_distance=s["validity_distance"],
                priority=s["priority"],
                status=s["status"],
                source=s["source"],
                created_at=now,
                updated_at=now
            )
            self._rius[riu.id] = riu

    def get_all_rius(self) -> List[VirtualRIU]:
        return list(self._rius.values())

    def get_riu_by_id(self, riu_id: str) -> Optional[VirtualRIU]:
        return self._rius.get(riu_id)

    def create_riu(self, data: VirtualRIUCreate) -> VirtualRIU:
        now = time.strftime("%Y-%m-%d %H:%M:%S")
        new_id = f"RIU-HYD-{len(self._rius) + 1:03d}"
        riu = VirtualRIU(
            id=new_id,
            created_at=now,
            updated_at=now,
            **data.model_dump()
        )
        self._rius[new_id] = riu
        return riu

    def update_riu(self, riu_id: str, data: VirtualRIUCreate) -> Optional[VirtualRIU]:
        if riu_id not in self._rius:
            return None
        now = time.strftime("%Y-%m-%d %H:%M:%S")
        existing = self._rius[riu_id]
        updated = VirtualRIU(
            id=riu_id,
            created_at=existing.created_at,
            updated_at=now,
            **data.model_dump()
        )
        self._rius[riu_id] = updated
        return updated

    def toggle_riu_status(self, riu_id: str) -> Optional[VirtualRIU]:
        if riu_id not in self._rius:
            return None
        riu = self._rius[riu_id]
        riu.status = "INACTIVE" if riu.status == "ACTIVE" else "ACTIVE"
        riu.updated_at = time.strftime("%Y-%m-%d %H:%M:%S")
        return riu

    def delete_riu(self, riu_id: str) -> bool:
        if riu_id in self._rius:
            del self._rius[riu_id]
            return True
        return False

riu_service = VirtualRIUService()
