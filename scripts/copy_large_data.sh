#!/bin/bash
echo "📂 Copying large CSV for local dev or GitHub Pages publish..."

# Resolve the directory the script is in
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Go to project root (parent of /scripts/)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Define source and destination
SOURCE="$PROJECT_ROOT/311_map_data.csv"
DEST="$PROJECT_ROOT/_site/data/311_map_data.csv"

# Create target directory if it doesn't exist
mkdir -p "$(dirname "$DEST")"

# Copy the file
cp "$SOURCE" "$DEST"

echo "✅ Copied: $SOURCE → $DEST"
