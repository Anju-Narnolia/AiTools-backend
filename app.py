from dotenv import load_dotenv
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
import os

load_dotenv()

# ✅ Fix: getenv usage
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/flask_app")
client = MongoClient(MONGODB_URI)

db = client["flask_app"]
users = db["users"]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def home():
    return "hello to backend"
@app.route("/signup", methods=["POST"], strict_slashes=False)
def signup():
    try:
        # ✅ Ensure JSON parsing
        form_data = request.get_json()
        if not form_data:
            return jsonify({"error": "No data received"}), 400

        users.insert_one(form_data)
        return jsonify({"message": "Data inserted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_data", methods=["GET"], strict_slashes=False)
def get_data():
    try:
        data = list(users.find({}, {"_id": 0}))  # Exclude MongoDB _id
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000) 
