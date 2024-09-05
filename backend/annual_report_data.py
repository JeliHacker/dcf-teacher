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
    all_tickers_file_path = os.path.join(os.path.dirname(__file__), 'all_tickers.txt')
    with open(all_tickers_file_path, 'r') as file:
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


def return_csv_data():
    """
    RENAME THIS FUNCTION
    """
    print("cik = ", COMPANY_CIK)
    filings = get_10k_filings(cik=COMPANY_CIK)
    
    if not filings:
        return 
    
    most_recent_10k = filings[0]
    sections_urls = get_financial_statements_urls_given_accession_number(most_recent_10k['accessionNumber'])

    print("section_urls", sections_urls)
    i = 1
    for url in sections_urls:
        if i != 4:
            i += 1
            continue
        print("i", i, url)
        response = requests.get(url=url, headers=HEADERS)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        first_table = soup.find('table')
        print(first_table)
        print(type(first_table))

        header = first_table.find_all('th')[2:]  # Ignore the first two 'th' rows (non-relevant)
        years = [h.text.strip() for h in header]

        # Now, we extract the data rows (each financial entry)
        rows = first_table.find_all('tr')[3:]  # Skipping the header rows
        data = []

        for row in rows:
            columns = row.find_all('td')
            if len(columns) > 1:
                # Extract label and values for each year
                label = columns[0].text.strip()
                values = [col.text.strip() for col in columns[1:]]
                data.append([label] + values)

        # Create a DataFrame to better structure the data
        df = pd.DataFrame(data, columns=['Metric'] + years)

        # Write the extracted data to a CSV or HTML file
        df.to_csv('financial_data.csv', index=False)

        # Display the DataFrame
        print(df)

        i += 1

        return df
