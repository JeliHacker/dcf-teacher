import requests
import csv
from helpers import convert_csv_to_txt
import time
import os
from bs4 import BeautifulSoup
from dotenv import load_dotenv, find_dotenv
import pandas as pd
load_dotenv(find_dotenv())


HEADERS = {'User-Agent': os.getenv('USER_AGENT')}
BASE_URL = "https://www.sec.gov/Archives/edgar/data"
FINANCIAL_STATEMENT_KEYWORDS = {
    'income_statement': ['Income Statement', 'CONSOLIDATED STATEMENTS OF INCOME', 'Statement of Operations', 'Statement of Earnings', 'CONSOLIDATED STATEMENTS OF OPERATIONS'],
    'balance_sheet': ['Balance Sheet', 'Consolidated Statements of Financial Condition'],
    'cash_flow_statement': ['Cash Flow Statement', 'Statement of Cash Flows', 'Statements of Cash Flows']
}

def get_cik_from_symbol(stock_symbol, add_zeroes: bool = False):
    all_tickers_file_path = os.path.join(os.path.dirname(__file__), 'all_tickers.txt')
    with open(all_tickers_file_path, 'r') as file:
        for line in file:
            parts = line.strip().split(', ')
            if len(parts) >= 4 and parts[1] == stock_symbol:
                if add_zeroes:
                    return parts[2].zfill(10)
                else:
                    return parts[2]
    print(f"Error in get_cik_from_symbol. Could not find a CIK for that stock ticker, {stock_symbol}.")
    return None


def get_all_tickers():
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


def get_10k_filings(cik):
    """
    Gets data about the 10-K filings for a company.
    Returns a list of dictionaries.
    """
    # Fetch the company's submissions
    submissions_url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    response = requests.get(submissions_url, headers=HEADERS)
    time.sleep(0.11)
    data = response.json()
    filings = data['filings']['recent']

    indices_10Ks = []
    i = 0
    for form in filings['form']:
        if form == "10-K":
            indices_10Ks.append(i)
        i += 1

    filings_10Ks = []
    # Construct URLs for 10-K filings
    filing_urls = []
    i = 0

    for index in indices_10Ks:
        form_info_dict = {}
        for key in data['filings']['recent']:
            key_data_at_index = data['filings']['recent'][key][index]
            form_info_dict[key] = key_data_at_index

        filings_10Ks.append(form_info_dict)
        
    return filings_10Ks


def get_financial_statements_urls_given_accession_number(accession_number, cik):
    urls = []
    for i in range(1, 10):
        url = f"https://www.sec.gov/Archives/edgar/data/{cik.lstrip('0')}/{accession_number.replace('-', '')}/R{i}.htm"
        response = requests.get(url=url, headers=HEADERS)
        urls.append(url)
        time.sleep(0.11)

    return urls






def identify_statement(title):
    """Identify the type of financial statement based on the title."""
    title_lower = title.lower()
    if ('parenthetical' in title_lower):
        return None
    for statement, keywords in FINANCIAL_STATEMENT_KEYWORDS.items():
        if any(keyword.lower() in title_lower for keyword in keywords):
            return statement
    return None


def return_financial_data(ticker):
    """
    Process multiple financial statements (Income Statement, Balance Sheet, Cash Flow Statement)
    from the SEC archive and return them.
    """
    COMPANY_CIK = get_cik_from_symbol(ticker.upper(), add_zeroes=True)
    filings = get_10k_filings(cik=COMPANY_CIK)
    
    if not filings:
        return 
    
    most_recent_10k = filings[0]
    sections_urls = get_financial_statements_urls_given_accession_number(most_recent_10k['accessionNumber'], cik=COMPANY_CIK)

    financial_data = {
        'income_statement': None,
        'balance_sheet': None,
        'cash_flow_statement': None
    }

    docArray = []

    i = 1
    for url in sections_urls:
        response = requests.get(url=url, headers=HEADERS)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        first_table = soup.find('table')
        title_element = first_table.find('th')
        title = title_element.get_text(strip=True) if title_element else ""

        # Identify the statement based on the title
        statement_type = identify_statement(title)
        if statement_type:
            print(f"Processing {statement_type} from {url}")
            header = first_table.find_all('th')[1:]  

            years = [h.text.strip() for h in header]

            # Extract the data rows (each financial entry)
            rows = first_table.find_all('tr')[1:]  # Skipping the header rows
            data = []
            doc = ""

            for row in rows:
                columns = row.find_all('td')
                if len(columns) > 1:
                    # Extract label and values for each year
                    label = columns[0].text.strip()
                    values = [col.text.strip() for col in columns[1:]]
                    data.append([label] + values)
            
            for fin in data:
                for line in fin:
                    doc = doc + line+"\n"
            docArray.append(doc)
            if "Months Ended" in years[0]:
                years.pop(0)
            
            df = pd.DataFrame(data, columns=['Metric'] + years)

            # Store the DataFrame in the corresponding key in the dictionary
            financial_data[statement_type] = df
            # print(f"Extracted {statement_type} data:\n", df)

            # Stop once all three statements are processed
            if all(df is not None and not df.empty for df in financial_data.values()):
                break

    return [financial_data, docArray]


if __name__ == "__main__":

    financial_data = return_financial_data('aapl')
