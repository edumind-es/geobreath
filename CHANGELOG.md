# Registro de cambios

Formato libre, en español, de más reciente a más antiguo.

## 2.0.3 — 2026-09-26 · Corrección VCER

Objetivo: que la app cumpla lo que declara y alcance «Recomendable» en la
rúbrica VCER. Sin cambios en la lógica de respiración.

- **Datos personales:** retirada la analítica Matomo de `src/app/layout.tsx`.
  La app ya no contacta con ningún servidor al abrir la portada.
- **Coherencia:** README, FAQ («¿Es privado?» en seis idiomas) y nuevo
  `PRIVACIDAD.md` describen lo que hace, lo que guarda y con qué se comunica,
  incluida la zona con cuenta y su almacén cifrado.
- **Contenido:** «Respira LME» pasa a «GeoBreath» en el panel y en las FAQ;
  tildes en los metadatos; referencia de Balban et al. (2023) con DOI en la
  pantalla de ayuda.
- **Accesibilidad:** `--ink-3` y el bloque legal del pie suben a ≥4,5:1;
  el diálogo de ayuda recibe el foco al abrirse y lo devuelve al cerrarse;
  `<html lang>` sigue al idioma elegido.
- **Material ajeno:** `CREDITS.md` y `OFL.txt`; atribución ARASAAC en la
  ayuda; nota sobre los clips de voz; borrados `pictogram_*.png` y los SVG de
  la plantilla de Next.js sin uso.
- **Rastro y reutilización:** `CHANGELOG.md`, `DECISIONES.md`, secciones
  «Hecho con IA» y «Cómo modificarlo» en el README; `COPYRIGHT` y `AUTHORS`
  coherentes con la licencia doble.
- Versión de `package.json` alineada con la del pie (2.0.3); caché del
  service worker `geobreath-v2.0.3`.

## 2.0.0 — 2026-08-30

- Rediseño con el sistema visual «lámina» de EDUmind y pie oficial.
- Editor de tiempos con modo simple y avanzado, patrones con respaldo
  (resonancia, caja, 4-7-8, suspiro fisiológico) y patrones guardados.
- Modo aula con rondas objetivo y modo empotrado por URL.
- Zona opcional con cuenta EDUmind (programas y perfil cifrado en servidor).
- Publicación del código con licencia doble AGPL-3.0-or-later / EUPL-1.2.
