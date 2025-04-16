import pandas as pd
import os

# Load the existing 311_map_data.csv to reconstruct the neighborhood_income_centroids.csv

csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "311_map_data.csv"))
df = pd.read_csv(csv_path)


# Group by neighborhood to calculate average income and centroid (if needed)
# This assumes 311_map_data.csv includes the income field (if not, this will fail)
if 'income' in df.columns:
    centroid_df = df.groupby('neighborhood').agg({
        'income': 'mean',
        'latitude': 'mean',
        'longitude': 'mean'
    }).reset_index()
else:
    # Provide a fallback structure using just lat/lon if income is missing
    centroid_df = df.groupby('neighborhood').agg({
        'latitude': 'mean',
        'longitude': 'mean'
    }).reset_index()
    centroid_df['income'] = pd.NA  # Add empty income column for compatibility

# Save the result
centroid_csv_path = "./data/neighborhood_income_centroids.csv"
centroid_df.to_csv(centroid_csv_path, index=False)

centroid_df.head()
