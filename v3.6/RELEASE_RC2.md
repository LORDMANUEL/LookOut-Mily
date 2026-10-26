# LookOut-Mily 3.6.0 RC2 — GitHub prerelease

Esta entrega sustituye a RC1 para nuevas pruebas. Se mantiene como XPI sin firma ATN y requiere un perfil de Thunderbird aislado.

- Corrige el botón de Configuración del popup y valida automáticamente los controles que utilizan los scripts HTML.
- El verificador de versiones permite enlaces al manifiesto raw de GitHub y a los XPI publicados en `github.com/LORDMANUEL/LookOut-Mily/releases/download/`, conservando una lista blanca de origen.
- Incluye pruebas de actualización para GitHub Releases, compatibilidad ESR y rechazo de enlaces ajenos.
- Se conserva el motor TNEF optimizado (12/12 corpus público), S/MIME y OpenPGP protegidos y creación de copias sin eliminar el correo original.
- La compilación del XPI permanece determinista y la revisión oficial de Thunderbird es parte obligatoria del CI.

**No es una release estable firmada.** La publicación estable 3.6.0 depende de firma ATN, migración 3.5.9 a 3.6.0 y pruebas E2E dentro de Thunderbird. No actualizar todavía `main/updates.json`.

[QA](./QA_REPORT_2026-10-26.md) · [Pendientes de firma y liberación](https://github.com/LORDMANUEL/LookOut-Mily/issues/5).
