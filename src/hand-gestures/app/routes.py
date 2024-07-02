from io import BytesIO

import cv2
import mediapipe as mp
import numpy as np
import pyautogui
from flask import Blueprint, jsonify, request
from PIL import Image
from pynput.mouse import Button, Controller

from .utils import get_angle, get_distance

mouse = Controller()
mpHands = mp.solutions.hands
hands = mpHands.Hands(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7,
    max_num_hands=1,
)

screen_width, screen_height = pyautogui.size()
main = Blueprint("main", __name__)

# index finger to move mouse
def move_mouse(idx_finger):
    if idx_finger:
        x = int(idx_finger.x * screen_width)
        y = int(idx_finger.y * screen_height)
        pyautogui.moveTo(x, y)


# 4 fingers for left arrow
def left_arrow(landmark_list):
    return (
        get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) > 90
        and get_angle(landmark_list[9], landmark_list[10], landmark_list[12]) > 90
        and get_angle(landmark_list[13], landmark_list[14], landmark_list[16]) > 90
        and get_angle(landmark_list[0], landmark_list[1], landmark_list[4]) > 90
        and get_angle(landmark_list[17], landmark_list[18], landmark_list[20]) > 90
    )


# 3 fingers for left click
def left_click(landmark_list, thumb_distance):
    return (
        get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) > 90
        and get_angle(landmark_list[9], landmark_list[10], landmark_list[12]) > 90
        and get_angle(landmark_list[13], landmark_list[14], landmark_list[16]) > 90
        and thumb_distance > 50
    )


# thumb finger for right arrow
def right_arrow(landmark_list):
    return (
        get_angle(landmark_list[9], landmark_list[10], landmark_list[12]) < 50
        and get_angle(landmark_list[0], landmark_list[1], landmark_list[4]) > 90
    )


# find index finger
def find_finger(processed):
    if processed.multi_hand_landmarks:
        hand_landmarks = processed.multi_hand_landmarks[0]
        return hand_landmarks.landmark[mpHands.HandLandmark.INDEX_FINGER_TIP]
    return None, None


def detect_gestures(frame, landmark_list, processed):
    if (len(landmark_list)) >= 21:
        idx_finger = find_finger(processed)

        thumb_distance = get_distance([landmark_list[4], landmark_list[5]])
        if (
            thumb_distance < 50
            and get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) > 90
        ):
            move_mouse(idx_finger)
        elif right_arrow(landmark_list):
            pyautogui.press("right")
        elif left_arrow(landmark_list):
            pyautogui.press("left")
        elif left_click(landmark_list, thumb_distance):
            mouse.press(Button.left)
            mouse.release(Button.left)


@main.route("/virtual-mouse", methods=["POST"])
def virtual_mouse():
    image = request.files["image"].read()
    img = Image.open(BytesIO(image))
    frame = np.array(img)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    frameRGB = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    processed = hands.process(frameRGB)

    landmark_list = []
    if processed.multi_hand_landmarks:
        hand_landmarks = processed.multi_hand_landmarks[0]
        for lm in hand_landmarks.landmark:
            landmark_list.append((lm.x, lm.y))
    detect_gestures(frame, landmark_list, processed)
    return jsonify({"status": "success"})
