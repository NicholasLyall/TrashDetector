# Trash Detector

An automated waste sorting system using a Raspberry Pi, webcam, and a fine-tuned EfficientNet-Lite0 classifier. Items placed under the camera are classified into one of 4 bins, and two servos route the waste to the correct bin.

## How It Works

1. A webcam mounted above a chute captures frames
2. Background subtraction detects when an item is present
3. EfficientNet-Lite0 classifies the item into one of 4 categories
4. Two GPIO-controlled servos position the correct bin underneath

## Bins

| Bin | Contents |
|---|---|
| Paper / Cardboard | Paper, cardboard |
| Metal / Glass | Metal cans, glass bottles |
| Plastic | All plastic types |
| Trash | Everything else (textiles, food waste, misc) |

## Model

- **Architecture:** EfficientNet-Lite0 (pretrained on ImageNet, fine-tuned on RealWaste)
- **Dataset:** [RealWaste](https://github.com/pedropro/RealWaste) — 4,752 real-world images across 9 original classes, remapped to 4 bins
- **Training:** 2-phase transfer learning — classifier head first, then full fine-tune
- **Validation accuracy:** 94.9% (v2)
- **Input size:** 224×224
- **Export format:** ONNX (runs on Pi via ONNX Runtime, no GPU needed)

### Training Breakdown

```
Phase 1 — 10 epochs, lr=1e-3
  Backbone frozen, only classifier head trained

Phase 2 — 30 epochs, lr=1e-4
  Full network fine-tuned end-to-end
```

Per-class results:

```
paper_cardboard   precision 0.95   recall 0.94   f1 0.94
metal_glass       precision 0.94   recall 0.93   f1 0.93
plastic           precision 0.90   recall 0.92   f1 0.91
trash             precision 0.98   recall 0.98   f1 0.98
```

## Project Structure

```
TrashDetector/
├── config.py          # bins, class mapping, hyperparameters
├── dataset.py         # RealWaste loader, augmentation, weighted sampler
├── model.py           # EfficientNet-Lite0 setup
├── train.py           # 2-phase training loop
├── export.py          # export trained model to ONNX
├── webcam_test.py     # live webcam demo with motion detection
├── data/realwaste/    # put RealWaste dataset here
└── models/            # saved model weights go here
```

## Setup

### Requirements
- Python 3.11
- NVIDIA GPU with CUDA 12.8 (for training)
- Raspberry Pi 4/5 (for deployment)

### Install

```bash
# Install PyTorch (CUDA 12.8)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128

# Install remaining dependencies
pip install -r requirements.txt
```

### Dataset

Download [RealWaste](https://github.com/pedropro/RealWaste) and place it at `data/realwaste/` so the folder contains subdirectories like `Cardboard/`, `Glass/`, etc.

### Train

```bash
python train.py
```

Saves best model to `models/best_model_v2.pth`. Training takes ~10 minutes on an RTX 4060+ with CUDA.

### Test with Webcam

```bash
python webcam_test.py
```

- Motion bar at the bottom shows how much has changed vs the background
- Blue threshold line — cross it to trigger classification
- Press **R** to recapture background if lighting changes
- Press **Q** to quit

### Export for Raspberry Pi

```bash
python export.py
```

Exports to `models/trash_classifier.onnx`. Copy this file to your Pi and run inference with `onnxruntime`.

## Raspberry Pi Deployment

Install ONNX Runtime on the Pi:

```bash
pip install onnxruntime
```

The `.onnx` model runs on CPU — no GPU required. Expected inference time ~125ms per frame on Pi 4.

## Hardware

- Raspberry Pi 4 or 5
- USB webcam (Logitech Brio 101 recommended)
- 2× servo motors wired to GPIO pins
- 4-bin sorting chute

### Servo Logic

2 servos give 4 bin positions (2-bit binary):

| Bin | Servo 1 | Servo 2 |
|---|---|---|
| Paper/Cardboard | 0° | 0° |
| Metal/Glass | 90° | 0° |
| Plastic | 0° | 90° |
| Trash | 90° | 90° |
