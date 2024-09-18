from sec_edgar_downloader import Downloader
import os

def download_10k_html(ticker, num_filings):
    # Initialize the downloader
    downloader = Downloader("johnson subedi", "johnson.subedi@centre.edu")

    # Download the 10-K filings
    downloaded_files = downloader.get("10-K", ticker, limit=num_filings)

    print(f"Downloaded {(downloaded_files)} 10-K filing(s) for {ticker}")

    # Print out the paths of downloaded files
    # for file in downloaded_files:
    #     print(f"File downloaded: {file}")

    # Optionally, you can return the list of downloaded files
    return downloaded_files

# Usage
company_ticker = "NFLX"  # Example: Apple Inc.
num_filings = 1
downloaded_files = download_10k_html(company_ticker, num_filings)