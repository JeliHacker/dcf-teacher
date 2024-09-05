from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import google.generativeai as genai
from annual_report_data import return_csv_data

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your API key from an environment variable or a config file
API_KEY = os.getenv('API_KEY')
GEMINI_API_URL = "https://api.gemini.com/v1/chat"


genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/')
def home():
    return jsonify({"message": "You've found the backend for DCF Teacher."})


@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Test route working!"})

@app.route('/api/financial-data', methods=['GET'])
def get_financial_data():
    df = return_csv_data()
    return jsonify(df.to_dict(orient="records"))


@app.route('/api/ask', methods=['POST'])
def ask_gemini():
    print("Received request at /api/ask")
    user_prompt = request.json.get('prompt')
    print("user_prompt: ", user_prompt)
    response = model.generate_content(user_prompt)
    print(f"Generated response: {response}")
    print(f"type(respone): {type(response)}")
    
    return response.text
    

if __name__ == "__main__":
    app.run(debug=True)
