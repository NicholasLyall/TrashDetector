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
    "paper_cardboard": (70,  70),
    "metal_glass":     (110, 70),
    "plastic":         (70,  110),
    "trash":           (110, 110),
}


def angle_to_duty(angle):
    return 2.5 + (angle / 180.0) * 10.0


def move_servos(angle1, angle2):
    servo1.ChangeDutyCycle(angle_to_duty(angle1))
    time.sleep(0.5)
    servo1.ChangeDutyCycle(0)
    time.sleep(2.0)
    servo2.ChangeDutyCycle(angle_to_duty(angle2))
    time.sleep(0.5)
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
GPIO.setwarnings(False)
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

done = False
trigger_time = None
move_servos(110, 70)
print("Servos initialised — servo1=110° servo2=90°")

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

        if done:
            if time.time() - trigger_time >= 3.0:
                move_servos(110, 70)
                print("Returning to centre — ready for next item")
                done = False
                trigger_time = None
        elif response != "WAIT":
            angle1 = 150 if response in ("paper_cardboard", "plastic") else 70
            angle2 = 140 if response in ("metal_glass", "plastic") else 0
            print(f"Object detected ({response}) — servo1={angle1}° servo2={angle2}°")
            move_servos(angle1, angle2)
            done = True
            trigger_time = time.time()

except KeyboardInterrupt:
    print("Shutting down")
finally:
    cap.release()
    sock.close()
    servo1.stop()
    servo2.stop()
    GPIO.cleanup()
