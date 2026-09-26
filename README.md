# GeoBreath

Respiración consciente guiada por geometría: una figura (de dos a seis lados) marca las fases inspira / aguanta / exhala. Se ajustan los segundos por lado, se editan ciclos libres (4-7-8, suspiro fisiológico…), se guardan patrones y se fijan rondas. Apoyos opcionales de sonido, vibración, pictogramas y voz. Pensado para bajar revoluciones al entrar en clase o después de la actividad física. Next.js, PWA, seis idiomas (es, gl, cat, eu, en, zh).

> Sin cuenta, sin registro y sin analítica. Se abre y se respira.

Sitio: https://breath.edumind.es

## Qué hace, qué guarda y con qué se comunica

- **Respiración (portada, para todo el mundo):** funciona entera en el navegador y sin conexión tras la primera visita (service worker). Guarda solo las preferencias (idioma, figura, segundos, apoyos, patrones con nombre, rondas) en `localStorage`; botón «Borrar mis datos». No contacta con ningún servidor al abrir.
- **Zona con cuenta EDUmind (`/app`, opcional, pensada para docentes):** inicio de sesión OpenID Connect (Authentik). Programas guiados, favoritos, historial y perfil (objetivo, franja horaria, meta semanal, notas). El perfil se guarda en un fichero JSON en el servidor, cifrado en reposo (AES-256-GCM, clave derivada de `AUTH_SECRET`). Si dejas vacías las variables `AUTH_*`, la app arranca sin esta zona.
- **Modo empotrado:** `?embed=1` más `lados`, `segundos`, `patron`, `rondas` y `auto=1` en la URL, para pizarras y otras apps.
- Detalle completo en [PRIVACIDAD.md](PRIVACIDAD.md). Material de terceros en [CREDITS.md](CREDITS.md). Cambios por versión en [CHANGELOG.md](CHANGELOG.md); por qué está hecho así en [DECISIONES.md](DECISIONES.md).

## Arrancar en local

```bash
cp .env.example .env   # opcional: vacío arranca sin inicio de sesión
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Pruebas

```bash
npm run lint
npm test               # vitest: 55 pruebas (secuencias de fases, resp/min, patrones)
```

El CI de GitHub (`.github/workflows/ci.yml`) pasa lint, pruebas y compilación en cada PR. No despliega.

## Cómo modificarlo

- **Añadir un patrón con respaldo:** `src/features/breathing/lib/patrones.ts`, array `PATRONES_GUIA` (id, claves de nombre/descripción y pasos `{ phase: "I" | "E" | "H", seconds }`). Añade las dos claves de texto en `src/lib/i18n.ts` (interfaz `AppTranslations` y los seis idiomas). Las pruebas de `__tests__/patrones.test.ts` comprueban que ningún patrón supera el umbral de retención.
- **Añadir un idioma:** en `src/lib/i18n.ts` amplía el tipo `Language` y añade el bloque de traducciones; en `src/features/breathing/lib/breathing.ts` súmalo a `LANGUAGE_OPTIONS`; en `src/features/breathing/hooks/useBreathingSession.ts` añade su código BCP 47 a `HTML_LANG`; en `src/lib/useBreathingFeedback.ts` añade la voz del navegador a `speechLocaleMap` y, si grabas clips `I.mp3`, `E.mp3`, `H.mp3` en `public/audio/<idioma>/`, inclúyelo en `CLIP_LANGS`.
- **Añadir un programa de la zona con cuenta:** `src/features/premium/data/programs.ts`, array `premiumPrograms` (slug estable, textos, `sessionParams` con los tiempos por fase).
- **Cambiar los pictogramas:** sustituye `public/img/inspiro.png`, `exhalo.png`, `aguanta.png` (500×500) y actualiza [CREDITS.md](CREDITS.md) y la atribución de `src/features/breathing/components/FaqDialog.tsx` si dejan de ser de ARASAAC.
- **Desactivar el inicio de sesión:** deja vacías `AUTH_AUTHENTIK_ID`, `AUTH_AUTHENTIK_SECRET` y `AUTH_AUTHENTIK_ISSUER`.
- **Estilo:** `src/styles/lamina-v1.css` es el canon compartido de EDUmind (no se edita); lo propio de GeoBreath va en `src/app/globals.css`.
- **Versión:** `package.json`, el pie en `src/app/layout.tsx` y la caché del service worker en `src/app/sw/route.ts` y `public/sw.js`.

## Hecho con IA

Este recurso se ha desarrollado con *vibe coding* con asistencia de IA (Claude Code y ChatGPT), según la [política de IA de EDUmind](https://edumind.es/es/legal/ia). Lo que ha comprobado el autor:

- Los tiempos de los cuatro patrones con respaldo y de los programas (resonancia 5,5-5,5, caja 4-4-4-4, 4-7-8, suspiro fisiológico 2+1/6, coherencia 5-5) y la referencia de Balban et al. (2023), con DOI, en la ayuda y en `CREDITS.md`.
- Las 55 pruebas automáticas (`npm test`) y el CI (lint, pruebas, compilación) en cada PR.
- La revisión de licencias y del material de terceros (`CREDITS.md`, `OFL.txt`).
- Los textos que ve el alumnado en los seis idiomas (`src/lib/i18n.ts`).
- La ejecución en navegador de escritorio y móvil, incluido el manejo solo con teclado.

## Colaborar

Se puede colaborar **sin programar**: contar cómo te ha ido en clase, reportar un fallo, revisar los textos o traducir. Todo el proyecto está en español. Empieza por [CONTRIBUTING.md](CONTRIBUTING.md) y el [código de conducta](CODE_OF_CONDUCT.md).

¿Un fallo de seguridad? No abras un issue público: ver [SECURITY.md](SECURITY.md).

Este repositorio es una *release saneada* para revisión y auditoría: no incluye secretos, configuración de despliegue ni datos de aula. Ver [OPEN_SOURCE_RELEASE.md](OPEN_SOURCE_RELEASE.md).

## Licencia

Licencia doble **AGPL-3.0-or-later** *o* **EUPL-1.2**, a elección de quien la reutilice. Ver [LICENSE](LICENSE) y [NOTICE](NOTICE). Los pictogramas ARASAAC conservan su licencia CC BY-NC-SA (ver [CREDITS.md](CREDITS.md)).

EDUmind® es marca registrada en España (OEPM). El código es libre; la marca y los logotipos no se ceden con él — ver [TRADEMARKS.md](TRADEMARKS.md).

Por **Luis Vilela Acuña · EDUmind®** — maestro de Educación Física.
