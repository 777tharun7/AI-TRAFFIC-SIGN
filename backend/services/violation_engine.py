"""
Multi-Violation Traffic Enforcement, Prevention & Traffic Management Engine.
Implements the 15 Statutory Enforcement & Safety Scenarios:
1. Red-Light Violation (Flagship with signal controller phase synchronization)
2. Stop-Line Violation (Calibrated stop-line geometry crossing)
3. Pedestrian Crossing Obstruction (Blocking zebra crossings)
4. Wrong-Side / Wrong-Way Driving (Direction vector conflict)
5. Overspeeding (Segment limit & GVID calibration tolerance)
6. No Helmet (Rider and pillion rider headgear compliance)
7. No Seatbelt (Front occupant non-compliance)
8. Handheld Mobile Phone Use while driving
9. Illegal Parking and Stopping (Dwell time & no-parking zones)
10. Wrong-Lane / Restricted-Lane Driving (Bus lanes / restricted lanes)
11. Failure to Give Way to Emergency Vehicles (Ambulance / Fire service)
12. Overloaded Goods Vehicles (Weigh-in-motion calibration)
13. Illegal or Dangerous Overtaking (Prohibited zone overtaking)
14. Restricted-Entry Violations (No-entry / time-restricted zones)
15. Junction Blocking & Gridlock (Intersection obstruction without space to clear)

Separates operational categories into:
- Category 1: Prevention (Speed limit warnings, approaching red signal, restricted zone alerts)
- Category 2: Traffic Management (Junction blockage, congestion, stalled vehicles)
- Category 3: Enforcement (Validated violations awaiting human officer review)
"""

import time
import hashlib
import json
from typing import List, Dict, Optional, Any
from ..models.schemas import (
    ViolationEvidencePackage, ViolationCategory, OperationalCategory,
    LegalClearanceStatus, EvidenceStatus, OfficerDecisionAction,
    SignalControllerEvidence, EvidenceFrameSequence, LegalRuleMapping,
    VehicleCategory, InfrastructureRecommendation
)

class ViolationEngine:
    def __init__(self):
        self._cases: Dict[str, ViolationEvidencePackage] = {}
        self._recommendations: List[InfrastructureRecommendation] = []
        self._init_15_enforcement_cases()
        self._init_infrastructure_recommendations()

    def _hash_seal(self, payload: Dict[str, Any]) -> str:
        s = json.dumps(payload, sort_keys=True).encode("utf-8")
        return hashlib.sha256(s).hexdigest()

    def _init_15_enforcement_cases(self):
        # 1. FLAGSHIP: RED LIGHT VIOLATION (Tharun Demo Persona)
        red_light_tharun = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0001",
            vehicle_reg_num="TS 09 EV 4412",
            vehicle_category=VehicleCategory.FOUR_WHEELER,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.RED_LIGHT_VIOLATION,
            violation_title="Red-Light Violation at Controlled Intersection",
            gvid_device_id="GVID-HYD-00109",
            camera_id="CAM-CYBER-04-PTZ-NORTH",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0812",
            road_segment_id="HYD-ROAD-101",
            location_name="Cyber Towers Junction (Approach North)",
            latitude=17.4502,
            longitude=78.3808,
            timestamp="2026-11-22 00:15:22 IST",
            speed_measured_kmh=38.4,
            speed_limit_applicable_kmh=40.0,
            speed_uncertainty_kmh=0.8,
            speed_delta_kmh=-1.6,
            sustained_duration_seconds=2.1,
            anpr_confidence_pct=98.6,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_4412.jpg",
            signal_evidence=SignalControllerEvidence(
                junction_id="JNC-CYBER-01",
                junction_name="Cyber Towers Junction (Approach North)",
                signal_id="SIG-CYBER-N1",
                approach_lane="Lane 2 (Straight / Right-turn)",
                green_start_time="00:13:50 IST",
                yellow_start_time="00:15:16 IST",
                red_start_time="00:15:20 IST",
                vehicle_stopline_cross_time="00:15:21.8 IST",
                seconds_into_red=1.8,  # Crossed 1.8 seconds AFTER red initiated
                amber_duration_seconds=4.0,
                stop_line_distance_m=2.4,
                controller_status="SYNCHRONIZED_NORMAL",
                clearance_status=LegalClearanceStatus.CLEAR_VIOLATION
            ),
            frame_sequence=EvidenceFrameSequence(
                frame_approach_url="/data/evidence/frames/cyber_approach.jpg",
                frame_approach_label="Frame 1 (T-1.2s): Approaching stop line as amber ends and red phase begins",
                frame_crossing_url="/data/evidence/frames/cyber_crossing.jpg",
                frame_crossing_label="Frame 2 (T+0.0s): Vehicle crosses marked stop line at +1.8s into active red",
                frame_junction_url="/data/evidence/frames/cyber_junction.jpg",
                frame_junction_label="Frame 3 (T+1.4s): Traversal into junction conflicting with cross-traffic phase",
                frame_anpr_plate_url="/data/evidence/frames/plate_crop_4412.jpg",
                plate_confidence_pct=98.6,
                image_quality="OPTIMAL_HIGH_RES"
            ),
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 184 / Section 119",
                offence_title="Disobedience of Mandatory Red Traffic Signal",
                statutory_penalty_inr=1000,
                subsequent_offence_penalty_inr=2000,
                points_deduction=2,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="4d7a8e2b0c9f1a3e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a",
            evidence_seal_sha256="e1a4b8c9d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Flagged for officer review. Crossed stop line 1.8s after red. Not in emergency convoy."
        )
        self._cases[red_light_tharun.evidence_id] = red_light_tharun

        # 2. LEGAL CLEARANCE COMPARISON CASE (Entered on Green, cleared on Red -> NOT A VIOLATION)
        legal_clearance_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0002",
            vehicle_reg_num="AP 28 BX 9011",
            vehicle_category=VehicleCategory.FOUR_WHEELER,
            operational_category=OperationalCategory.TRAFFIC_MANAGEMENT,
            violation_category=ViolationCategory.RED_LIGHT_VIOLATION,
            violation_title="Intersection Traversal During Signal Transition (Legal Clearance)",
            gvid_device_id=None,
            camera_id="CAM-MINDSPACE-02",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0720",
            road_segment_id="HYD-ROAD-102",
            location_name="Mindspace Roundabout Signal",
            latitude=17.4450,
            longitude=78.3818,
            timestamp="2026-11-21 23:40:02 IST",
            speed_measured_kmh=24.0,
            speed_limit_applicable_kmh=40.0,
            speed_uncertainty_kmh=1.0,
            speed_delta_kmh=-16.0,
            sustained_duration_seconds=3.2,
            anpr_confidence_pct=96.2,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_9011.jpg",
            signal_evidence=SignalControllerEvidence(
                junction_id="JNC-MINDSPACE-01",
                junction_name="Mindspace Roundabout Signal",
                signal_id="SIG-MIND-S2",
                approach_lane="Lane 1 (Through)",
                green_start_time="23:38:00 IST",
                yellow_start_time="23:39:55 IST",
                red_start_time="23:40:00 IST",
                vehicle_stopline_cross_time="23:39:57.2 IST",  # Crossed DURING YELLOW, inside on red
                seconds_into_red=-2.8,  # Crossed 2.8s BEFORE red
                amber_duration_seconds=5.0,
                stop_line_distance_m=12.0,
                controller_status="SYNCHRONIZED_NORMAL",
                clearance_status=LegalClearanceStatus.LEGAL_CLEARANCE_GREEN_ENTRY
            ),
            frame_sequence=EvidenceFrameSequence(
                frame_approach_url="/data/evidence/frames/mindspace_approach.jpg",
                frame_approach_label="Frame 1: Vehicle entered intersection legally on green/yellow",
                frame_crossing_url="/data/evidence/frames/mindspace_crossing.jpg",
                frame_crossing_label="Frame 2: Crossed stop line before red started (-2.8s)",
                frame_junction_url="/data/evidence/frames/mindspace_junction.jpg",
                frame_junction_label="Frame 3: Clearing intersection during phase transition",
                frame_anpr_plate_url="/data/evidence/frames/plate_crop_9011.jpg",
                plate_confidence_pct=96.2,
                image_quality="ACCEPTABLE"
            ),
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Driving Regulations, 2017",
                section_code="Rule 22(1) / Section 177",
                offence_title="Legal Intersection Clearance Exception",
                statutory_penalty_inr=0,
                subsequent_offence_penalty_inr=0,
                points_deduction=0,
                requires_human_verification=True,
                section_167a_admissible=False,
                legal_defense_exemptions=["Vehicle had already crossed stop line before red onset"]
            ),
            clearance_status=LegalClearanceStatus.LEGAL_CLEARANCE_GREEN_ENTRY,
            telemetry_hash_sha256="8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e",
            evidence_seal_sha256="b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6",
            status=EvidenceStatus.OFFICER_DISMISSED,
            officer_id="OFF-TG-4402",
            officer_name="Insp. K. Sridhar (Traffic West)",
            officer_notes="Dismissed: Vehicle crossed stop line on amber. Safe clearance confirmed under Rule 22."
        )
        self._cases[legal_clearance_case.evidence_id] = legal_clearance_case

        # 3. STOP LINE VIOLATION (Stopped Over Stop Line but didn't jump junction)
        stop_line_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0003",
            vehicle_reg_num="TS 08 UB 3301",
            vehicle_category=VehicleCategory.BUS_TRANSIT,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.STOP_LINE_VIOLATION,
            violation_title="Crossing Marked Stop Line at Red Signal",
            gvid_device_id="GVID-HYD-00990",
            camera_id="CAM-GACHIBOWLI-01",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0610",
            road_segment_id="HYD-ROAD-103",
            location_name="Gachibowli Stadium Junction",
            latitude=17.4265,
            longitude=78.3625,
            timestamp="2026-11-21 23:22:10 IST",
            speed_measured_kmh=0.0,
            speed_limit_applicable_kmh=40.0,
            speed_uncertainty_kmh=0.5,
            speed_delta_kmh=-40.0,
            sustained_duration_seconds=18.0,
            anpr_confidence_pct=97.4,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_3301.jpg",
            signal_evidence=SignalControllerEvidence(
                junction_id="JNC-GACHI-01",
                junction_name="Gachibowli Stadium Junction",
                signal_id="SIG-GACHI-W1",
                approach_lane="Lane 3 (Bus/Transit)",
                green_start_time="23:20:00 IST",
                yellow_start_time="23:21:40 IST",
                red_start_time="23:21:45 IST",
                vehicle_stopline_cross_time="23:21:47 IST",
                seconds_into_red=2.0,
                amber_duration_seconds=5.0,
                stop_line_distance_m=1.8,  # Front wheels 1.8m past line
                controller_status="SYNCHRONIZED_NORMAL",
                clearance_status=LegalClearanceStatus.STOPPED_OVER_LINE_ONLY
            ),
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles (Driving) Regulations, 2017",
                section_code="Rule 22(2) read with Section 177",
                offence_title="Failure to Stop Behind Stop Line at Red Light",
                statutory_penalty_inr=500,
                subsequent_offence_penalty_inr=1000,
                points_deduction=1,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.STOPPED_OVER_LINE_ONLY,
            telemetry_hash_sha256="1a3e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f",
            evidence_seal_sha256="c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Vehicle halted 1.8m over stop line during red. Did not traverse into cross traffic."
        )
        self._cases[stop_line_case.evidence_id] = stop_line_case

        # 4. PEDESTRIAN CROSSING OBSTRUCTION
        zebra_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0004",
            vehicle_reg_num="TS 10 EV 8821",
            vehicle_category=VehicleCategory.EV_COMMERCIAL,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.PEDESTRIAN_CROSSING_OBSTRUCTION,
            violation_title="Encroachment of Pedestrian Zebra Crossing",
            gvid_device_id="GVID-HYD-00812",
            camera_id="CAM-INORBIT-03",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0518",
            road_segment_id="HYD-ROAD-102",
            location_name="Inorbit Mall Pedestrian Crossing",
            latitude=17.4380,
            longitude=78.3780,
            timestamp="2026-11-21 23:18:40 IST",
            speed_measured_kmh=0.0,
            speed_limit_applicable_kmh=30.0,
            speed_uncertainty_kmh=0.5,
            speed_delta_kmh=-30.0,
            sustained_duration_seconds=32.0,
            anpr_confidence_pct=95.8,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_8821.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles (Driving) Regulations, 2017",
                section_code="Rule 11 / Section 177",
                offence_title="Obstruction of Pedestrian Crossing / Right of Way",
                statutory_penalty_inr=500,
                subsequent_offence_penalty_inr=1000,
                points_deduction=1,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.PEDESTRIAN_BLOCKED,
            telemetry_hash_sha256="7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b",
            evidence_seal_sha256="f6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Vehicle stationary across entire width of pedestrian zebra crossing for 32 seconds."
        )
        self._cases[zebra_case.evidence_id] = zebra_case

        # 5. WRONG-SIDE / WRONG-WAY DRIVING
        wrong_way_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0005",
            vehicle_reg_num="TS 07 TR 1022",
            vehicle_category=VehicleCategory.HEAVY_MOTOR_VEHICLE,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.WRONG_SIDE_DRIVING,
            violation_title="Dangerous Driving Against Authorised Direction",
            gvid_device_id="GVID-HYD-00441",
            camera_id="CAM-ORR-RAMP-01",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0912",
            road_segment_id="HYD-ORR-EXPRESSWAY",
            location_name="Nanakramguda ORR Exit Ramp",
            latitude=17.4200,
            longitude=78.3520,
            timestamp="2026-11-21 23:05:12 IST",
            speed_measured_kmh=36.0,
            speed_limit_applicable_kmh=40.0,
            speed_uncertainty_kmh=1.2,
            speed_delta_kmh=-4.0,
            sustained_duration_seconds=14.5,
            anpr_confidence_pct=98.1,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_1022.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 184 (Dangerous Driving)",
                offence_title="Driving Against Authorized One-Way Flow / Dangerous Driving",
                statutory_penalty_inr=5000,
                subsequent_offence_penalty_inr=10000,
                points_deduction=4,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e4f3a",
            evidence_seal_sha256="d2e4f6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0",
            status=EvidenceStatus.ESCALATED_INVESTIGATION,
            officer_notes="Heavy tipper travelling North on a designated Southbound exit ramp. Severe collision risk."
        )
        self._cases[wrong_way_case.evidence_id] = wrong_way_case

        # 6. OVERSPEEDING (GVID + Road Segment Engine)
        overspeed_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0006",
            vehicle_reg_num="TS 09 EV 4412",
            vehicle_category=VehicleCategory.FOUR_WHEELER,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.OVERSPEEDING,
            violation_title="Sustained Excessive Speed Over Notified Limit",
            gvid_device_id="GVID-HYD-00109",
            camera_id="CAM-FLYOVER-02",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0812",
            road_segment_id="HYD-ROAD-101",
            location_name="Cyber Towers Flyover Mid-Span",
            latitude=17.4510,
            longitude=78.3820,
            timestamp="2026-11-21 22:50:08 IST",
            speed_measured_kmh=74.5,
            speed_limit_applicable_kmh=50.0,
            speed_uncertainty_kmh=1.5,
            speed_delta_kmh=24.5,
            sustained_duration_seconds=4.8,
            anpr_confidence_pct=98.8,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_4412.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 183(1)",
                offence_title="Exceeding Prescribed Speed Limit (Light Motor Vehicle)",
                statutory_penalty_inr=1500,
                subsequent_offence_penalty_inr=2000,
                points_deduction=2,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="3e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a",
            evidence_seal_sha256="4d7a8e2b0c9f1a3e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a",
            status=EvidenceStatus.EVIDENCE_VERIFIED,
            officer_id="OFF-TG-4402",
            officer_name="Insp. K. Sridhar (Traffic West)",
            officer_notes="Evidence verified against GVID CAN wheel speed. Sustained 74.5 km/h in 50 km/h zone."
        )
        self._cases[overspeed_case.evidence_id] = overspeed_case

        # 7. NO HELMET VIOLATION (Motorcycle)
        helmet_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0007",
            vehicle_reg_num="TS 09 BC 2210",
            vehicle_category=VehicleCategory.TWO_WHEELER,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.NO_HELMET,
            violation_title="Failure to Wear Protective Headgear (Rider & Pillion)",
            gvid_device_id=None,
            camera_id="CAM-JUBILEE-01",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0412",
            road_segment_id="HYD-ROAD-104",
            location_name="Jubilee Hills Check Post",
            latitude=17.4300,
            longitude=78.4100,
            timestamp="2026-11-21 22:42:15 IST",
            speed_measured_kmh=41.0,
            speed_limit_applicable_kmh=50.0,
            speed_uncertainty_kmh=2.0,
            speed_delta_kmh=-9.0,
            sustained_duration_seconds=3.0,
            anpr_confidence_pct=96.5,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_2210.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 129 / Section 194D",
                offence_title="Riding Without Protective Headgear (Helmet)",
                statutory_penalty_inr=1000,
                subsequent_offence_penalty_inr=1000,
                points_deduction=1,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c",
            evidence_seal_sha256="a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4f6",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="AI headgear detection indicates rider non-compliance (confidence 94.2%). Pillion wearing turban (exempt)."
        )
        self._cases[helmet_case.evidence_id] = helmet_case

        # 8. NO SEATBELT VIOLATION
        seatbelt_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0008",
            vehicle_reg_num="AP 28 BX 9011",
            vehicle_category=VehicleCategory.FOUR_WHEELER,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.NO_SEATBELT,
            violation_title="Failure to Wear Safety Belt while Driving",
            gvid_device_id=None,
            camera_id="CAM-HIGHTECH-05",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0618",
            road_segment_id="HYD-ROAD-101",
            location_name="Hitec City Station Underpass",
            latitude=17.4480,
            longitude=78.3790,
            timestamp="2026-11-21 22:30:44 IST",
            speed_measured_kmh=35.0,
            speed_limit_applicable_kmh=50.0,
            speed_uncertainty_kmh=1.5,
            speed_delta_kmh=-15.0,
            sustained_duration_seconds=2.5,
            anpr_confidence_pct=94.1,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_9011.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 194B",
                offence_title="Failure to Secure Safety Belt (Driver / Front Occupant)",
                statutory_penalty_inr=1000,
                subsequent_offence_penalty_inr=1000,
                points_deduction=1,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d",
            evidence_seal_sha256="0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4f6a8b",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Driver diagonal chest strap missing under daylight cabin camera. Passenger belt fastened."
        )
        self._cases[seatbelt_case.evidence_id] = seatbelt_case

        # 9. HANDHELD MOBILE PHONE USE
        phone_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0009",
            vehicle_reg_num="TS 10 EV 8821",
            vehicle_category=VehicleCategory.EV_COMMERCIAL,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.MOBILE_PHONE_USE,
            violation_title="Handheld Device Usage while Operating Vehicle",
            gvid_device_id="GVID-HYD-00812",
            camera_id="CAM-CYBER-02",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0812",
            road_segment_id="HYD-ROAD-101",
            location_name="Cyber Gateway Entry",
            latitude=17.4465,
            longitude=78.3795,
            timestamp="2026-11-21 22:15:30 IST",
            speed_measured_kmh=42.0,
            speed_limit_applicable_kmh=50.0,
            speed_uncertainty_kmh=1.0,
            speed_delta_kmh=-8.0,
            sustained_duration_seconds=5.2,
            anpr_confidence_pct=97.0,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_8821.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 184(c)",
                offence_title="Use of Handheld Communication Device while Driving",
                statutory_penalty_inr=1500,
                subsequent_offence_penalty_inr=5000,
                points_deduction=3,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e",
            evidence_seal_sha256="c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4f6a8b0",
            status=EvidenceStatus.MORE_EVIDENCE_REQUESTED,
            officer_notes="Hand position near ear detected. Officer requested 3-frame sequence to confirm handheld device vs hands-free touch."
        )
        self._cases[phone_case.evidence_id] = phone_case

        # 10. ILLEGAL PARKING & STOPPING
        parking_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0010",
            vehicle_reg_num="TS 09 FA 1080",
            vehicle_category=VehicleCategory.EMERGENCY,
            operational_category=OperationalCategory.TRAFFIC_MANAGEMENT,
            violation_category=ViolationCategory.ILLEGAL_PARKING,
            violation_title="Vehicle Stationary in Designated No-Parking Corridor",
            gvid_device_id="GVID-HYD-00108",
            camera_id="CAM-CARE-HOSP-01",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0310",
            road_segment_id="HYD-ROAD-102",
            location_name="Care Hospital Emergency Access Bay",
            latitude=17.4420,
            longitude=78.3810,
            timestamp="2026-11-21 21:55:00 IST",
            speed_measured_kmh=0.0,
            speed_limit_applicable_kmh=30.0,
            speed_uncertainty_kmh=0.5,
            speed_delta_kmh=-30.0,
            sustained_duration_seconds=180.0,
            anpr_confidence_pct=99.2,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_1080.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 122 read with Section 177",
                offence_title="Leaving Vehicle in Dangerous Position / No-Parking Zone",
                statutory_penalty_inr=500,
                subsequent_offence_penalty_inr=1500,
                points_deduction=0,
                requires_human_verification=True,
                section_167a_admissible=True,
                legal_defense_exemptions=["Authorized Emergency Ambulance on active patient transfer"]
            ),
            clearance_status=LegalClearanceStatus.EMERGENCY_EXEMPTION,
            telemetry_hash_sha256="3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e4f",
            evidence_seal_sha256="2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4f6a8b0c",
            status=EvidenceStatus.OFFICER_DISMISSED,
            officer_id="OFF-TG-4402",
            officer_name="Insp. K. Sridhar (Traffic West)",
            officer_notes="Dismissed with exemption: 108 Emergency Ambulance actively receiving trauma patient."
        )
        self._cases[parking_case.evidence_id] = parking_case

        # 11. WRONG LANE / RESTRICTED BUS LANE
        bus_lane_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0011",
            vehicle_reg_num="AP 28 BX 9011",
            vehicle_category=VehicleCategory.FOUR_WHEELER,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.WRONG_LANE_DRIVING,
            violation_title="Unauthorised Operation in Dedicated Bus Priority Lane",
            gvid_device_id=None,
            camera_id="CAM-BRTS-01",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0720",
            road_segment_id="HYD-ROAD-101",
            location_name="Hitec BRTS Dedicated Corridor Lane",
            latitude=17.4495,
            longitude=78.3805,
            timestamp="2026-11-21 21:40:18 IST",
            speed_measured_kmh=44.0,
            speed_limit_applicable_kmh=50.0,
            speed_uncertainty_kmh=1.0,
            speed_delta_kmh=-6.0,
            sustained_duration_seconds=8.4,
            anpr_confidence_pct=97.3,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_9011.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles (Driving) Regulations, 2017",
                section_code="Rule 11(2) read with Section 177",
                offence_title="Violation of Designated Lane Discipline (Bus Lane Encroachment)",
                statutory_penalty_inr=500,
                subsequent_offence_penalty_inr=1500,
                points_deduction=1,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e4f3a",
            evidence_seal_sha256="e4f6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Private car operating inside marked yellow-bordered Bus Priority Corridor during peak transit hours."
        )
        self._cases[bus_lane_case.evidence_id] = bus_lane_case

        # 12. FAILURE TO GIVE WAY TO EMERGENCY VEHICLE
        ems_block_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0012",
            vehicle_reg_num="TS 07 TR 1022",
            vehicle_category=VehicleCategory.HEAVY_MOTOR_VEHICLE,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.EMERGENCY_VEHICLE_OBSTRUCTION,
            violation_title="Failure to Yield to Approaching Emergency Ambulance",
            gvid_device_id="GVID-HYD-00441",
            camera_id="CAM-FLYOVER-03",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0912",
            road_segment_id="HYD-ROAD-101",
            location_name="Cyber Towers Flyover Down-Ramp",
            latitude=17.4520,
            longitude=78.3835,
            timestamp="2026-11-21 21:20:42 IST",
            speed_measured_kmh=22.0,
            speed_limit_applicable_kmh=40.0,
            speed_uncertainty_kmh=1.0,
            speed_delta_kmh=-18.0,
            sustained_duration_seconds=12.0,
            anpr_confidence_pct=98.5,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_1022.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 194E",
                offence_title="Failure to Allow Free Passage to Emergency Vehicles",
                statutory_penalty_inr=10000,
                subsequent_offence_penalty_inr=10000,
                points_deduction=4,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e4f3a2b",
            evidence_seal_sha256="4f6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e",
            status=EvidenceStatus.ESCALATED_INVESTIGATION,
            officer_notes="Heavy tipper failed to draw to the curb despite 108 ambulance sirens and emergency V2X beacon broadcasting."
        )
        self._cases[ems_block_case.evidence_id] = ems_block_case

        # 13. OVERLOADED GOODS VEHICLE (Weigh-in-Motion)
        wim_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0013",
            vehicle_reg_num="TS 07 TR 1022",
            vehicle_category=VehicleCategory.HEAVY_MOTOR_VEHICLE,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.OVERLOADED_GOODS_VEHICLE,
            violation_title="Gross Vehicle Weight Exceeding Permitted Axle Limit",
            gvid_device_id="GVID-HYD-00441",
            camera_id="WIM-ORR-SENSOR-02",
            camera_calibration_cert="CERT-WIM-METROLOGY-2025-1102",
            road_segment_id="HYD-ORR-EXPRESSWAY",
            location_name="ORR Weigh-in-Motion Gate 3",
            latitude=17.4180,
            longitude=78.3490,
            timestamp="2026-11-21 20:45:10 IST",
            speed_measured_kmh=42.0,
            speed_limit_applicable_kmh=70.0,
            speed_uncertainty_kmh=1.0,
            speed_delta_kmh=-28.0,
            sustained_duration_seconds=1.2,
            anpr_confidence_pct=98.9,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_1022.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 194",
                offence_title="Driving Overloaded Vehicle (Axle Weight Violation)",
                statutory_penalty_inr=20000,
                subsequent_offence_penalty_inr=20000,
                points_deduction=3,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e4f3a2b1c",
            evidence_seal_sha256="6a8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4f",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Weigh-in-motion measured 34.2 tonnes against registered GVW limit of 28.0 tonnes (+6.2 tonnes excess)."
        )
        self._cases[wim_case.evidence_id] = wim_case

        # 14. RESTRICTED ENTRY VIOLATION
        restricted_entry_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0014",
            vehicle_reg_num="TS 07 TR 1022",
            vehicle_category=VehicleCategory.HEAVY_MOTOR_VEHICLE,
            operational_category=OperationalCategory.ENFORCEMENT,
            violation_category=ViolationCategory.RESTRICTED_ENTRY_VIOLATION,
            violation_title="Operation of Heavy Vehicle in Peak-Hour Prohibited Zone",
            gvid_device_id="GVID-HYD-00441",
            camera_id="CAM-CORD-RESTRICT-01",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0812",
            road_segment_id="HYD-ROAD-101",
            location_name="Hitec City IT Corridor Main Spine",
            latitude=17.4470,
            longitude=78.3798,
            timestamp="2026-11-21 19:30:15 IST",
            speed_measured_kmh=28.0,
            speed_limit_applicable_kmh=40.0,
            speed_uncertainty_kmh=1.0,
            speed_delta_kmh=-12.0,
            sustained_duration_seconds=45.0,
            anpr_confidence_pct=98.0,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_1022.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles Act, 1988 (Amended 2019)",
                section_code="Section 115 / Section 194C",
                offence_title="Disobedience of Road Restriction / Time-Prohibited Entry",
                statutory_penalty_inr=2000,
                subsequent_offence_penalty_inr=5000,
                points_deduction=2,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e4f3a2b1c0d",
            evidence_seal_sha256="8b0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4f6a",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Heavy transport vehicle entered notified IT corridor during prohibited 08:00-11:00 / 17:00-22:00 window."
        )
        self._cases[restricted_entry_case.evidence_id] = restricted_entry_case

        # 15. JUNCTION BLOCKING & GRIDLOCK (Traffic Management Focus)
        gridlock_case = ViolationEvidencePackage(
            evidence_id="EVD-2026-HYD-0015",
            vehicle_reg_num="AP 28 BX 9011",
            vehicle_category=VehicleCategory.FOUR_WHEELER,
            operational_category=OperationalCategory.TRAFFIC_MANAGEMENT,
            violation_category=ViolationCategory.JUNCTION_BLOCKING_GRIDLOCK,
            violation_title="Entering Yellow Box Junction Without Clear Exit Path",
            gvid_device_id=None,
            camera_id="CAM-BOX-JUNCT-01",
            camera_calibration_cert="CERT-AIS140-CAM-2025-0720",
            road_segment_id="HYD-ROAD-102",
            location_name="Bio-Diversity Yellow Box Junction",
            latitude=17.4325,
            longitude=78.3712,
            timestamp="2026-11-21 18:45:22 IST",
            speed_measured_kmh=0.0,
            speed_limit_applicable_kmh=30.0,
            speed_uncertainty_kmh=0.5,
            speed_delta_kmh=-30.0,
            sustained_duration_seconds=65.0,
            anpr_confidence_pct=95.1,
            anpr_plate_snapshot_url="/data/evidence/frames/plate_crop_9011.jpg",
            legal_rule=LegalRuleMapping(
                act_name="Motor Vehicles (Driving) Regulations, 2017",
                section_code="Rule 11(3) read with Section 177",
                offence_title="Blocking Intersection / Entering Yellow Box Junction Without Clearance",
                statutory_penalty_inr=500,
                subsequent_offence_penalty_inr=1500,
                points_deduction=1,
                requires_human_verification=True,
                section_167a_admissible=True
            ),
            clearance_status=LegalClearanceStatus.CLEAR_VIOLATION,
            telemetry_hash_sha256="8f7a6b5c4d3e2f1a0b9c8d7e6f5a4d7a8e2b0c9f1a3e8b7c6d5e4f3a2b1c0d9e",
            evidence_seal_sha256="0c2d4e6f8a0b2c4d6e8f4d7a8e2b0c9f1a3e1a4b8c9d0e2f4a6b8c0d2e4f6a8b",
            status=EvidenceStatus.PENDING_REVIEW,
            officer_notes="Traffic Management advisory: Vehicle stranded inside yellow box junction for 65s during peak evening surge."
        )
        self._cases[gridlock_case.evidence_id] = gridlock_case

    def _init_infrastructure_recommendations(self):
        self._recommendations = [
            InfrastructureRecommendation(
                recommendation_id="REC-2026-CYBER-01",
                junction_id="JNC-CYBER-01",
                junction_name="Cyber Towers Junction (Approach North)",
                corridor_id="COR-01",
                violation_pattern="High concentration of Stop-Line & Red-Light violations during evening peak (17:30 - 20:30)",
                historical_count_30d=142,
                root_cause_analysis=(
                    "Current amber phase duration of 4.0 seconds is insufficient for downhill 3.2% approach gradient. "
                    "Drivers traveling at legal 40 km/h design speed cannot safely stop without hard braking, leading to stop-line overshoot."
                ),
                action_type="SIGNAL_RETIMING",
                recommended_intervention="Extend amber clearance interval from 4.0s to 5.5s; advance all-red clearance buffer by +1.5s.",
                projected_violation_reduction_pct=68.4,
                implementation_urgency="HIGH",
                estimated_cost_inr=15000,
                status="PROPOSED_FOR_COMMISSIONER_APPROVAL"
            ),
            InfrastructureRecommendation(
                recommendation_id="REC-2026-MIND-02",
                junction_id="JNC-MINDSPACE-01",
                junction_name="Mindspace Roundabout Pedestrian Crossing",
                corridor_id="COR-01",
                violation_pattern="Repeated pedestrian zebra crossing encroachment by turning vehicles",
                historical_count_30d=89,
                root_cause_analysis=(
                    "Stop line painted 1.2m too close to zebra crossing. "
                    "Turning vehicles queue across zebra stripes due to lack of dedicated refuge island."
                ),
                action_type="ROAD_MARKING_REFRESH",
                recommended_intervention="Relocate stop line back by 3.5m; install high-reflectivity thermoplastic markings and advance pedestrian sensor beacon.",
                projected_violation_reduction_pct=54.2,
                implementation_urgency="MEDIUM",
                estimated_cost_inr=45000,
                status="APPROVED_IN_CIVIL_WORKS_PIPELINE"
            )
        ]

    def get_all_cases(
        self,
        violation_type: Optional[str] = None,
        operational_category: Optional[str] = None,
        status: Optional[str] = None,
        query: Optional[str] = None
    ) -> List[ViolationEvidencePackage]:
        results = list(self._cases.values())
        if violation_type and violation_type != "ALL":
            results = [c for c in results if c.violation_category.value == violation_type or c.violation_category == violation_type]
        if operational_category and operational_category != "ALL":
            results = [c for c in results if c.operational_category.value == operational_category or c.operational_category == operational_category]
        if status and status != "ALL":
            results = [c for c in results if c.status.value == status or c.status == status]
        if query:
            q = query.upper().replace(" ", "").replace("-", "")
            results = [
                c for c in results
                if q in c.vehicle_reg_num.upper().replace(" ", "").replace("-", "")
                or q in c.location_name.upper()
                or q in c.evidence_id.upper()
            ]
        return sorted(results, key=lambda x: x.timestamp, reverse=True)

    def get_case_by_id(self, evidence_id: str) -> Optional[ViolationEvidencePackage]:
        return self._cases.get(evidence_id)

    def process_officer_decision(
        self,
        evidence_id: str,
        action: OfficerDecisionAction,
        officer_id: str = "OFF-TG-4402",
        officer_name: str = "Insp. K. Sridhar (Traffic West)",
        notes: Optional[str] = None
    ) -> Optional[ViolationEvidencePackage]:
        case = self._cases.get(evidence_id)
        if not case:
            return None

        case.officer_id = officer_id
        case.officer_name = officer_name
        case.officer_action = action
        case.review_timestamp = time.strftime("%Y-%m-%d %H:%M:%S IST")

        if action == OfficerDecisionAction.VERIFY_EVIDENCE:
            case.status = EvidenceStatus.EVIDENCE_VERIFIED
            case.officer_notes = notes or "Evidence verified: Signal timings, vehicle telemetry, and ANPR plate verified accurate."
        elif action == OfficerDecisionAction.REQUEST_MORE_EVIDENCE:
            case.status = EvidenceStatus.MORE_EVIDENCE_REQUESTED
            case.officer_notes = notes or "Requesting supplementary video clip or adjacent camera angle before decision."
        elif action == OfficerDecisionAction.REJECT_EVENT:
            case.status = EvidenceStatus.OFFICER_DISMISSED
            case.officer_notes = notes or "Dismissed: Evidence fails to establish clear intentional violation (benefit of doubt / exemption applied)."
        elif action == OfficerDecisionAction.ESCALATE_INVESTIGATION:
            case.status = EvidenceStatus.ESCALATED_INVESTIGATION
            case.officer_notes = notes or "Escalated to Traffic Appellate Authority / Senior RTO Inspector for deeper investigation."
        elif action == OfficerDecisionAction.APPROVE_CHALLAN:
            case.status = EvidenceStatus.OFFICER_APPROVED
            case.officer_notes = notes or "Approved for official e-Challan generation under Section 167A CMVR."

        return case

    def get_operational_metrics(self) -> Dict[str, Any]:
        cases = list(self._cases.values())
        return {
            "active_traffic_incidents": sum(1 for c in cases if c.operational_category == OperationalCategory.TRAFFIC_MANAGEMENT),
            "pending_violation_reviews": sum(1 for c in cases if c.status == EvidenceStatus.PENDING_REVIEW),
            "red_light_violations": sum(1 for c in cases if c.violation_category == ViolationCategory.RED_LIGHT_VIOLATION),
            "overspeed_events": sum(1 for c in cases if c.violation_category == ViolationCategory.OVERSPEEDING),
            "active_junctions": 8,
            "critical_road_alerts": sum(1 for c in cases if c.status == EvidenceStatus.ESCALATED_INVESTIGATION),
            "device_health_pct": 98.4,
            "evidence_awaiting_review": sum(1 for c in cases if c.status == EvidenceStatus.PENDING_REVIEW),
            "official_challans_issued": 14,
            "disputed_challans": 1,
            "emergency_priority_events": 2,
            "congestion_hotspots": 3
        }

    def get_recommendations(self) -> List[InfrastructureRecommendation]:
        return self._recommendations

violation_engine = ViolationEngine()
