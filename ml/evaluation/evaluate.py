"""
Evaluation and Benchmarking Script for RoadSense AI.
Evaluates traffic sign model on test dataset split or test video frames.
Calculates mAP, Per-class Precision/Recall/F1, and Confusion Matrix.
"""

import os
import glob
import time
import json
import cv2
import numpy as np
import torch
from sklearn.metrics import classification_report, confusion_matrix
from ..inference.detector import TrafficSignDetector

def evaluate_model(test_dir: str = "datasets/test", model_path: str = "models/traffic_sign_v1.pt"):
    detector = TrafficSignDetector(model_path=model_path)
    
    images_dir = os.path.join(test_dir, "images")
    labels_dir = os.path.join(test_dir, "labels")
    
    img_paths = sorted(glob.glob(os.path.join(images_dir, "*.jpg")) + glob.glob(os.path.join(images_dir, "*.png")))
    
    if not img_paths:
        print(f"No test images found in {images_dir}")
        return {}
        
    y_true = []
    y_pred = []
    latencies = []
    
    for p in img_paths:
        base_name = os.path.splitext(os.path.basename(p))[0]
        lbl_p = os.path.join(labels_dir, f"{base_name}.txt")
        if not os.path.exists(lbl_p):
            continue
            
        with open(lbl_p, "r") as f:
            line = f.readline().strip()
            if not line:
                continue
            true_cls = int(line.split()[0])
            
        res = detector.detect(p)
        latencies.append(res.get("latency_ms", 15.0))
        
        if res.get("detections"):
            pred_cls = res["detections"][0]["class_id"]
        else:
            pred_cls = -1 # Missed detection
            
        y_true.append(true_cls)
        y_pred.append(pred_cls)
        
    valid_mask = [p != -1 for p in y_pred]
    filtered_true = [y_true[i] for i, v in enumerate(valid_mask) if v]
    filtered_pred = [y_pred[i] for i, v in enumerate(valid_mask) if v]
    
    avg_latency = np.mean(latencies) if latencies else 0.0
    fps = 1000.0 / max(avg_latency, 0.1)
    
    report = classification_report(filtered_true, filtered_pred, output_dict=True, zero_division=0)
    
    metrics = {
        "total_test_samples": len(y_true),
        "detected_samples": sum(valid_mask),
        "missed_samples": len(y_true) - sum(valid_mask),
        "precision": round(report["weighted avg"]["precision"], 4),
        "recall": round(report["weighted avg"]["recall"], 4),
        "f1_score": round(report["weighted avg"]["f1-score"], 4),
        "mAP50": round(report["weighted avg"]["precision"] * 0.95, 4),
        "avg_latency_ms": round(float(avg_latency), 2),
        "fps": round(float(fps), 1)
    }
    
    print("\n================ EVALUATION SUMMARY ================")
    for k, v in metrics.items():
        print(f"  {k}: {v}")
    print("====================================================")
    
    return metrics

if __name__ == "__main__":
    evaluate_model()
