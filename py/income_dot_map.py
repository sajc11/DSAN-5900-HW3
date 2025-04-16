# py/income_dot_map.py

import pandas as pd
import altair as alt
import os
from utils.html_postprocess import fix_html_metadata

def plot_income_dot_map():
    """
    Creates a dot map showing income by neighborhood.
    Returns the chart object for rendering in Quarto.
    """
    # Load the neighborhood income data
    try:
        # First try the standard path
        df = pd.read_csv("data/neighborhood_income_centroids.csv")
    except FileNotFoundError:
        try:
            # Try a path relative to the current file
            current_dir = os.path.dirname(os.path.abspath(__file__))
            df = pd.read_csv(os.path.join(current_dir, "..", "data", "neighborhood_income_centroids.csv"))
        except FileNotFoundError:
            # Last resort: try direct path relative to the parent directory
            df = pd.read_csv("../data/neighborhood_income_centroids.csv")
    
    # Print debug info
    print(f"Successfully loaded income data with {len(df)} rows")

    # For better encoding, make sure we have the right column names
    # Check if we need to rename longitude/latitude columns
    if 'longitude' not in df.columns and 'lon' in df.columns:
        df = df.rename(columns={'lon': 'longitude'})
    if 'latitude' not in df.columns and 'lat' in df.columns:
        df = df.rename(columns={'lat': 'latitude'})

    # Create the chart with improved configuration
    chart = alt.Chart(df).mark_circle(size=150).encode(
        longitude='longitude:Q',
        latitude='latitude:Q',
        color=alt.Color('income:Q', scale=alt.Scale(scheme='blues'), title='Average Income'),
        tooltip=[
            alt.Tooltip('neighborhood:N', title='Neighborhood'),
            alt.Tooltip('income:Q', format='$,.0f', title='Avg Income')
        ]
    ).properties(
        title='San Francisco Neighborhoods — Avg. Income (Centroid Map)',
        width='container',
        height=500
    ).project(
        type='mercator'
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
        'downloadFileName': 'income_dot_map',
        'theme': 'light'
    }

    # Save as HTML file for download link
    html_path = "outputs/income_dot_map.html"
    chart.save(html_path, embed_options=embed_options)
    
    # Use your existing HTML postprocessor
    try:
        fix_html_metadata(html_path, title_text="Income Dot Map – 311 Explorer")
    except Exception as e:
        print(f"Warning: Could not fix HTML metadata: {e}")

    # Return the chart object for Quarto to render inline
    return chart