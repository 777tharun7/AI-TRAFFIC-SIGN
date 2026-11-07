"""
Data Folder CSV & Image Loader for RoadSense AI.
Ingests dataset from the project's `data/` directory:
- data/signnames.csv (43 class mappings)
- data/Train.csv & data/Train/ (39,209 training images with ROIs)
- data/Test.csv & data/Test/ (12,630 test images with ROIs)
- data/Meta.csv & data/Meta/ (Reference sign templates & metadata)
"""

import os
import csv
import random
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader

class CSVTrafficSignDataset(Dataset):
    def __init__(self, samples: list, img_size: int = 64, is_train: bool = True):
        self.samples = samples
        self.img_size = img_size
        self.is_train = is_train

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, (x1, y1, x2, y2), class_id = self.samples[idx]
        
        img = cv2.imread(img_path)
        if img is None:
            img = np.zeros((self.img_size, self.img_size, 3), dtype=np.uint8)
        else:
            # Crop to ROI if available
            if x2 > x1 and y2 > y1 and (x2 - x1) >= 5 and (y2 - y1) >= 5:
                img = img[y1:y2, x1:x2]
            img = cv2.resize(img, (self.img_size, self.img_size))

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        tensor = torch.from_numpy(img_rgb).permute(2, 0, 1).float() / 255.0

        # Standard Normalization
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
        tensor = (tensor - mean) / std

        return tensor, torch.tensor(class_id, dtype=torch.long)

def load_data_folder_samples(data_dir: str = "data", max_train_per_class: int = 250, max_test_samples: int = 500):
    """
    Parses `data/Train.csv` and `data/Test.csv` resolving `/code/Train` to `data/Train` paths.
    """
    train_csv_path = os.path.join(data_dir, "Train.csv")
    test_csv_path = os.path.join(data_dir, "Test.csv")
    
    # 1. Read Train.csv
    train_by_class = {i: [] for i in range(43)}
    if os.path.exists(train_csv_path):
        with open(train_csv_path, "r") as f:
            reader = csv.reader(f)
            headers = next(reader, None) # Width,Height,Roi.X1,Roi.Y1,Roi.X2,Roi.Y2,ClassId,Path
            for row in reader:
                if len(row) >= 8:
                    x1, y1, x2, y2 = int(row[2]), int(row[3]), int(row[4]), int(row[5])
                    class_id = int(row[6])
                    rel_path = row[7].replace("/code/", "") # "Train/20/00020_00000.png"
                    img_path = os.path.join(data_dir, rel_path)
                    if os.path.exists(img_path):
                        train_by_class[class_id].append((img_path, (x1, y1, x2, y2), class_id))

    train_samples = []
    val_samples = []
    for cls_id, samples in train_by_class.items():
        random.seed(42)
        random.shuffle(samples)
        if max_train_per_class:
            samples = samples[:max_train_per_class]
        split_idx = int(len(samples) * 0.85)
        train_samples.extend(samples[:split_idx])
        val_samples.extend(samples[split_idx:])

    # 2. Read Test.csv
    test_samples = []
    if os.path.exists(test_csv_path):
        with open(test_csv_path, "r") as f:
            reader = csv.reader(f)
            headers = next(reader, None)
            for row in reader:
                if len(row) >= 8:
                    x1, y1, x2, y2 = int(row[2]), int(row[3]), int(row[4]), int(row[5])
                    class_id = int(row[6])
                    rel_path = row[7].replace("/code/", "")
                    img_path = os.path.join(data_dir, rel_path)
                    if os.path.exists(img_path):
                        test_samples.append((img_path, (x1, y1, x2, y2), class_id))

    if max_test_samples and len(test_samples) > max_test_samples:
        random.seed(42)
        random.shuffle(test_samples)
        test_samples = test_samples[:max_test_samples]

    print(f"[Data Folder Loader] Successfully ingested data/ folder: {len(train_samples)} Train, {len(val_samples)} Val, {len(test_samples)} Test samples across 43 classes.")
    return train_samples, val_samples, test_samples

def get_class_names_map(data_dir: str = "data") -> dict:
    signnames_path = os.path.join(data_dir, "signnames.csv")
    mapping = {}
    if os.path.exists(signnames_path):
        with open(signnames_path, "r") as f:
            reader = csv.reader(f)
            headers = next(reader, None)
            for row in reader:
                if len(row) >= 2:
                    mapping[int(row[0])] = row[1].strip()
    return mapping

if __name__ == "__main__":
    train_s, val_s, test_s = load_data_folder_samples()
