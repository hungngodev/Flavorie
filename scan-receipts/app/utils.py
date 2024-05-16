import json
import os
import string

import fasttext
import fasttext.util
import nltk
from annoy import AnnoyIndex
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from scipy.spatial.distance import cdist


# Extract related information from receipts 
def post_process(data):
    structured_receipts = {
        'items': [],
        'total': None
    }
    structured_receipts['total'] = data['total']
    for item in data['line_items']:
        item_name = item['item_name']
        item_price = item['item_value']
        item_quantity = item['item_quantity']
        structured_receipts['items'].append({'name': item_name, 'price': item_price, 'quantity': item_quantity})
    return structured_receipts

# Match ingredients
# Load FastText model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/cc.en.300.bin')
if MODEL_PATH:
    ft_model = fasttext.load_model(MODEL_PATH)

else:
    fasttext.util.download_model('en', if_exists='ignore')


# Preprocess text 
def preprocess(text):
    text = text.lower()
    text = "".join([char for char in text if char not in string.punctuation])
    words = nltk.word_tokenize(text)

    stop_words = set(stopwords.words('english'))
    words = [w for w in words if w not in stop_words]

    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]
    processed_text = " ".join(words)
    return processed_text

# Load ingredients' names
INGREDIENTS_PATH = os.path.join(os.path.dirname(__file__), '../../flavorie.ingredients.json')

with open(INGREDIENTS_PATH, 'r') as f:
    file = json.load(f)
ingredient_names = [ingredient['name'] for ingredient in file]
# print(ingredient_names)

ingredient_oid = {ingredient['name']: ingredient['_id']['$oid'] for ingredient in file}

# Build ANNOY index
annoy_index = AnnoyIndex(300, 'angular')

for i, ingredient in enumerate(file):
    name = ingredient['name']
    name_emb = ft_model.get_sentence_vector(preprocess(name))
    annoy_index.add_item(i, name_emb)
annoy_index.build(50)

def match_ingredients(items):
    matched_items = []
    for item in items:
        item_name = item['name']
        processed_item_name = preprocess(item_name)
        item_embedding = ft_model.get_sentence_vector(processed_item_name)
        # Get idx of 10 similar items
        similar_idx = annoy_index.get_nns_by_vector(item_embedding, 15)
        # print(similar_idx)

        # calculate cosine similarities of potential items and sort
        candidate_vectors = [ft_model.get_sentence_vector(preprocess(ingredient_names[i])) for i in similar_idx]
        
        cosine_similarities = 1 - cdist([item_embedding], candidate_vectors, 'cosine')[0]
        similar_items = [(cosine_similarities[i], ingredient_names[idx], ingredient_oid[ingredient_names[idx]]) for i, idx in enumerate(similar_idx)]

        similar_items.sort(key=lambda x: x[0], reverse=True)
        # print(similar_items)

        potential_matches = [val[1] for val in similar_items]
        potential_oids = [val[2] for val in similar_items]
        
        item['potential_matches'] = potential_matches
        item['potential_oids'] = potential_oids
        matched_items.append(item)
    return matched_items



