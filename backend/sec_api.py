import requests
from annual_report_data import get_cik_from_symbol, HEADERS
import time

ALTERNATIVE_KEYS = {
    'capital_expenditures': ['PaymentsToAcquirePropertyPlantAndEquipment', 'PaymentsForCapitalImprovements', 'PaymentsToAcquireProductiveAssets'],
    'cash_flows_from_operations': ['NetCashProvidedByUsedInOperatingActivities', 'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations']
}

def get_data_given_ticker_and_year_and_category(ticker, year, category):
    """Get data from the SEC API. This function acts as a wrapper. It's user friendly than interacting with SEC API directly, trust me.
    The valid categories are:\n
    capital_expenditures\n
    cash_flows_from_operations\n

    Args:
        ticker (str): e.g. AAPL
        year (int): e.g. 2023
        category (str): e.g. capital_expenditures

    Returns:
        int: The value for whatever category
    """
    try:
        alternative_keys = ALTERNATIVE_KEYS[category]
    except KeyError:
        return None
    
    cik = get_cik_from_symbol(ticker.upper(), add_zeroes=True)
    
    time.sleep(0.11)
    
    company_facts = requests.get(
        f'https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json',
        headers=HEADERS
    ).json()
    
    for key in alternative_keys:
        try:
            all_data_for_key = [fact for fact in company_facts['facts']['us-gaap'][key]['units']['USD'] if fact['form'] == '10-K']
            all_data_for_key = [fact for fact in all_data_for_key if fact.get('frame', '').endswith(year)]
        except KeyError:
            print(f"KeyError for {key}")
            print(company_facts['facts']['us-gaap'].keys())
            continue

        if all_data_for_key:
            return all_data_for_key[0]['val']


if __name__ == '__main__':
    print(get_data_given_ticker_and_year_and_category('aapl', '2023', 'cash_flows_from_operations'))