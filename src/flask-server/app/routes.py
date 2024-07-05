from io import BytesIO
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import numpy as np
import pyautogui
import requests
from app.tasks import process_receipt_task
from PIL import Image
import cv2
import mediapipe as mp
from pynput.mouse import Controller
from .utils import get_angle, get_distance



main = Blueprint("main", __name__)

@main.route("/scan-receipts", methods=["POST"])
def scan_receipt():
    if "receipt" not in request.form:
        return jsonify({"error": "No receipt variables"}), 400

    # img_url received from nodejs
    img_url = request.form["receipt"]

    if img_url == "":
        return jsonify({"error": "No selected file"}), 400
    try:
        # fetch img data from url, stream=True allows writing even when the download is not done
        response = requests.get(img_url, stream=True)

        # if error occur, return httperror object
        response.raise_for_status()

        # response.content is in bytes
        img = Image.open(BytesIO(response.content)).convert("RGB")
        final_res = process_receipt_task(img, main.mongo_client)
        return final_res

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
# def move_mouse(idx_finger):
#     if idx_finger:
#         x = int(idx_finger.x * screen_width)
#         y = int(idx_finger.y * screen_height)
#         pyautogui.moveTo(x, y)


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
        # if (
        #     thumb_distance < 50
        #     and get_angle(landmark_list[5], landmark_list[6], landmark_list[8]) > 90
        # ):
        #     # move_mouse(idx_finger)
        #     return "move-mouse"
        if right_arrow(landmark_list):
            return "right-arrow"
        elif left_arrow(landmark_list):
            # pyautogui.press("left")
            # pyautogui.press("b")
            return "left-arrow"
        # elif left_click(landmark_list, thumb_distance):
            # mouse.press(Button.left)
            # mouse.release(Button.left)
            # return "left-click"

@cross_origin()

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
    action = detect_gestures(frame, landmark_list, processed)
    print("action", action)
    return jsonify({"status": "success", "action": action})
