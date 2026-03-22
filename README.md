# Trash Detector

An automated waste sorting system using a Raspberry Pi, webcam, and CLIP zero-shot image classification. Items placed under the camera are classified into one of 4 bins, and two servos route the waste to the correct bin.

## How It Works

1. A webcam on the Raspberry Pi streams frames over WiFi to a PC
2. The PC runs background subtraction to detect when an item is present
3. CLIP classifies the item into one of 4 categories using text descriptions
4. The PC sends the bin result back to the Pi
5. Two GPIO-controlled servos position the correct bin underneath

## Bins

| Bin | Contents |
|---|---|
| Paper / Cardboard | Clean flat paper, cardboard boxes |
| Metal / Glass | Metal cans, glass bottles and jars |
| Plastic | Plastic bottles, bags, cups, containers |
| Trash | Greasy/crumpled paper, food waste, general rubbish |

## Model

**Inference:** [CLIP](https://openai.com/research/clip) (`openai/clip-vit-base-patch32`) — zero-shot classification using text descriptions, no task-specific training required. Runs on PC GPU via HuggingFace Transformers.

**Training (kept for reference):** EfficientNet-Lite0 fine-tuned on [RealWaste](https://github.com/pedropro/RealWaste) — 4,752 real-world images across 9 original classes, remapped to 4 bins. Achieved 94.9% validation accuracy (v2). Training code retained in repo.

### CLIP Bin Prompts

Classification is driven entirely by these text descriptions — edit them in `pc_server.py` to adjust behaviour:

```python
"paper_cardboard": "flat brown corrugated cardboard box or clean flat sheet of paper or notebook paper or cardboard sheet for recycling"
"metal_glass":     "glass bottle or transparent glass jar or shiny metal can or aluminium can or tin can or steel can"
"plastic":         "plastic bottle or clear plastic cup or solo cup or plastic container or plastic bag or polythene"
"trash":           "crumpled dirty paper or greasy food wrapper or chip paper or greaseproof paper or soiled paper or food waste or general rubbish"
```

## Project Structure

```
TrashDetector/
├── pc_server.py       # runs on PC — CLIP inference, motion detection, UI, sends servo commands
├── pi_client.py       # runs on Pi — streams webcam frames, receives commands, moves servos
├── config.py          # bins, class mapping, hyperparameters
├── dataset.py         # RealWaste loader, augmentation, weighted sampler
├── model.py           # EfficientNet-Lite0 setup (training only)
├── train.py           # 2-phase training loop (training only)
├── export.py          # export trained model to ONNX (training only)
├── webcam_test.py     # local webcam demo with motion detection
├── data/realwaste/    # put RealWaste dataset here (training only)
└── models/            # saved model weights (training only)
```

## Setup

### Requirements
- **PC:** Python 3.11, NVIDIA GPU with CUDA 12.8
- **Pi:** Raspberry Pi 3B or newer, USB webcam, 2× servo motors

### PC Install

```bash
# Install PyTorch (CUDA 12.8)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128

# Install remaining dependencies
pip install -r requirements.txt
pip install transformers
```

### Pi Install

```bash
pip install opencv-python-headless RPi.GPIO numpy --index-url https://www.piwheels.org/simple
sudo apt-get install libatlas-base-dev
```

### Run

**PC first:**
```bash
py -3.11 pc_server.py
```

**Then Pi:**
```bash
python3 pi_client.py
```

CLIP (~600MB) downloads automatically on first run and is cached after that.

## Hardware

- Raspberry Pi 3B (or newer)
- Logitech Brio 101 webcam (USB)
- 2× servo motors wired to GPIO 17 and 18
- 4-bin sorting chute

### Servo Logic

2 servos × 2 positions = 4 bins:

| Bin | Servo 1 | Servo 2 |
|---|---|---|
| Paper/Cardboard | 0° | 0° |
| Metal/Glass | 90° | 0° |
| Plastic | 0° | 90° |
| Trash | 90° | 90° |
