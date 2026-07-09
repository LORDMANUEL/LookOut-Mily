# LookOut-Mily - ATN Listing Copy

## Resumen corto (ES)

Convierte correos con `winmail.dat` / TNEF en Thunderbird y extrae los adjuntos reales como archivos normales.

## Short summary (EN)

Converts `winmail.dat` / TNEF messages in Thunderbird and extracts the real attachments as normal files.

## Descripción larga (ES)

LookOut-Mily es una extensión para Thunderbird enfocada en correos enviados desde Outlook que llegan con `winmail.dat` o formato TNEF.

El complemento detecta el mensaje abierto, extrae sus archivos reales y permite trabajar con ellos como adjuntos normales. También puede reemplazar el correo original por una copia convertida, para dejar una versión más limpia y fácil de revisar.

Funciones principales:

- procesa solo el correo que el usuario abre
- evita conversiones masivas sobre toda la cuenta
- extrae adjuntos reales desde `winmail.dat`
- puede reemplazar el mensaje original por una copia convertida
- mantiene el flujo manual de guardar archivos si la conversión completa no aplica
- incluye logs exportables para diagnóstico y soporte

Puntos de acceso:

1. Botón del complemento en la vista del mensaje.
2. Popup del complemento al abrir un correo con `winmail.dat`.
3. Página de opciones del complemento para activar o desactivar conversión automática, reemplazo y logs.

Cómo usarlo:

1. Abre un correo que contenga `winmail.dat`.
2. Si la conversión automática está activa, LookOut-Mily procesará ese correo abierto.
3. Si no se reemplaza el mensaje automáticamente, abre el popup del complemento.
4. Desde el popup puedes guardar los archivos extraídos o ver los adjuntos originales.
5. En Opciones puedes activar:
   - conversión automática
   - guardado automático
   - reemplazo del mensaje por copia convertida
   - logs de diagnóstico

Cómo probarlo:

1. Instala el complemento.
2. Usa un correo de prueba que contenga `winmail.dat`.
3. Verifica que el complemento detecte el mensaje abierto.
4. Verifica que los archivos extraídos puedan guardarse.
5. Si está activa la opción de reemplazo, verifica que el complemento cree una copia convertida y envíe el original a la papelera.

Capturas recomendadas para subir a ATN:

1. Popup mostrando archivos extraídos de `winmail.dat`.
2. Página de Opciones mostrando conversión automática, reemplazo y logs.
3. Vista del sitio o documentación donde se vea claramente el flujo del complemento.

## Long description (EN)

LookOut-Mily is a Thunderbird extension focused on Outlook messages that arrive as `winmail.dat` / TNEF.

The add-on detects the message currently being opened, extracts the real files from the TNEF container, and lets the user work with them as normal attachments. It can also replace the original message with a converted copy, leaving a cleaner version that is easier to review.

Main features:

- processes only the message currently opened by the user
- avoids bulk conversion across the entire account
- extracts the real attachments from `winmail.dat`
- can replace the original message with a converted copy
- keeps a manual save flow when full replacement is not applicable
- includes exportable diagnostic logs for support

Entry points:

1. Add-on button in the message display view.
2. Add-on popup when opening a message with `winmail.dat`.
3. Add-on options page to enable or disable automatic conversion, replacement, and logs.

How to use it:

1. Open a message that contains `winmail.dat`.
2. If automatic conversion is enabled, LookOut-Mily will process that opened message.
3. If the message is not automatically replaced, open the add-on popup.
4. From the popup you can save the extracted files or review the original attachments.
5. In the Options page you can enable:
   - automatic conversion
   - automatic saving
   - message replacement with a converted copy
   - diagnostic logs

How to test it:

1. Install the add-on.
2. Use a test message containing `winmail.dat`.
3. Verify that the add-on detects the opened message.
4. Verify that the extracted files can be saved.
5. If replacement is enabled, verify that the add-on creates a converted copy and moves the original to Trash.

Suggested screenshots for ATN:

1. Popup showing files extracted from `winmail.dat`.
2. Options page showing automatic conversion, replacement, and logs.
3. A documentation or project view that clearly shows the add-on workflow.

## Nota para revisión / Review note

LookOut-Mily is a distinct continuation focused on modern Thunderbird compatibility, one-message-at-a-time conversion, replacement workflow, and diagnostic logging.
