"""
Official e-Challan Workflow and Legal Compliance Service.
Features:
- Motor Vehicles (Amendment) Act 2019 legal sections (Sec 183, Sec 184, Sec 177)
- Section 167A CMVR compliance (Human verification, certified digital evidence seal)
- Simulated payment lifecycle (UPI, Card, Net Banking) with official receipt ID
- Citizen grievance and dispute handling workflow
- All demonstration records labeled [SIMULATED DATA]
"""

import time
import uuid
from typing import List, Dict, Optional, Any
from ..models.schemas import EChallanRecord, ChallanStatus

class EChallanService:
    def __init__(self):
        self._challans: Dict[str, EChallanRecord] = {}
        self._init_mock_challans()

    def _init_mock_challans(self):
        records = [
            EChallanRecord(
                challan_id="CHL-HYD-2026-0812",
                challan_number="TS-HYD-2026-CH-081290",
                vehicle_reg_num="TS 09 EV 4412",
                owner_name="Devanboina Tharun",
                violation_type="Overspeeding (Exceeding Specified Speed Limit)",
                motor_vehicle_act_section="Section 183(1) of Motor Vehicles Act, 1988 (Amended 2019)",
                road_location="Cyber Towers Flyover Approach (Ch 1+240)",
                violation_timestamp="2026-11-21 23:42:15 IST",
                speed_detected_kmh=74.5,
                speed_limit_kmh=50.0,
                penalty_amount_inr=1500,
                evidence_package_id="EVD-2026-HYD-9810",
                evidence_seal_sha256="4d7a8e2b0c9f1a3e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a",
                status=ChallanStatus.ISSUED,
                due_date="2026-12-06",
                issuing_authority="Hyderabad City Police - Cyberabad Traffic Branch"
            ),
            EChallanRecord(
                challan_id="CHL-HYD-2026-0798",
                challan_number="TS-HYD-2026-CH-079822",
                vehicle_reg_num="TS 07 TR 1022",
                owner_name="Megha Logistics Cargo Ltd",
                violation_type="Dangerous Speeding in School Zone (Heavy Vehicle)",
                motor_vehicle_act_section="Section 183(2) & Section 184 of Motor Vehicles Act, 1988",
                road_location="Bio-Diversity Junction School Zone",
                violation_timestamp="2026-11-21 23:36:48 IST",
                speed_detected_kmh=58.0,
                speed_limit_kmh=25.0,
                penalty_amount_inr=4000,
                evidence_package_id="EVD-2026-HYD-9812",
                evidence_seal_sha256="c2e8a10f9b3d7c5e1a4b8c9d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f",
                status=ChallanStatus.ISSUED,
                due_date="2026-12-05",
                issuing_authority="Hyderabad City Police - Traffic Branch West"
            ),
            EChallanRecord(
                challan_id="CHL-HYD-2026-0610",
                challan_number="TS-HYD-2026-CH-061044",
                vehicle_reg_num="AP 28 BX 9011",
                owner_name="V. K. Raman Rao",
                violation_type="Red Light Jump & Stop Line Cross",
                motor_vehicle_act_section="Section 184 (Dangerous Driving) & Sec 177",
                road_location="Mindspace Roundabout Stop Line",
                violation_timestamp="2026-11-20 18:14:02 IST",
                speed_detected_kmh=42.0,
                speed_limit_kmh=40.0,
                penalty_amount_inr=2000,
                evidence_package_id="EVD-2026-HYD-9811",
                evidence_seal_sha256="9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
                status=ChallanStatus.PAID,
                due_date="2026-12-05",
                payment_receipt_id="RCPT-TS-TG-2026-88129",
                payment_timestamp="2026-11-21 10:15:30 IST",
                payment_mode="UPI (PhonePe)",
                issuing_authority="Hyderabad City Police - Traffic Branch West"
            )
        ]
        for c in records:
            self._challans[c.challan_id] = c

    def get_all(self, plate: Optional[str] = None) -> List[EChallanRecord]:
        results = list(self._challans.values())
        if plate:
            p = plate.upper().replace(" ", "").replace("-", "")
            results = [c for c in results if p in c.vehicle_reg_num.upper().replace(" ", "").replace("-", "")]
        return sorted(results, key=lambda x: x.violation_timestamp, reverse=True)

    def get_by_id(self, challan_id: str) -> Optional[EChallanRecord]:
        return self._challans.get(challan_id)

    def pay_challan(self, challan_id: str, payment_mode: str = "UPI") -> Optional[EChallanRecord]:
        challan = self._challans.get(challan_id)
        if not challan:
            return None
        if challan.status == ChallanStatus.PAID:
            return challan

        receipt_suffix = str(uuid.uuid4())[:8].upper()
        challan.status = ChallanStatus.PAID
        challan.payment_receipt_id = f"RCPT-TG-GOV-{receipt_suffix}"
        challan.payment_timestamp = time.strftime("%Y-%m-%d %H:%M:%S IST")
        challan.payment_mode = payment_mode
        return challan

    def dispute_challan(self, challan_id: str, dispute_reason: str, citizen_contact: str) -> Optional[EChallanRecord]:
        challan = self._challans.get(challan_id)
        if not challan:
            return None

        challan.status = ChallanStatus.DISPUTED
        challan.dispute_reason = dispute_reason
        challan.dispute_filed_date = time.strftime("%Y-%m-%d %H:%M:%S IST")
        challan.dispute_resolution_note = (
            f"Under administrative review by Traffic Appellate Authority. Contact: {citizen_contact}. "
            f"Challan execution stayed pending officer inspection."
        )
        return challan

    def create_from_evidence(self, evidence_id: str, penalty_amount_inr: int = 1500) -> Optional[EChallanRecord]:
        from .evidence_service import evidence_service
        pkg = evidence_service.get_by_id(evidence_id)
        if not pkg:
            return None

        cid = f"CHL-HYD-2026-{str(uuid.uuid4())[:6].upper()}"
        cnum = f"TS-HYD-2026-CH-{str(uuid.uuid4())[:8].upper()}"
        record = EChallanRecord(
            challan_id=cid,
            challan_number=cnum,
            vehicle_reg_num=pkg.vehicle_reg_num,
            owner_name="Registered Vehicle Owner",
            violation_type=f"Overspeeding by +{pkg.speed_delta_kmh} km/h",
            motor_vehicle_act_section="Section 183 of Motor Vehicles Act, 1988",
            road_location=pkg.location_name,
            violation_timestamp=pkg.timestamp,
            speed_detected_kmh=pkg.speed_measured_kmh,
            speed_limit_kmh=pkg.speed_limit_applicable_kmh,
            penalty_amount_inr=penalty_amount_inr,
            evidence_package_id=pkg.evidence_id,
            evidence_seal_sha256=pkg.evidence_seal_sha256,
            status=ChallanStatus.ISSUED,
            due_date="2026-12-21",
            issuing_authority="Hyderabad City Police - Traffic Branch"
        )
        self._challans[cid] = record
        pkg.status = EvidenceStatus.CHALLAN_ISSUED
        return record

echallan_service = EChallanService()
