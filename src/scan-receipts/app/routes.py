from flask import Blueprint, request, jsonify
from app.tasks import process_receipt_task
from PIL import Image


main = Blueprint('main', __name__)

@main.route('/scan-receipts', methods=['POST'])

def scan_receipt():
    if 'receipt' not in request.files:
        return jsonify({"error": "No receipt variables"}), 400
    
    img_file = request.files['receipt']
    
    if img_file.name == "":
        return jsonify({"error": "No selected file"}), 400
    try:
        img = Image.open(img_file.stream).convert('RGB')

        final_res = process_receipt_task(img)
        return jsonify(final_res)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


