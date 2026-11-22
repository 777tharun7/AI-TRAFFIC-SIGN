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
                title="Scene 1 — The Project Vision: Preventive Cockpit Guidance",
                subtitle="Connected Vehicle Intelligence Fusing Edge Vision & RTK GNSS",
                description=(
                    "RoadSense AI was engineered on a transformative premise: traffic safety should be cooperative and preventive, not a punitive revenue trap. "
                    "Tharun drives his connected electric vehicle (TS 09 EV 4412) along the Hitec City Connected Corridor. "
                    "Instead of being surprised by obscured roadside signboards, RoadSense AI detects IRC:67-2012 signs with 99.4% precision and renders dynamic speed envelopes (50 km/h) and hazard advisories directly in the in-cabin HUD."
                ),
                actor="Devanboina Tharun (Driver & Vehicle Owner)",
                vehicle_plate="TS 09 EV 4412",
                location="Hitec City Main Road (Heading East)",
                primary_view="car_cockpit",
                key_metrics={
                    "vision_accuracy": "99.4% (YOLOv8 + ResNet)",
                    "current_speed": "42 km/h",
                    "posted_limit": "50 km/h",
                    "v2x_telemetry": "ONLINE (5.9 GHz DSRC)",
                    "battery_soc": "82%",
                    "project_intent": "Zero Accidental Infractions"
                },
                operational_action="Preventive Assistance: Driver receives upcoming sign & corridor advisory 300m ahead.",
                is_active=True
            ),
            DemoStoryScene(
                scene_id=2,
                title="Scene 2 — V2X SPaT Green Wave & Calibrated Stop-Lines",
                subtitle="Cooperative Signal Countdown to Eliminate Sudden Panic Braking",
                description=(
                    "Approaching Cyber Towers Junction, the roadside V-RIU broadcasts live Signal Phase and Timing (SPaT). "
                    "Rather than an abrupt amber transition that causes dangerous rear-end collisions, the in-cabin HUD provides GLOSA (Green Light Optimal Speed Advisory) recommending 42 km/h to cruise through on green, with millisecond-calibrated stop-line awareness."
                ),
                actor="Roadside Virtual RIU & Signal Controller",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers Junction (Approach North, Lane 2)",
                primary_view="road_intelligence",
                key_metrics={
                    "signal_phase": "GREEN -> AMBER (4.0s countdown)",
                    "distance_to_stopline": "45 metres",
                    "glosa_advisory": "42 km/h (Green Wave Locked)",
                    "v2x_latency": "12 ms (Sub-second Edge)",
                    "safety_buffer": "15.2 metres safe stopping distance"
                },
                operational_action="Cooperative Deceleration: Driver advised of optimal speed envelope to avoid abrupt braking.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=3,
                title="Scene 3 — The Real-World Dilemma: Emergency Over-Speeding",
                subtitle="Rushing a Critically Ill Passenger vs. Automated Radar Traps",
                description=(
                    "A sudden, severe medical crisis strikes: Tharun's family member in the passenger seat collapses with acute chest pain and cardiac distress. "
                    "Every second is vital to reach AIG Hospitals Gachibowli. Tharun accelerates to 82 km/h in a 50 km/h zone. "
                    "Under traditional traffic camera systems, a blind automated challan of ₹2,000 would be issued and license points deducted, unfairly penalizing a citizen trying to save a human life."
                ),
                actor="Tharun (Driver under Critical Medical Emergency)",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers Flyover Corridor (HYD-ROAD-101)",
                primary_view="car_cockpit",
                key_metrics={
                    "measured_speed": "82.4 km/h (Limit: 50 km/h)",
                    "emergency_nature": "Acute Cardiac / Medical Distress",
                    "destination": "AIG Hospitals Emergency Ward",
                    "traditional_system": "Blind ₹2,000 Fine + Court Notice",
                    "roadsense_solution": "In-Cabin Emergency SOS & Triage Geofencing"
                },
                operational_action="Crisis Event: Driver exceeds posted limit during bona fide life-threatening medical emergency.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=4,
                title="Scene 4 — RoadSense AI Solution: Emergency SOS & V2X Corridor",
                subtitle="Dynamic Green Wave Preemption & Medical Verification Pending",
                description=(
                    "RoadSense AI introduces the Medical Emergency Exemption Protocol: Tharun taps 'Emergency Medical SOS' in his Cockpit HMI. "
                    "The system responds instantly: 1) Activates vehicle hazard beacons and broadcasts Emergency Priority V2X packets; "
                    "2) Roadside signal controllers trigger EVP (Emergency Vehicle Preemption) to turn upcoming signals green; "
                    "3) The radar logs the 82 km/h speed, but instead of a punitive citation, tags the dossier as 'MEVP: Medical Emergency Verification Pending'."
                ),
                actor="RoadSense AI Autonomous Safety Engine",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers to Gachibowli Expressway",
                primary_view="traffic_dept",
                key_metrics={
                    "emergency_beacon": "ACTIVE (Hazard Strobe + V2X Priority)",
                    "signal_preemption": "EVP GREEN WAVE ENGAGED",
                    "enforcement_state": "MEVP: Medical Verification Pending",
                    "initial_fine_status": "FROZEN (Pending Hospital Validation)",
                    "hospital_eta": "3.8 Minutes (4.2 km)"
                },
                operational_action="Smart Preemption: Upcoming signals turned green; citation frozen pending medical proof.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=5,
                title="Scene 5 — Verification & Anti-Abuse: Hospital Geofence Audit",
                subtitle="Automated Cross-Validation with Hospital Admission Triage Slip",
                description=(
                    "To prevent reckless drivers from falsely claiming emergency, RoadSense AI enforces rigorous 3-point digital verification: "
                    "1) RTK GNSS confirms vehicle arrived and parked inside AIG Hospital Emergency Bay at 00:22 IST; "
                    "2) Digital health record / doctor admission slip (Triage Token #ER-2026-HYD-9941) is digitally linked via National Health Authority / ABHA gateway; "
                    "3) Route kinematics prove non-stop journey straight to the hospital."
                ),
                actor="Hospital Emergency Desk & City Telematics Gateway",
                vehicle_plate="TS 09 EV 4412",
                location="AIG Hospitals Emergency Bay (Geofence Verified)",
                primary_view="evidence_workflow",
                key_metrics={
                    "hospital_arrival_time": "00:22:14 IST (Verified)",
                    "hospital_geofence": "LOCKED: AIG Emergency Ward Bay 2",
                    "triage_token": "ER-2026-HYD-9941 (Doctor Certified)",
                    "telematics_trajectory": "Continuous Direct Run (No stops/diversions)",
                    "anti_abuse_verdict": "GENUINE LIFE-SAVING EMERGENCY VERIFIED"
                },
                operational_action="Digital Audit: Vehicle location, speed timestamps, and emergency admission record verified.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=6,
                title="Scene 6 — Judicial Adjudication: 100% Fine Waiver Issued",
                subtitle="Human-in-the-Loop Officer Approval under Section 194 / 115 MV Act",
                description=(
                    "Traffic Inspector K. Sridhar opens the Emergency Verification Console. The synchronized dashboard displays the 82 km/h radar snapshot alongside the hospital admission timestamp and emergency triage certificate. "
                    "Applying statutory Good Samaritan guidelines under Section 115 / Section 194 MV Act, Inspector Sridhar officially approves Waiver Certificate #EX-HYD-2026-789: The ₹2,000 fine is waived to ₹0 and zero license points deducted."
                ),
                actor="Insp. K. Sridhar (Cyberabad Traffic Police)",
                vehicle_plate="TS 09 EV 4412",
                location="Traffic Command & Adjudication Centre",
                primary_view="evidence_workflow",
                key_metrics={
                    "officer_verdict": "OFFICIALLY EXEMPTED (Medical Emergency)",
                    "statutory_authority": "Section 194 / 115 MV Act (Emergency Exception)",
                    "penalty_waiver": "₹2,000 -> ₹0 (100% Waived)",
                    "demerit_points": "0 Points Deducted",
                    "waiver_certificate": "EX-HYD-2026-789 (Cryptographically Signed)"
                },
                operational_action="Statutory Waiver: Traffic Inspector signs off on emergency fine waiver with official exemption stamp.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=7,
                title="Scene 7 — Citizen Transparency & Digital Ledger",
                subtitle="Zero-Fee Citizen Portal with Cryptographic Evidence Dossier",
                description=(
                    "Tharun logs into the RoadSense Citizen Portal from his mobile device. Instead of stressful legal notices or court dates, "
                    "he finds a certified copy of his Medical Exemption Certificate (#EX-HYD-2026-789) and his clean driving record intact. "
                    "For any non-emergency violation, citizens enjoy transparent photographic proof, radar calibration records, and one-tap dispute mechanisms without intermediaries."
                ),
                actor="Devanboina Tharun (Citizen Motorist)",
                vehicle_plate="TS 09 EV 4412",
                location="RoadSense AI Citizen Portal",
                primary_view="citizen_portal",
                key_metrics={
                    "portal_status": "EXEMPTION CONFIRMED (Clean Record)",
                    "transparency_score": "100% Full Evidence Disclosure",
                    "dispute_fee": "₹0 (Citizen Friendly)",
                    "digital_certificate": "Downloadable PDF with QR Validation",
                    "driver_trust_index": "98.8% Citizen Satisfaction"
                },
                operational_action="Citizen Transparency: Citizen accesses verified exemption documentation and evidence timeline.",
                is_active=False
            ),
            DemoStoryScene(
                scene_id=8,
                title="Scene 8 — Closing the Loop: Engineering Safe Corridors",
                subtitle="From Punitive Fines to Systematic Road Infrastructure Optimization",
                description=(
                    "RoadSense AI closes the loop by shifting road safety from collecting penalties to fixing root infrastructure causes. "
                    "The Traffic Analytics Engine analyzes 142 red-light slips at Cyber Towers Junction and discovers a 3.2% downhill gradient paired with an inadequate 4.0s amber phase. "
                    "The platform automatically recommends extending the amber duration to 5.5s, projected to eliminate 68.4% of violations before they ever occur."
                ),
                actor="Traffic Planning & Infrastructure Engineering Wing",
                vehicle_plate="TS 09 EV 4412",
                location="Cyber Towers Junction Infrastructure Optimization",
                primary_view="traffic_dept",
                key_metrics={
                    "root_cause": "Downhill gradient + 4.0s amber causes overshoot",
                    "engineered_solution": "Extend amber duration to 5.5s",
                    "projected_reduction": "68.4% fewer violations",
                    "implementation_cost": "₹15,000 (Software Signal Plan Update)",
                    "core_philosophy": "DETECT -> ASSIST -> ADJUDICATE FAIRLY -> IMPROVE"
                },
                operational_action="Continuous Optimization: Platform implements preventive engineering changes to protect future drivers.",
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
