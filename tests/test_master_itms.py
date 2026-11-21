"""
Comprehensive Unit Tests for RoadSense AI Master ITMS & Vehicle Intelligence Expansion.
Tests:
- Vehicle Registry & Document Compliance Badges
- GVID Device Telemetry & Anti-Tamper State
- Intelligent Overspeed Compliance & Tolerance Margins
- Evidence Package Cryptographic SHA-256 Sealing & Officer Review
- e-Challan Lifecycle (Issuance, Payment, Citizen Dispute)
- Public Transport Fleet Tracking & Delay Analysis
"""

import pytest
from backend.services.vehicle_registry_service import vehicle_registry_service
from backend.services.gvid_service import gvid_service
from backend.services.overspeed_engine import overspeed_engine
from backend.services.evidence_service import evidence_service
from backend.services.echallan_service import echallan_service
from backend.services.public_transport_service import public_transport_service
from backend.models.schemas import GVIDTelemetryPacket, GVIDTamperStatus, EvidenceStatus, ChallanStatus

def test_vehicle_registry_lookup_and_filter():
    all_veh = vehicle_registry_service.get_all()
    assert len(all_veh) >= 5

    # Look up by plate
    v = vehicle_registry_service.get_by_plate("TS 09 EV 4412")
    assert v is not None
    assert v.owner_name == "Devanboina Tharun"
    assert v.fuel_type == "EV"
    assert v.compliance_badge == "FULLY_COMPLIANT"

    # Search query
    filtered = vehicle_registry_service.get_all(query="Megha")
    assert len(filtered) == 1
    assert filtered[0].registration_number == "TS 07 TR 1022"

def test_gvid_device_and_telemetry_ingest():
    devices = gvid_service.get_all_devices()
    assert len(devices) >= 5

    dev = gvid_service.get_device("GVID-HYD-00109")
    assert dev is not None
    assert dev.vehicle_reg_num == "TS 09 EV 4412"
    assert dev.speed_sensor_uncertainty_kmh <= 1.0
    assert dev.tamper_status == GVIDTamperStatus.SECURE

    # Test telemetry ingestion
    packet = GVIDTelemetryPacket(
        device_id="GVID-HYD-00109",
        vehicle_reg_num="TS 09 EV 4412",
        timestamp="2026-11-21 23:55:00",
        gnss_latitude=17.4435,
        gnss_longitude=78.3772,
        gnss_speed_kmh=42.5,
        can_wheel_speed_kmh=42.0,
        fused_speed_kmh=42.2,
        heading_deg=90.0,
        road_segment_id="HYD-ROAD-101",
        odometer_km=14200.5,
        tamper_status=GVIDTamperStatus.SECURE
    )
    res = gvid_service.ingest_telemetry(packet)
    assert res["status"] == "ACCEPTED"
    assert res["fused_speed_kmh"] == 42.2

def test_overspeed_engine_tolerances():
    # 4W traveling at 48 km/h in 50 km/h zone -> Compliant
    res1 = overspeed_engine.evaluate_compliance(
        measured_speed_kmh=48.0,
        segment_id="HYD-ROAD-101",
        category="FOUR_WHEELER",
        sustained_seconds=4.0
    )
    assert not res1["is_overspeeding"]

    # 4W traveling at 51 km/h in 50 km/h zone -> Within 2 km/h sensor tolerance margin!
    res2 = overspeed_engine.evaluate_compliance(
        measured_speed_kmh=51.0,
        segment_id="HYD-ROAD-101",
        category="FOUR_WHEELER",
        sustained_seconds=4.0
    )
    assert not res2["is_overspeeding"]  # 51 - 2 = 49 <= 50 (protected by driver margin)

    # 4W traveling at 74 km/h in 50 km/h zone -> Overspeeding!
    res3 = overspeed_engine.evaluate_compliance(
        measured_speed_kmh=74.0,
        segment_id="HYD-ROAD-101",
        category="FOUR_WHEELER",
        sustained_seconds=4.0
    )
    assert res3["is_overspeeding"]
    assert res3["severity"] in ["HIGH_OVERSPEED", "CRITICAL_DANGEROUS_DRIVING"]

def test_evidence_package_and_officer_review():
    queue = evidence_service.get_queue()
    assert len(queue) >= 3

    target_id = queue[0].evidence_id
    pkg = evidence_service.get_by_id(target_id)
    assert pkg is not None
    assert pkg.evidence_seal_sha256 is not None
    assert len(pkg.evidence_seal_sha256) == 64  # SHA-256 length

    # Review evidence
    reviewed = evidence_service.review_evidence(
        evidence_id=target_id,
        decision="APPROVE",
        officer_id="OFF-TEST-01",
        officer_name="Officer Tested",
        notes="Verified ANPR plate clearly legible and calibration within validity."
    )
    assert reviewed is not None
    assert reviewed.status == EvidenceStatus.OFFICER_APPROVED
    assert reviewed.officer_id == "OFF-TEST-01"

def test_echallan_payment_and_dispute():
    all_ch = echallan_service.get_all()
    assert len(all_ch) >= 3

    # Find unpaid challan
    unpaid = next((c for c in all_ch if c.status == ChallanStatus.ISSUED), None)
    assert unpaid is not None

    cid = unpaid.challan_id
    # Simulate payment
    paid = echallan_service.pay_challan(cid, payment_mode="UPI (GPay)")
    assert paid is not None
    assert paid.status == ChallanStatus.PAID
    assert paid.payment_receipt_id.startswith("RCPT-TG-GOV-")

    # Simulate dispute on another challan
    another = next((c for c in all_ch if c.challan_id != cid), None)
    if another:
        disp = echallan_service.dispute_challan(
            another.challan_id,
            dispute_reason="Vehicle was in emergency convoy escort",
            citizen_contact="+91 99999 11111"
        )
        assert disp.status == ChallanStatus.DISPUTED
        assert "Appellate" in disp.dispute_resolution_note

def test_public_transit_service():
    buses = public_transport_service.get_all_buses()
    assert len(buses) >= 3
    routes = public_transport_service.get_all_routes()
    assert len(routes) >= 2

    bus = buses[0]
    assert bus.is_ev is True
    assert 0 <= bus.battery_soc_pct <= 100
    assert -10 <= bus.schedule_delay_minutes <= 30
