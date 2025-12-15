# GEOBREATH - Técnicas de Respiración con Geometría Interactiva

![GeoBreath](https://img.shields.io/badge/GeoBreath-Mindfulness-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-AGPL%20v3.0-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)

## 📖 Descripción

**GeoBreath** es una aplicación web de bienestar que guíala respiración mediante animaciones geométricas hipnóticas. Combina ejercicios de **mindfulness** con visualizaciones matemáticas interactivas para reducir estrés y mejorar la concentración.

✨ **Sin backend, sin cookies, sin tracking** - Privacidad total.

### Características

- 🌀 **Figuras Geométricas Animadas:** Cuadrados, círculos, triángulos, estrellas
- 🎨 **Paletas de Color Personalizables:** Modos día/noche/personalizado
- ⏱️ **Patrones de Respiración:** 4-7-8, Box Breathing, Wim Hof, Coherencia Cardíaca
- 🌐 **Multiidioma:** Español, Inglés, Chino (i18n)
- 📱 **Responsive:** Funciona en móvil, tablet y desktop
- ♿ **Accesible:** ARIA labels, navegación por teclado
- 🔇 **Modo Silencioso:** Sin sonidos molestos
- 🎯 **Modo Enfoque:** Pantalla completa sin distracciones

---

## 🏗️ Arquitectura

### Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **React:** 19.2.0
- **Styling:** Tailwind CSS 4
- **Animaciones:** Framer Motion 12
- **Icons:** Lucide React
- **i18n:** next-intl (no integrado, manual)
- **TypeScript:** Configuración estricta

### Estructura

```
geobreath_react/
├── src/
│   └── app/
│       ├── layout.tsx          # Layout global + metadata
│       ├── page.tsx            # Página principal
│       └── components/
│           ├── BreathingContainer.tsx   # Lógica de respiración
│           ├── GeometricShape.tsx       # Renderizado figuras
│           ├── Controls.tsx             # Panel de control
│           ├── PatternSelector.tsx      # Selector de ejercicios
│           ├── ColorPicker.tsx          # Personalización colores
│           └── LanguageSelector.tsx     # Cambio de idioma
├── public/
│   ├── logo_geobreath.png
│   └── favicons/
├── dist/                        # Build de producción
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Componente Principal

```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <BreathingContainer />
    </main>
  );
}
```

---

## 🚀 Instalación

### Desarrollo

```bash
# Clonar
git clone https://github.com/edumind-es/geobreath.git
cd geobreath_react

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:3000
```

### Producción

```bash
# Build
npm run build

# Preview local
npm start

# O servir con Nginx
cp -r .next/static dist/
# Configurar Nginx para servir dist/
```

### Despliegue con Nginx

```nginx
# /etc/nginx/sites-available/breath.edumind.es
server {
    listen 443 ssl http2;
    server_name breath.edumind.es;

    ssl_certificate /etc/letsencrypt/live/breath.edumind.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/breath.edumind.es/privkey.pem;

    root /var/www/geobreath_react/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caché para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🎯 Funcionamiento

### Patrones de Respiración

#### 1. **4-7-8 (Dr. Andrew Weil)**
```
Inhala:  4 segundos
Retén:   7 segundos
Exhala:  8 segundos
Ciclos:  4 repeticiones
```
**Beneficio:** Reduce ansiedad, induce sueño

#### 2. **Box Breathing (Respiración Cuadrada)**
```
Inhala:  4 segundos
Retén:   4 segundos
Exhala:  4 segundos
Retén:   4 segundos
Ciclos:  Infinito
```
**Beneficio:** Usado por Navy SEALs, mejora concentración

#### 3. **Wim Hof (Modificado)**
```
Inhalaciones rápidas: 30 ciclos (2 seg c/u)
Retención:            60 segundos
Exhalación completa:  15 segundos
```
**Beneficio:** Oxigenación celular, energía

#### 4. **Coherencia Cardíaca (5-5)**
```
Inhala:  5 segundos
Exhala:  5 segundos
Ritmo:   6 respiraciones/minuto
Duración: 5 minutos
```
**Beneficio:** Equilibrio del sistema nervioso

### Flujo de Usuario

1. **Selección de Patrón:**
   - Usuario ve lista de ejercicios con descripciones
   - Clic en patrón → Se carga configuración

2. **Personalización:**
   - Color de figura (picker RGB)
   - Color de fondo (gradiente preestablecido o custom)
   - Velocidad (multiplicador 0.5x - 2x)
   - Forma geométrica (cuadrado, círculo, triángulo, estrella)

3. **Sesión de Respiración:**
   ```
   INHALA (figura crece)
     ↓
   RETÉN (figura estática grande)
     ↓
   EXHALA (figura decrece)
     ↓
   RETÉN (figura estática pequeña)
     ↓
   REPETIR
   ```

4. **Visualización:**
   - Contador de ciclos: "Ciclo 3/4"
   - Barra de progreso circular
   - Texto guía: "Inhala lentamente..."
   - Animación fluida (Framer Motion)

---

## 🎨 Personalización

### Colores Predefinidos

```typescript
const PALETTES = {
  ocean: {
    shape: '#00BCD4',
    background: 'from-blue-400 to-cyan-300'
  },
  sunset: {
    shape: '#FF6B6B',
    background: 'from-orange-400 to-pink-500'
  },
  forest: {
    shape: '#4CAF50',
    background: 'from-green-300 to-teal-400'
  },
  night: {
    shape: '#9C27B0',
    background: 'from-indigo-900 to-purple-800'
  }
};
```

### Figuras Geométricas

**Cuadrado (SVG):**
```tsx
<motion.rect
  width={size}
  height={size}
  fill={color}
  animate={{ scale: [1, breathing ? 1.5 : 1] }}
  transition={{ duration: 4, ease: "easeInOut" }}
/>
```

**Círculo (CSS):**
```tsx
<motion.div
  className="rounded-full"
  style={{ width: size, height: size, backgroundColor: color }}
  animate={{ scale: breathing ? 1.5 : 1 }}
/>
```

**Estrella (Path SVG):**
```tsx
<motion.path
  d="M 50,10 L 61,39 L 92,39 L 67,59 L 78,88 L 50,68 L 22,88 L 33,59 L 8,39 L 39,39 Z"
  fill={color}
  animate={{ rotate: [0, breathing ? 180 : 0] }}
/>
```

---

## 🌐 Internacionalización

### Estructura de Traducciones

```typescript
// src/i18n/es.json
{
  "app.title": "GeoBreath - Respiración Consciente",
  "patterns.478.name": "4-7-8 (Relajación)",
  "patterns.478.description": "Técnica del Dr. Weil para calmar la mente",
  "instructions.inhale": "Inhala profundamente por la nariz",
  "instructions.exhale": "Exhala lentamente por la boca"
}
```

### Cambio de Idioma

```tsx
function LanguageSelector() {
  const [locale, setLocale] = useState('es');
  
  return (
    <select onChange={(e) => setLocale(e.target.value)}>
      <option value="es">🇪🇸 Español</option>
      <option value="en">🇬🇧 English</option>
      <option value="zh">🇨🇳 中文</option>
    </select>
  );
}
```

---

## ♿ Accesibilidad

### Características Implementadas

✅ **ARIA Labels:**
```tsx
<button aria-label="Iniciar ejercicio de respiración">
  Comenzar
</button>
```

✅ **Navegación por Teclado:**
- `Space`: Play/Pause
- `Escape`: Salir de modo enfoque
- `1-4`: Cambiar patrón rápido

✅ **Focus Indicators:**
```css
button:focus-visible {
  outline: 2px solid #00BCD4;
  outline-offset: 2px;
}
```

✅ **Modo Alto Contraste:**
- Detección automática de `prefers-contrast`
- Colores ajustados dinámicamente

✅ **Reducción de Movimiento:**
```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const animationDuration = prefersReducedMotion ? 0 : 4;
```

---

## 📊 Ventajas vs Otras Apps

| Característica | GeoBreath | Calm/Headspace | Apps Genéricas |
|---------------|-----------|----------------|----------------|
| **Sin Registro** | ✅ | ❌ | ❌ |
| **Sin Anuncios** | ✅ | ❌ (freemium) | ❌ |
| **Open Source** | ✅ | ❌ | ❌ |
| **Offline** | ✅ | Parcial | ❌ |
| **Gratis** | ✅ | Suscripción | Freemium |
| **Educativo** | ✅ | ❌ | ❌ |
| **Geometría Matemática** | ✅ | ❌ | ❌ |

---

## 🧪 Testing

### Tests Manuales

```bash
# Auditoría de accesibilidad
npm run build
npx @axe-core/cli http://localhost:3000 --save axe-report.json

# Lighthouse
npx lighthouse http://localhost:3000 --view
```

### Checklist de QA

- [ ] Todos los patrones funcionan correctamente
- [ ] Animaciones fluidas en móvil (60fps)
- [ ] Cambio de idioma sin reload
- [ ] Colores personalizados se aplican
- [ ] Modo enfoque oculta controles
- [ ] Navegación por teclado funcional

---

## 🐛 Troubleshooting

### Animaciones no fluidas

**Causa:** React Compiler deshabilitado (compatibilidad Firefox)

**Solución:** Usar Chrome/Edge para mejor rendimiento

```typescript
// next.config.ts
const nextConfig = {
  // experimental: { reactCompiler: false } // Deshabilitado
};
```

### Build falla en producción

```bash
# Limpiar caché
rm -rf .next node_modules
npm install
npm run build
```

### Purga de caché Cloudflare

```bash
# Ejecutar script
./purge-breath-cache.sh
```

---

## 📈 Roadmap

### v1.1 (Próximo)
- [ ] Sonidos ambientales opcionales (rain, ocean)
- [ ] Temporizador personalizado
- [ ] Historial de sesiones (localStorage)
- [ ] Modo oscuro automático (sistema)

### v1.2 (Futuro)
- [ ] PWA completa (instalable)
- [ ] Notificaciones de recordatorio
- [ ] Integración con wearables (frecuencia cardíaca)
- [ ] Compartir sesiones (social)

---

## 📄 Licencia

**GNU Affero General Public License v3.0**

Software libre. Mejora y comparte respetando la licencia.

---

## 👥 Autores

**EDUmind Team**

Ver [AUTHORS](AUTHORS)

---

## 🙏 Agradecimientos

- Dr. Andrew Weil (técnica 4-7-8)
- Wim Hof (método Wim Hof)
- Comunidad de mindfulness
- Framer Motion team

---

**URL:** https://breath.edumind.es  
**Versión:** 0.1.0  
**Estado:** Producción Estable
