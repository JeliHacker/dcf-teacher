import fastapi
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv
from app.models.fin_statements import FinancialDataResponse

# Load your API key from an environment variable or a config file
load_dotenv()

router = fastapi.APIRouter()

API_KEY = os.getenv('API_KEY')
GEMINI_API_URL = "https://api.gemini.com/v1/chat"
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

@router.get("/financialdata/", response_model=FinancialDataResponse)
async def financial_data(ticker: str):
    if not ticker: 
        raise HTTPException(status_code=400, detail="No ticker provided")
    
    financial_data = return_financial_data(ticker)
    if not financial_data:
        raise HTTPException(status_code=404, detail="No financial data found")

    financial_data_dict = {
        'income_statement': financial_data['income_statement'].to_dict(orient="records"),
        'balance_sheet': financial_data['balance_sheet'].to_dict(orient="records"),
        'cash_flow_statement': financial_data['cash_flow_statement'].to_dict(orient="records")
    }

    return financia_data_dict

@router.post("/ask/")
async def ask_gemini(prompt: str):
    user_prompt = request.prompt
    response = model.generate_content(user_prompt)
    return {"response": response.text}