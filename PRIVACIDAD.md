# Privacidad en GeoBreath

Resumen: la respiración funciona **sin cuenta, sin registro y sin analítica**.
Lo único que se guarda son las preferencias, y se guardan en tu navegador.
Existe una zona opcional con cuenta EDUmind, pensada para docentes, que guarda
un perfil cifrado en el servidor de EDUmind.

## Qué guarda el navegador (todo el mundo)

| Dato | Dónde | Cuánto tiempo |
|---|---|---|
| Idioma, figura, segundos por lado, apoyos activos (sonido, vibración, pictogramas, voz), patrones guardados con nombre libre, rondas objetivo | `localStorage`, clave `geobreath:preferencias:v1` (`src/lib/almacenLocal.ts`) | Hasta que pulses **Borrar mis datos** en el editor o borres los datos del sitio en el navegador |
| Caché de la app para uso sin conexión (HTML, CSS, JS, pictogramas, logotipo) | Service worker (`src/app/sw/route.ts`) | Se renueva sola con cada versión; nunca cachea `/api/`, `/app/` ni `/sign-in` |

No hay nombres de personas ni nada identificativo. No se piden permisos de
cámara, micrófono ni ubicación. La vibración y la síntesis de voz del navegador
se ejecutan en el dispositivo.

## Qué guarda el servidor

- **Sin cuenta: nada.** El servidor sirve ficheros estáticos y no registra
  analítica. Matomo se retiró en la versión 2.0.3 (antes se cargaba en todas
  las páginas, sin cookies y respetando *Do Not Track*).
- **Con cuenta EDUmind (zona `/app`, opcional):** al pulsar «Acceso EDUmind» se
  inicia sesión por OpenID Connect en el servidor de identidad de EDUmind
  (Authentik). GeoBreath recibe identificador, nombre, correo y grupos
  (`src/auth.ts`). El perfil premium —objetivo, franja horaria, meta semanal,
  notas libres, favoritos e historial de sesiones— se guarda en un fichero JSON
  del servidor (`GEOBREATH_DATA_FILE`, por defecto `.local/premium-store.json`)
  cifrado en reposo con AES-256-GCM y clave derivada de `AUTH_SECRET`
  (`src/server/repos/premium-store.ts`). Se conserva mientras exista la cuenta;
  para ejercer los derechos de acceso, rectificación o supresión escribe a
  contacto@edumind.es (no hay aún exportación ni borrado desde la propia app).

La zona con cuenta está pensada para docentes. Si un centro quisiera dar
cuentas al alumnado, antes debe revisar base jurídica, retención y derechos.

## Con qué se comunica la app

| Destino | Cuándo |
|---|---|
| El propio dominio de la app | Siempre (ficheros, tipografías servidas en local) |
| Servidor de identidad EDUmind (Authentik) | Solo al pulsar «Acceso EDUmind» |
| El propio servidor (`/app`, acciones de servidor) | Solo tras iniciar sesión |
| edumind.es, gnu.org, eupl.eu, github.com, redes sociales | Solo si pulsas los enlaces del pie (ventana nueva) |

Cookies observadas sin sesión: las técnicas de Auth.js (`__Host-authjs.csrf-token`,
`__Secure-authjs.callback-url`). No hay cookies de terceros.

## Quien despliegue su propia instancia

Este repositorio es una publicación saneada: no contiene bases de datos,
copias de seguridad, registros ni configuración privada (ver
[OPEN_SOURCE_RELEASE.md](OPEN_SOURCE_RELEASE.md)). Quien opere una instancia
responde de sus propias obligaciones de protección de datos (RGPD/LOPDGDD).
Para arrancar sin inicio de sesión basta con dejar vacías las variables
`AUTH_*` de `.env.example`.
