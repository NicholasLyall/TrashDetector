"""
PC Server — receives frames from Pi, runs motion detection + inference, displays UI, sends servo commands back.
Run this on your PC before starting pi_client.py on the Pi.
"""
import socket
import struct
import numpy as np
import cv2
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from config import DEVICE

HOST = "0.0.0.0"
PORT = 5050

MOTION_THRESHOLD = 0.025
PIXEL_DIFF_THRESHOLD = 8

BINS = ["paper_cardboard", "metal_glass", "plastic", "trash"]

BIN_COLORS = {
    "paper_cardboard": (0, 180, 255),
    "metal_glass":     (255, 200, 0),
    "plastic":         (0, 200, 0),
    "trash":           (60, 60, 60),
}

# Text prompts — tweak these to improve accuracy
BIN_PROMPTS = {
    "paper_cardboard": "flat brown corrugated cardboard box or clean flat sheet of paper or notebook paper or cardboard sheet for recycling",
    "metal_glass":     "glass bottle or transparent glass jar or shiny metal can or aluminium can or tin can or steel can",
    "plastic":         "plastic bottle or clear plastic cup or solo cup or plastic container or plastic bag or polythene",
    "trash":           "crumpled dirty paper or greasy food wrapper or chip paper or greaseproof paper or soiled paper or food waste or general rubbish",
}
PROMPTS = [BIN_PROMPTS[b] for b in BINS]

# Load CLIP
device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")
print("Loading CLIP...")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model.eval()
print(f"CLIP loaded on {device}")


def classify_frame(frame):
    pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    inputs = clip_processor(text=PROMPTS, images=pil_img, return_tensors="pt", padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = clip_model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)[0]
    pred_bin = BINS[probs.argmax().item()]
    return pred_bin, probs


def recv_all(conn, size):
    data = b""
    while len(data) < size:
        chunk = conn.recv(size - len(data))
        if not chunk:
            raise ConnectionError("Pi disconnected")
        data += chunk
    return data


def draw_ui(frame, changed_ratio, object_present, locked_result, background_ready):
    h, w = frame.shape[:2]

    if not background_ready:
        cv2.putText(frame, "Calibrating background...", (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 200, 255), 2)
        return frame

    # Status
    if object_present and locked_result:
        pred_bin, probs = locked_result
        status, status_color = "OBJECT DETECTED", (0, 255, 0)
        box_color = BIN_COLORS[pred_bin]
        label = f"{pred_bin}  {probs.max().item()*100:.1f}%"
    else:
        status, status_color = "EMPTY", (180, 180, 180)
        box_color = (120, 120, 120)
        label = "waiting..."
        probs = None

    # Crop box outline
    size = min(h, w)
    y1 = (h - size) // 2
    x1 = (w - size) // 2
    cv2.rectangle(frame, (x1, y1), (x1+size, y1+size), box_color, 2)
    cv2.rectangle(frame, (x1, y1-36), (x1+size, y1), box_color, -1)
    cv2.putText(frame, label, (x1+8, y1-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    # Class probability bars
    if probs is not None:
        for i, (bin_name, prob) in enumerate(zip(BINS, probs)):
            bar_w = int(prob.item() * 200)
            y = 30 + i * 35
            cv2.rectangle(frame, (10, y), (10+bar_w, y+25), BIN_COLORS[bin_name], -1)
            cv2.putText(frame, f"{bin_name} {prob*100:.1f}%", (15, y+18),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    # Motion meter
    meter_x1, meter_y1 = 10, h - 40
    meter_w = w - 20
    fill = int(meter_w * min(changed_ratio / (MOTION_THRESHOLD * 2), 1.0))
    threshold_x = int(meter_w * 0.5)
    cv2.rectangle(frame, (meter_x1, meter_y1), (meter_x1+meter_w, meter_y1+20), (50, 50, 50), -1)
    fill_color = (0, 220, 0) if object_present else (160, 160, 160)
    cv2.rectangle(frame, (meter_x1, meter_y1), (meter_x1+fill, meter_y1+20), fill_color, -1)
    cv2.line(frame, (meter_x1+threshold_x, meter_y1-4),
             (meter_x1+threshold_x, meter_y1+24), (0, 100, 255), 2)
    cv2.putText(frame, f"motion {changed_ratio*100:.1f}%  |  threshold {MOTION_THRESHOLD*100:.0f}%",
                (meter_x1, meter_y1-6), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

    # Status top right
    cv2.putText(frame, status, (w-220, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)

    return frame


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind((HOST, PORT))
server.listen(1)
print(f"Waiting for Pi on port {PORT}...")

while True:
    conn, addr = server.accept()
    print(f"Pi connected from {addr}")

    background = None
    bg_frames = []
    locked_result = None

    try:
        while True:
            # Receive frame
            header = recv_all(conn, 4)
            frame_size = struct.unpack(">I", header)[0]
            jpg_bytes = recv_all(conn, frame_size)

            arr = np.frombuffer(jpg_bytes, dtype=np.uint8)
            frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)

            gray = cv2.GaussianBlur(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), (5, 5), 0)

            # Build background from first 30 frames
            if background is None:
                bg_frames.append(gray.astype(np.float32))
                if len(bg_frames) >= 30:
                    background = np.mean(bg_frames, axis=0).astype(np.uint8)
                    print("Background captured.")
                changed_ratio = 0
                object_present = False
                servo_cmd = b"WAIT".ljust(32)
            else:
                # Motion detection
                diff = cv2.absdiff(gray, background)
                _, fg_mask = cv2.threshold(diff, PIXEL_DIFF_THRESHOLD, 255, cv2.THRESH_BINARY)
                changed_ratio = np.count_nonzero(fg_mask) / fg_mask.size
                object_present = changed_ratio > MOTION_THRESHOLD

                if object_present:
                    pred_bin, probs = classify_frame(frame)
                    locked_result = (pred_bin, probs)
                    servo_cmd = pred_bin.encode().ljust(32)
                    print(f"  → {pred_bin} ({probs.max().item()*100:.1f}%)")
                else:
                    locked_result = None
                    servo_cmd = b"WAIT".ljust(32)

            # Send command back to Pi
            conn.sendall(servo_cmd)

            # Draw UI and display
            frame = draw_ui(frame, changed_ratio, object_present,
                           locked_result, background is not None)
            cv2.imshow("Pi Camera — Trash Detector", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    except ConnectionError:
        print("Pi disconnected, waiting for reconnect...")
        conn.close()
        cv2.destroyAllWindows()
