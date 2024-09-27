import requests
import pandas as pd
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from annual_report_data import get_cik_from_symbol
import time
import os


HEADERS = {'User-Agent': os.getenv('USER_AGENT')}
COMPANY_TICKER = "AAPL"



def get_10k_values(data, key):
    """
    Get 10-K values
    :param data This is where company_facts go
    :param key This is the category you are looking for 10K values for
    """

    if key in data['facts']['us-gaap']:
        try:
            values = data['facts']['us-gaap'][key]['units']['USD']
        except KeyError:
            print(f"KeyError for {key}")
            return []
        return [entry for entry in values if entry.get('form') == '10-K']
    return []


if __name__ == '__main__':
    print('dcf calculator')
    COMPANY_FACTS = requests.get(
    f'https://data.sec.gov/api/xbrl/companyfacts/CIK{get_cik_from_symbol(COMPANY_TICKER, add_zeroes=True)}.json',
    headers=HEADERS
).json()