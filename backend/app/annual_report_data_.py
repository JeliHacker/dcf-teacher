import requests
import csv
import time
import os
from bs4 import BeautifulSoup
from dotenv import load_dotenv, find_dotenv
import pandas as pd
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

load_dotenv(find_dotenv())

HEADERS = {'User-Agent': os.getenv('USER_AGENT')}
BASE_URL = "https://www.sec.gov/Archives/edgar/data"
FINANCIAL_STATEMENT_KEYWORDS = {
    'income_statement': ['Income Statement', 'CONSOLIDATED STATEMENTS OF INCOME', 'Statement of Operations', 'Statement of Earnings', 'CONSOLIDATED STATEMENTS OF OPERATIONS'],
    'balance_sheet': ['Balance Sheet', 'Consolidated Statements of Financial Condition'],
    'cash_flow_statement': ['Cash Flow Statement', 'Statement of Cash Flows', 'Statements of Cash Flows']
}

def get_cik_from_symbol(stock_symbol: str, add_zeroes: bool = False) -> Optional[str]:
    """
    Retrieves the CIK (Central Index Key) for a given stock symbol from the 'all_tickers.txt' file.

    Args:
        stock_symbol (str): The stock symbol to retrieve the CIK for.
        add_zeroes (bool, optional): Whether to add leading zeroes to the CIK. Defaults to False.

    Returns:
        Optional[str]: The CIK for the given stock symbol, or None if not found.
    """
    all_tickers_file_path = os.path.join(os.path.dirname(__file__), 'all_tickers.txt')
    with open(all_tickers_file_path, 'r') as file:
        for line in file:
            parts = line.strip().split(', ')
            if len(parts) >= 4 and parts[1] == stock_symbol:
                return parts[2].zfill(10) if add_zeroes else parts[2]
    print(f"Error in get_cik_from_symbol. Could not find a CIK for that stock ticker, {stock_symbol}.")
    return None


def get_all_tickers(): 
    """
    Retrieves all company tickers from the SEC website and writes them to a CSV and TXT file.

    The function sends a GET request to the SEC website to retrieve a JSON object containing all company tickers.
    It then writes this data to a CSV file and converts the CSV file to a TXT file.

    Parameters:
        None

    Returns:
        None
    """
    # get all companies data
    company_tickers = requests.get(
        "https://www.sec.gov/files/company_tickers.json",
        headers=HEADERS
    ).json()

    all_tickers_txt_file_path = os.path.join(os.path.dirname(__file__), 'all_tickers.txt')
    all_tickers_csv_file_path = os.path.join(os.path.dirname(__file__), 'all_tickers.csv')
    with open(all_tickers_csv_file_path, "w") as file:
        for key in company_tickers:
            curr = company_tickers[key]
            file.write(f"{key},{curr['ticker']},{curr['cik_str']},{curr['title']}\n")

    convert_csv_to_txt(all_tickers_csv_file_path, all_tickers_txt_file_path)


def get_10k_filings(cik: str) -> List[Dict[str, str]]:
    """
    Retrieves a list of 10-K filings for a company with the given CIK.

    Args:
        cik (str): The Central Index Key of the company.

    Returns:
        List[Dict[str, str]]: A list of dictionaries containing information about each 10-K filing.
    """
    submissions_url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    response = requests.get(submissions_url, headers=HEADERS)
    time.sleep(0.11)
    data = response.json()
    filings = data['filings']['recent']
    
    indices_10Ks = [i for i, form in enumerate(filings['form']) if form == "10-K"]

    filings_10Ks = []
    for index in indices_10Ks:
        form_info_dict = {key: data['filings']['recent'][key][index] for key in data['filings']['recent']}
        filings_10Ks.append(form_info_dict)
        
    return filings_10Ks


def get_financial_statements_urls_given_accession_number(accession_number: str, cik: str) -> List[str]:
    """
    Retrieves a list of URLs for financial statements given an accession number and a CIK.

    Args:
        accession_number (str): The accession number of the financial statement.
        cik (str): The Central Index Key of the company.

    Returns:
        List[str]: A list of URLs for the financial statements.
    """
    urls = [f"https://www.sec.gov/Archives/edgar/data/{cik.lstrip('0')}/{accession_number.replace('-', '')}/R{i}.htm" for i in range(1, 10)]
    for url in urls:
        requests.get(url=url, headers=HEADERS)
        time.sleep(0.11)
    return urls


def identify_statement(title: str) -> Optional[str]:
    """
    Identify the type of financial statement based on the title.

    Args:
        title (str): The title of the financial statement.

    Returns:
        Optional[str]: The type of financial statement if found, None otherwise.
    """
    title_lower = title.lower()
    if 'parenthetical' in title_lower:
        return None
    for statement, keywords in FINANCIAL_STATEMENT_KEYWORDS.items():
        if any(keyword.lower() in title_lower for keyword in keywords):
            return statement
    return None


# @app.get("/financial-data/{ticker}", response_model=FinancialDataResponse)
def return_financial_data(ticker: str):
    """
    Retrieves the financial data for a given company ticker symbol.

    Args:
        ticker (str): The company ticker symbol.

    Returns:
        dict: A dictionary containing the financial data, including income statement, balance sheet, and cash flow statement.

    Raises:
        HTTPException: If the company CIK is not found or if no 10-K filings are found.
    """
    COMPANY_CIK = get_cik_from_symbol(ticker.upper(), add_zeroes=True)
    if not COMPANY_CIK:
        raise HTTPException(status_code=404, detail="Company CIK not found")

    filings = get_10k_filings(cik=COMPANY_CIK)
    if not filings:
        raise HTTPException(status_code=404, detail="No 10-K filings found")
    
    most_recent_10k = filings[0]
    sections_urls = get_financial_statements_urls_given_accession_number(most_recent_10k['accessionNumber'], cik=COMPANY_CIK)

    financial_data = {
        'income_statement': None,
        'balance_sheet': None,
        'cash_flow_statement': None
    }

    for url in sections_urls:
        response = requests.get(url=url, headers=HEADERS)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        first_table = soup.find('table')
        title_element = first_table.find('th')
        title = title_element.get_text(strip=True) if title_element else ""

        statement_type = identify_statement(title)
        if statement_type:
            header = first_table.find_all('th')[1:]  
            years = [h.text.strip() for h in header]

            rows = first_table.find_all('tr')[1:]
            data = []

            for row in rows:
                columns = row.find_all('td')
                if len(columns) > 1:
                    label = columns[0].text.strip()
                    values = [col.text.strip() for col in columns[1:]]
                    data.append([label] + values)

            if "Months Ended" in years[0]:
                years.pop(0)
            
            df = pd.DataFrame(data, columns=['Metric'] + years)

            financial_data[statement_type] = df.to_dict(orient="records")

            if all(df is not None and not df.empty for df in financial_data.values()):
                break

    return financial_data