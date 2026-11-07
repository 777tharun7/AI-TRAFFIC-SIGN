"""
GTSRB Dataset Loader & Preprocessing Pipeline for RoadSense AI.
Ingests real user-uploaded German Traffic Sign Recognition Benchmark (GTSRB) images and annotations.
Converts .ppm to normalized RGB crops with train / validation / test splits.
"""

import os
import glob
import csv
import random
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from PIL import Image

class GTSRBDataset(Dataset):
    def __init__(self, samples: list, img_size: int = 64, transform=None):
        self.samples = samples
        self.img_size = img_size
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, roi, class_id = self.samples[idx]
        
        # Read PPM image
        img = cv2.imread(img_path)
        if img is None:
            img = np.zeros((self.img_size, self.img_size, 3), dtype=np.uint8)
        else:
            # Crop to ROI if available
            x1, y1, x2, y2 = roi
            if x2 > x1 and y2 > y1:
                img = img[y1:y2, x1:x2]
            img = cv2.resize(img, (self.img_size, self.img_size))

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        tensor = torch.from_numpy(img_rgb).permute(2, 0, 1).float() / 255.0

        # Normalization
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
        tensor = (tensor - mean) / std

        return tensor, torch.tensor(class_id, dtype=torch.long)

def load_gtsrb_samples(gtsrb_root: str = "GTSRB/Training", max_samples_per_class: int = 200):
    """
    Parses GTSRB directory structure and CSV annotation files.
    Returns (train_samples, val_samples, test_samples).
    """
    train_samples = []
    val_samples = []
    test_samples = []

    for class_id in range(43):
        class_dir = os.path.join(gtsrb_root, f"{class_id:05d}")
        if not os.path.exists(class_dir):
            continue

        csv_file = os.path.join(class_dir, f"GT-{class_id:05d}.csv")
        class_samples = []

        if os.path.exists(csv_file):
            with open(csv_file, "r") as f:
                reader = csv.reader(f, delimiter=";")
                headers = next(reader, None)  # Skip header
                for row in reader:
                    if len(row) >= 8:
                        filename = row[0]
                        w, h = int(row[1]), int(row[2])
                        x1, y1, x2, y2 = int(row[3]), int(row[4]), int(row[5]), int(row[6])
                        cls = int(row[7])
                        img_path = os.path.join(class_dir, filename)
                        if os.path.exists(img_path):
                            class_samples.append((img_path, (x1, y1, x2, y2), cls))
        else:
            # Fallback to listing .ppm files directly
            ppm_files = glob.glob(os.path.join(class_dir, "*.ppm"))
            for p in ppm_files:
                class_samples.append((p, (0, 0, 0, 0), class_id))

        # Shuffle and split
        random.seed(42)
        random.shuffle(class_samples)
        if max_samples_per_class:
            class_samples = class_samples[:max_samples_per_class]

        n_total = len(class_samples)
        n_train = int(n_total * 0.70)
        n_val = int(n_total * 0.15)

        train_samples.extend(class_samples[:n_train])
        val_samples.extend(class_samples[n_train:n_train + n_val])
        test_samples.extend(class_samples[n_train + n_val:])

    print(f"[GTSRB Loader] Ingested user dataset: {len(train_samples)} Train, {len(val_samples)} Val, {len(test_samples)} Test samples across 43 classes.")
    return train_samples, val_samples, test_samples

def export_test_gallery(test_samples: list, output_dir: str = "datasets/test/images", max_export: int = 100):
    """Exports test samples to standard JPEG images for web studio & API testing."""
    os.makedirs(output_dir, exist_ok=True)
    for idx, (img_path, roi, cls) in enumerate(test_samples[:max_export]):
        img = cv2.imread(img_path)
        if img is not None:
            x1, y1, x2, y2 = roi
            if x2 > x1 and y2 > y1:
                img = img[y1:y2, x1:x2]
            out_p = os.path.join(output_dir, f"gtsrb_cls{cls:02d}_{idx:04d}.jpg")
            cv2.imwrite(out_p, img)
    print(f"[GTSRB Loader] Exported {min(len(test_samples), max_export)} real test samples to {output_dir}")

if __name__ == "__main__":
    train_s, val_s, test_s = load_gtsrb_samples()
    export_test_gallery(test_s)
