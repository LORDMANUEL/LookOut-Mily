# Actualizaciones de LookOut-Mily 3.6.0 en Thunderbird

**Canal público:** [GitHub Releases](https://github.com/LORDMANUEL/LookOut-Mily/releases). La versión 3.6.0 se distribuye mediante un XPI autohospedado, aprobado para lanzamiento por el responsable del proyecto.

## Thunderbird, ATN y firma

Thunderbird **no exige firma ATN** para instalar extensiones XPI con un ID válido. En cambio, publicar la extensión en el catálogo [addons.thunderbird.net](https://addons.thunderbird.net/) implica una revisión y políticas propias. Estas dos modalidades son independientes. No confundas la firma obligatoria de Firefox con las condiciones de Thunderbird. No es necesario desactivar ajustes de seguridad ni pedir al usuario hacerlo.

Documentación:
- [Thunderbird: crear una extensión XPI](https://developer.thunderbird.net/add-ons/hello-world-add-on)
- [Thunderbird: guía de extensiones](https://developer.thunderbird.net/add-ons/mailextensions)
- [Política de revisión ATN](https://github.com/thunderbird/atn-review-policy)
- [Herramienta oficial de revisión webext-linter](https://github.com/thunderbird/webext-linter)
- [Guía de IA oficial para desarrollar MailExtensions](https://github.com/thunderbird/webext-support/blob/master/ai/thunderbird-webextensions-skill.md)

## Arquitectura de actualización

```text
Instalación LookOut-Mily 3.6.0
             |
             +--> Thunderbird: update_url de manifest.json
             |       |
             |       +--> GitHub main/updates.json
             |                     |
             |                     +--> versión posterior, URL XPI y SHA256
             |                     |
             |                     +--> Thunderbird obtiene/instala conforme a sus preferencias
             |
             +--> Avisos del propio complemento
                     |
                     +--> consulta updates.json cada 12 horas
                     +--> compara versiones
                     +--> avisa una vez por versión
                     +--> abre GitHub Releases al solicitarlo
```

El manifiesto contiene la dirección **HTTPS** `https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/updates.json`. El identificador `lookout-modern@addons.thunderbird.net` permanece sin cambios.

**Nota importante:** la RC2 y el lanzamiento público se identifican como `3.6.0`; por ello Thunderbird no interpreta la sustitución de una RC2 por otro XPI 3.6.0 como una actualización de versión. Quienes probaron RC2 deben instalar manualmente la edición pública. Las versiones **3.6.1 y posteriores** sí podrán detectarse y ofrecerse como superiores.

## Procedimiento para publicar la siguiente versión

1. Actualizar la versión del manifiesto a un valor mayor (por ejemplo `3.6.1`).
2. Generar XPI desde fuentes verificables mediante GitHub Actions, ejecutar pruebas TNEF, UI, actualización y `thunderbird/webext-linter`.
3. Publicar el XPI en un GitHub Release estable, con nombre y tag inmutables; verificar SHA-256 del archivo descargable.
4. **Solo después** actualizar `updates.json` en `main` con la versión, `update_link` HTTPS y `update_hash` correspondiente al archivo.
5. Probar una actualización real en Thunderbird desde la versión anterior y validar que las preferencias y correos se conservan.
6. Confirmar que aparece el aviso del complemento una sola vez por versión y que Thunderbird respeta sus opciones de actualizaciones automáticas.

## Pruebas y seguridad

- La comprobación de versiones consulta metadatos públicos, **no envía correos ni adjuntos**.
- La extensión no debe borrar los mensajes originales ni reescribir S/MIME/OpenPGP protegido.
- TNEF es un formato contenedor, no un sistema de cifrado. Los mensajes realmente cifrados requieren sus claves legítimas.
- El usuario administra las actualizaciones automáticas en **Complementos y temas → engranaje → Actualizar complementos automáticamente**.
- Ejecutar las pruebas de mensajes `winmail.dat` y verificar integridad antes de distribuir masivamente.
- La revisión ATN, si posteriormente se solicita figurar en ese catálogo, es independiente del release autohospedado.

[GitHub Releases](https://github.com/LORDMANUEL/LookOut-Mily/releases) · [Informe QA](https://github.com/LORDMANUEL/LookOut-Mily/blob/release/3.6.0-public/v3.6/QA_REPORT_2026-10-26.md)
