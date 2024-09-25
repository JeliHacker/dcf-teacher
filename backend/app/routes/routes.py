# app/routes.py

from fastapi import FastAPI, HTTPException, Query
from app.models import FinancialDataResponse, AskRequest
from app.services import return_financial_data, ask_gemini

app = FastAPI()

@app.get("/")
async def home():
    return {"message": "You've found the backend for DCF Teacher."}

@app.get("/api/test")
async def test_route():
    return {"message": "Test route working!"}

@app.get("/api/financial-data", response_model=FinancialDataResponse)
async def get_financial_data(ticker: str = Query(..., description="Stock ticker symbol")):
    financial_data = return_financial_data(ticker)
    if not financial_data:
        raise HTTPException(status_code=404, detail="No financial data found")
    return financial_data

@app.post("/api/ask")
async def ask_gemini_route(request_body: AskRequest):
    response_text = ask_gemini(request_body.prompt)
    return {"response": response_text}
