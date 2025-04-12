import pandas as pd

# What're weakness of this model ?

# Define a function to compute the score based on 15 value-investing rules
def score_stock(row):
    score = 0

    # Rule 1: Low P/E
    if row['trailingPE'] is not None and row['trailingPE'] < 15:
        score += 1

    # Rule 2: Low P/B
    if row['priceToBook'] is not None and row['priceToBook'] < 1:
        score += 1

    # Rule 3: Low P/S
    if row['priceToSalesTrailing12Months'] is not None and row['priceToSalesTrailing12Months'] < 1:
        score += 1

    # Rule 4: High Earnings Yield (we use inverse of P/E)
    if row['trailingPE'] is not None and row['trailingPE'] > 0 and (1 / row['trailingPE']) > 0.08:
        score += 1

    # Rule 5: EV/EBITDA < 10
    if row['enterpriseToEbitda'] is not None and row['enterpriseToEbitda'] < 10:
        score += 1

    # Rule 6: Free Cash Flow Yield > 8%
    if row['freeCashflow'] is not None and row['marketCap'] is not None and row['marketCap'] > 0:
        fcf_yield = row['freeCashflow'] / row['marketCap']
        if fcf_yield > 0.08:
            score += 1

    # Rule 7: Low Debt-to-Equity
    if row['debtToEquity'] is not None and row['debtToEquity'] < 1:
        score += 1

    # Rule 8: High ROE
    if row['returnOnEquity'] is not None and row['returnOnEquity'] > 0.15:
        score += 1

    # Rule 9: Positive Operating Margin
    if row['operatingMargins'] is not None and row['operatingMargins'] > 0:
        score += 1

    # Rule 10: Positive Earnings Growth
    if row['earningsQuarterlyGrowth'] is not None and row['earningsQuarterlyGrowth'] > 0:
        score += 1

    # Rule 11: PEG < 1
    if row['pegRatio'] is not None and row['pegRatio'] < 1:
        score += 1

    # Rule 12: Total Cash > Total Debt
    if row['totalCash'] is not None and row['totalDebt'] is not None and row['totalCash'] > row['totalDebt']:
        score += 1

    # Rule 13: EV/Revenue < 2
    if row['enterpriseToRevenue'] is not None and row['enterpriseToRevenue'] < 2:
        score += 1

    # Rule 14: Market Cap exists (we'll just count presence for now)
    if row['marketCap'] is not None:
        score += 1

    # Rule 15: Bonus - All key fields present
    essential_keys = ['trailingPE', 'priceToBook', 'freeCashflow', 'marketCap']
    if all(row.get(k) is not None for k in essential_keys):
        score += 1

    return score

# Apply the scoring to a full DataFrame
def apply_scores(df):
    df['score'] = df.apply(score_stock, axis=1)
    return df

# Optional: show score distribution
import matplotlib.pyplot as plt

def plot_score_distribution(df):
    plt.figure(figsize=(10, 6))
    plt.hist(df['score'], bins=range(0, 17), edgecolor='black', align='left')
    plt.title('Value Score Distribution (0–15 scale)')
    plt.xlabel('Score')
    plt.ylabel('Number of Stocks')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig("score_distribution.pdf")  # Save the plot to a PDF file
    plt.show()

# Example usage (if run standalone)
if __name__ == "__main__":
    from data_loader import load_data
    df = load_data()
    scored_df = apply_scores(df)
    print(scored_df[['symbol', 'score']].sort_values(by='score', ascending=False).head())
    plot_score_distribution(scored_df)
