GeoBreath v2.0.0 - Deployment Instructions
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
