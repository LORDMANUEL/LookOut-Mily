# LookOut-Mily 3.6.0 — Candidato público RC1

Esta edición permite probar el XPI de **LookOut-Mily 3.6.0** antes de una liberación estable, en perfiles aislados de Thunderbird.

- Incluye corrección del selector `opts-link` que provocaba una excepción al abrir el popup.
- La batería CI revisa que todas las referencias a controles HTML desde los controladores JavaScript tengan su ID.
- El motor TNEF conserva los correos originales, valida la integridad de los atributos y supera 12 muestras públicas reales.
- La interfaz de Opciones y el popup pasaron pruebas visuales simuladas en Chromium; todavía no existe instalación real verificada en Thunderbird.
- El complemento no puede descifrar correo S/MIME u OpenPGP sin la clave privada autorizada.

**ATENCIÓN:** el XPI es una compilación pública **sin firma ATN** y **no se anuncia como versión estable**. Se publica como GitHub prerelease `v3.6.0-rc.1`; el manifiesto público `updates.json` continúa apuntando a 3.5.10 hasta obtener firma y terminar QA de migración.

## Ruta de liberación estable

1. Obtener firma y revisión ATN de 3.6.0.
2. Probar instalación en Thunderbird, upgrade desde 3.5.9 y preservación de preferencias IMAP/POP.
3. Publicar una release estable con el XPI firmado y el hash correspondiente.
4. Actualizar `updates.json` a 3.6.0 solo cuando la URL firmada esté disponible.

Más información: [QA](./QA_REPORT_2026-10-26.md) · [Incidencia de liberación](https://github.com/LORDMANUEL/LookOut-Mily/issues/5).
