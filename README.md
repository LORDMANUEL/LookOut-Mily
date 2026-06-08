# LookOut-Mily

**Extension para Thunderbird** que convierte automaticamente adjuntos TNEF (`winmail.dat`) en correos con adjuntos normales.

## ¿Qué hace?

Al abrir un correo que contiene `winmail.dat`:

1. **Extrae automaticamente** los archivos del TNEF.
2. **Reconstruye el cuerpo del mensaje** usando el contenido del TNEF y las partes inline originales del correo.
3. **Crea una copia convertida** con adjuntos normales.
4. **Abre la copia convertida** y envia el correo original con `winmail.dat` a la papelera.
5. Si la conversion total falla, mantiene funciones manuales desde el popup.

## Instalación (sin firma)

1. En Thunderbird, ve a `about:config` y establece `xpinstall.signatures.required = false`.
2. Ve a **Herramientas → Complementos → ⚙ → Instalar desde archivo**.
3. Selecciona el `.xpi`.

## Opciones

Haz clic en Opciones dentro del popup:

| Opción | Descripción |
|--------|-------------|
| **Convertir automaticamente** | Procesa el `winmail.dat` al abrir el correo |
| **Reemplazar el mensaje por una copia convertida** | Importa un correo nuevo con adjuntos normales y manda el original a la papelera |
| **Guardar en disco automaticamente** | Descarga los archivos extraidos cuando hay fallback manual |
| **Notificacion al convertir** | Aviso de escritorio al terminar |
| **Sub-carpeta** | Carpeta dentro de Descargas donde guardar archivos en modo manual |

## Compatibilidad

- Thunderbird **115.0 o superior**
- Manifest V2 / MailExtensions API

## Actualizaciones

Repositorio: [LORDMANUEL/LookOut-Mily](https://github.com/LORDMANUEL/LookOut-Mily)

Las actualizaciones se detectan automaticamente desde `updates.json` en este repositorio.

Para publicar una nueva versión, ver [`COMO_ACTUALIZAR.md`](COMO_ACTUALIZAR.md).

## Créditos

Basado en LookOut v1.2.15 por Aron Rubin. Adaptado y extendido como LookOut-Mily por **Luis Manuel Fajardo Rivera**.
