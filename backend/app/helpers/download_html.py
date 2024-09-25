import requests

HEADERS = {'User-Agent': "eli@stockpitcher.app"}
url = "https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm"
response = requests.get(url, headers=HEADERS)

if response.status_code == 200:
    with open("./backend/aapl-20230930.html", "w", encoding="utf-8") as file:
        file.write(response.text)
    print("HTML content downloaded and saved successfully!")
else:
    print(f"Failed to retrieve the content. Status code {response.status_code}")
