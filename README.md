# LookOut-Mily

[![Website](https://img.shields.io/badge/website-live-0b8f6a?style=for-the-badge)](https://lordmanuel.github.io/LookOut-Mily/)
[![Release](https://img.shields.io/badge/release-3.5.9-157ad1?style=for-the-badge)](https://github.com/LORDMANUEL/LookOut-Mily/releases)

**LookOut-Mily** es una extension para Thunderbird que convierte correos con `winmail.dat` / TNEF en mensajes con adjuntos normales.

Descarga oficial en Thunderbird Add-ons:
[https://addons.thunderbird.net/es/thunderbird/addon/lookout-mily/](https://addons.thunderbird.net/es/thunderbird/addon/lookout-mily/)

Respaldo XPI directo:
[https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/lookout-mily-3.5.9.xpi](https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/lookout-mily-3.5.9.xpi)

Sitio oficial del proyecto:
[https://lordmanuel.github.io/LookOut-Mily/](https://lordmanuel.github.io/LookOut-Mily/)

Repositorio oficial:
[https://github.com/LORDMANUEL/LookOut-Mily](https://github.com/LORDMANUEL/LookOut-Mily)

## Version actual

**3.5.9**

Esta version mantiene el comportamiento estable de la 3.5.8 y agrega ajustes para publicacion y revision en Mozilla / ATN:

- convierte solo el mensaje que abres
- evita reconvertir el mismo correo original
- extrae y normaliza los adjuntos de `winmail.dat`
- reutiliza la pestaña actual cuando crea la copia convertida, para evitar aperturas en cascada
- agrega logs exportables para diagnostico y reportes reales de usuarios
- elimina configuracion de auto-actualizacion no permitida para complementos alojados por Mozilla
- corrige una asignacion dinamica a `innerHTML` para cumplir mejor con revision de seguridad
- conserva un modo manual como respaldo desde el popup

## Flujo de trabajo

Al abrir un correo que contiene `winmail.dat`:

1. LookOut-Mily detecta el adjunto TNEF.
2. Extrae los archivos reales contenidos en `winmail.dat`.
3. Intenta crear una copia nueva del mensaje con adjuntos normales.
4. Selecciona la copia convertida en la misma pestaña cuando es posible y envia el original a la papelera.
5. Si la conversion total falla, mantiene disponibles las acciones manuales del complemento.

## Cambios destacados en 3.5.9

- mantiene el flujo funcional estable de la 3.5.8
- remueve `update_url` del `manifest.json` para compatibilidad con publicacion alojada por Mozilla
- reemplaza el uso dinamico de `innerHTML` en la vista previa por construccion segura del DOM
- conserva la conversion individual del correo abierto, el reemplazo controlado y los logs exportables
- continuidad del paquete `LookOut-Mily` con marca, icono y enlaces del repositorio actual

## Instalacion manual

1. En Thunderbird, abre `about:config`.
2. Establece `xpinstall.signatures.required = false` si tu entorno permite instalaciones sin firma.
3. Ve a **Herramientas -> Complementos -> Instalar complemento desde archivo**.
4. Selecciona [`lookout-mily-3.5.9.xpi`](./lookout-mily-3.5.9.xpi).

## Opciones disponibles

| Opcion | Descripcion |
|--------|-------------|
| Convertir automaticamente | Procesa el `winmail.dat` al abrir el correo |
| Reemplazar el mensaje por una copia convertida | Crea un nuevo correo con adjuntos normales y mueve el original a papelera |
| Guardar en disco automaticamente | Descarga los archivos extraidos cuando aplica el flujo manual |
| Mostrar notificaciones | Informa cuando la conversion o el guardado terminan |
| Sub-carpeta de descarga | Guarda archivos en una carpeta especifica dentro de Descargas |
| Habilitar logs de diagnostico | Registra eventos tecnicos y permite exportarlos a JSON desde Opciones |

## Compatibilidad

- Thunderbird **115.0 o superior**
- MailExtensions / Manifest V2

## Actualizaciones

Este repositorio publica el manifiesto de actualizaciones en [`updates.json`](./updates.json).

## Sitio web del proyecto

La landing page del proyecto vive en [`docs/`](./docs) y esta preparada para publicarse con GitHub Pages directamente desde la rama principal.

URL esperada del sitio:
`https://lordmanuel.github.io/LookOut-Mily/`

Configuracion recomendada en GitHub:

1. Ve a **Settings**
2. Entra en **Pages**
3. En **Source**, selecciona **Deploy from a branch**
4. En **Branch**, selecciona **main**
5. En la carpeta, selecciona **/docs**
6. Guarda los cambios

Este repositorio no necesita workflow de GitHub Actions para publicar la landing, porque el sitio ya es estatico y `index.html` vive en `docs/`.

## Publicacion de versiones

La guia de publicacion se encuentra en [`COMO_ACTUALIZAR.md`](./COMO_ACTUALIZAR.md).

## Creditos

Basado en LookOut v1.2.15 por Aron Rubin.

Adaptacion, continuidad y personalizacion:
**Luis Manuel Fajardo Rivera**
