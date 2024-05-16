import json
import fasttext
import fasttext.util
from annoy import AnnoyIndex
import os
import numpy as np 
from sklearn.metrics.pairwise import cosine_similarity


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

# Match ingredients
# Load FastText model
fasttext.util.download_model('en', if_exists='ignore')
ft_model = fasttext.load_model('cc.en.300.bin')
# fasttext.util.reduce_model(ft_model, 100)
# ft_model.save_model('cc.en.100.bin')

# Load ingredients' name
INGREDIENTS_PATH = os.path.join(os.path.dirname(__file__), '../../flavorie.ingredients.json')

with open(INGREDIENTS_PATH, 'r') as f:
    file = json.load(f)
ingredient_names = [ingredient['name'] for ingredient in file]
ingredient_oid = {ingredient['name']: ingredient['_id']['$oid'] for ingredient in file}

# Build ANNOY index
annoy_index = AnnoyIndex(300, 'angular')

for i, ingredient in enumerate(file):
    name = ingredient['name']
    name_emb = ft_model.get_sentence_vector(name)
    annoy_index.add_item(i, name_emb)
annoy_index.build(70)


#Calculate cosine similiarity between query and returned items
def calculate_cosine(v1, v2):
    v1 = np.array(v1).reshape(1, -1)
    v2 = np.array(v2).reshape(1, -1)
    return cosine_similarity(v1, v2)[0][0]

def match_ingredients(items):
    matched_items = []
    for item in items:
        item_name = item['name']
        item_embedding = ft_model.get_sentence_vector(item_name)
        nearest_idx = annoy_index.get_nns_by_vector(item_embedding, 10, include_distances=False)
        similar_items = [ingredient_names[i] for i in nearest_idx]
        similar_items_ids = [ingredient_oid[ingredient_names[i]] for i in nearest_idx]
        item['similar_items'] = similar_items
        item['similar_items_ids'] = similar_items_ids
        matched_items.append(item)
    return matched_items


