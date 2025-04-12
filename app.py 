import streamlit as st
import matplotlib.pyplot as plt
from data_loader import load_data
from scoring_engine import apply_scores

st.set_page_config(page_title="S&P 500 Value Screener", layout="wide")

st.title("📈 S&P 500 Value Investing Screener")
st.markdown("""
This tool evaluates S&P 500 stocks using 15 value-investing criteria (based on Graham, Klarman, Buffett, etc.).
Each stock earns 1 point per criterion met, for a maximum score of 15.
""")

# Load and score the data
st.info("Loading S&P 500 data...")
df = load_data()
scored_df = apply_scores(df)

# Display score distribution histogram
st.subheader("Score Distribution")
fig, ax = plt.subplots(figsize=(10, 6))
ax.hist(scored_df['score'], bins=range(0, 17), edgecolor='black', align='left')
ax.set_title('Value Score Distribution (0–15 scale)')
ax.set_xlabel('Score')
ax.set_ylabel('Number of Stocks')
ax.grid(True)
st.pyplot(fig)

# Display scored table
st.subheader("Detailed Scores by Stock")
st.dataframe(scored_df[['symbol', 'score']].sort_values(by='score', ascending=False))

# Download button
csv = scored_df.to_csv(index=False)
st.download_button("Download CSV", csv, "scored_sp500.csv", "text/csv")
