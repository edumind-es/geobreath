#!/bin/bash
# ============================================================================
# GeoBreath React - Deploy Script
# ============================================================================
set -e

echo "🚀 Deploying GeoBreath React..."

cd /var/www/geobreath_react

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build
echo "🔨 Building..."
npm run build

echo "✅ GeoBreath deployed successfully!"
