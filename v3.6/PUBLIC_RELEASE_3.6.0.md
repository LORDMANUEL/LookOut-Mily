# Publicación 3.6.0 — LookOut-Mily

Canal: GitHub Releases, extensión Thunderbird autohospedada. La revisión ATN es opcional, y esta variante utiliza un `update_url` externo incompatible con la catalogación ATN.

- Conversión TNEF Outlook / winmail.dat, 12/12 muestras públicas aprobadas.
- Rediseño de popup y opciones, conservando el correo original.
- Preservación de S/MIME/OpenPGP y validación de integridad de adjuntos.
- `browser_specific_settings.gecko.update_url` apunta al manifiesto público HTTPS del repositorio.
- Notificaciones internas de versiones disponibles sin duplicados, además de actualizaciones nativas gestionadas por Thunderbird.
- Instalación en Thunderbird confirmada por el mantenedor; siguen ampliándose pruebas con correos Outlook reales.
- Revisión oficial webext-linter integrada: cero hallazgos inesperados. La regla `update-url` se documenta expresamente como restricción de catalogación ATN, no bloqueo de distribución por GitHub.

**Nota de compatibilidad con RC2:** como la RC2 y la versión pública llevan el mismo número `3.6.0`, Thunderbird no efectúa un salto automático de una a otra. Es necesario instalar manualmente el XPI público sobre esa RC2 una vez. Las versiones futuras superiores pueden utilizar el manifiesto.

La URL de descarga y SHA-256 se verifican antes de publicar la entrada de `updates.json` de producción.
