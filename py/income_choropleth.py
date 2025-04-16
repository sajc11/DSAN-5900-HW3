# py/income_choropleth.py

import folium
import pandas as pd
import geopandas as gpd
import os
import json
from utils.html_postprocess import fix_html_metadata

def plot_income_choropleth():
    """
    Creates a full-screen choropleth map that works well in iframes.
    Returns the path to the HTML file.
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
    
    # Load the geojson data
    try:
        sf_geo = gpd.read_file("data/SF_Find_Neighborhoods_2025.geojson")
    except FileNotFoundError:
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            sf_geo = gpd.read_file(os.path.join(current_dir, "..", "data", "SF_Find_Neighborhoods_2025.geojson"))
        except FileNotFoundError:
            sf_geo = gpd.read_file("../data/SF_Find_Neighborhoods_2025.geojson")
    
    # Print debug info
    print(f"Successfully loaded income data with {len(df)} rows")
    print(f"Successfully loaded geo data with {len(sf_geo)} features")

    # Merge data
    sf_geo = sf_geo.merge(df, left_on='name', right_on='neighborhood')
    
    # Create a folium map
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
        highlight=True
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
            style="background-color: white; color: #333; font-size: 12px; padding: 6px;"
        ),
        style_function=lambda x: {
            'fillColor': 'transparent',
            'color': 'white',
            'weight': 1.5,
            'fillOpacity': 0.0
        }
    ).add_to(m)
    
    # Make sure output directory exists
    os.makedirs("outputs", exist_ok=True)
    
    # Create a custom HTML file with reliable full-screen behavior
    output_path = "outputs/income_choropleth.html"
    
    # Get the HTML template
    template_path = os.path.join(os.path.dirname(__file__), "templates", "choropleth_template.html")
    
    # If template doesn't exist, create a simple template
    if not os.path.exists(template_path):
        template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Income Choropleth – 311 Explorer</title>
    <style>
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        #map {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    </style>
    <!-- Folium required resources -->
    {{resources}}
</head>
<body>
    <div id="map"></div>
    
    <script>
        {{script}}
    </script>
</body>
</html>
        """
    else:
        with open(template_path, 'r') as f:
            template = f.read()
    
    # Save the map as string
    map_html = m.get_root().render()
    
    # Extract required resources (CSS and JS)
    resources = ""
    for line in map_html.split('\n'):
        if ('<link' in line and 'href' in line) or ('<script' in line and 'src' in line):
            resources += line + '\n'
    
    # Extract the script part
    start_marker = '<script>'
    end_marker = '</script>'
    script_start = map_html.find(start_marker) + len(start_marker)
    script_end = map_html.rfind(end_marker)
    script = map_html[script_start:script_end].strip()
    
    # Replace placeholders in template
    html_content = template.replace('{{resources}}', resources).replace('{{script}}', script)
    
    # Write the custom HTML file
    with open(output_path, 'w') as f:
        f.write(html_content)
    
    return output_path