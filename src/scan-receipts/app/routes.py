from io import BytesIO
from flask import Blueprint, request, jsonify
import requests
from app.tasks import process_receipt_task
from PIL import Image

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
