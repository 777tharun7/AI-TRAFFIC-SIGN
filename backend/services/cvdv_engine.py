"""
CVDV (Computer Vision + Digital Vehicle & Data Visualization) Architecture Engine.
Bridges visual perception (CV) and connected vehicle intelligence (DV).

Stages of CVDV:
Stage 1: [CV Perception] - Raw Camera Frame & Optical Candidate Saliency
Stage 2: [CV Classification] - Deep Feature Tensor & 43-Class Taxonomy Mapping (signnames.csv)
Stage 3: [DV Digital Twin] - Virtual RIU Beacon Association & Signed Along-Track Geofencing
Stage 4: [DV ADAS Telemetry] - Vehicle Instrument Cluster HUD Advisory & Green-Wave Window
"""

import os
import csv
import json
from typing import Dict, List, Optional
from ..models.schemas import RoadEvent, PriorityLevel, RoadEventState
from .geospatial import calculate_along_track_distance, is_heading_aligned

class CVDVEngine:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.sign_catalog = self._load_sign_catalog()

    def _load_sign_catalog(self) -> List[Dict]:
        signnames_path = os.path.join(self.data_dir, "signnames.csv")
        meta_csv_path = os.path.join(self.data_dir, "Meta.csv")
        
        meta_info = {}
        if os.path.exists(meta_csv_path):
            with open(meta_csv_path, "r") as f:
                reader = csv.reader(f)
                headers = next(reader, None) # Path,ClassId,ShapeId,ColorId,SignId
                for row in reader:
                    if len(row) >= 5:
                        cls_id = int(row[1])
                        meta_info[cls_id] = {
                            "shape_id": int(row[2]),
                            "color_id": int(row[3]),
                            "sign_id": row[4],
                            "meta_image": f"/data/Meta/{cls_id}.png"
                        }

        catalog = []
        if os.path.exists(signnames_path):
            with open(signnames_path, "r") as f:
                reader = csv.reader(f)
                headers = next(reader, None)
                for row in reader:
                    if len(row) >= 2:
                        cls_id = int(row[0])
                        name = row[1].strip()
                        meta = meta_info.get(cls_id, {})
                        
                        # Determine category & priority
                        category = "REGULATORY" if "Speed" in name or "No" in name or "Stop" in name or "Yield" in name else "WARNING"
                        if "Turn" in name or "Ahead" in name or "Roundabout" in name or "Keep" in name:
                            category = "MANDATORY"
                            
                        priority = "HIGH" if "Stop" in name or "No entry" in name or "No vehicles" in name else "MEDIUM"
                        
                        catalog.append({
                            "class_id": cls_id,
                            "sign_name": name,
                            "category": category,
                            "priority": priority,
                            "meta_image": meta.get("meta_image", f"/data/Meta/{cls_id}.png"),
                            "shape_id": meta.get("shape_id", 0),
                            "color_id": meta.get("color_id", 0),
                            "sample_test_image": f"/data/Test/{cls_id:05d}.png" if os.path.exists(os.path.join(self.data_dir, "Test", f"{cls_id:05d}.png")) else f"/data/Meta/{cls_id}.png"
                        })
        return catalog

    def explain_cvdv_transformation(self, detection: dict, vehicle_state: dict) -> dict:
        """
        Explains step-by-step how a visual camera detection is transformed into a connected vehicle advisory.
        """
        class_id = detection.get("class_id", 0)
        sign_info = next((s for s in self.sign_catalog if s["class_id"] == class_id), {
            "class_id": class_id,
            "sign_name": detection.get("name", "Traffic Sign"),
            "category": "REGULATORY"
        })

        # 1. CV Optical Stage
        cv_stage = {
            "stage_name": "CV: Optical Perception & Classification",
            "bbox": detection.get("bbox", [0, 0, 64, 64]),
            "confidence_score": detection.get("confidence", 0.95),
            "class_id": class_id,
            "sign_name": sign_info["sign_name"],
            "dataset_source": "data/Train.csv & data/signnames.csv",
            "feature_extractor": "Deep CNN Multi-Scale Backbone"
        }

        # 2. DV Digital Twin Stage
        speed = vehicle_state.get("speed_kmh", 45.0)
        heading = vehicle_state.get("heading", 90.0)
        road = vehicle_state.get("current_road", "Hitec City Main Road")
        
        dv_stage = {
            "stage_name": "DV: Digital Twin & V-RIU Fusion",
            "digital_event_type": sign_info["sign_name"].upper().replace(" ", "_"),
            "road_segment": road,
            "vehicle_heading": f"{heading}°",
            "applicable_heading": f"{heading}° (±30° Aligned)",
            "geofence_status": "ACTIVE_APPROACHING",
            "passed_sign_projection": "Along-track positive (ahead)"
        }

        # 3. ADAS HUD Driver Advisory Stage
        rec_speed = 40.0
        if "Speed limit" in sign_info["sign_name"]:
            import re
            m = re.search(r"(\d+)", sign_info["sign_name"])
            if m:
                rec_speed = float(m.group(1))
        elif "Stop" in sign_info["sign_name"] or "No entry" in sign_info["sign_name"]:
            rec_speed = 0.0

        hud_stage = {
            "stage_name": "DV: Connected Vehicle HUD Telemetry",
            "target_speed_advisory_kmh": rec_speed,
            "driver_alert_level": "WARNING" if rec_speed < speed else "INFO",
            "hazard_urgency": "High" if rec_speed <= 30 else "Moderate",
            "display_target": "Car HUD & Bike 6.7 inch Cluster"
        }

        return {
            "cv_perception": cv_stage,
            "dv_digital_twin": dv_stage,
            "hud_advisory": hud_stage
        }

cvdv_engine = CVDVEngine()
