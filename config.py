from pathlib import Path

# Paths
DATA_DIR = Path("realwaste-main/RealWaste")
MODEL_DIR = Path("models")
MODEL_DIR.mkdir(exist_ok=True)

# RealWaste 9 classes → your 4 bins
CLASS_MAP = {
    "paper":              "paper_cardboard",
    "cardboard":          "paper_cardboard",
    "metal":              "metal_glass",
    "glass":              "metal_glass",
    "plastic":            "plastic",
    "miscellaneous_trash":"trash",
    "textile_trash":      "trash",
    "food_organics":      "trash",
    "vegetation":         "trash",
}

BINS = ["paper_cardboard", "metal_glass", "plastic", "trash"]
NUM_CLASSES = len(BINS)

# Model
MODEL_NAME = "tf_efficientnet_lite0"
IMG_SIZE = 224

# Training
BATCH_SIZE = 32
NUM_WORKERS = 4
EPOCHS_HEAD = 10    # phase 1: train classifier head only
EPOCHS_FINETUNE = 30  # phase 2: fine-tune full model
LR_HEAD = 1e-3
LR_FINETUNE = 1e-4

# Device
DEVICE = "cuda"
