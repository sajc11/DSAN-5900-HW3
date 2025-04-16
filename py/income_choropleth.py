# py/income_choropleth.py

import folium
import pandas as pd
import geopandas as gpd
import os
from utils.html_postprocess import fix_html_metadata

def plot_income_choropleth():
    """
    Creates a choropleth map of income by neighborhood in San Francisco.
    Returns the path to the HTML file.
    """
    # Load data
    df = pd.read_csv("data/neighborhood_income_centroids.csv")
    sf_geo = gpd.read_file("data/SF_Find_Neighborhoods_2025.geojson")

    # Merge data
    sf_geo = sf_geo.merge(df, left_on='name', right_on='neighborhood')

    # Make sure output directory exists
    os.makedirs("outputs", exist_ok=True)

    # Create map
    m = folium.Map(
        location=[37.76, -122.44], 
        zoom_start=12, 
        tiles="CartoDB positron",
        width='100%',
        height='100%'
    )
    
    # Add choropleth layer
    choropleth = folium.Choropleth(
        geo_data=sf_geo,
        data=sf_geo,
        columns=["neighborhood", "income"],
        key_on="feature.properties.neighborhood",
        fill_color="YlGnBu",
        fill_opacity=0.7,
        line_opacity=0.3,
        line_color="gray",
        legend_name="Average Income ($)",
        highlight=True,
        smooth_factor=1.0
    ).add_to(m)
    
    # Add tooltip layer
    folium.GeoJson(
        sf_geo,
        tooltip=folium.GeoJsonTooltip(
            fields=["neighborhood", "income"],
            aliases=["Neighborhood", "Income ($)"],
            localize=True,
            sticky=False,
            labels=True,
            style=("background-color: white; color: #333; font-family: Arial, sans-serif; "
                  "font-size: 12px; padding: 8px; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.15);")
        ),
        style_function=lambda x: {
            'fillOpacity': 0,
            'weight': 1.5,
            'color': 'white'
        }
    ).add_to(m)

    # Add a title
    title_html = '''
        <div style="position: fixed; 
                    top: 10px; 
                    left: 50%; 
                    transform: translateX(-50%);
                    z-index: 9999; 
                    background-color: white; 
                    padding: 10px; 
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    font-weight: bold;">
            Income Distribution Across San Francisco Neighborhoods
        </div>
    '''
    m.get_root().html.add_child(folium.Element(title_html))

    # Save to file
    output_path = "outputs/income_choropleth.html"
    m.save(output_path)
    
    # Improve the HTML
    fix_html_metadata(output_path, title_text="Income Choropleth – 311 Explorer")
    
    # Add custom CSS to make the map responsive
    with open(output_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    responsive_css = '''
    <style>
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        .folium-map {
            width: 100%;
            height: 100%;
        }
        @media (max-width: 768px) {
            .info.legend {
                font-size: 10px;
                padding: 6px;
            }
        }
    </style>
    '''
    
    if '</head>' in content:
        head_end = content.find('</head>')
        content = content[:head_end] + responsive_css + content[head_end:]
        
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(content)

    return output_path