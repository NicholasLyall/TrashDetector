"""
Pi Client — streams webcam frames to PC, receives servo commands, moves servos.
Run on Raspberry Pi after pc_server.py is running on the PC.
"""
import socket
import struct
import cv2
import numpy as np
import RPi.GPIO as GPIO
import time

PC_HOST = "192.168.4.30"
PC_PORT = 5050

# Servo GPIO pins
SERVO_1_PIN = 17
SERVO_2_PIN = 18

# Bin → servo positions (Servo1°, Servo2°)
BIN_POSITIONS = {
    "paper_cardboard": (0,  0),
    "metal_glass":     (90, 0),
    "plastic":         (0,  90),
    "trash":           (90, 90),
}


def angle_to_duty(angle):
    return 2.5 + (angle / 180.0) * 10.0


def move_servos(angle1, angle2):
    servo1.ChangeDutyCycle(angle_to_duty(angle1))
    servo2.ChangeDutyCycle(angle_to_duty(angle2))
    time.sleep(0.5)
    servo1.ChangeDutyCycle(0)
    servo2.ChangeDutyCycle(0)


def recv_all(sock, size):
    data = b""
    while len(data) < size:
        chunk = sock.recv(size - len(data))
        if not chunk:
            raise ConnectionError("Server disconnected")
        data += chunk
    return data


# GPIO setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_1_PIN, GPIO.OUT)
GPIO.setup(SERVO_2_PIN, GPIO.OUT)
servo1 = GPIO.PWM(SERVO_1_PIN, 50)
servo2 = GPIO.PWM(SERVO_2_PIN, 50)
servo1.start(0)
servo2.start(0)

# Connect to PC
print(f"Connecting to PC at {PC_HOST}:{PC_PORT}...")
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((PC_HOST, PC_PORT))
print("Connected. Streaming...")

cap = cv2.VideoCapture(0)

current_bin = None

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        # Encode and send frame
        _, jpg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 75])
        jpg_bytes = jpg.tobytes()
        sock.sendall(struct.pack(">I", len(jpg_bytes)) + jpg_bytes)

        # Receive command from PC
        response = recv_all(sock, 32).decode().strip()

        if response != "WAIT" and response in BIN_POSITIONS and response != current_bin:
            print(f"Moving to: {response}")
            current_bin = response
            angle1, angle2 = BIN_POSITIONS[response]
            move_servos(angle1, angle2)

except KeyboardInterrupt:
    print("Shutting down")
finally:
    cap.release()
    sock.close()
    servo1.stop()
    servo2.stop()
    GPIO.cleanup()
