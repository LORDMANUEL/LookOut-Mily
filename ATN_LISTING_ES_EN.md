# LookOut-Mily 3.6.0 — Texto para Thunderbird Add-ons (ATN)

**Estado:** material de publicación **PREPARADO**, no enviado ni aprobado. Corresponde a **3.6.0 RC**. La información pública debe cambiarse únicamente después de la firma, la migración verificada y las pruebas reales de Thunderbird. La versión que apunta `updates.json` de main continúa siendo 3.5.10.

## Resumen corto (ES)

Convierte archivos `winmail.dat` / Outlook TNEF en adjuntos normales en Thunderbird; conserva el correo original y facilita el diagnóstico.

## Short summary (EN)

Convert Outlook `winmail.dat` / TNEF attachments into usable files in Thunderbird, preserving the original message and providing diagnostics.

## Descripción larga (ES) — propuesta 3.6

**LookOut-Mily 3.6** es un complemento para Thunderbird que recupera adjuntos incluidos en el encapsulado TNEF (`winmail.dat`) utilizado por Microsoft Outlook.

**Novedades de esta versión**

- Interfaz rediseñada, accesible y adaptable, con tema claro/oscuro.
- Conversión del mensaje abierto; evita procesar toda la bandeja.
- Extracción de adjuntos múltiples, nombres Unicode, objetos MAPI y contenido compatible RTF/HTML.
- Corrección de atributos de longitud cero, archivos de datos enviados antes de su nombre y adjuntos vacíos.
- Validación de integridad para evitar conversiones parciales de datos TNEF dañados.
- Guardado manual o múltiple de los archivos recuperados.
- Creación opcional de un correo MIME con los adjuntos como archivos convencionales, **sin eliminar el mensaje original**. Esta opción está desactivada inicialmente.
- Registros exportables para diagnóstico.
- Avisos de versiones nuevas desde el repositorio GitHub; permiten revisar la publicación, no instalar automáticamente una versión sin firma.
- Compatibilidad declarada desde Thunderbird 128 mediante MailExtensions / Manifest V2; pruebas reales de instalación pendientes.

**Correo firmado o cifrado:** el complemento no modifica ni sustituye los mensajes protegidos S/MIME/OpenPGP. TNEF no representa cifrado criptográfico y un mensaje cifrado, aunque carezca de firma digital, necesita la clave privada del destinatario para poder leerse.

**Uso**

1. Abrir un mensaje que contenga `winmail.dat`.
2. Abrir el popup de LookOut-Mily para revisar los adjuntos extraídos.
3. Guardar individualmente los archivos o guardarlos todos.
4. Si se necesita una copia del correo con adjuntos MIME convencionales, habilitar esa opción en la configuración; el original permanecerá intacto.
5. En Opciones se pueden configurar conversiones, descargas, notificaciones y logs.

**Permisos y privacidad**

Los permisos de lectura/gestión de mensajes se utilizan para acceder al correo abierto y, de manera opcional, importar una copia convertida. La comprobación de versiones se realiza mediante la lectura de un manifiesto público HTTPS en GitHub; no transmite el cuerpo ni los adjuntos de correo a GitHub.

**Evidencia de validación del candidato**

La suite automatizada 3.6 recupera la lista esperada de adjuntos en 12/12 archivos TNEF públicos de prueba y el linter oficial Thunderbird informa 0 errores y 0 advertencias. Todavía faltan instalación real, firma y revisión ATN.

## Long description (EN) — proposed 3.6

**LookOut-Mily 3.6** is a Thunderbird MailExtension that extracts usable attachments from Microsoft Outlook's TNEF (`winmail.dat`) message container.

**What's new**

- Redesigned responsive options and attachment popup with light/dark themes.
- Processes only the message currently opened, not an entire mailbox.
- Supports multiple attachments, Unicode file names, supported MAPI objects, and compatible RTF/HTML message contents.
- Fixes empty attributes, data-before-filename ordering, and zero-byte attachments.
- Validates corrupted/truncated containers to avoid incomplete conversion.
- Allows manual and bulk saving of extracted attachments.
- Optionally imports a converted MIME copy **while preserving the original email**; creating a copy is disabled by default.
- Exportable logs for troubleshooting.
- GitHub version checks and notifications, with a link to review releases, not silent XPI installation.
- Declares Thunderbird 128+ compatibility via MailExtensions / Manifest V2. End-to-end client testing is still pending.

**Signed and encrypted email:** the extension does not rewrite or remove protected S/MIME or OpenPGP messages. TNEF encapsulation is not cryptographic encryption; an encrypted email without a digital signature still needs the legitimate recipient's private key.

**How to use**

1. Open an email containing `winmail.dat`.
2. Open the LookOut-Mily popup and inspect the recovered attachments.
3. Save files one by one or save all.
4. Enable optional MIME-copy creation in Settings when needed. Your original email remains intact.
5. Configure automatic processing, downloads, notifications and diagnostic logs in Settings.

**Permissions and privacy**

Mail access permissions enable extraction from the current message and optional import of a converted copy. Update checking retrieves public version metadata over HTTPS from GitHub; message bodies and attachments are not sent to GitHub by the update checker.

**Testing evidence**

The automated 3.6 tests match expected attachments in 12/12 publicly available TNEF samples and the Thunderbird extension linter reports zero findings. Actual installation tests, signing and ATN review have not been completed.

## Capturas de pantalla propuestas / Suggested screenshots

1. Popup modernizado con archivos de `winmail.dat` recuperados / Modern attachment popup.
2. Opciones con conversión, copia opcional y protección del correo original / Settings and preservation.
3. Tema claro/oscuro y versiones de Thunderbird / Themes and Thunderbird compatibility.
4. Aviso de versión disponible desde GitHub / Available-update notification.

## Notas para revisión de ATN / Reviewer notes

- Maintains extension ID `lookout-modern@addons.thunderbird.net` and supports manifest version 2 for Thunderbird 128+.
- Version 3.6 is built reproducibly from the 3.5.10 base with versioned safety patches and readable source.
- No external JavaScript is loaded at runtime; the network request used for update checking is limited to public version metadata.
- No automatic deletion of original mail and no bypass of cryptographic encryption.
- [Source + pull request](https://github.com/LORDMANUEL/LookOut-Mily/pull/3) · [Build and QA instructions](./v3.6/README.md) · [QA report](./v3.6/QA_REPORT_2026-10-26.md).

**No subir esta ficha como publicación estable hasta resolver la [lista de liberación #5](https://github.com/LORDMANUEL/LookOut-Mily/issues/5).**
