"""
Traffic Sign Image & YOLO Dataset Generator.
Generates realistic traffic sign images matching IRC (Indian Road Congress) & Vienna convention specs
placed onto simulated road scenes, generating valid YOLO coordinates (class_id, x_center, y_center, width, height).
"""

import os
import json
import math
import random
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from .augmentations import RoadConditionAugmentor

class TrafficSignGenerator:
    def __init__(self, mapping_path: str = None):
        if mapping_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            mapping_path = os.path.join(base_dir, "class_mapping.json")
        
        with open(mapping_path, "r") as f:
            self.taxonomy = json.load(f)
            
        self.classes = self.taxonomy["classes"]
        self.augmentor = RoadConditionAugmentor()

    def render_sign_badge(self, sign_info: dict, size: int = 160) -> np.ndarray:
        """Draws a vector-quality traffic sign badge according to official geometric specs."""
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        shape = sign_info.get("shape", "CIRCLE")
        border_col = sign_info.get("border_color", "RED")
        bg_col = sign_info.get("bg_color", "WHITE")
        code = sign_info.get("code", "")
        
        # Color mapping (RGB)
        c_red = (220, 20, 30, 255)
        c_white = (255, 255, 255, 255)
        c_blue = (20, 80, 200, 255)
        c_yellow = (255, 210, 0, 255)
        c_black = (20, 20, 20, 255)
        
        b_color = c_red if border_col == "RED" else (c_white if border_col == "WHITE" else c_black)
        bg = c_white if bg_col == "WHITE" else (c_blue if bg_col == "BLUE" else (c_red if bg_col == "RED" else c_yellow))
        
        pad = 8
        if shape == "CIRCLE":
            draw.ellipse([pad, pad, size - pad, size - pad], fill=bg, outline=b_color, width=int(size * 0.12))
            
            if "SPEED_LIMIT" in code:
                val = str(sign_info.get("value", "40"))
                # Speed limit number in center
                draw.text((size // 2, size // 2), val, fill=c_black, anchor="mm", font_size=int(size * 0.42), stroke_width=2, stroke_fill=c_black)
            elif code == "NO_ENTRY":
                bar_h = int(size * 0.16)
                draw.rectangle([size * 0.2, size // 2 - bar_h // 2, size * 0.8, size // 2 + bar_h // 2], fill=c_white)
            elif code == "NO_PARKING":
                draw.line([pad + 15, pad + 15, size - pad - 15, size - pad - 15], fill=c_red, width=int(size * 0.1))
                draw.text((size // 2, size // 2), "P", fill=c_white, anchor="mm", font_size=int(size * 0.5))
            elif code == "NO_STOPPING":
                draw.line([pad + 15, pad + 15, size - pad - 15, size - pad - 15], fill=c_red, width=int(size * 0.09))
                draw.line([size - pad - 15, pad + 15, pad + 15, size - pad - 15], fill=c_red, width=int(size * 0.09))
            elif code == "TURN_LEFT":
                draw.line([size * 0.65, size * 0.65, size * 0.65, size * 0.4], fill=c_white, width=int(size * 0.08))
                draw.line([size * 0.65, size * 0.4, size * 0.35, size * 0.4], fill=c_white, width=int(size * 0.08))
                draw.polygon([(size * 0.35, size * 0.28), (size * 0.22, size * 0.4), (size * 0.35, size * 0.52)], fill=c_white)
            elif code == "TURN_RIGHT":
                draw.line([size * 0.35, size * 0.65, size * 0.35, size * 0.4], fill=c_white, width=int(size * 0.08))
                draw.line([size * 0.35, size * 0.4, size * 0.65, size * 0.4], fill=c_white, width=int(size * 0.08))
                draw.polygon([(size * 0.65, size * 0.28), (size * 0.78, size * 0.4), (size * 0.65, size * 0.52)], fill=c_white)
            elif code == "COMPULSORY_AHEAD":
                draw.line([size // 2, size * 0.75, size // 2, size * 0.35], fill=c_white, width=int(size * 0.09))
                draw.polygon([(size * 0.36, size * 0.35), (size // 2, size * 0.2), (size * 0.64, size * 0.35)], fill=c_white)
                
        elif shape == "OCTAGON":
            # STOP sign
            pts = [
                (size * 0.3, pad), (size * 0.7, pad),
                (size - pad, size * 0.3), (size - pad, size * 0.7),
                (size * 0.7, size - pad), (size * 0.3, size - pad),
                (pad, size * 0.7), (pad, size * 0.3)
            ]
            draw.polygon(pts, fill=c_red, outline=c_white, width=int(size * 0.04))
            draw.text((size // 2, size // 2), "STOP", fill=c_white, anchor="mm", font_size=int(size * 0.3), stroke_width=2, stroke_fill=c_white)
            
        elif shape == "TRIANGLE_UP":
            pts = [(size // 2, pad), (size - pad, size - pad), (pad, size - pad)]
            draw.polygon(pts, fill=c_white, outline=c_red, width=int(size * 0.12))
            
            if code == "SPEED_BREAKER":
                # Speed bump icon
                draw.arc([size * 0.28, size * 0.52, size * 0.72, size * 0.76], 180, 0, fill=c_black, width=int(size * 0.08))
            elif code == "PEDESTRIAN_CROSSING":
                # Pedestrian icon stick figure
                draw.ellipse([size * 0.46, size * 0.38, size * 0.54, size * 0.46], fill=c_black)
                draw.line([size * 0.5, size * 0.46, size * 0.5, size * 0.65], fill=c_black, width=int(size * 0.05))
                draw.line([size * 0.5, size * 0.65, size * 0.4, size * 0.8], fill=c_black, width=int(size * 0.05))
                draw.line([size * 0.5, size * 0.65, size * 0.6, size * 0.8], fill=c_black, width=int(size * 0.05))
            elif code == "SCHOOL_ZONE":
                draw.text((size // 2, size * 0.62), "SCHOOL", fill=c_black, anchor="mm", font_size=int(size * 0.16))
            elif code == "ROAD_WORK":
                draw.text((size // 2, size * 0.62), "WORK", fill=c_black, anchor="mm", font_size=int(size * 0.18))
            elif code == "SLIPPERY_ROAD":
                draw.text((size // 2, size * 0.62), "SLIP", fill=c_black, anchor="mm", font_size=int(size * 0.2))
            elif code == "TRAFFIC_SIGNAL":
                draw.ellipse([size // 2 - 6, size * 0.45, size // 2 + 6, size * 0.45 + 12], fill=c_red)
                draw.ellipse([size // 2 - 6, size * 0.55, size // 2 + 6, size * 0.55 + 12], fill=c_yellow)
                draw.ellipse([size // 2 - 6, size * 0.65, size // 2 + 6, size * 0.65 + 12], fill=(20, 200, 40, 255))
            elif code == "U_TURN":
                draw.arc([size * 0.35, size * 0.4, size * 0.65, size * 0.7], 0, 180, fill=c_black, width=int(size * 0.06))
            else:
                draw.text((size // 2, size * 0.62), "!", fill=c_black, anchor="mm", font_size=int(size * 0.35))
                
        elif shape == "TRIANGLE_DOWN":
            pts = [(pad, pad), (size - pad, pad), (size // 2, size - pad)]
            draw.polygon(pts, fill=c_white, outline=c_red, width=int(size * 0.12))
            draw.text((size // 2, size * 0.42), "GIVE\nWAY", fill=c_black, anchor="mm", font_size=int(size * 0.18))
            
        return np.array(img)

    def generate_road_scene(self, width: int = 640, height: int = 480) -> np.ndarray:
        """Generates a realistic background highway / urban road scene."""
        scene = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Sky gradient (top 40%)
        horizon = int(height * 0.45)
        for y in range(horizon):
            ratio = y / horizon
            sky_b = int(220 * (1 - ratio) + 140 * ratio)
            sky_g = int(180 * (1 - ratio) + 130 * ratio)
            sky_r = int(120 * (1 - ratio) + 110 * ratio)
            scene[y, :] = [sky_b, sky_g, sky_r]
            
        # Ground / Road (bottom 55%)
        for y in range(horizon, height):
            ratio = (y - horizon) / (height - horizon)
            road_val = int(70 + 40 * ratio)
            scene[y, :] = [road_val, road_val + 5, road_val + 10]
            
        # Road lane lines in perspective
        pts_road = np.array([
            [int(width * 0.38), horizon],
            [int(width * 0.62), horizon],
            [int(width * 0.95), height],
            [int(width * 0.05), height]
        ], np.int32)
        cv2.fillPoly(scene, [pts_road], (60, 60, 65))
        
        # Road shoulder / buildings / trees
        cv2.rectangle(scene, (0, horizon - 20), (int(width * 0.3), horizon), (40, 90, 45), -1)
        cv2.rectangle(scene, (int(width * 0.7), horizon - 30), (width, horizon), (50, 100, 55), -1)
        
        # Dashed center line
        for y in range(horizon + 10, height, 40):
            cv2.line(scene, (width // 2, y), (width // 2, min(y + 20, height)), (240, 240, 240), 3)
            
        return scene

    def create_sample_composite(self, sign_id: int, out_w: int = 640, out_h: int = 480, condition: str = "random") -> tuple:
        """
        Creates a full composite scene with the given traffic sign, returns (image_bgr, yolo_bbox_tuple).
        yolo_bbox = (class_id, x_center, y_center, width, height) normalized to [0, 1].
        """
        sign_info = next((c for c in self.classes if c["id"] == sign_id), self.classes[0])
        scene = self.generate_road_scene(out_w, out_h)
        
        # Determine sign scale and placement (e.g. right roadside or overhead gantry)
        sign_px = random.randint(70, 140)
        sign_rgba = self.render_sign_badge(sign_info, sign_px)
        
        # Roadside pole
        side = random.choice(["right", "right", "left"])
        if side == "right":
            min_x = int(out_w * 0.65)
            max_x = max(min_x + 10, out_w - sign_px - 20)
            sign_x = random.randint(min_x, max_x)
            sign_y = random.randint(int(out_h * 0.22), int(out_h * 0.52))
        else:
            min_x = 20
            max_x = max(min_x + 10, int(out_w * 0.35) - sign_px)
            sign_x = random.randint(min_x, max_x)
            sign_y = random.randint(int(out_h * 0.22), int(out_h * 0.52))
            
        pole_x = sign_x + sign_px // 2
        cv2.line(scene, (pole_x, sign_y + sign_px // 2), (pole_x, int(out_h * 0.85)), (120, 120, 125), 5)
        
        # Paste RGBA badge onto BGR scene
        badge_bgr = cv2.cvtColor(sign_rgba[:, :, :3], cv2.COLOR_RGB2BGR)
        badge_mask = sign_rgba[:, :, 3] / 255.0
        
        for c in range(3):
            scene[sign_y:sign_y + sign_px, sign_x:sign_x + sign_px, c] = (
                scene[sign_y:sign_y + sign_px, sign_x:sign_x + sign_px, c] * (1.0 - badge_mask) +
                badge_bgr[:, :, c] * badge_mask
            ).astype(np.uint8)
            
        # Apply environmental augmentations
        scene = self.augmentor.augment_pipeline(scene, condition)
        
        # YOLO normalized bounding box
        x_center = (sign_x + sign_px / 2.0) / out_w
        y_center = (sign_y + sign_px / 2.0) / out_h
        w_norm = sign_px / float(out_w)
        h_norm = sign_px / float(out_h)
        
        bbox = (sign_id, x_center, y_center, w_norm, h_norm)
        return scene, bbox, sign_info

    def generate_full_dataset(self, samples_per_class: int = 15, output_dir: str = "datasets"):
        """Generates train, validation, test splits with images and labels."""
        splits = {
            "train": int(samples_per_class * 0.7),
            "validation": int(samples_per_class * 0.2),
            "test": max(1, int(samples_per_class * 0.1))
        }
        
        for split in splits.keys():
            os.makedirs(os.path.join(output_dir, split, "images"), exist_ok=True)
            os.makedirs(os.path.join(output_dir, split, "labels"), exist_ok=True)
            
        counts = {"train": 0, "validation": 0, "test": 0}
        
        for cls in self.classes:
            cls_id = cls["id"]
            for split, count in splits.items():
                for i in range(count):
                    img, bbox, _ = self.create_sample_composite(cls_id, condition="random")
                    file_id = f"sign_{cls_id:02d}_{split}_{i:04d}"
                    img_path = os.path.join(output_dir, split, "images", f"{file_id}.jpg")
                    lbl_path = os.path.join(output_dir, split, "labels", f"{file_id}.txt")
                    
                    cv2.imwrite(img_path, img)
                    with open(lbl_path, "w") as f:
                        f.write(f"{bbox[0]} {bbox[1]:.6f} {bbox[2]:.6f} {bbox[3]:.6f} {bbox[4]:.6f}\n")
                    counts[split] += 1
                    
        print(f"[Dataset Generator] Successfully generated: {counts}")
        return counts

if __name__ == "__main__":
    gen = TrafficSignGenerator()
    gen.generate_full_dataset(samples_per_class=12)
