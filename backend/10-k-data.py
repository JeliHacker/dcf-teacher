import requests
import csv
from helpers import convert_csv_to_txt
import time
import os


HEADERS = {'User-Agent': os.getenv('USER_AGENT')}

def get_cik_from_symbol(stock_symbol, add_zeroes: bool = False):
    with open("all_tickers.txt", 'r') as file:
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

    with open("all_tickers.csv", "w") as file:
        for key in company_tickers:
            curr = company_tickers[key]
            file.write(f"{key},{curr['ticker']},{curr['cik_str']},{curr['title']}\n")

    convert_csv_to_txt("all_tickers.csv", "all_tickers.txt")

get_all_tickers()


BASE_URL = "https://www.sec.gov/Archives/edgar/data"
COMPANY_CIK = get_cik_from_symbol("TSLA",add_zeroes=True)
print("cik = ", COMPANY_CIK)

def get_filings(cik):
    # Fetch the company's submissions
    submissions_url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    response = requests.get(submissions_url, headers=HEADERS)
    time.sleep(0.1)
    data = response.json()
    print("data['filings'].keys():", data['filings']['recent'].keys())
    filings = data['filings']['recent']
    print("type(filings)", len(filings))
    # print("len(filings):", len(filings), "len(filings['form']):", len(filings['form']), "len(filings['accessionNumber']):", len(filings['accessionNumber']))

    accession_numbers_10Ks = []
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
            print("key", key)
            key_data_at_index = data['filings']['recent'][key][index]
            form_info_dict[key] = key_data_at_index
            
            print("key-data-at-index", key_data_at_index)
        filings_10Ks.append(form_info_dict)
        

    return filing_urls

filings_urls = get_filings(cik=COMPANY_CIK)
print(len(filings_urls))

for url in filings_urls:
    print(url)
