from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import google.generativeai as genai
from annual_report_data import return_financial_data
import gemini_model

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
    print("Received request at /api/financial-data")
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
        'income_statement': financial_data[0]['income_statement'].to_dict(orient="records"),
        'balance_sheet': financial_data[0]['balance_sheet'].to_dict(orient="records"),
        'cash_flow_statement': financial_data[0]['cash_flow_statement'].to_dict(orient="records")
    }
    
    return jsonify(
    {
        "fin_dict": financial_data_dict,
        "original": financial_data[1]
    })


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

@app.route('/api/submit_multiple_choice_answer', methods=['POST'])
def submit_multiple_choice_answer():
    print("Received request at /api/submit_multiple_choice_answer")
    original_question = request.json.get('question')
    user_answer = request.json.get('answer')
    # relevant_data = request.json.get('data') # this is just an idea right now
    
    prompt = f"You just asked me a multiple choice question: {original_question}. My answer was '{user_answer}'. In a few sentences, evaluate my answer. Keep in mind that my answer might be incorrect. Tell me if I'm wrong."
    response = model.generate_content(prompt)
    print(f"Generated response: {response}")
    print(f"type(response): {type(response)}")
    
    return response.text


@app.route('/api/submit_open_response_answer', methods=['POST'])
def submit_open_response_answer():
    print('Received request at /api/submit_open_response_answer')
    # The question (or prompt, etc)
    # the financial data (what we have)
    # the user's answer
    
    question = request.json.get('question')
    user_answer = request.json.get('answer')
    financial_data = request.json.get('financial_data')
    print("question: ", question)
    print("user_answer: ", user_answer)
    print("data: ", financial_data)
    
    # # Example input payload structure
    # correct_category = data['correctCategory']  # The correct category for the financial statement
    
    prompt = f"You just asked the following question: {question}. My answer was '{user_answer}'."
    prompt += "Based on the financial data provided, can you evaluate my answer, telling me if I'm right, or explaining in a few sentences why I'm wrong? Keep in mind that my answer might be incorrect. Tell me if I'm wrong."
    prompt += "Financial data is as follows. For each category, the first number corresponds to 2023, the second number is 2022, and the third (if there is one) is for 2021. \n" 
    prompt += financial_data 
    print("The prompt is: ", prompt)
    response = model.generate_content(prompt)
    print(f"Generated response: {response}")
    print(f"type(response): {type(response)}")
    
    return response.text

@app.route('/api/sec_api', methods=['GET'])
def get_operating_cash_flows():
    """_summary_

    Returns:
        _type_: _description_
    """
    print('Received request at /api/sec_api')
    # The question (or prompt, etc)
    # the financial data (what we have)
    # the user's answer
    
    stock_ticker = request.args.get('stock_ticker')
    year = request.args.get('year')
    category = request.args.get('category')
    
    print("api/sec_api: ", stock_ticker, year, category)
    
    return jsonify({'message': 6969})


if __name__ == "__main__":
    app.run(debug=True)
