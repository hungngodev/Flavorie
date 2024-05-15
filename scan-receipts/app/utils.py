import fasttext
from annoy import AnnoyIndex
import fasttext.util

# Extract related information from receipts 
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

#Match ingredients
fasttext.util.download_model('en', if_exists='ignore')
ft_model = fasttext.load_model('cc.en.300.bin')
fasttext.util.reduce_model(ft_model, 100)
ft_model.save_model('cc.en.100.bin')
