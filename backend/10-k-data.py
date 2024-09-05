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

def get_cik_from_symbol(stock_symbol, add_zeroes: bool = False):
    with open("./backend/all_tickers.txt", 'r') as file:
        for line in file:
            parts = line.strip().split(', ')
            if len(parts) >= 4 and parts[1] == stock_symbol:
                if add_zeroes:
                    return parts[2].zfill(10)
                else:
                    return parts[2]
    print("Error in get_cik_from_symbol. Could not find a CIK for that stock ticker.")
    return None


def get_all_tickers():
    # get all companies data
    company_tickers = requests.get(
        "https://www.sec.gov/files/company_tickers.json",
        headers=HEADERS
    ).json()

    with open("./backend/all_tickers.csv", "w") as file:
        for key in company_tickers:
            curr = company_tickers[key]
            file.write(f"{key},{curr['ticker']},{curr['cik_str']},{curr['title']}\n")

    convert_csv_to_txt("./backend/all_tickers.csv", "./backend/all_tickers.txt")





def get_10k_filings(cik):
    """
    Gets data about the 10-K filings for a company.
    Returns a list of dictionaries.
    """
    # Fetch the company's submissions
    submissions_url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    response = requests.get(submissions_url, headers=HEADERS)
    time.sleep(0.1)
    data = response.json()
    filings = data['filings']['recent']

    indices_10Ks = []
    i = 0
    for form in filings['form']:
        if form == "10-K":
            indices_10Ks.append(i)
        i += 1

    print(indices_10Ks)

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


def get_financial_statements_urls_given_accession_number(accession_number):
    urls = []
    for i in range(1, 10):
        url = f"https://www.sec.gov/Archives/edgar/data/{COMPANY_CIK.lstrip('0')}/{accession_number.replace('-', '')}/R{i}.htm"
        response = requests.get(url=url, headers=HEADERS)
        urls.append(url)
        time.sleep(0.11)

    return urls


COMPANY_CIK = get_cik_from_symbol("AAPL", add_zeroes=True)


def main():
    print("cik = ", COMPANY_CIK)
    filings = get_10k_filings(cik=COMPANY_CIK)
    
    if not filings:
        return 
    
    most_recent_10k = filings[0]
    sections_urls = get_financial_statements_urls_given_accession_number(most_recent_10k['accessionNumber'])

    print(sections_urls[4])
    response = requests.get(url=sections_urls[4], headers=HEADERS)
    soup = BeautifulSoup(response.content, 'html.parser')
    print(type(soup))
    with open("section5.html", "w", encoding='utf-8') as file:
        file.write(soup.prettify())

    # Extract the table headers (dates)
    headers = []
    for th in soup.find_all('th', class_='th'):
        headers.append(th.get_text(strip=True))

    # Extract the row data (items and values)
    data = []
    rows = soup.find_all('tr')
    for row in rows[2:]:  # Skip the first two rows (header and category label)
        cols = row.find_all('td')
        item = cols[0].get_text(strip=True)
        values = [col.get_text(strip=True).replace('$', '').replace(',', '') for col in cols[1:]]
        data.append([item] + values)

    # Create a Pandas DataFrame
    df = pd.DataFrame(data, columns=["Item"] + headers)

    # Display the DataFrame
    print(df)

main()