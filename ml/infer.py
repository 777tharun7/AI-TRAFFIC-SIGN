"""
CLI Inference runner for RoadSense AI.
Usage:
python -m ml.infer --image datasets/test/images/sign_02_test_0000.jpg --output output.jpg
"""

import argparse
import json
import cv2
from .inference.detector import TrafficSignDetector

def main():
    parser = argparse.ArgumentParser(description="RoadSense AI Traffic Sign Inference")
    parser.add_argument("--image", type=str, required=True, help="Path to input image")
    parser.add_argument("--output", type=str, default="output_annotated.jpg", help="Path to save annotated image")
    parser.add_argument("--conf", type=float, default=0.45, help="Confidence threshold")
    args = parser.parse_args()
    
    detector = TrafficSignDetector(conf_threshold=args.conf)
    result = detector.detect(args.image)
    
    print("\n========== INFERENCE RESULT ==========")
    print(json.dumps(result, indent=2))
    print("======================================\n")
    
    if result.get("detections"):
        img = cv2.imread(args.image)
        if img is not None:
            annotated = detector.draw_detections(img, result["detections"])
            cv2.imwrite(args.output, annotated)
            print(f"Annotated visualization saved to {args.output}")

if __name__ == "__main__":
    main()
