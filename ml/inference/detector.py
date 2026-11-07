"""
Production-grade Computer Vision Inference Engine for RoadSense AI.
Supports 43-Class GTSRB Traffic Sign Dataset and Deep PyTorch Backbone.
Features:
- Multi-input: Base64, raw bytes, OpenCV image, PIL Image, or File path
- Bounding Box localization + 43-class Classification + Normalized confidence
- Real-time latency tracking & FPS calculation
"""

import os
import io
import time
import json
import base64
import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image

class TrafficSignCNN(nn.Module):
    """Deep Feature Extraction Backbone for Sign Classification (43 classes)."""
    def __init__(self, num_classes=43):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2), # 64 -> 32
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2), # 32 -> 16
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2), # 16 -> 8
            
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((4, 4))
        )
        self.classifier = nn.Sequential(
            nn.Dropout(0.35),
            nn.Linear(256 * 4 * 4, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.25),
            nn.Linear(256, num_classes)
        )
        
    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

class TrafficSignDetector:
    def __init__(self, model_path: str = None, mapping_path: str = None, conf_threshold: float = 0.35):
        self.conf_threshold = conf_threshold
        self.device = torch.device("cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu"))
        
        # Load taxonomy
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if mapping_path is None:
            mapping_path = os.path.join(base_dir, "class_mapping.json")
            
        with open(mapping_path, "r") as f:
            self.taxonomy = json.load(f)
            
        self.classes = {c["id"]: c for c in self.taxonomy["classes"]}
        self.num_classes = len(self.classes)
        
        # Initialize Deep Model Backbone with 43 classes
        self.model = TrafficSignCNN(num_classes=self.num_classes).to(self.device)
        self.model_path = model_path or os.path.join(os.path.dirname(base_dir), "models", "traffic_sign_v1.pt")
        
        # Load weights if present
        if os.path.exists(self.model_path):
            try:
                state_dict = torch.load(self.model_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                print(f"[Detector] Loaded model weights from {self.model_path}")
            except Exception as e:
                print(f"[Detector] Weights notice: {e}, using initialized weights")
        else:
            print(f"[Detector] Initialized 43-class detector model on {self.device}")
            
        self.model.eval()

    def _color_segment_proposals(self, img_bgr: np.ndarray) -> list:
        hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
        h, w, _ = img_bgr.shape
        
        # Red masks
        mask_red1 = cv2.inRange(hsv, np.array([0, 60, 50]), np.array([12, 255, 255]))
        mask_red2 = cv2.inRange(hsv, np.array([165, 60, 50]), np.array([180, 255, 255]))
        mask_red = cv2.bitwise_or(mask_red1, mask_red2)
        
        # Blue mask
        mask_blue = cv2.inRange(hsv, np.array([95, 70, 50]), np.array([135, 255, 255]))
        
        # Yellow mask
        mask_yellow = cv2.inRange(hsv, np.array([15, 70, 70]), np.array([35, 255, 255]))
        
        combined_mask = cv2.bitwise_or(mask_red, mask_blue)
        combined_mask = cv2.bitwise_or(combined_mask, mask_yellow)
        
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel)
        combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_OPEN, kernel)
        
        contours, _ = cv2.findContours(combined_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        proposals = []
        min_area = (h * w) * 0.0005
        max_area = (h * w) * 0.95
        
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if min_area <= area <= max_area:
                x, y, bw, bh = cv2.boundingRect(cnt)
                aspect = float(bw) / float(bh)
                if 0.50 <= aspect <= 2.0:
                    pad_x = int(bw * 0.05)
                    pad_y = int(bh * 0.05)
                    x1 = max(0, x - pad_x)
                    y1 = max(0, y - pad_y)
                    x2 = min(w, x + bw + pad_x)
                    y2 = min(h, y + bh + pad_y)
                    proposals.append((x1, y1, x2, y2))
                    
        return proposals

    def detect(self, image_input) -> dict:
        start_time = time.perf_counter()
        
        # Parse Image Input
        img_bgr = None
        if isinstance(image_input, str):
            if image_input.startswith("data:image") or len(image_input) > 500:
                if "," in image_input:
                    image_input = image_input.split(",", 1)[1]
                img_bytes = base64.b64decode(image_input)
                nparr = np.frombuffer(img_bytes, np.uint8)
                img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            elif os.path.exists(image_input):
                img_bgr = cv2.imread(image_input)
        elif isinstance(image_input, bytes):
            nparr = np.frombuffer(image_input, np.uint8)
            img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        elif isinstance(image_input, Image.Image):
            img_rgb = np.array(image_input)
            img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
        elif isinstance(image_input, np.ndarray):
            img_bgr = image_input.copy()
            
        if img_bgr is None:
            return {"error": "Invalid image input", "detections": [], "latency_ms": 0}
            
        h, w, _ = img_bgr.shape
        proposals = self._color_segment_proposals(img_bgr)
        
        # If whole crop is provided or no proposal found, include full frame
        if len(proposals) == 0 or (w <= 200 and h <= 200):
            proposals.append((0, 0, w, h))
            
        detections = []
        
        with torch.no_grad():
            for (x1, y1, x2, y2) in proposals:
                crop = img_bgr[y1:y2, x1:x2]
                if crop.size == 0 or crop.shape[0] < 5 or crop.shape[1] < 5:
                    continue
                    
                crop_resized = cv2.resize(crop, (64, 64))
                crop_rgb = cv2.cvtColor(crop_resized, cv2.COLOR_BGR2RGB)
                
                tensor = torch.from_numpy(crop_rgb).permute(2, 0, 1).float() / 255.0
                mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
                std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
                tensor = (tensor - mean) / std
                tensor = tensor.unsqueeze(0).to(self.device)
                
                logits = self.model(tensor)
                probs = torch.softmax(logits, dim=1).squeeze(0)
                conf, pred_id = torch.max(probs, dim=0)
                
                conf_val = float(conf.item())
                class_id = int(pred_id.item())
                
                if conf_val >= self.conf_threshold:
                    sign_meta = self.classes.get(class_id, {
                        "id": class_id,
                        "code": f"SIGN_{class_id}",
                        "name": f"Traffic Sign #{class_id}",
                        "priority": "MEDIUM",
                        "category": "GENERAL"
                    })
                    
                    detections.append({
                        "bbox": [int(x1), int(y1), int(x2), int(y2)],
                        "confidence": round(conf_val, 4),
                        "class_id": class_id,
                        "code": sign_meta.get("code"),
                        "name": sign_meta.get("name"),
                        "category": sign_meta.get("category"),
                        "priority": sign_meta.get("priority", "MEDIUM"),
                        "value": sign_meta.get("value"),
                        "unit": sign_meta.get("unit")
                    })
                    
        # Apply NMS
        final_detections = self._apply_nms(detections, iou_thresh=0.4)
        
        latency = (time.perf_counter() - start_time) * 1000.0
        fps = round(1000.0 / max(latency, 0.1), 1)
        
        return {
            "detections": final_detections,
            "count": len(final_detections),
            "latency_ms": round(latency, 2),
            "fps": fps,
            "image_size": {"width": w, "height": h}
        }

    def _apply_nms(self, detections: list, iou_thresh: float = 0.4) -> list:
        if not detections:
            return []
        dets = sorted(detections, key=lambda x: x["confidence"], reverse=True)
        keep = []
        while dets:
            best = dets.pop(0)
            keep.append(best)
            remaining = []
            for d in dets:
                iou = self._calc_iou(best["bbox"], d["bbox"])
                if iou < iou_thresh:
                    remaining.append(d)
            dets = remaining
        return keep

    def _calc_iou(self, boxA, boxB) -> float:
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[2], boxB[2])
        yB = min(boxA[3], boxB[3])
        interArea = max(0, xB - xA) * max(0, yB - yA)
        boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
        boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
        unionArea = boxAArea + boxBArea - interArea
        if unionArea <= 0:
            return 0.0
        return interArea / float(unionArea)

    def classify_roi(self, image_input, bbox: list = None) -> dict:
        """Classify a specific manually drawn or detected ROI and return Top-5 predictions."""
        start_time = time.perf_counter()
        
        img_bgr = None
        if isinstance(image_input, str):
            if image_input.startswith("data:image") or len(image_input) > 500:
                if "," in image_input:
                    image_input = image_input.split(",", 1)[1]
                img_bytes = base64.b64decode(image_input)
                nparr = np.frombuffer(img_bytes, np.uint8)
                img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            elif os.path.exists(image_input):
                img_bgr = cv2.imread(image_input)
        elif isinstance(image_input, bytes):
            nparr = np.frombuffer(image_input, np.uint8)
            img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        elif isinstance(image_input, np.ndarray):
            img_bgr = image_input.copy()
            
        if img_bgr is None:
            return {"error": "Invalid image input"}
            
        h, w, _ = img_bgr.shape
        if bbox and len(bbox) == 4:
            x1 = max(0, min(w - 1, int(bbox[0])))
            y1 = max(0, min(h - 1, int(bbox[1])))
            x2 = max(x1 + 1, min(w, int(bbox[2])))
            y2 = max(y1 + 1, min(h, int(bbox[3])))
            crop = img_bgr[y1:y2, x1:x2]
        else:
            x1, y1, x2, y2 = 0, 0, w, h
            crop = img_bgr
            
        if crop.size == 0 or crop.shape[0] < 3 or crop.shape[1] < 3:
            return {"error": "ROI crop too small"}
            
        crop_resized = cv2.resize(crop, (64, 64))
        crop_rgb = cv2.cvtColor(crop_resized, cv2.COLOR_BGR2RGB)
        
        with torch.no_grad():
            tensor = torch.from_numpy(crop_rgb).permute(2, 0, 1).float() / 255.0
            mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
            std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
            tensor = (tensor - mean) / std
            tensor = tensor.unsqueeze(0).to(self.device)
            
            logits = self.model(tensor)
            probs = torch.softmax(logits, dim=1).squeeze(0)
            top_k = torch.topk(probs, min(5, self.num_classes))
            
        top_predictions = []
        for prob, idx in zip(top_k.values, top_k.indices):
            class_id = int(idx.item())
            meta = self.classes.get(class_id, {
                "id": class_id,
                "code": f"SIGN_{class_id}",
                "name": f"Traffic Sign #{class_id}",
                "priority": "MEDIUM",
                "category": "GENERAL"
            })
            top_predictions.append({
                "class_id": class_id,
                "confidence": round(float(prob.item()), 4),
                "name": meta.get("name"),
                "code": meta.get("code"),
                "category": meta.get("category"),
                "priority": meta.get("priority", "MEDIUM"),
                "value": meta.get("value"),
                "unit": meta.get("unit")
            })
            
        # Encode cropped ROI as base64 for preview
        _, buf = cv2.imencode(".jpg", crop)
        crop_b64 = "data:image/jpeg;base64," + base64.b64encode(buf).decode("utf-8")
        
        latency = (time.perf_counter() - start_time) * 1000.0
        primary = top_predictions[0] if top_predictions else {}
        
        # Calculate vehicle action advisory
        action = "ADVISORY"
        target_speed = None
        cat = primary.get("category", "")
        if "SPEED_LIMIT" in primary.get("code", ""):
            action = "SPEED_LIMIT_ENFORCED"
            target_speed = primary.get("value")
        elif "STOP" in primary.get("code", ""):
            action = "STOP_REQUIRED_3S"
            target_speed = 0
        elif "YIELD" in primary.get("code", ""):
            action = "DECELERATE_PREPARE_YIELD"
            target_speed = 20
        elif cat == "DANGER":
            action = "CAUTION_SLOW_DOWN"
            target_speed = 30
            
        return {
            "bbox": [x1, y1, x2, y2],
            "primary": primary,
            "top_5": top_predictions,
            "cropped_roi_base64": crop_b64,
            "latency_ms": round(latency, 2),
            "fps": round(1000.0 / max(latency, 0.1), 1),
            "vehicle_action": action,
            "target_speed_kmh": target_speed,
            "timestamp": time.time()
        }

    def draw_detections(self, img_bgr: np.ndarray, detections: list) -> np.ndarray:
        annotated = img_bgr.copy()
        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            conf = det["confidence"]
            name = det["name"]
            priority = det.get("priority", "MEDIUM")
            
            color = (34, 197, 94)
            if priority == "HIGH":
                color = (0, 165, 255)
            elif priority == "CRITICAL":
                color = (50, 50, 239)
                
            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
            label = f"{name} ({int(conf * 100)}%)"
            (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
            cv2.rectangle(annotated, (x1, max(0, y1 - 20)), (x1 + tw + 8, y1), color, -1)
            cv2.putText(annotated, label, (x1 + 4, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
        return annotated
