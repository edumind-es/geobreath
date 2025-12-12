#!/bin/bash

# Configuration
APP_NAME="geobreath_react"
VERSION="2.0.0"
OUTPUT_DIR="dist"
BUILD_DIR=".next/standalone"
DATE=$(date +%Y%m%d)

echo "📦 Packaging ${APP_NAME} v${VERSION}..."

# 1. Clean previous builds
echo "🧹 Cleaning..."
rm -rf .next ${OUTPUT_DIR}
mkdir -p ${OUTPUT_DIR}

# 2. Build for Production
echo "🏗️  Building Next.js application..."
# First ensure next.config.ts enables standalone output.
# We will check if it exists or needs modification in a separate step, 
# but assuming standard build for now.
# Actually, for "distribution via web", a standalone node server is best if they have node,
# OR 'export' if they want static HTML. Given the interactive features (i18n, state), static export is possible but
# some features like Image Optimization require config.
# Let's target Standalone build which includes a minimal Node server.
# Adding output: 'standalone' to next.config if not present would be ideal.
# But for now let's just run build.

npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 3. Create Distribution Package
echo "📚 Creating distribution archive..."

# Check if standalone dir exists (requires output: 'standalone' in next.config)
# If not, we just zip the whole thing excluding node_modules (less ideal but works)
# But let's assume we want a pro package.

PACKAGE_NAME="${APP_NAME}_v${VERSION}_${DATE}.tar.gz"

# Create a clean folder structure for the release
RELEASE_DIR="${OUTPUT_DIR}/${APP_NAME}"
mkdir -p ${RELEASE_DIR}

# Copy essential files
cp -r .next ${RELEASE_DIR}/
cp -r public ${RELEASE_DIR}/
cp package.json ${RELEASE_DIR}/
cp next.config.ts ${RELEASE_DIR}/ 2>/dev/null || cp next.config.js ${RELEASE_DIR}/

# Create a README for deployment
cat <<EOF > ${RELEASE_DIR}/README.txt
GeoBreath v${VERSION} - Deployment Instructions
==============================================

Option A: Run Locally (Requires Node.js 18+)
--------------------------------------------
1. Unzip this package.
2. Run 'npm install --production' to install dependencies.
3. Run 'npm start' to launch the server on port 3000.

Option B: Docker / EDUmind Server
---------------------------------
This package works best with the 'geobreath-react.service' systemd unit provided.
Ensure environment variables (NODE_ENV=production) are set.

Content:
- .next/: The built application.
- public/: Static assets (images, logos).

Support: soporte@edumind.es
EOF

# Compress
tar -czf ${OUTPUT_DIR}/${PACKAGE_NAME} -C ${OUTPUT_DIR} ${APP_NAME}

echo "✅ Package created at: ${OUTPUT_DIR}/${PACKAGE_NAME}"
echo "🚀 Ready for upload to EDUmind Web!"
