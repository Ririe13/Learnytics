#!/bin/bash

# Learning Insight Dashboard - Seed Database Script
# This script populates the backend with sample data

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
DATA_DIR="$BACKEND_DIR/src/data"

echo "🌱 Learning Insight Dashboard - Seed Script"
echo "============================================"

# Check if data directory exists
if [ ! -d "$DATA_DIR" ]; then
    echo "Creating data directory..."
    mkdir -p "$DATA_DIR"
fi

# Copy seed data to the backend data folder
echo "📦 Copying seed data to $DATA_DIR/dummy.json..."
cp "$SCRIPT_DIR/seed.json" "$DATA_DIR/dummy.json"

echo "✅ Seed data successfully loaded!"
echo ""
echo "Data Summary:"
echo "  - File: $DATA_DIR/dummy.json"
echo "  - Records: $(jq length "$DATA_DIR/dummy.json" 2>/dev/null || echo "N/A")"
echo ""
echo "To verify, run the backend and check:"
echo "  curl http://localhost:9000/api/v1/data/sample"
