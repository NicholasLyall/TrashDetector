"""
Export trained model to ONNX for Raspberry Pi deployment.
Run after training: python export.py
"""
import torch
from pathlib import Path
from model import build_model
from config import MODEL_DIR, IMG_SIZE, BINS


def export_onnx():
    model = build_model(freeze_backbone=False)
    model.load_state_dict(torch.load(MODEL_DIR / "best_model.pth", map_location="cpu"))
    model.eval()

    dummy_input = torch.randn(1, 3, IMG_SIZE, IMG_SIZE)
    onnx_path = MODEL_DIR / "trash_classifier.onnx"

    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        input_names=["image"],
        output_names=["logits"],
        dynamic_axes={"image": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=17,
    )
    print(f"Exported to {onnx_path}")
    print(f"Classes: {BINS}")
    print("Copy trash_classifier.onnx to your Raspberry Pi.")


if __name__ == "__main__":
    export_onnx()
