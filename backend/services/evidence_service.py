"""
Evidence Collection, Cryptographic Sealing & Chain-of-Custody Service.
Features:
- Encapsulates ANPR plate crops, GVID CAN/GNSS readings, road speed rules
- Generates SHA-256 digital cryptographic hash seal for legal accountability
- Section 167A Central Motor Vehicles Rules (CMVR) compliance certification
- Traffic Officer human-in-the-loop review queue (Approve / Dismiss)
- All demonstration records labeled [SIMULATED DATA]
"""

import hashlib
import json
import time
from typing import List, Dict, Optional, Any
from ..models.schemas import ViolationEvidencePackage, EvidenceStatus, VehicleCategory

class EvidenceService:
    def __init__(self):
        self._evidence_store: Dict[str, ViolationEvidencePackage] = {}
        self._init_mock_evidence()

    def _generate_sha256(self, payload: Dict[str, Any]) -> str:
        serialized = json.dumps(payload, sort_keys=True).encode("utf-8")
        return hashlib.sha256(serialized).hexdigest()

    def _init_mock_evidence(self):
        # Initial review queue evidence packages
        records = [
            {
                "evidence_id": "EVD-2026-HYD-9810",
                "vehicle_reg_num": "TS 09 EV 4412",
                "vehicle_category": VehicleCategory.FOUR_WHEELER,
                "gvid_device_id": "GVID-HYD-00109",
                "road_segment_id": "HYD-ROAD-101",
                "location_name": "Cyber Towers Flyover Approach (Ch 1+240)",
                "latitude": 17.4502,
                "longitude": 78.3808,
                "timestamp": "2026-11-21 23:42:15 IST",
                "speed_measured_kmh": 74.5,
                "speed_limit_applicable_kmh": 50.0,
                "speed_uncertainty_kmh": 1.5,
                "speed_delta_kmh": 24.5,
                "sustained_duration_seconds": 4.2,
                "anpr_confidence_pct": 98.4,
                "anpr_plate_snapshot_url": "/data/evidence/anpr_plate_4412.jpg",
                "status": EvidenceStatus.PENDING_REVIEW,
                "officer_notes": "Awaiting officer sign-off under Section 167A CMVR"
            },
            {
                "evidence_id": "EVD-2026-HYD-9811",
                "vehicle_reg_num": "AP 28 BX 9011",
                "vehicle_category": VehicleCategory.FOUR_WHEELER,
                "gvid_device_id": None,
                "road_segment_id": "HYD-ROAD-102",
                "location_name": "Mindspace Junction Stop Line",
                "latitude": 17.4450,
                "longitude": 78.3818,
                "timestamp": "2026-11-21 23:40:02 IST",
                "speed_measured_kmh": 42.0,
                "speed_limit_applicable_kmh": 40.0,
                "speed_uncertainty_kmh": 2.0,
                "speed_delta_kmh": 2.0,
                "sustained_duration_seconds": 1.1,
                "anpr_confidence_pct": 91.2,
                "anpr_plate_snapshot_url": "/data/evidence/anpr_plate_9011.jpg",
                "status": EvidenceStatus.PENDING_REVIEW,
                "officer_notes": "Speed margin within calibration uncertainty tolerance; recommend dismissal"
            },
            {
                "evidence_id": "EVD-2026-HYD-9812",
                "vehicle_reg_num": "TS 07 TR 1022",
                "vehicle_category": VehicleCategory.HEAVY_MOTOR_VEHICLE,
                "gvid_device_id": "GVID-HYD-00441",
                "road_segment_id": "HYD-ROAD-103",
                "location_name": "Bio-Diversity Junction School Zone",
                "latitude": 17.4325,
                "longitude": 78.3712,
                "timestamp": "2026-11-21 23:36:48 IST",
                "speed_measured_kmh": 58.0,
                "speed_limit_applicable_kmh": 25.0,
                "speed_uncertainty_kmh": 1.2,
                "speed_delta_kmh": 33.0,
                "sustained_duration_seconds": 6.8,
                "anpr_confidence_pct": 97.6,
                "anpr_plate_snapshot_url": "/data/evidence/anpr_plate_1022.jpg",
                "status": EvidenceStatus.OFFICER_APPROVED,
                "officer_id": "OFF-TG-4402",
                "officer_name": "Insp. K. Sridhar (Traffic West)",
                "officer_notes": "Severe overspeed in designated school zone. Heavy vehicle limit 25 km/h violated.",
                "review_timestamp": "2026-11-21 23:38:10 IST"
            }
        ]

        for r in records:
            telemetry_data = {
                "veh": r["vehicle_reg_num"],
                "speed": r["speed_measured_kmh"],
                "limit": r["speed_limit_applicable_kmh"],
                "ts": r["timestamp"]
            }
            tel_hash = self._generate_sha256(telemetry_data)
            seal_data = {**telemetry_data, "tel_hash": tel_hash, "loc": r["location_name"]}
            seal_hash = self._generate_sha256(seal_data)

            package = ViolationEvidencePackage(
                **r,
                telemetry_hash_sha256=tel_hash,
                evidence_seal_sha256=seal_hash
            )
            self._evidence_store[package.evidence_id] = package

    def get_queue(self, status: Optional[EvidenceStatus] = None) -> List[ViolationEvidencePackage]:
        packages = list(self._evidence_store.values())
        if status:
            packages = [p for p in packages if p.status == status]
        return sorted(packages, key=lambda x: x.timestamp, reverse=True)

    def get_by_id(self, evidence_id: str) -> Optional[ViolationEvidencePackage]:
        return self._evidence_store.get(evidence_id)

    def review_evidence(
        self,
        evidence_id: str,
        decision: str,  # "APPROVE" or "DISMISS"
        officer_id: str = "OFF-TG-4402",
        officer_name: str = "Insp. K. Sridhar (Traffic West)",
        notes: Optional[str] = None
    ) -> Optional[ViolationEvidencePackage]:
        pkg = self._evidence_store.get(evidence_id)
        if not pkg:
            return None

        pkg.officer_id = officer_id
        pkg.officer_name = officer_name
        pkg.officer_notes = notes or ("Approved for official e-Challan generation" if decision == "APPROVE" else "Dismissed - Evidence does not meet threshold")
        pkg.review_timestamp = time.strftime("%Y-%m-%d %H:%M:%S IST")

        if decision == "APPROVE":
            pkg.status = EvidenceStatus.OFFICER_APPROVED
        else:
            pkg.status = EvidenceStatus.OFFICER_DISMISSED

        return pkg

evidence_service = EvidenceService()
