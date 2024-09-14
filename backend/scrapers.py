# scrapers.py
import requests
from bs4 import BeautifulSoup
import annual_report_data

def get_sp500_stocks():
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find('table', {'id': 'constituents'})
    stocks = []

    for row in table.findAll('tr')[1:]:
        stock = row.findAll('td')[0].text.strip()
        stocks.append(stock)

    return stocks


if __name__ == '__main__':
    array = get_sp500_stocks()
    data = [{"tkr":"", "data": None}]

    for tkr in array:
        print(tkr)
        finData = annual_report_data.return_financial_data(tkr)
        
    print(data)