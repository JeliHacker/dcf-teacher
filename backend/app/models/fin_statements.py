from pydantic import BaseModel
from typing import Optional, List, Dict

class FinancialStatement(BaseModel):
    Metric: str
    Year_1: Optional[str] = None
    Year_2: Optional[str] = None
    Year_3: Optional[str] = None

class FinancialDataResponse(BaseModel):
    income_statement: Optional[List[FinancialStatement]]
    balance_sheet: Optional[List[FinancialStatement]]
    cash_flow_statement: Optional[List[FinancialStatement]]
