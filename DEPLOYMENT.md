# GeoBreath 2.0 - Deployment & Distribution Guide

## 📦 Distribution Package

This project includes an automated packaging system for easy distribution via the EDUmind website.

### Quick Package Creation

```bash
./package-dist.sh
```

This will:
1. Clean previous builds
2. Build the production-optimized Next.js application
3. Create a compressed archive in `dist/` directory
4. Include deployment instructions

### Package Contents

The distribution package includes:
- `.next/` - Compiled Next.js application
- `public/` - Static assets (logos, pictograms, images)
- `package.json` - Dependencies manifest
- `README.txt` - Deployment instructions for end users

### Distribution via EDUmind Web

Upload the generated `.tar.gz` file to the EDUmind downloads section. Users can:

**Option A: Run Locally**
```bash
tar -xzf geobreath_react_v2.0.0_*.tar.gz
cd geobreath_react
npm install --production
npm start
```

**Option B: Deploy as Systemd Service** (Recommended for servers)
```bash
# Copy service file
sudo cp geobreath-react.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable geobreath-react.service
sudo systemctl start geobreath-react.service
```

## 🌐 Nginx Configuration

For production deployment with Nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name breath.edumind.es;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Development

```bash
npm run dev    # Development server (port 3000)
npm run build  # Production build
npm start      # Production server (port 3000)
```

## 📋 Features

- ✅ 6 Language Support (ES, GL, CAT, EU, EN, ZH)
- ✅ Interactive FAQ System
- ✅ Focus Mode (Fullscreen breathing visualization)
- ✅ Challenge/Gamification Mode
- ✅ Audio, Haptic & TTS Feedback
- ✅ Accessibility Pictograms
- ✅ 100% Privacy-First (No data collection)
- ✅ Progressive Web App (PWA) Ready

## 🎯 System Requirements

- Node.js 18+ (for running the server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 50MB disk space

## 📞 Support

For technical support or questions:
- Email: soporte@edumind.es
- Documentation: https://edumind.es/docs/geobreath

---

**GeoBreath 2.0** - Sistema propiedad de EDUmind © 2024
