# py/income_dot_map.py

import pandas as pd
import altair as alt
import os
from utils.html_postprocess import fix_html_metadata

def plot_income_dot_map():
    """
    Creates a dot map showing income distribution by neighborhood.
    Returns the chart object for rendering in Quarto.
    """
    # Load data
    df = pd.read_csv("data/neighborhood_income_centroids.csv")
    
    # Create the chart with improved configuration
    chart = alt.Chart(df).mark_circle(size=200).encode(
        longitude='lon:Q',
        latitude='lat:Q',
        color=alt.Color('income:Q', 
                       scale=alt.Scale(scheme='viridis'),
                       title="Income ($)"),
        tooltip=[
            alt.Tooltip('neighborhood:N', title='Neighborhood'),
            alt.Tooltip('income:Q', title='Income ($)', format='$,.0f'),
            alt.Tooltip('resolution_rate:Q', title='Resolution Rate', format='.1%')
        ],
        size=alt.Size('resolution_time:Q', 
                     scale=alt.Scale(range=[100, 500]),
                     title='Avg. Resolution Time (hrs)')
    ).properties(
        title="Income and Resolution Time by Neighborhood",
        width="container",
        height=400
    ).configure_axis(
        grid=False,
        labels=False,
        domain=False,
        ticks=False,
        title=None
    ).configure_legend(
        labelFontSize=12,
        titleFontSize=13,
        orient='bottom'
    ).configure_view(
        stroke='transparent'
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
        'downloadFileName': 'income_dot_map',
        'theme': 'light'
    }

    # Save as HTML file for download link
    html_path = "outputs/income_dot_map.html"
    chart.save(html_path, embed_options=embed_options)
    
    # Use your existing HTML postprocessor
    fix_html_metadata(html_path, title_text="Income Dot Map – 311 Explorer")

    # Return the chart object for Quarto to render inline
    return chart