from flask import Blueprint, request, jsonify
from app.tasks import use_model
from PIL import Image


main = Blueprint('main', __name__)

@main.route('/scan-receipts', methods=['POST'])

def process_receipt():
    if 'receipt' not in request.files:
        return jsonify({"error": "No receipt variables"})
    
    img_file = request.files['receipt']
    if img_file.name == "":
        return jsonify({"error": "No selected file"})
    try:
        img = Image.open(img_file.stream).convert('RGB')
        final_res = use_model(img)
        return jsonify(final_res)
        # output_model = use_model(img)
        # structured_data = post_process(output_model)
        # return jsonify(structured_data)
    except Exception as e:
        return jsonify({"error": str(e)})


