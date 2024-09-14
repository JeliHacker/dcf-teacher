from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import google.generativeai as genai
from annual_report_data import return_financial_data

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
    # Get the stock ticker from the query parameter (e.g., /api/financial-data?ticker=aapl)
    stock_ticker = request.args.get('ticker')

    if not stock_ticker:
        return jsonify({"error": "Stock ticker is required"}), 400

    # Call your function to get the financial data
    financial_data = return_financial_data(stock_ticker)
    
    # Ensure the financial_data contains DataFrames
    if not financial_data:
        return jsonify({"error": "No financial data found"}), 404

    # Convert the DataFrames to dictionaries
    financial_data_dict = {
        'income_statement': financial_data['income_statement'].to_dict(orient="records"),
        'balance_sheet': financial_data['balance_sheet'].to_dict(orient="records"),
        'cash_flow_statement': financial_data['cash_flow_statement'].to_dict(orient="records")
    }
    
    return jsonify(financial_data_dict)


@app.route('/api/ask', methods=['POST'])
def ask_gemini():
    print("Received request at /api/ask")
    user_prompt = request.json.get('prompt')
    print("user_prompt: ", user_prompt)
    response = model.generate_content(user_prompt)
    print(f"Generated response: {response}")
    print(f"type(respone): {type(response)}")
    
    return response.text

@app.route('/api/generate_question', methods=['POST'])
def generate_question():
    print("Received request at /api/generate_question")
    user_prompt = request.json.get('prompt')
    
    user_prompt = f"Generate a multiple choice question based on the following topic: {user_prompt}. Label the options A, B, C, and D."
    user_prompt += "Don't reveal the answer."
    print("The user_prompt is: ", user_prompt)
    response = model.generate_content(user_prompt)
    print(f"Generated response: {response}")
    print(f"type(response): {type(response)}")
    
    return response.text


if __name__ == "__main__":
    app.run(debug=True)
