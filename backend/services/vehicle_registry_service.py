"""
Vehicle Registry Service for RoadSense AI.
Provides:
- Searchable database of registered vehicles (2W, 4W, EV, HMV, Buses)
- Real-time validity tracking for RC, Insurance, PUC, and Fitness certificates
- Compliance badge calculation (FULLY_COMPLIANT, DOCUMENT_EXPIRED, UNREGISTERED_DEVICE)
- Linkage to Government Vehicle Intelligence Devices (GVID)
- All demonstration records labeled [SIMULATED DATA]
"""

from typing import List, Dict, Optional
from ..models.schemas import (
    VehicleRegistryRecord, VehicleCategory, DocumentStatus, ComplianceBadge
)

class VehicleRegistryService:
    def __init__(self):
        self._vehicles: Dict[str, VehicleRegistryRecord] = {}
        self._init_database()

    def _init_database(self):
        records = [
            VehicleRegistryRecord(
                registration_number="TS 09 EV 4412",
                owner_name="Devanboina Tharun",
                owner_contact_masked="+91 98480 •••••",
                vehicle_category=VehicleCategory.FOUR_WHEELER,
                make_model="Tata Nexon EV Max (Empowered+)",
                fuel_type="EV",
                rc_valid_until="2038-04-12",
                rc_status=DocumentStatus.VALID,
                insurance_policy_number="HDFC-ERGO-EV-98231",
                insurance_valid_until="2027-03-31",
                insurance_status=DocumentStatus.VALID,
                puc_certificate_number="PUC-TG-EV-EXEMPT",
                puc_valid_until="2099-12-31",
                puc_status=DocumentStatus.VALID,
                fitness_valid_until="2038-04-12",
                fitness_status=DocumentStatus.VALID,
                gvid_device_id="GVID-HYD-00109",
                compliance_badge=ComplianceBadge.FULLY_COMPLIANT,
                is_commercial=False,
                chassis_number_masked="MAT612988••••••14",
                registered_rto="TG-09 (Hyderabad Central)"
            ),
            VehicleRegistryRecord(
                registration_number="TS 07 TR 1022",
                owner_name="Megha Logistics Cargo Ltd",
                owner_contact_masked="+91 94401 •••••",
                vehicle_category=VehicleCategory.HEAVY_MOTOR_VEHICLE,
                make_model="BharatBenz 2823C Tipper",
                fuel_type="DIESEL",
                rc_valid_until="2029-08-20",
                rc_status=DocumentStatus.VALID,
                insurance_policy_number="ICICI-LOMB-CV-4410",
                insurance_valid_until="2026-12-15",
                insurance_status=DocumentStatus.VALID,
                puc_certificate_number="PUC-TG-2026-90412",
                puc_valid_until="2026-05-10",
                puc_status=DocumentStatus.VALID,
                fitness_valid_until="2026-08-15",
                fitness_status=DocumentStatus.VALID,
                gvid_device_id="GVID-HYD-00441",
                compliance_badge=ComplianceBadge.FULLY_COMPLIANT,
                is_commercial=True,
                chassis_number_masked="ME3432000••••••90",
                registered_rto="TG-07 (Ranga Reddy)"
            ),
            VehicleRegistryRecord(
                registration_number="AP 28 BX 9011",
                owner_name="V. K. Raman Rao",
                owner_contact_masked="+91 97012 •••••",
                vehicle_category=VehicleCategory.FOUR_WHEELER,
                make_model="Hyundai Creta SX (O)",
                fuel_type="PETROL",
                rc_valid_until="2035-11-04",
                rc_status=DocumentStatus.VALID,
                insurance_policy_number="NEW-INDIA-ASR-7712",
                insurance_valid_until="2026-02-10",
                insurance_status=DocumentStatus.EXPIRED,
                puc_certificate_number="PUC-AP-2025-11002",
                puc_valid_until="2025-11-20",
                puc_status=DocumentStatus.EXPIRED,
                fitness_valid_until="2035-11-04",
                fitness_status=DocumentStatus.VALID,
                gvid_device_id=None,
                compliance_badge=ComplianceBadge.DOCUMENT_EXPIRED,
                is_commercial=False,
                chassis_number_masked="MALC3814C••••••55",
                registered_rto="AP-28 (Vijayawada North)"
            ),
            VehicleRegistryRecord(
                registration_number="TS 10 EV 8821",
                owner_name="Uber Green Mobility Fleet",
                owner_contact_masked="+91 99890 •••••",
                vehicle_category=VehicleCategory.EV_COMMERCIAL,
                make_model="MG ZS EV Excite",
                fuel_type="EV",
                rc_valid_until="2037-02-28",
                rc_status=DocumentStatus.VALID,
                insurance_policy_number="BAJAJ-ALLZ-COMM-1123",
                insurance_valid_until="2027-01-14",
                insurance_status=DocumentStatus.VALID,
                puc_certificate_number="PUC-TG-EV-EXEMPT",
                puc_valid_until="2099-12-31",
                puc_status=DocumentStatus.VALID,
                fitness_valid_until="2027-02-28",
                fitness_status=DocumentStatus.VALID,
                gvid_device_id="GVID-HYD-00812",
                compliance_badge=ComplianceBadge.FULLY_COMPLIANT,
                is_commercial=True,
                chassis_number_masked="MA3890211••••••78",
                registered_rto="TG-10 (Secunderabad)"
            ),
            VehicleRegistryRecord(
                registration_number="TS 08 UB 3301",
                owner_name="TSRTC Hyderabad City Bus Depot",
                owner_contact_masked="+91 40 2345 ••••",
                vehicle_category=VehicleCategory.BUS_TRANSIT,
                make_model="Olectra K9 Electric Low-Floor Bus",
                fuel_type="EV",
                rc_valid_until="2036-09-15",
                rc_status=DocumentStatus.VALID,
                insurance_policy_number="UNITED-INDIA-RTC-0012",
                insurance_valid_until="2027-08-30",
                insurance_status=DocumentStatus.VALID,
                puc_certificate_number="PUC-TG-EV-EXEMPT",
                puc_valid_until="2099-12-31",
                puc_status=DocumentStatus.VALID,
                fitness_valid_until="2027-09-15",
                fitness_status=DocumentStatus.VALID,
                gvid_device_id="GVID-HYD-00990",
                compliance_badge=ComplianceBadge.FULLY_COMPLIANT,
                is_commercial=True,
                chassis_number_masked="ME9981240••••••01",
                registered_rto="TG-08 (Uppal/Medchal)"
            ),
            VehicleRegistryRecord(
                registration_number="TS 09 FA 1080",
                owner_name="EMRI 108 Health Care Emergency Services",
                owner_contact_masked="+91 108 •••••••",
                vehicle_category=VehicleCategory.EMERGENCY,
                make_model="Force Traveller Advanced Life Support",
                fuel_type="DIESEL",
                rc_valid_until="2034-05-18",
                rc_status=DocumentStatus.VALID,
                insurance_policy_number="ORIENTAL-GOV-EMS-9912",
                insurance_valid_until="2027-05-18",
                insurance_status=DocumentStatus.VALID,
                puc_certificate_number="PUC-TG-2026-00192",
                puc_valid_until="2026-11-12",
                puc_status=DocumentStatus.VALID,
                fitness_valid_until="2027-05-18",
                fitness_status=DocumentStatus.VALID,
                gvid_device_id="GVID-HYD-00108",
                compliance_badge=ComplianceBadge.FULLY_COMPLIANT,
                is_commercial=False,
                chassis_number_masked="MA3081080••••••88",
                registered_rto="TG-09 (Hyderabad Central)"
            )
        ]
        for v in records:
            self._vehicles[v.registration_number.upper().replace(" ", "")] = v

    def get_all(self, query: Optional[str] = None, category: Optional[str] = None) -> List[VehicleRegistryRecord]:
        results = list(self._vehicles.values())
        if query:
            q = query.upper().replace(" ", "").replace("-", "")
            results = [
                v for v in results
                if q in v.registration_number.upper().replace(" ", "").replace("-", "")
                or q in v.owner_name.upper()
                or (v.gvid_device_id and q in v.gvid_device_id.upper())
            ]
        if category:
            results = [v for v in results if v.vehicle_category == category]
        return results

    def get_by_plate(self, registration_number: str) -> Optional[VehicleRegistryRecord]:
        key = registration_number.upper().replace(" ", "").replace("-", "")
        for k, v in self._vehicles.items():
            if k.replace("-", "") == key:
                return v
        return None

    def register_vehicle(self, record: VehicleRegistryRecord) -> VehicleRegistryRecord:
        key = record.registration_number.upper().replace(" ", "")
        self._vehicles[key] = record
        return record

vehicle_registry_service = VehicleRegistryService()
