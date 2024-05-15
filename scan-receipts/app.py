from flask import Flask, request, jsonify
import re
from PIL import Image
import torch
from transformers import DonutProcessor, VisionEncoderDecoderModel
import json

app = Flask(__name__)
@app.route('/scan-receipts', methods= ['POST'])


def process_receipt():
    if 'receipt' not in request.files:
        return jsonify({"error": "No receipt variables"})
    
    img_file = request.files['receipt']
    if img_file.name == "":
        return jsonify({"error": "No selected file"})
    try:
        img = Image.open(img_file.stream).convert('RGB')
        output_model = use_model(img)
        structured_data = post_process(output_model)
        return jsonify(structured_data)
    except Exception as e:
        return jsonify({"error": str(e)})

def use_model(img):
    # img = Image.open(img_path).convert('RGB')
    processor = DonutProcessor.from_pretrained("AdamCodd/donut-receipts-extract")
    model = VisionEncoderDecoderModel.from_pretrained("AdamCodd/donut-receipts-extract")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    task_prompt = "<s_receipt>"
    decoder_input_ids = processor.tokenizer(task_prompt, add_special_tokens=False, return_tensors="pt").input_ids

    pixel_values = processor(img, return_tensors="pt").pixel_values
    outputs = model.generate(
    pixel_values.to(device),
    decoder_input_ids = decoder_input_ids.to(device),
    max_length = model.decoder.config.max_position_embeddings,
    pad_token_id = processor.tokenizer.pad_token_id,
    eos_token_id = processor.tokenizer.eos_token_id,
    use_cache=True,
    bad_words_ids=[[processor.tokenizer.unk_token_id]],
    return_dict_in_generate=True,
)
    sequence = processor.batch_decode(outputs.sequences)[0]
    sequence = sequence.replace(processor.tokenizer.eos_token, "").replace(processor.tokenizer.pad_token, "")
    sequence = re.sub(r"<.*?>", "", sequence, count=1).strip()  
    return processor.token2json(sequence)
def post_process(data):
    structured_receipts = {
        'items': [],
        'total': None
    }
    # data = use_model(img_path)
    # data = json.loads(response)
    structured_receipts['total'] = data['total']
    for item in data['line_items']:
        item_name = item['item_name']
        item_price = item['item_value']
        item_quantity = item['item_quantity']
        structured_receipts['items'].append({'name': item_name, 'price': item_price, 'quantity': item_quantity})
    return structured_receipts

    

if __name__ == "__main__":
    # image_path = '../test3.jpg'
    # print(post_process(image_path))
    app.run(port=5000, debug=True)
