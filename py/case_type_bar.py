# py/case_type_bar.py

import pandas as pd
import altair as alt
import os
from utils.html_postprocess import fix_html_metadata

def plot_case_type():
    """
    Creates a horizontal bar chart showing resolution rates by case type.
    Returns the chart object for rendering in Quarto.
    """
    # Load data using the specified method for the large file
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "311_map_data.csv"))
    df = pd.read_csv(csv_path)
    
    # Print debug info
    print(f"Successfully loaded data with {len(df)} rows")

    # Prepare data for plotting
    case_grouped = (
        df.groupby("case")
        .agg(
            resolution_rate=("resolution_rate", "mean"),
            count=("case", "count")
        )
        .reset_index()
        .sort_values("resolution_rate", ascending=False)
    )

    # Get top 10 cases by resolution rate
    top_n = case_grouped.head(10)

    # Create the chart with improved configuration
    chart = alt.Chart(top_n).mark_bar().encode(
        x=alt.X("resolution_rate:Q", 
                axis=alt.Axis(format=".0%", title="Resolution Rate", labelFontSize=12)),
        y=alt.Y("case:N", 
                sort='-x', 
                title="Case Type", 
                axis=alt.Axis(labelFontSize=12, labelLimit=200)),
        color=alt.value("#4c78a8"),
        tooltip=[
            alt.Tooltip("case:N", title="Case Type"),
            alt.Tooltip("resolution_rate:Q", format=".1%", title="Resolution Rate"),
            alt.Tooltip("count:Q", title="Cases Reported")
        ]
    ).properties(
        title="Top 311 Case Types by Resolution Rate",
        width="container",
        height=300
    ).configure_axis(
        grid=False
    ).configure_view(
        stroke=None
    ).configure_title(
        fontSize=16, 
        anchor='start'
    )

    # Make sure output directory exists
    os.makedirs("outputs", exist_ok=True)
    
    # Set up Vega embed options for better rendering
    embed_options = {
        'actions': True,
        'renderer': 'svg',
        'scaleFactor': 2,
        'downloadFileName': 'case_type_chart',
        'theme': 'light'
    }

    # Save as HTML file for download link
    html_path = "outputs/case_type_chart.html"
    chart.save(html_path, embed_options=embed_options)
    
    # Use your existing HTML postprocessor
    try:
        fix_html_metadata(html_path, title_text="Case Type Resolution – 311 Explorer")
    except Exception as e:
        print(f"Warning: Could not fix HTML metadata: {e}")

    # Return the chart object for Quarto to render inline
    return chart