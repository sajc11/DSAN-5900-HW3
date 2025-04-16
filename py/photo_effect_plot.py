# py/photo_effect_plot.py

import pandas as pd
import altair as alt
import os
from utils.html_postprocess import fix_html_metadata

def plot_photo_effect():
    """
    Creates a bar chart showing resolution time with and without photo evidence.
    Returns the chart object for rendering in Quarto.
    """
    # Load data using the specified method for the large file
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "311_map_data.csv"))
    df = pd.read_csv(csv_path)
    
    # Print debug info
    print(f"Successfully loaded data with {len(df)} rows")

    # Prepare data for plotting
    plot_df = (
        df.groupby("photo.dumm")
        .agg(avg_time=("resolution_time", "mean"))
        .reset_index()
    )

    plot_df["photo_label"] = plot_df["photo.dumm"].map({
        0: "No Photo",
        1: "With Photo"
    })
    
    # Simple bar chart without annotation - more reliable rendering
    chart = alt.Chart(plot_df).mark_bar().encode(
        x=alt.X("photo_label:N", 
                title="", 
                axis=alt.Axis(labelFontSize=13)),
        y=alt.Y("avg_time:Q", 
                title="Average Resolution Time (hrs)", 
                axis=alt.Axis(labelFontSize=13)),
        color=alt.Color("photo_label:N", 
                       scale=alt.Scale(scheme="blues"), 
                       legend=None),
        tooltip=[
            alt.Tooltip("photo_label:N", title="Photo Evidence"),
            alt.Tooltip("avg_time:Q", format=".0f", title="Avg. Resolution Time (hrs)")
        ]
    ).properties(
        title="Photo Evidence Reduces Resolution Time",
        width=400,  # Fixed width instead of container
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
        'actions': True,          # Show the action menu
        'renderer': 'svg',        # Use SVG for sharper rendering
        'scaleFactor': 2,         # For better rendering on high-DPI displays
        'downloadFileName': 'photo_effect_chart',  # Default download filename
        'theme': 'light'          # Use light theme
    }

    # Save as HTML file for download link
    html_path = "outputs/photo_effect_chart.html"
    chart.save(html_path, embed_options=embed_options)
    
    # Use your existing HTML postprocessor
    try:
        fix_html_metadata(html_path, title_text="Photo Evidence – Resolution Explorer")
    except Exception as e:
        print(f"Warning: Could not fix HTML metadata: {e}")

    # Return the chart object for Quarto to render inline
    return chart