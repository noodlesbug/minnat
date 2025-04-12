import yfinance as yf  # Library for accessing financial data from Yahoo Finance
import pandas as pd  # Library for working with tabular data
import requests  # Library for making HTTP requests
from bs4 import BeautifulSoup  # Library for parsing HTML

def get_sp500_tickers():
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'  
    response = requests.get(url)  # Send HTTP request to the page
    soup = BeautifulSoup(response.text, 'html.parser')  # Parse the HTML content
    table = soup.find('table', {'id': 'constituents'})  # Find the table containing the tickers

    # replace '.' with '-'  (e.g., BRK.B becomes BRK-B)
    # skip the first row, just the data rows/ skip header
    tickers = [row.find_all('td')[0].text.strip().replace(".", "-") for row in table.find_all('tr')[1:]] 
    return tickers  # list of ticker symbols

# financial fields want to retrieve 
desired_fields = [
    'symbol', 'trailingPE', 'priceToBook', 'priceToSalesTrailing12Months',
    'enterpriseToEbitda', 'enterpriseToRevenue', 'freeCashflow',
    'totalCash', 'totalDebt', 'debtToEquity', 'returnOnEquity', 'operatingMargins',
    'earningsQuarterlyGrowth', 'pegRatio', 'marketCap'
]

def load_data(tickers=None):
    if tickers is None:
        tickers = get_sp500_tickers()  # if no ticker, fetch all S&P 500 tickers

    data = []  # list to store each stock's data
    for ticker in tickers:  
        try:
            info = yf.Ticker(ticker).info  # Get company info using yfinance
            # Create a dictionary containing only the desired fields
            row = {field: info.get(field, None) for field in desired_fields}
            row['symbol'] = ticker  # Add the ticker symbol explicitly (redundant safeguard)
            data.append(row)  # Add the row to the data list
        except Exception as e:
            print(f"Error loading {ticker}: {e}")  # Log any error encountered for a ticker
            continue  # Skip to the next ticker if an error occurs

    df = pd.DataFrame(data)  # Convert list of dictionaries into a DataFrame
    return df  # Return the final dataset

# Entry point for standalone script execution
if __name__ == "__main__":
    df = load_data()  # Load the data into a DataFrame
    print(df.head())  # Print the first few rows for quick inspection
