# LookOut-Mily

**LookOut-Mily** es una extension para Thunderbird que convierte correos con `winmail.dat` / TNEF en mensajes con adjuntos normales.

## Version actual

**3.5.7**

Esta version prioriza una conversion mas estable del correo:

- convierte solo el mensaje que abres
- evita reconvertir el mismo correo original
- extrae y normaliza los adjuntos de `winmail.dat`
- reemplaza el correo original por una copia limpia cuando la conversion completa es posible
- conserva un modo manual como respaldo desde el popup

## Flujo de trabajo

Al abrir un correo que contiene `winmail.dat`:

1. LookOut-Mily detecta el adjunto TNEF.
2. Extrae los archivos reales contenidos en `winmail.dat`.
3. Intenta crear una copia nueva del mensaje con adjuntos normales.
4. Abre la copia convertida y envia el original a la papelera.
5. Si la conversion total falla, mantiene disponibles las acciones manuales del complemento.

## Cambios destacados en 3.5.7

- correccion para no reconvertir el mismo mensaje varias veces
- conversion disparada solo al abrir el correo actual
- mejora de estabilidad para conversaciones grandes
- continuidad del paquete `LookOut-Mily` con marca, icono y enlaces del repositorio actual

## Instalacion manual

1. En Thunderbird, abre `about:config`.
2. Establece `xpinstall.signatures.required = false` si tu entorno permite instalaciones sin firma.
3. Ve a **Herramientas -> Complementos -> Instalar complemento desde archivo**.
4. Selecciona [`lookout-mily-3.5.7.xpi`](./lookout-mily-3.5.7.xpi).

## Opciones disponibles

| Opcion | Descripcion |
|--------|-------------|
| Convertir automaticamente | Procesa el `winmail.dat` al abrir el correo |
| Reemplazar el mensaje por una copia convertida | Crea un nuevo correo con adjuntos normales y mueve el original a papelera |
| Guardar en disco automaticamente | Descarga los archivos extraidos cuando aplica el flujo manual |
| Mostrar notificaciones | Informa cuando la conversion o el guardado terminan |
| Sub-carpeta de descarga | Guarda archivos en una carpeta especifica dentro de Descargas |

## Compatibilidad

- Thunderbird **115.0 o superior**
- MailExtensions / Manifest V2

## Actualizaciones

Este repositorio publica el manifiesto de actualizaciones en [`updates.json`](./updates.json).

Repositorio oficial:
[https://github.com/LORDMANUEL/LookOut-Mily](https://github.com/LORDMANUEL/LookOut-Mily)

## Publicacion de versiones

La guia de publicacion se encuentra en [`COMO_ACTUALIZAR.md`](./COMO_ACTUALIZAR.md).

## Creditos

Basado en LookOut v1.2.15 por Aron Rubin.

Adaptacion, continuidad y personalizacion:
**Luis Manuel Fajardo Rivera**
