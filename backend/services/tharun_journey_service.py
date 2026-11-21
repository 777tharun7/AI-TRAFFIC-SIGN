"""
Tharun Demonstration Journey Service.
Orchestrates the 8-scene realistic demonstration story:
- Scene 1: Starting the journey (Driver Cockpit HUD, route Cyber Towers -> Mindspace)
- Scene 2: Approaching a red signal (Cyber Towers Junction, SPaT countdown, stop line)
- Scene 3: Red-light violation simulation (Vehicle crosses stop line 1.8s into red phase)
- Scene 4: Traffic Officer review (Officer reviews before/after frames, signal sync)
- Scene 5: Official challan workflow (Simulated e-challan under Section 184 / Section 167A)
- Scene 6: Citizen / Driver experience (Tharun opens Citizen Portal, inspects evidence)
- Scene 7: Overspeeding scenario (Dynamic limit changes, warning, compliance check)
- Scene 8: Road safety analytics & infrastructure recommendation (Signal retiming)
"""

from typing import List, Dict, Any, Optional
from ..models.schemas import DemoStoryScene

class TharunJourneyService:
    def __init__(self):
        self._current_scene_id: int = 1
        self._scenes: Dict[int, DemoStoryScene] = self._init_scenes()

    def _init_scenes(self) -> Dict[int, DemoStoryScene]:
        scenes_list = [
            DemoStoryScene(
                scene_id=1,
                title="Scene 1 — Starting the Journey",
                subtitle="Connected Vehicle Experience & Preventive Cockpit HMI",
                description=(
                    "Tharun begins driving his connected electric vehicle (Tata Nexon EV Max, TS 09 EV 4412). "
                    "The RoadSense AI in-vehicle HMI displays current route, applicable 50 km/h speed limit, "
                    "GVID telemetry link, battery SoC (74%), and early road hazard advisories."
                ),
                actor="Tharun (Vehicle Owner & Driver)",
                vehicle_plate="TS 09 EV 4412",
                location="Hitec City Main Road (Heading East)",
                primary_view="car_cockpit",
                key_metrics={
                    "current_speed": "42 km/h",
                    "applicable_limit": "50 km/h",
                    "gvid_status": "ONLINE (CAN + GNSS 20Hz)",
                    "battery_soc": "74%",
                    "next_junction": "Cyber Towers (380m ahead)"
                },
                operational_action="Preventive Guidance: Driver informed of upcoming signalized junction and current speed envelope.",
                is_active=True
            ),
            DemoStoryScene(
                scene_id=2,
                title="Scene 2 — Approaching a Controlled Junction",
                subtitle="V2X SPaT Signal Awareness & Calibrated Stop-Line",
                description=(
                    "As Tharun approaches Cyber Towers Junction, the roadside V-RIU broadcasts live signal phase and timing (SPaT). "
                    "The traffic signal transitions from Green to Amber (4.0s duration). The in-cockpit HUD alerts Tharun of the stop line ahead."
                ),
                actor="Tharun (Vehicle Owner & Driver)",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers Junction (Approach North, Lane 2)",
                primary_view="road_intelligence",
                key_metrics={
                    "signal_state": "YELLOW (Countdown: 2s)",
                    "distance_to_stopline": "45 metres",
                    "current_speed": "38 km/h",
                    "recommended_action": "Decelerate to smooth stop before stop line"
                },
                operational_action="Signal Advisory: Visual countdown and audible chime warn driver of imminent red transition.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=3,
                title="Scene 3 — Red-Light Violation Event Generation",
                subtitle="Synchronized Signal Controller & Calibrated Camera Event",
                description=(
                    "In this simulation scenario, Tharun's vehicle fails to stop and crosses the marked stop line 1.8 seconds AFTER "
                    "the red phase becomes active. Roadside PTZ cameras capture multi-frame evidence and ANPR plate crop (98.6% confidence), "
                    "sealing the package with a SHA-256 cryptographic hash."
                ),
                actor="Roadside Edge Unit & Signal Controller",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers Junction (Stop Line 1+240)",
                primary_view="evidence_workflow",
                key_metrics={
                    "red_onset_timestamp": "00:15:20 IST",
                    "stopline_cross_timestamp": "00:15:21.8 IST (+1.8s into red)",
                    "speed_at_crossing": "38.4 km/h",
                    "anpr_confidence": "98.6%",
                    "legal_clearance_status": "CLEAR_VIOLATION"
                },
                operational_action="Event Detected: Roadside system creates potential violation dossier and queues for officer review.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=4,
                title="Scene 4 — Traffic Officer Human-in-the-Loop Review",
                subtitle="Operational Verification Desk & Legal Assessment",
                description=(
                    "Traffic Inspector K. Sridhar opens the evidence review desk. The screen displays the before-crossing frame, "
                    "stop-line crossing frame, inside-junction frame, and signal controller transition graph. The officer verifies "
                    "the vehicle did NOT enter during green/yellow (no legal clearance exception) and confirms plate accuracy."
                ),
                actor="Insp. K. Sridhar (Traffic Branch West)",
                vehicle_plate="TS 09 EV 4412",
                location="Traffic Command Centre — Verification Console",
                primary_view="evidence_workflow",
                key_metrics={
                    "evidence_id": "EVD-2026-HYD-0001",
                    "applicable_law": "Section 184 / Section 119 MV Act",
                    "camera_calibration": "AIS-140 Certified Valid",
                    "officer_action_permitted": "Verify Evidence or Request More Evidence"
                },
                operational_action="Human Verification: Officer inspects evidence sequence and verifies fact of violation under Section 167A CMVR.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=5,
                title="Scene 5 — Official e-Challan Issuance",
                subtitle="Statutory Notice Generation with Section 167A Seal",
                description=(
                    "Upon officer approval, the system generates simulated official e-Challan #TS-HYD-2026-CH-081290 with a penalty of ₹1,000. "
                    "A certified digital evidence seal and QR code are embedded for legal validity."
                ),
                actor="Hyderabad City Police — Traffic Division",
                vehicle_plate="TS 09 EV 4412",
                location="Automated Government Compliance Gateway",
                primary_view="traffic_dept",
                key_metrics={
                    "challan_number": "TS-HYD-2026-CH-081290",
                    "penalty_amount": "₹1,000",
                    "legal_section": "Section 184 MV Act (Red Light Jump)",
                    "due_date": "15 Days (2026-12-07)",
                    "data_tag": "[SIMULATED CHALLAN — NOT AN OFFICIAL GOVERNMENT NOTICE]"
                },
                operational_action="Enforcement Issued: Official simulated citation queued for digital notification to registered owner.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=6,
                title="Scene 6 — Citizen & Driver Portal Experience",
                subtitle="Transparent Evidence Inspection, Digital Pay & Appeals",
                description=(
                    "Tharun receives a notification and opens the Citizen Portal. He enters his plate number and views the full "
                    "violation timeline, camera snapshots, and signal timing proof. Tharun has the option to contest the citation or pay ₹1,000 online."
                ),
                actor="Tharun (Citizen & Driver)",
                vehicle_plate="TS 09 EV 4412",
                location="RoadSense AI Citizen Portal",
                primary_view="citizen_portal",
                key_metrics={
                    "portal_status": "PENDING CITIZEN ACTION",
                    "evidence_transparency": "Full camera & signal timing proof visible to citizen",
                    "options_available": "Instant Online Payment (UPI) or Formal Legal Dispute"
                },
                operational_action="Citizen Transparency: Citizen sees exact photographic proof and can resolve or contest without court visit.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=7,
                title="Scene 7 — Overspeeding & Dynamic Road Limits",
                subtitle="Multi-Segment Compliance & Calibration Grace Margins",
                description=(
                    "Later on his journey, Tharun accelerates on the Cyber Towers Flyover approach. The road segment speed limit is 50 km/h. "
                    "Tharun sustains 74.5 km/h. The engine applies the mandatory ±2.0 km/h sensor uncertainty tolerance and flags an overspeed event."
                ),
                actor="Tharun (Vehicle Owner & Driver)",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers Flyover Mid-Span (HYD-ROAD-101)",
                primary_view="road_intelligence",
                key_metrics={
                    "measured_speed": "74.5 km/h",
                    "posted_limit": "50.0 km/h",
                    "grace_margin": "±2.0 km/h (Driver Benefit of Doubt)",
                    "admissible_speed": "72.5 km/h (+22.5 km/h over limit)",
                    "sustained_duration": "4.8 seconds"
                },
                operational_action="Multi-Violation Detection: System demonstrates speed compliance checking alongside signal monitoring.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=8,
                title="Scene 8 — Road Safety & Infrastructure Improvement",
                subtitle="Root-Cause Analysis Over Punitive Enforcement",
                description=(
                    "Rather than simply collecting fines, the Department Analytics module aggregates repeated violations at Cyber Towers Junction. "
                    "It identifies that a 4.0s amber duration on a 3.2% downhill slope causes drivers to overshoot. The platform proposes an "
                    "infrastructure improvement: extend amber to 5.5s, projected to reduce red-light violations by 68.4%."
                ),
                actor="Traffic Planning & Engineering Wing",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers Junction Infrastructure Optimization",
                primary_view="traffic_dept",
                key_metrics={
                    "30_day_violation_count": "142 at this junction",
                    "root_cause": "Downhill gradient + 4.0s amber causes unavoidable overshoot",
                    "proposed_intervention": "Extend amber interval from 4.0s to 5.5s",
                    "projected_reduction": "68.4% reduction in red-light violations",
                    "estimated_cost": "₹15,000 (Software Signal Plan Update)"
                },
                operational_action="Continuous Improvement: Closing the loop: DETECT -> VERIFY -> ENFORCE -> IMPROVE.",
                is_active=False
            )
        ]
        return {s.scene_id: s for s in scenes_list}

    def get_all_scenes(self) -> List[DemoStoryScene]:
        scenes = list(self._scenes.values())
        for s in scenes:
            s.is_active = (s.scene_id == self._current_scene_id)
        return scenes

    def get_current_scene(self) -> DemoStoryScene:
        scene = self._scenes.get(self._current_scene_id, self._scenes[1])
        scene.is_active = True
        return scene

    def set_current_scene(self, scene_id: int) -> DemoStoryScene:
        if scene_id in self._scenes:
            self._current_scene_id = scene_id
        return self.get_current_scene()

    def next_scene(self) -> DemoStoryScene:
        if self._current_scene_id < 8:
            self._current_scene_id += 1
        return self.get_current_scene()

    def prev_scene(self) -> DemoStoryScene:
        if self._current_scene_id > 1:
            self._current_scene_id -= 1
        return self.get_current_scene()

    def reset(self) -> DemoStoryScene:
        self._current_scene_id = 1
        return self.get_current_scene()

tharun_journey_service = TharunJourneyService()
