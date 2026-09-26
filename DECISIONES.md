# Decisiones de diseño

Redactado a posteriori el 2026-09-26 a partir del código y de la evaluación
VCER; recoge cómo funciona el recurso hoy y por qué.

## Local-first: la respiración no necesita servidor

La experiencia pública (figura, editor, apoyos, voz) corre entera en el
navegador y funciona sin conexión gracias al service worker. Las preferencias
viven en `localStorage` (`src/lib/almacenLocal.ts`), validadas al leerlas por
si alguien las edita a mano o vienen de una versión anterior. Motivo: el
alumnado no debe necesitar cuenta ni conexión para respirar en clase.

## Sin analítica

Hasta la 2.0.2 se cargaba Matomo (propio, sin cookies, con *Do Not Track*).
Aun así contradecía lo que la app decía de sí misma y la rúbrica VCER lo
puntúa con 0. Decisión (2026-09-26): quitarlo del todo; no hay métricas que
compensen romper la promesa «sin analítica».

## Zona con cuenta, opcional y para docentes

`/app` exige inicio de sesión OIDC (Authentik de EDUmind) y ofrece programas
guiados, favoritos e historial. El perfil se guarda en un fichero JSON cifrado
en reposo (AES-256-GCM, clave derivada de `AUTH_SECRET`), sin base de datos,
para que una instancia se despliegue con un solo proceso. Si se dejan vacías
las variables `AUTH_*`, la app arranca sin esa zona. Pendiente: exportación y
borrado de cuenta desde la propia app.

## Patrones con respaldo, no por variedad

Los cuatro patrones de `src/features/breathing/lib/patrones.ts` existen porque
hay evidencia detrás (resonancia ≈0,1 Hz, caja, 4-7-8, suspiro fisiológico de
Balban et al., 2023). Ninguno supera el umbral de aviso de retención (10 s),
y el editor avisa por encima de ese umbral pensando en niñas y niños.

## Pictogramas ARASAAC

Se usan tres pictogramas de ARASAAC (CC BY-NC-SA) como apoyo visual. Su
licencia no es la del código: se acreditan en `CREDITS.md` y en la ayuda, y
quien reutilice la app con fines comerciales debe sustituirlos.

## Sistema visual «lámina»

`src/styles/lamina-v1.css` es el canon compartido por las apps EDUmind y no se
edita; las particularidades de GeoBreath (tema híbrido papel/noche, tokens de
contraste) van en `src/app/globals.css`.

## Licencia doble y marca aparte

AGPL-3.0-or-later o EUPL-1.2 a elección de quien reutilice; la marca EDUmind®
y los logotipos quedan fuera (`TRADEMARKS.md`). El repositorio público es una
publicación saneada sin secretos ni datos de aula (`OPEN_SOURCE_RELEASE.md`).
