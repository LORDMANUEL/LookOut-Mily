# Thunderbird / Mozilla — Guía de IA y revisión técnica de LookOut-Mily 3.6.0

## Recursos oficiales

- [Guía oficial de IA para Thunderbird WebExtensions](https://github.com/thunderbird/webext-support/blob/master/ai/thunderbird-webextensions-skill.md) — orienta a agentes de programación y contiene API, empaquetado, revisiones y buenas prácticas. **No es un motor automático de aprobación**.
- [Validador oficial thunderbird/webext-linter](https://github.com/thunderbird/webext-linter) — herramienta de análisis estático que revisa APIs, permisos, manifiesto, código y políticas ATN. Este sí se ejecuta automáticamente en GitHub Actions.
- [WebExtension API de Thunderbird Manifest V2](https://webextension-api.thunderbird.net/en/mv2/) — referencia de las APIs utilizadas por el complemento.
- [Políticas ATN](https://github.com/thunderbird/atn-review-policy) — relevantes para solicitar inclusión voluntaria en el catálogo oficial.
- [Revisión técnica ATN](https://addons-reviewer-guide.thunderbird.net/) — revisión humana aparte de la validación automática.

## Resultados y alcance

| Control | Estado |
| --- | --- |
| Validación estática oficial de Thunderbird | Integrada y obligatoria en CI: cero errores inesperados y cero advertencias en CI. La única restricción señalada es update-url, exclusiva del catálogo ATN: el paquete se distribuye por GitHub y no solicita listarse en ATN. |
| Pruebas TNEF reales de corpus público | 12 de 12 muestras recuperan los adjuntos esperados |
| Pruebas TNEF sintéticas | Valida bytes, checksum, truncamientos y nombres |
| S/MIME / OpenPGP | Protección contra reescritura de mensajes protegidos; descifrado solo con clave legítima |
| Instalación en Thunderbird | Confirmada por el usuario en la 3.6 RC2 |
| Convertir un correo empresarial Outlook real en Thunderbird | Aún sin evidencia de prueba de extremo a extremo |
| Actualización 3.5.9 → 3.6.0 sobre perfil activo | Aún sin evidencia de prueba de extremo a extremo |

## Criterios que debe aplicar cualquier agente de IA

1. Leer el archivo oficial de habilidad de Thunderbird; comprobar las APIs en los esquemas MV2 y ESR. No inventar APIs ni ocultar errores con bloques catch vacíos.
2. Mantener el identificador inmutable `lookout-modern@addons.thunderbird.net`.
3. Usar `browser_specific_settings.gecko.update_url` por HTTPS para la distribución autohospedada y verificar que el manifiesto remoto declara un XPI válido.
4. No enviar contenido de correos ni adjuntos a servicios externos. El servidor GitHub recibe solo consultas de versiones.
5. No eliminar el correo original al importar una copia; no reescribir mensajes firmados/cifrados.
6. Minimizar permisos y describir explícitamente su necesidad.
7. Conservar el motor TNEF compatible al introducir mejoras. Casos de regresión obligatorios.
8. Comprobar UI en ventanas pequeñas y teclados; no duplicar identificadores HTML ni dejar selectores muertos.
9. Compilar un XPI determinista y validar con el linter Thunderbird en CI. No tratar el resultado del linter como equivalente a una instalación real.
10. Preparar cada lanzamiento mediante GitHub Releases, URL inmutable, SHA-256 verificado y actualización posterior de `updates.json`.
11. No publicar una versión en el manifiesto hasta confirmar que el enlace definitivo y su digest corresponden al XPI entregado.
12. Distinguir **ATN (catalogación/revisión)** de **distribución GitHub de Thunderbird**. No exigir una firma que Thunderbird no requiere.

## Flujo de pruebas

```bash
python3 v3.6/scripts/build_xpi.py
python3 v3.6/tests/validate_xpi.py
python3 v3.6/scripts/build_xpi.py --verify
node v3.6/tests/test_updates.js
```

Las pruebas de TNEF y de compatibilidad que se ejecutan desde CI se describen en [el workflow](../.github/workflows/lookout-mily-v36.yml).

En todas las revisiones usar informes basados en resultados efectivos, no afirmar que una IA «aprobó Mozilla»: **el linter automatizado y la revisión editorial/humana son pasos diferentes**.
