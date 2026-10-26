# Registro de cambios — LookOut-Mily

El proyecto distingue **código en desarrollo** de **versión publicada**. Los cambios no se consideran disponibles en Thunderbird hasta que se firmen, publiquen y prueben.

## [3.6.0] — Versión pública 3.6.0 (GitHub Releases) — 2026-10-26

**Estado:** edición pública; motor probado automáticamente, instalación confirmada en Thunderbird, pendientes únicamente pruebas ampliadas de correos reales y migración. El catálogo ATN es opcional y requiere una variante sin update_url externo. [PR #3](https://github.com/LORDMANUEL/LookOut-Mily/pull/3) · [Tareas de publicación #5](https://github.com/LORDMANUEL/LookOut-Mily/issues/5).

### Interfaz y experiencia

- Popup de archivos recuperados rediseñado, con botones de descarga y estados más claros.
- Configuración reorganizada, tema claro/oscuro, componentes adaptables y navegación más accesible.
- Mensajes de versiones nuevas disponibles desde GitHub; consulta manual y automática cada 12 horas, con avisos que no se repiten por versión.

### Motor Outlook / TNEF

- Corrección de atributos de longitud cero y del caso en que los datos preceden al nombre.
- Recuperación del último atributo corto, adjuntos sin nombre como `unknown.dat` y nombre correcto de los archivos vacíos.
- Normalización de nombres con caracteres NUL terminales y separadores.
- Validación del encabezado y longitud del contenedor, integridad de atributos, checksum y truncamiento antes de confirmar los archivos.
- Unión de fragmentos de adjuntos una sola vez para reducir el coste de concatenación en contenidos grandes.

### Seguridad y compatibilidad

- La conversión MIME opcional **no elimina el mensaje original**.
- Crear copia convertida queda desactivado por defecto para nuevas instalaciones.
- Los mensajes firmados o cifrados S/MIME/OpenPGP no se reescriben; el descifrado requiere la clave privada disponible y autorizada, incluso si no existe firma digital.
- Adaptación de parámetros de `messages.getFull` según APIs disponibles desde Thunderbird 128 y 140+.
- Código fuente y compilación del XPI auditables y reproducibles.

### Calidad (automática, no E2E)

- 12/12 archivos públicos TNEF con nombres y cantidades esperados.
- 11 categorías sintéticas, incluidos archivos binarios comparados byte a byte.
- 8 escenarios de preservación de mensajes.
- Compatibilidad de APIs simulada en Thunderbird 128 ESR, 140 ESR, 153 ESR y 158.
- Linter oficial Thunderbird: 0 errores y 0 advertencias.
- Dos builds del XPI con SHA-256 idéntico.

**Limitación:** las validaciones automatizadas no sustituyen la instalación y las pruebas visuales reales. Tampoco garantizan lectura de contenido cifrado sin clave.

[Informe técnico de QA](./v3.6/QA_REPORT_2026-10-26.md) · [Plan manual](./v3.6/QA_COMPATIBILITY.md).

## [3.5.10] — Paquete actualmente referenciado por main

- Ajustes de compatibilidad de Thunderbird 128+ y Manifest V2.
- Revisión de APIs y permisos para ATN.
- Localización en inglés y español.
- Registro exportable de diagnósticos.
- Empaquetado XPI depurado y conversión de correo abierto.

**Nota histórica:** 3.5.10 tenía un flujo de reemplazo que podía enviar el original a la Papelera; **ese flujo se cambia para 3.6**. No mezclar las instrucciones de operación de ambas versiones.

## [3.5.9] — Versión de referencia para migración

- Versión anterior disponible en el historial XPI de GitHub.
- La ruta de actualización que debe probarse es 3.5.9 → 3.6.0, preservando preferencias, adjuntos, cabeceras y correo original.

---

Antes de anunciar una nueva versión como estable, seguir la [guía de publicación y actualizaciones](./COMO_ACTUALIZAR.md) y verificar el XPI final firmado.
