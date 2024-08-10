import os
import string
import fasttext
import fasttext.util
from flask import jsonify
import nltk
from annoy import AnnoyIndex
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from scipy.spatial.distance import cdist
from bson import ObjectId
import numpy as np

# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')


# Extract related information from receipts
def post_process(data):
    structured_receipts = {"items": [], "total": None}
    structured_receipts["total"] = data["total"]
    for item in data["line_items"]:
        item_name = item["item_name"]
        item_price = item["item_value"]
        item_quantity = item["item_quantity"]
        structured_receipts["items"].append(
            {"name": item_name, "price": item_price, "quantity": item_quantity}
        )
    return structured_receipts


# Match ingredients
# Load FastText model
def load_fasttext_model():
    model_path = os.path.join(os.path.dirname(__file__), "../models/cc.en.300.bin")
    if os.path.exists(model_path):
        return fasttext.load_model(model_path)
    else:
        fasttext.util.download_model("en", if_exists="ignore")
        return fasttext.load_model("cc.en.300.bin")


ft_model = load_fasttext_model()


# Preprocess text
def preprocess(text):
    text = text.lower()
    text = "".join([char for char in text if char not in string.punctuation])
    words = nltk.word_tokenize(text)

    stop_words = set(stopwords.words("english"))
    words = [w for w in words if w not in stop_words]

    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]
    processed_text = " ".join(words)
    return processed_text


# Load ingredients' names
def get_ingredients(mongo_client):
    ingredient_collection = mongo_client.test.ingredients
    ingredient_cursor = list(ingredient_collection.find({}))
    ingredient_names = []
    ingredient_img = {}
    ingredient_oid = {}
    for ingredient in ingredient_cursor:
        name = ingredient["name"]
        ingredient_names.append(name)
        ingredient_img[name] = (
            "https://img.spoonacular.com/ingredients_250x250/"
            + ingredient.get("image", "No image")
        )
        ingredient_oid[name] = str(ingredient["_id"])
    return ingredient_names, ingredient_img, ingredient_oid


# Build ANNOY index
def build_annoy_idx(ft_model, ingredient_names):
    annoy_index = AnnoyIndex(ft_model.get_dimension(), "angular")
    for i, name in enumerate(ingredient_names):
        name_emb = ft_model.get_sentence_vector(preprocess(name))
        annoy_index.add_item(i, name_emb)
    annoy_index.build(50)
    return annoy_index


def match_ingredients(items, mongo_client):
    ingredient_names, ingredient_img, ingredient_oid = get_ingredients(mongo_client)
    annoy_index = build_annoy_idx(ft_model, ingredient_names)
    matched_items = []
    for item in items:
        item_name = item["name"]
        processed_item_name = preprocess(item_name)
        item_embedding = ft_model.get_sentence_vector(processed_item_name)

        # Get idx of 20 similar items
        similar_idx = annoy_index.get_nns_by_vector(item_embedding, 20)

        # calculate cosine similarities of potential items and sort
        candidate_vectors = [
            ft_model.get_sentence_vector(preprocess(ingredient_names[i]))
            for i in similar_idx
        ]

        cosine_similarities = (
            1 - cdist([item_embedding], candidate_vectors, "cosine")[0]
        )
        similar_items = [
            (
                cosine_similarities[i],
                ingredient_names[idx],
                ingredient_img[ingredient_names[idx]],
                ingredient_oid[ingredient_names[idx]],
            )
            for i, idx in enumerate(similar_idx)
        ]

        similar_items.sort(key=lambda x: x[0], reverse=True)
        potential_matches = []
        for val in similar_items:
            potential_items = {
                "potential_name": val[1],
                "potential_image": val[2],
                "potential_id": val[3],
            }
            potential_matches.append(potential_items)

        item["potential_matches"] = potential_matches
        matched_items.append(item)
    return matched_items

def get_angle(a, b, c):
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(np.degrees(radians))
    return angle

def get_distance (landmark_list):
    if (len(landmark_list)) < 2:
        return
    (x1, y1), (x2, y2) = landmark_list[0], landmark_list[1]
    L = np.hypot(x2 - x1, y2 - y1)
    return np.interp(L, [0, 1], [0, 1000])
