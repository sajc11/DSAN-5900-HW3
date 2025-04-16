# py/subset_selection_plot.py

import pandas as pd
import altair as alt
import os
from utils.html_postprocess import fix_html_metadata

def plot_subset_selection():
    """
    Creates a dual-panel chart showing R² and BIC metrics by number of features.
    Returns the chart object for rendering in Quarto.
    """
    # Create sample data
    data = pd.DataFrame({
        'num_features': [1, 2, 3, 4, 5, 6],
        'r_squared': [0.23, 0.41, 0.55, 0.62, 0.68, 0.69],
        'bic': [150.1, 130.4, 115.3, 110.7, 109.2, 109.9]
    })

    # Add a column to highlight the optimal point (minimum BIC)
    data['optimal'] = data['bic'] == data['bic'].min()
    
    # Create R² chart
    r2_chart = alt.Chart(data).mark_line(point=True).encode(
        x=alt.X('num_features:Q', 
                title="Number of Features",
                axis=alt.Axis(labelFontSize=12)),
        y=alt.Y('r_squared:Q', 
                title="R²",
                axis=alt.Axis(labelFontSize=12, format='.2f')),
        tooltip=[
            alt.Tooltip('num_features:Q', title='Number of Features'),
            alt.Tooltip('r_squared:Q', format='.2f', title='R²')
        ]
    ).properties(
        title="R² by Number of Features", 
        width=320, 
        height=300
    )
    
    # Add points with special highlight for optimal value
    r2_points = alt.Chart(data).mark_point(size=80).encode(
        x='num_features:Q',
        y='r_squared:Q',
        color=alt.condition(
            'datum.optimal',
            alt.value('#e63946'),  # Highlight color
            alt.value('#4c78a8')   # Default color
        ),
        stroke=alt.condition(
            'datum.optimal',
            alt.value('black'),    # Highlight stroke
            alt.value(None)        # Default no stroke
        ),
        strokeWidth=alt.condition(
            'datum.optimal',
            alt.value(1),         
            alt.value(0)           
        ),
        tooltip=[
            alt.Tooltip('num_features:Q', title='Number of Features'),
            alt.Tooltip('r_squared:Q', format='.2f', title='R²'),
            alt.Tooltip('optimal:N', title='Optimal Model')
        ]
    )
    
    # Complete R² visualization
    r2_viz = r2_chart + r2_points

    # Create BIC chart
    bic_chart = alt.Chart(data).mark_line(point=False).encode(
        x=alt.X('num_features:Q', 
                title="Number of Features",
                axis=alt.Axis(labelFontSize=12)),
        y=alt.Y('bic:Q', 
                title="BIC",
                axis=alt.Axis(labelFontSize=12, format='.1f')),
        tooltip=[
            alt.Tooltip('num_features:Q', title='Number of Features'),
            alt.Tooltip('bic:Q', format='.1f', title='BIC')
        ]
    ).properties(
        title="BIC by Number of Features", 
        width=320, 
        height=300
    )
    
    # Add points with special highlight for optimal value
    bic_points = alt.Chart(data).mark_point(size=80).encode(
        x='num_features:Q',
        y='bic:Q',
        color=alt.condition(
            'datum.optimal',
            alt.value('#e63946'),  # Highlight color
            alt.value('crimson')   # Default color
        ),
        stroke=alt.condition(
            'datum.optimal',
            alt.value('black'),    # Highlight stroke
            alt.value(None)        # Default no stroke
        ),
        strokeWidth=alt.condition(
            'datum.optimal',
            alt.value(1),         
            alt.value(0)           
        ),
        tooltip=[
            alt.Tooltip('num_features:Q', title='Number of Features'),
            alt.Tooltip('bic:Q', format='.1f', title='BIC'),
            alt.Tooltip('optimal:N', title='Optimal Model')
        ]
    )
    
    # Complete BIC visualization
    bic_viz = bic_chart + bic_points

    # Combine charts with independent y-scales
    chart = alt.hconcat(r2_viz, bic_viz).resolve_scale(
        y='independent'
    ).configure_axis(
        grid=False
    ).configure_view(
        stroke=None
    ).configure_title(
        fontSize=16, 
        anchor='start'
    ).configure_legend(
        disable=True  # No need for legend
    )

    # Make sure output directory exists
    os.makedirs("outputs", exist_ok=True)
    
    # Set up Vega embed options for better rendering
    embed_options = {
        'actions': True,
        'renderer': 'svg',
        'scaleFactor': 2,
        'downloadFileName': 'subset_selection_chart',
        'theme': 'light'
    }

    # Save as HTML file for download link
    html_path = "outputs/subset_selection_chart.html"
    chart.save(html_path, embed_options=embed_options)
    
    # Use your existing HTML postprocessor
    fix_html_metadata(html_path, title_text="Subset Selection – 311 Explorer")

    # Return the chart object for Quarto to render inline
    return chart