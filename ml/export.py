"""
Model Exporter for RoadSense AI.
Exports trained PyTorch weights to TorchScript (.torchscript) and ONNX (.onnx) for embedded deployment.
"""

import os
import torch
from .inference.detector import TrafficSignCNN

def export_models(weights_path: str = "models/traffic_sign_v1.pt", output_dir: str = "models"):
    os.makedirs(output_dir, exist_ok=True)
    device = torch.device("cpu")
    
    model = TrafficSignCNN(num_classes=23)
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
        print(f"Loaded weights from {weights_path}")
    model.eval()
    
    dummy_input = torch.randn(1, 3, 64, 64, device=device)
    
    # 1. Export to TorchScript
    ts_path = os.path.join(output_dir, "traffic_sign_model.torchscript")
    try:
        traced_cell = torch.jit.trace(model, dummy_input)
        traced_cell.save(ts_path)
        print(f"✓ Successfully exported TorchScript model to {ts_path}")
    except Exception as e:
        print(f"TorchScript export note: {e}")
        
    # 2. Export to ONNX
    onnx_path = os.path.join(output_dir, "traffic_sign_model.onnx")
    try:
        torch.onnx.export(
            model,
            dummy_input,
            onnx_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=["input"],
            output_names=["output"],
            dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
        )
        print(f"✓ Successfully exported ONNX model to {onnx_path}")
    except Exception as e:
        print(f"ONNX export note: {e}")

if __name__ == "__main__":
    export_models()
