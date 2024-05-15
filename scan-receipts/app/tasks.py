import re
from PIL import Image
import torch
from transformers import DonutProcessor, VisionEncoderDecoderModel

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