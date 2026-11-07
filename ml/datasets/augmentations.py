"""
Data Augmentation Engine for Indian and International Road Conditions.
Simulates realistic environmental variations:
- Glare and extreme sunlight (typical Indian summer)
- Heavy monsoon rain & wiper streaking
- Night-time with headlight beam cones
- Lens dust, motion blur, and sensor compression noise
- Faded signs, paint peeling, and perspective skew
"""

import cv2
import numpy as np
import random
from PIL import Image, ImageEnhance, ImageFilter

class RoadConditionAugmentor:
    def __init__(self):
        pass

    def apply_rain(self, img_np: np.ndarray, intensity: float = 0.5) -> np.ndarray:
        """Simulate realistic rain streaks."""
        h, w, c = img_np.shape
        rain_layer = np.zeros((h, w), dtype=np.uint8)
        num_drops = int(500 * intensity)
        for _ in range(num_drops):
            x = random.randint(0, w - 1)
            y = random.randint(0, h - 20)
            length = random.randint(10, 25)
            angle = random.uniform(0.1, 0.3)
            x2 = int(x + length * angle)
            y2 = int(y + length)
            cv2.line(rain_layer, (x, y), (x2, y2), 200, 1)
        
        rain_layer = cv2.blur(rain_layer, (3, 3))
        res = img_np.copy()
        for i in range(3):
            res[:, :, i] = np.clip(res[:, :, i].astype(np.int16) + (rain_layer * 0.4).astype(np.int16), 0, 255).astype(np.uint8)
        return res

    def apply_night_headlights(self, img_np: np.ndarray) -> np.ndarray:
        """Darken overall scene and add vehicle headlight illumination cone."""
        h, w, c = img_np.shape
        dark = (img_np * 0.25).astype(np.uint8)
        
        # Create headlight radial mask
        mask = np.zeros((h, w), dtype=np.float32)
        center = (w // 2, int(h * 0.7))
        cv2.circle(mask, center, int(max(h, w) * 0.6), 1.0, -1)
        mask = cv2.GaussianBlur(mask, (101, 101), 0)
        
        lit = img_np.astype(np.float32) * 0.95
        res = (dark.astype(np.float32) * (1.0 - mask[:, :, None] * 0.7) + lit * (mask[:, :, None] * 0.7)).clip(0, 255).astype(np.uint8)
        return res

    def apply_sun_glare(self, img_np: np.ndarray) -> np.ndarray:
        """Add realistic sun glare."""
        h, w, c = img_np.shape
        glare_mask = np.zeros((h, w, 3), dtype=np.float32)
        glare_pt = (random.randint(int(w * 0.2), int(w * 0.8)), random.randint(0, int(h * 0.4)))
        cv2.circle(glare_mask, glare_pt, int(min(h, w) * 0.4), (255, 245, 220), -1)
        glare_mask = cv2.GaussianBlur(glare_mask, (151, 151), 0)
        
        res = cv2.addWeighted(img_np.astype(np.float32), 0.85, glare_mask, 0.4, 0)
        return np.clip(res, 0, 255).astype(np.uint8)

    def apply_motion_blur(self, img_np: np.ndarray, size: int = 7) -> np.ndarray:
        """Simulate high-speed motion blur."""
        kernel = np.zeros((size, size))
        kernel[int((size - 1) / 2), :] = np.ones(size)
        kernel = kernel / size
        return cv2.filter2D(img_np, -1, kernel)

    def apply_faded_sign(self, img_np: np.ndarray) -> np.ndarray:
        """Desaturate and fade weathered sign paint."""
        hsv = cv2.cvtColor(img_np, cv2.COLOR_BGR2HSV).astype(np.float32)
        hsv[:, :, 1] *= random.uniform(0.5, 0.75) # Reduce saturation
        hsv[:, :, 2] = np.clip(hsv[:, :, 2] * random.uniform(0.9, 1.15), 0, 255) # Lighten
        return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    def augment_pipeline(self, img_np: np.ndarray, condition: str = "random") -> np.ndarray:
        """Run through configurable augmentation conditions."""
        if condition == "random":
            conds = ["clean", "rain", "night", "glare", "blur", "faded"]
            condition = random.choice(conds)
        
        if condition == "rain":
            return self.apply_rain(img_np, random.uniform(0.4, 0.8))
        elif condition == "night":
            return self.apply_night_headlights(img_np)
        elif condition == "glare":
            return self.apply_sun_glare(img_np)
        elif condition == "blur":
            return self.apply_motion_blur(img_np, random.choice([5, 7, 9]))
        elif condition == "faded":
            return self.apply_faded_sign(img_np)
        return img_np
