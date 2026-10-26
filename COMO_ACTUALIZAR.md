# Publicación y actualización de LookOut-Mily 3.6

**Estado actual: LookOut-Mily 3.6.0 RC en desarrollo.** La versión 3.6 todavía no está publicada ni firmada. El `updates.json` público continúa anunciando el paquete 3.5.10; **no cambiarlo antes de superar la liberación**.

## Archivos que deben mantenerse sincronizados

| Archivo | Función |
| --- | --- |
| `README.md`, `CHANGELOG.md` | Versión de desarrollo, versión publicada y notas de cambios |
| `v3.6/manifest.json` | Versión de la extensión (actualmente 3.6.0) y el identificador invariable |
| `v3.6/scripts/build_xpi.py` | Generación reproducible del XPI desde las fuentes |
| `v3.6/QA_REPORT_2026-10-26.md` | Pruebas y evidencia del candidato |
| `v3.6/QA_COMPATIBILITY.md` | Pruebas manuales de Thunderbird y migración |
| `ATN_LISTING_ES_EN.md` | Texto de ficha ATN preparado para la futura publicación |
| `docs/index.html` | Sitio público: diferenciar paquete existente y próxima versión |
| `updates.json` en `main` | Manifiesto público: **actualizar solo cuando 3.6 firmada esté disponible** |

## Fases para liberar 3.6.0

1. Confirmar el PR #3 con GitHub Actions aprobado: XPI reproducible, 12 casos TNEF reales, S/MIME protegido, compatibilidad simulada y linter oficial con 0 hallazgos.
2. Preparar una copia de perfil de Thunderbird para validar la migración 3.5.9 → 3.6.0 y las preferencias existentes, sin modificar los buzones originales.
3. Probar el complemento dentro de Thunderbird 128 ESR, 140 ESR, 153 ESR y 158, con mensajes de prueba POP e IMAP, adjuntos múltiples, Unicode, RTF/HTML, S/MIME firmado y cifrado.
4. Enviar el paquete a revisión/firma de Thunderbird Add-ons (ATN) según el canal de publicación utilizado. No deshabilitar `xpinstall.signatures.required` como procedimiento de instalación.
5. Obtener el **XPI definitivo firmado** y generar su SHA-256. La firma cambia los bytes; no copiar el hash del XPI unsigned-test.
6. Publicar el XPI firmado y las notas de versión en **GitHub Releases**. Comprobar realmente la URL de descarga.
7. Actualizar el `updates.json` público con versión, enlace firmado y hash SHA-256 del archivo final, respetando el identificador `lookout-modern@addons.thunderbird.net`.
8. Verificar una actualización real en Thunderbird y su retroceso seguro. Solo entonces actualizar la tabla de versiones del README, la web y el estado del lanzamiento a **3.6.0 estable**.

## Actualización desde GitHub: dos componentes diferentes

**Detector de LookOut-Mily:** `v3.6/updates/background.js` comprueba el manifiesto `updates.json` alojado en GitHub cada 12 horas y bajo demanda. Si encuentra una versión compatible superior, presenta una notificación y abre la sección de Releases para que el usuario la revise. No instala paquetes en segundo plano.

**Instalación y firma:** la instalación automática administrada por Thunderbird/Add-ons requiere el mecanismo de actualización admitido y la firma correspondiente. No debe confundirse el aviso interno de GitHub con la instalación automática de una nueva XPI.

## Ejemplo orientativo de updates.json para el día del lanzamiento

Este ejemplo **NO debe copiarse hoy a la rama principal**. Su URL será válida solo después de crear el tag, adjuntar el XPI firmado y comprobar el hash del paquete:

```json
{
  "addons": {
    "lookout-modern@addons.thunderbird.net": {
      "updates": [
        {
          "version": "3.6.0",
          "update_link": "https://github.com/LORDMANUEL/LookOut-Mily/releases/download/v3.6.0/lookout-mily-3.6.0.xpi",
          "update_hash": "sha256:REEMPLAZAR_CON_SHA256_DEL_XPI_FIRMADO",
          "browser_specific_settings": {
            "gecko": {
              "strict_min_version": "128.0"
            }
          }
        }
      ]
    }
  }
}
```

Verificar también que el detector acepta el dominio del enlace final, que las versiones anteriores mantengan su ruta de actualización y que las políticas de ATN aplicables permitan el método de distribución elegido.

## Construcción y verificación local

```bash
python3 v3.6/scripts/build_xpi.py
python3 v3.6/tests/validate_xpi.py
python3 v3.6/scripts/build_xpi.py --verify
sha256sum lookout-mily-3.6.0.xpi
```

El workflow repite las compilaciones y exige un SHA-256 idéntico, ejecuta la batería de regresión y usa `thunderbird/webext-linter` como control obligatorio. El XPI sin firma de GitHub Actions es para pruebas aisladas, no para desplegar a todos los empleados.

## Regla de seguridad

**No borrar el mensaje original, no saltar controles de firma y no intentar descifrar S/MIME/OpenPGP sin claves autorizadas.** Un correo Outlook con TNEF no es necesariamente un correo cifrado. Para reportar errores, consultar los logs exportables sin incluir contenido privado de correos.

## Evidencia / pendientes

- [PR 3.6](https://github.com/LORDMANUEL/LookOut-Mily/pull/3)
- [Workflow de pruebas](https://github.com/LORDMANUEL/LookOut-Mily/actions/runs/40393031865)
- [Informe de QA](./v3.6/QA_REPORT_2026-10-26.md)
- [Validación de Thunderbird y firma pendiente](https://github.com/LORDMANUEL/LookOut-Mily/issues/5)
