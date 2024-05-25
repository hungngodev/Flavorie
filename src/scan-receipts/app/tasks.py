import re
import torch
from transformers import DonutProcessor, VisionEncoderDecoderModel
# from app.utils import post_process, match_ingredients
from app.utils import post_process
from PIL import Image
import os
from flask import current_app, jsonify
from app.notification import update_notification

def process_receipt_task(img):
    # img = Image.open(img_path).convert('RGB')
    try:
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
        structured_data = processor.token2json(sequence)

        structured_receipts = post_process(structured_data)
        # result = {
        #     'title': "Process invoice successfully",
        #     'data': structured_receipts
        # }

        # update_notification(taskId, 'SUCCESS', result)
    # result = {
    #     'status': 'processed',
    #     "data": structured_receipts
    # }

    # matched_items = match_ingredients(structured_receipts['items'])
    # return matched_items
        return structured_receipts
    except Exception as e:
        return jsonify(str(e))

    # return result

    
    #     socketio = current_app.socketio 
    #     socketio.emit('notification', {
    #     'taskId': taskId, 
    #     'status': 'SUCCESS', 
    #     'message': {
    #         'title': 'Complete processing receipt',
    #         'data': structured_receipts
    #     }
    # })
        # return jsonify({
        #     'taskId': current_app.task_id, 
        #     'status': 'SUCCESS', 
        #     'message': {
        #         'title': 'Complete processing receipt',
        #         'data': structured_receipts
        #     }
        # })
    # except Exception as e:
    #     update_notification(taskId, 'FAILURE', {
    #         'title': 'Failed', 
    #         'data': str(e)
    #     })
    #     socketio = current_app.socketio
    #     socketio.emit('notification', {
    #         'taskId': taskId,
    #         'status': 'FAILURE',
    #         'message': {
    #             'title': 'Fail',
    #             'data': str(e)
    #         }
    #     })
        # return jsonify({
        #     'taskId': current_app.task_id,
        #     'status': 'FAILURE',
        #     'message': {
        #         'title': 'Fail',
        #         'data': str(e)
        #     }
        # })

# def process_receipt_task(img):
#     # img = Image.open(file_path).convert('RGB')
#     final_output = use_model(img)
#     # os.remove(file_path)
#     return final_output