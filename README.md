# LookOut Modern

**Extensión para Thunderbird** que decodifica automáticamente adjuntos TNEF (`winmail.dat`) generados por Microsoft Outlook.

## ¿Qué hace?

Al abrir un correo que contiene `winmail.dat`:

1. **Extrae automáticamente** todos los archivos dentro del archivo TNEF.
2. **Muestra en el popup** dos secciones:
   - 📂 **Archivos extraídos** — los documentos reales (PDFs, Word, imágenes, etc.) con botón "Guardar todos".
   - 📎 **Adjuntos originales** — el `winmail.dat` y cualquier otro adjunto del correo, para que puedas guardarlos y compartirlos fácilmente.

## Instalación (sin firma)

1. En Thunderbird, ve a `about:config` y establece `xpinstall.signatures.required = false`.
2. Ve a **Herramientas → Complementos → ⚙ → Instalar desde archivo**.
3. Selecciona el `.xpi`.

## Opciones

Haz clic en ⚙ dentro del popup:

| Opción | Descripción |
|--------|-------------|
| **Convertir automáticamente** | Extrae el TNEF al abrir el correo (activado por defecto) |
| **Guardar en disco automáticamente** | Descarga los archivos extraídos sin abrir el popup |
| **Notificación al convertir** | Aviso de escritorio cuando se procesan los archivos |
| **Sub-carpeta** | Carpeta dentro de Descargas donde guardar los archivos |

## Compatibilidad

- Thunderbird **115.0 o superior** (incluye 151.x+)
- Manifest V2 / MailExtensions API

## Actualizaciones

Las actualizaciones se detectan automáticamente desde `updates.json` en este repositorio.

Para publicar una nueva versión, ver [`COMO_ACTUALIZAR.md`](COMO_ACTUALIZAR.md).

## Créditos

Basado en LookOut v1.2.15 por Aron Rubin. Adaptado para Thunderbird moderno (WebExtensions) por Luis / 2026.
