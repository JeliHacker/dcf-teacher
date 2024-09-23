import requests
from annual_report_data import get_cik_from_symbol, HEADERS
import time

ignore = '''
<ins>**Capital Expenditures**</ins>: PaymentsToAcquirePropertyPlantAndEquipment, PaymentsForCapitalImprovements, PaymentsToAcquireProductiveAssets\
<ins>**Cash Flow from Operations**</ins>: NetCashProvidedByUsedInOperatingActivities, NetCashProvidedByUsedInOperatingActivitiesContinuingOperations,\
'''

def get_data_given_ticker_and_year_and_alternative_keys(ticker, year, alternative_keys):
    cik = get_cik_from_symbol(ticker.upper(), add_zeroes=True)
    
    time.sleep(0.11)
    
    company_facts = requests.get(
        f'https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json',
        headers=HEADERS
    ).json()
    
    for key in alternative_keys:
        try:
            all_data_for_key = [fact for fact in company_facts['facts']['us-gaap'][key]['units']['USD'] if fact['form'] == '10-K']
            all_data_for_key = [fact for fact in all_data_for_key if fact['end'].startswith(year)]
        except KeyError:
            print(f"KeyError for {key}")
            print(company_facts['facts']['us-gaap'].keys())
            continue
        print(all_data_for_key)
        if all_data_for_key:
            return all_data_for_key[0]['val']

if __name__ == '__main__':
    
    cik = get_cik_from_symbol('TSLA', add_zeroes=True)
    
    time.sleep(0.11)
    
    company_facts = requests.get(
        f'https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json',
        headers=HEADERS
    ).json()
    
    # print(company_facts['facts']['us-gaap'].keys())
    
    # ['NetCashProvidedByUsedInOperatingActivities', 'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations']
    print(get_data_given_ticker_and_year_and_alternative_keys('nke', '2023', ['PaymentsToAcquirePropertyPlantAndEquipment', 'PaymentsForCapitalImprovements', 'PaymentsToAcquireProductiveAssets']))