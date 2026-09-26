# Créditos y material de terceros

GeoBreath es obra de **Luis Vilela Acuña · EDUmind®** y se publica con licencia doble
AGPL-3.0-or-later / EUPL-1.2 (ver [LICENSE](LICENSE)). El material de terceros que
incorpora, con su procedencia y licencia, es el siguiente.

## Pictogramas (`public/img/inspiro.png`, `exhalo.png`, `aguanta.png`)

Autor pictogramas: Sergio Palao. Origen: ARASAAC (http://www.arasaac.org).
Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón (España).

Los tres pictogramas se muestran como apoyo visual opcional durante la sesión
(`src/features/breathing/components/BreathingPanel.tsx`) y se precargan en el
service worker. Su licencia CC BY-NC-SA es independiente de la licencia del
código: quien reutilice GeoBreath con fines comerciales debe sustituirlos.
La misma fórmula de atribución aparece en la pantalla de ayuda de la app.

## Clips de voz (`public/audio/{es,gl,cat,en,zh}/{I,E,H}.mp3`)

Quince clips de unos dos segundos («inspira», «exhala», «aguanta» en cinco
idiomas), pregrabados con síntesis de voz. **Pendiente de confirmar el servicio
por el autor.** El euskera no tiene clips y usa el sintetizador del navegador
(`speechSynthesis`).

## Tipografías (SIL Open Font License 1.1, ver [OFL.txt](OFL.txt))

| Familia | Autoría | Origen |
|---|---|---|
| Bricolage Grotesque | Mathieu Triay | https://github.com/ateliertriay/bricolage |
| Poppins | Indian Type Foundry (Jonny Pinhorn, Ninad Kale) | https://github.com/itfoundry/Poppins |
| IBM Plex Mono | Mike Abbink, Bold Monday (IBM) | https://github.com/IBM/plex |

Se cargan con `next/font/google` (`src/app/layout.tsx`): los ficheros se
descargan en el momento de compilar y se sirven desde el propio dominio, sin
llamadas a Google en tiempo de uso.

## Librerías principales (declaradas en `package.json`)

| Paquete | Licencia | Para qué |
|---|---|---|
| next, react, react-dom | MIT | Framework y renderizado |
| next-auth | ISC | Inicio de sesión OIDC (opcional) |
| framer-motion | MIT | Animación de la figura |
| lucide-react | ISC | Iconos |
| tailwindcss | MIT | Utilidades CSS |
| vitest | MIT | Pruebas |

## Referencia científica citada

Balban, M. Y., Neri, E., Kogon, M. M., Weed, L., Nouriani, B., Jo, B., Holl, G.,
Zeitzer, J. M., Spiegel, D., & Huberman, A. D. (2023). Brief structured respiration
practices enhance mood and reduce physiological arousal. *Cell Reports Medicine*,
4(1), 100895. https://doi.org/10.1016/j.xcrm.2022.100895

## Propio

Logotipo e iconos de la PWA (`public/logo_geobreath.png`, `public/icons/*`),
textos en seis idiomas, patrones y programas: obra propia. EDUmind® es marca
registrada y no se cede con el código (ver [TRADEMARKS.md](TRADEMARKS.md)).
