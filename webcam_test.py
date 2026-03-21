import cv2
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import numpy as np
from model import build_model
from config import MODEL_DIR, IMG_SIZE, BINS, DEVICE

# Load model
device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")
model = build_model(freeze_backbone=False)
model.load_state_dict(torch.load(MODEL_DIR / "best_model.pth", map_location=device))
model.eval().to(device)

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

BIN_COLORS = {
    "glass":      (255, 200, 0),
    "recyclable": (0, 200, 0),
    "organic":    (0, 180, 255),
    "trash":      (60, 60, 60),
}

# How much of the crop needs to change to count as an object (tune this)
MOTION_THRESHOLD = 0.04  # 8% of pixels

cap = cv2.VideoCapture(0)
print("Webcam running — press Q to quit, R to recapture background")

# Let camera auto-exposure stabilise before capturing background
print("Warming up camera...")
for _ in range(60):
    cap.read()

# Capture fixed background reference
print("Capturing background — keep frame empty...")
bg_frames = []
while len(bg_frames) < 30:
    ret, frame = cap.read()
    if not ret:
        continue
    h, w = frame.shape[:2]
    size = min(h, w)
    y1 = (h - size) // 2
    x1 = (w - size) // 2
    crop = frame[y1:y1+size, x1:x1+size]
    gray = cv2.GaussianBlur(cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY), (5, 5), 0)
    bg_frames.append(gray.astype(np.float32))
background = np.mean(bg_frames, axis=0).astype(np.uint8)
print("Background captured.")

locked_result = None   # holds classification result while object is present

while True:
    ret, frame = cap.read()
    if not ret:
        break

    h, w = frame.shape[:2]
    size = min(h, w)
    y1 = (h - size) // 2
    x1 = (w - size) // 2
    crop = frame[y1:y1+size, x1:x1+size]

    # --- Motion detection (fixed background diff) ---
    gray_crop = cv2.GaussianBlur(cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY), (5, 5), 0)
    diff = cv2.absdiff(gray_crop, background)
    _, fg_mask = cv2.threshold(diff, 50, 255, cv2.THRESH_BINARY)
    changed_ratio = np.count_nonzero(fg_mask) / fg_mask.size
    object_present = changed_ratio > MOTION_THRESHOLD

    # --- Classification (only when object present) ---
    if object_present:
        pil_img = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
        tensor = transform(pil_img).unsqueeze(0).to(device)
        with torch.no_grad():
            logits = model(tensor)
            probs = F.softmax(logits, dim=1)[0]
        pred_idx = probs.argmax().item()
        locked_result = (BINS[pred_idx], probs[pred_idx].item(), probs)
    else:
        locked_result = None

    # --- Draw crop box ---
    if locked_result:
        pred_bin, confidence, probs = locked_result
        box_color = BIN_COLORS[pred_bin]
        label = f"{pred_bin}  {confidence*100:.1f}%"
        status = "OBJECT DETECTED"
        status_color = (0, 255, 0)
    else:
        box_color = (120, 120, 120)
        label = "waiting..."
        status = "EMPTY"
        status_color = (180, 180, 180)
        probs = None

    cv2.rectangle(frame, (x1, y1), (x1+size, y1+size), box_color, 2)
    cv2.rectangle(frame, (x1, y1 - 36), (x1 + size, y1), box_color, -1)
    cv2.putText(frame, label, (x1 + 8, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    # --- Class probability bars (left side) ---
    if probs is not None:
        for i, (bin_name, prob) in enumerate(zip(BINS, probs)):
            bar_w = int(prob.item() * 200)
            y = 30 + i * 35
            cv2.rectangle(frame, (10, y), (10 + bar_w, y + 25), BIN_COLORS[bin_name], -1)
            cv2.putText(frame, f"{bin_name} {prob*100:.1f}%", (15, y + 18),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)

    # --- Motion meter (bottom of frame) ---
    meter_x1, meter_y1 = 10, h - 40
    meter_w = w - 20
    meter_h = 20
    fill = int(meter_w * min(changed_ratio / (MOTION_THRESHOLD * 2), 1.0))
    threshold_x = int(meter_w * 0.5)  # threshold line sits at 50% of the bar

    # background track
    cv2.rectangle(frame, (meter_x1, meter_y1), (meter_x1 + meter_w, meter_y1 + meter_h), (50, 50, 50), -1)
    # fill colour: green if above threshold, grey if below
    fill_color = (0, 220, 0) if object_present else (160, 160, 160)
    cv2.rectangle(frame, (meter_x1, meter_y1), (meter_x1 + fill, meter_y1 + meter_h), fill_color, -1)
    # threshold marker line
    cv2.line(frame, (meter_x1 + threshold_x, meter_y1 - 4),
             (meter_x1 + threshold_x, meter_y1 + meter_h + 4), (0, 100, 255), 2)
    cv2.putText(frame, f"motion {changed_ratio*100:.1f}%  |  threshold {MOTION_THRESHOLD*100:.0f}%",
                (meter_x1, meter_y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

    # --- Status indicator (top right) ---
    cv2.putText(frame, status, (w - 220, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)

    cv2.imshow("Trash Detector", frame)
    key = cv2.waitKey(1) & 0xFF
    if key == ord("q"):
        break
    elif key == ord("r"):
        bg_frames = []
        while len(bg_frames) < 30:
            ret, f = cap.read()
            if not ret:
                continue
            c = f[y1:y1+size, x1:x1+size]
            gray = cv2.GaussianBlur(cv2.cvtColor(c, cv2.COLOR_BGR2GRAY), (5, 5), 0)
            bg_frames.append(gray.astype(np.float32))
        background = np.mean(bg_frames, axis=0).astype(np.uint8)
        print("Background recaptured")

cap.release()
cv2.destroyAllWindows()
