# 🌟 GeoBreath - Respiración Consciente con Guías Geométricas

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)

**GeoBreath** (Respira LME) es una aplicación web de **respiración consciente** que utiliza **formas geométricas animadas** para guiar técnicas de respiración controlada. Un punto recorre el perímetro de figuras geométricas (círculo, triángulo, cuadrado, pentágono, hexágono) indicando cuándo inspirar, exhalar o aguantar la respiración.

🌐 **Demo en vivo:** [breath.edumind.es](https://breath.edumind.es)

---

## ✨ Características

### 🔷 Respiración Geométrica
- **5 formas disponibles:** Círculo (2 fases), Triángulo (3), Cuadrado (4), Pentágono (5), Hexágono (6)
- **Punto guía animado** que recorre el perímetro de la figura
- **Lógica de respiración:** Lado ascendente = Inspira, Lado descendente = Exhala, Horizontal = Aguanta
- **Duración configurable:** de 1 a 10 segundos por fase

### 🎯 Feedback Multimodal
- 🔊 **Audio** - Sonidos al cambiar de fase
- 📳 **Vibración háptica** - Feedback táctil en dispositivos móviles
- 🗣️ **Voz (TTS)** - Narración de instrucciones ("Inspira", "Exhala", "Aguanta")
- 🖼️ **Pictogramas ARASAAC** - Apoyo visual con pictogramas educativos

### 🎨 Interfaz Premium
- **Diseño glassmorphism** con efectos de desenfoque y transparencias
- **Animaciones fluidas** con Framer Motion
- **Modo foco** - Pantalla completa sin distracciones
- **Temas de color** por fase (verde menta, azul cielo, violeta)

### 📊 Gamificación
- **Sistema de retos** - Completa N ciclos según la forma elegida
- **Contador de ciclos** con barra de progreso
- **Estadísticas de sesión** - Tiempo total y ciclos completados
- **Botón "Me distraje"** - Reinicia el contador si pierdes la concentración

### 🎭 Rutinas Preconfiguradas
- 🧘‍♀️ **Calma** - Triángulo, 3.5s (relajación)
- 🎯 **Foco** - Cuadrado, 4s (concentración)
- ⚡ **Recuperación** - Hexágono, 2.5s (energización)

### 🌍 Multiidioma
Soporte completo para 6 idiomas:
- Español
- Gallego
- Catalán
- Euskera
- English
- 中文 (Chino)

### 🔒 Privacidad Total
- **100% cliente** - Sin backend, sin tracking
- **Datos locales** - Todo se procesa en tu dispositivo
- **Sin registro** - Empieza de inmediato

---

## 🚀 Inicio Rápido

### Uso Online (Recomendado)

Simplemente abre [breath.edumind.es](https://breath.edumind.es) en tu navegador.

### Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/edumind-es/geobreath.git
cd geobreath

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
```

---

## 📖 Uso

1. **Elige una forma geométrica** (2 a 6 lados)
2. **Configura la duración** por fase (1-10 segundos)
3. **Activa el feedback** que prefieras (sonido, vibración, voz, pictogramas)
4. **Pulsa PLAY** y sigue el punto que recorre la figura
5. **Respira** según las instrucciones:
   - Lado ascendente → **Inspira**
   - Lado descendente → **Exhala**
   - Lado horizontal → **Aguanta**

### 🎮 Modos de Uso

**Modo Normal:** Interface completa con controles y estadísticas  
**Modo Foco:** Solo la figura animada, sin distracciones (botón `⛶`)

---

## 🧠 Fundamento Científico

Las técnicas de respiración controlada se utilizan en:
- **Reducción del estrés** y ansiedad
- **Mejora del foco** y concentración
- **Regulación emocional**
- **Mindfulness** y meditación
- **Preparación deportiva**

GeoBreath facilita estas prácticas con una guía visual clara y feedback inmediato.

---

## 🛠️ Tecnologías

- **Next.js 16** - React framework con App Router
- **TypeScript** - Tipado estático
- **Framer Motion** - Animaciones fluidas
- **Tailwind CSS** - Estilos utilitarios
- **Lucide React** - Iconos modernos
- **Web APIs:**
  - Web Audio API (sonidos)
  - Vibration API (feedback háptico)
  - Speech Synthesis API (voz)
  - Canvas/SVG (gráficos)

---

## 🎯 Casos de Uso Educativos

- **Aulas de primaria/secundaria** - Regulación emocional
- **Educación Física** - Preparación y recuperación
- **Educación Especial** - Apoyo con pictogramas
- **Tutoría** - Gestión del estrés
- **Mindfulness escolar** - Pausas activas
- **Formación docente** - Autocuidado

---

## 📐 Lógica de Respiración

```typescript
// Para un cuadrado (4 lados):
// Lado 0 (derecha, ascendente) → Inspira
// Lado 1 (arriba, horizontal) → Aguanta  
// Lado 2 (izquierda, descendente) → Exhala
// Lado 3 (abajo, horizontal) → Aguanta

// Algoritmo:
const sequence = geoBreathSequence(n); 
// n=4 → ['I', 'H', 'E', 'H']
// n=3 → ['I', 'E', 'H']
// n=6 → ['I', 'H', 'E', 'H', 'I', 'E']
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar GeoBreath:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📜 Licencia

Este proyecto está bajo licencia **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Ver [LICENSE](LICENSE) para el texto completo.

---

## 👨‍💻 Autor

**Luis Vilela Acuña**
- Maestro de Educación Física
- Especialista en bienestar digital
- Creator del ecosistema EDUmind

---

## 🌟 Proyecto EDUmind

GeoBreath es parte del **ecosistema EDUmind**: herramientas digitales libres y abiertas para la educación.

- 🌐 Web: [edumind.es](https://edumind.es)
- 📧 Email: contacto@edumind.es
- 💬 Discord: [Únete a la comunidad](https://discord.gg/YaHXTwbh)
- 📰 Newsletter: [Substack](https://losmundosedufis.substack.com)

**Otros proyectos EDUmind:**
- [Motion](https://motion.edumind.es) - Editor de stopmotion educativo
- [Liga EDUmind](https://liga.edumind.es) - Ligas deportivas educativas
- [Campus EDUmind](https://campus.edumind.es) - Plataforma de cursos

---

## 🙏 Agradecimientos

- **ARASAAC** - Por los pictogramas educativos
- **Comunidad EDUmind** - Por el feedback constante
- **Docentes y alumnado** - Por validar la idea y mejorarla

---

## 📊 Estado del Proyecto

🟢 **Activo** - En desarrollo y mantenimiento constante

---

## 💡 Inspiración

Este proyecto nace de la necesidad de herramientas simples, efectivas y accesibles para la **regulación emocional** en contextos educativos. La geometría proporciona una guía visual clara que cualquier persona puede seguir, independientemente de su edad o capacidad.

---

**¿Preguntas? ¿Ideas?** Abre un [issue](https://github.com/edumind-es/geobreath/issues) o contáctanos en contacto@edumind.es

**¡Respira y relájate!** 🌟🫁
