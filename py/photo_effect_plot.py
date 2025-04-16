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
    # Load data
    df = pd.read_csv("data/311_map_data.csv")

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
    
    # Calculate percentage difference
    with_photo = plot_df.loc[plot_df['photo.dumm'] == 1, 'avg_time'].values[0]
    no_photo = plot_df.loc[plot_df['photo.dumm'] == 0, 'avg_time'].values[0]
    percent_diff = (no_photo - with_photo) / no_photo * 100
    
    # Add annotation data
    annotation_df = pd.DataFrame({
        'x': ['With Photo'],
        'y': [with_photo + 50],  # Position slightly above the bar
        'text': [f"{percent_diff:.0f}% faster"]
    })

    # Create the chart with improved configuration
    bars = alt.Chart(plot_df).mark_bar(size=60).encode(
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
    )
    
    # Add annotation for percentage difference
    annotation = alt.Chart(annotation_df).mark_text(
        fontSize=13,
        fontWeight='bold',
        color='#1f77b4'
    ).encode(
        x='x:N',
        y='y:Q',
        text='text:N'
    )
    
    # Combine chart components
    chart = (bars + annotation).properties(
        title="Photo Evidence Reduces Resolution Time",
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
    fix_html_metadata(html_path, title_text="Photo Evidence – Resolution Explorer")

    # Return the chart object for Quarto to render inline
    return chart