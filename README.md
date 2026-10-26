# LookOut-Mily

[![Versión en desarrollo](https://img.shields.io/badge/desarrollo-3.6.0_RC-0b8f6a?style=for-the-badge)](https://github.com/LORDMANUEL/LookOut-Mily/pull/3)
[![Paquete en main](https://img.shields.io/badge/paquete_en_main-3.5.10-157ad1?style=for-the-badge)](https://github.com/LORDMANUEL/LookOut-Mily/blob/main/updates.json)
[![Sitio](https://img.shields.io/badge/sitio-GitHub_Pages-4659bd?style=for-the-badge)](https://lordmanuel.github.io/LookOut-Mily/)

**LookOut-Mily** es un complemento MailExtensions para **Thunderbird** que recupera adjuntos y datos de mensajes de Microsoft Outlook enviados como `winmail.dat` / **TNEF**, para poder usarlos como archivos convencionales. No recopila contenido del correo para consultar versiones.

## Versiones y estado de lanzamiento

| Canal | Versión | Estado | Acción |
| --- | --- | --- | --- |
| Próxima entrega, rama `feature/lookout-mily-v3.6` | **3.6.0 RC** | Desarrollo y pruebas automáticas aprobados. **No firmado ni publicado como estable**. | [Revisar PR #3](https://github.com/LORDMANUEL/LookOut-Mily/pull/3) |
| Paquete disponible en la rama `main` | **3.5.10** | Sigue siendo el paquete al que apunta `updates.json`. No se ha sustituido por la RC. | [Consultar el manifiesto de actualizaciones](./updates.json) |

El estado **3.6 RC** representa el trabajo actual de desarrollo, no una actualización ya instalada en los equipos. El número de versión del complemento dentro del paquete de pruebas es **3.6.0**.

- [XPI 3.6.0 de pruebas sin firma — artefacto de GitHub Actions](https://github.com/LORDMANUEL/LookOut-Mily/releases/download/v3.6.0-rc.2/lookout-mily-3.6.0.xpi). Para un perfil aislado, no como instalador general; el artefacto de Actions es temporal.
- [Complemento en Thunderbird Add-ons (ATN)](https://addons.thunderbird.net/es/thunderbird/addon/lookout-mily/) — verificar allí qué versión está efectivamente aprobada antes de instalar.
- [Sitio del proyecto](https://lordmanuel.github.io/LookOut-Mily/) · [Código y PR](https://github.com/LORDMANUEL/LookOut-Mily/pull/3) · [Reporte QA 3.6](./v3.6/QA_REPORT_2026-10-26.md)

## Novedades de LookOut-Mily 3.6

- **Rediseño de interfaz:** popup de adjuntos y opciones modernizados, adaptables a diferentes pantallas, tema claro/oscuro, accesibilidad y estados visibles.
- **Conversión TNEF optimizada:** procesa múltiples adjuntos, nombres Unicode, objetos MAPI, cuerpos RTF/HTML y adjuntos vacíos; corrige casos DATA antes de TITLE, atributos de longitud cero y atributos finales cortos.
- **Validación de integridad:** identifica datos truncados, checksums inválidos y contenedores malformados; no presenta resultados parciales como conversiones completas.
- **Protección de los correos:** al habilitar la creación de una copia MIME convertida se conserva el correo original. La opción viene desactivada por defecto para instalaciones nuevas.
- **Mensajes firmados o cifrados:** protege el MIME original S/MIME/OpenPGP para evitar reescribirlo. Un correo realmente cifrado, aunque no esté firmado, **necesita su clave legítima de descifrado**; TNEF no equivale a cifrado.
- **Actualizaciones:** comprobación de metadatos públicos en GitHub cada 12 horas y bajo demanda; detecta versiones superiores compatibles, evita avisos repetidos y permite abrir GitHub Releases. No instala un XPI automáticamente.
- **Compatibilidad de APIs:** manejo de `messages.getFull` adaptado a Thunderbird 128 y a las APIs de 140 y posteriores.
- **Build reproducible:** el mismo código genera el mismo SHA-256 del XPI de pruebas.

## ¿Cómo se usa?

1. Abre un mensaje con `winmail.dat` en Thunderbird.
2. LookOut-Mily identifica el contenedor TNEF y presenta los archivos extraíbles en su popup.
3. Puedes guardarlos individualmente o en conjunto.
4. Si activas expresamente **Crear copia convertida**, se crea un mensaje MIME con adjuntos convencionales, **sin eliminar el correo original**.
5. En **Opciones** configuras conversión, guardado, registros y avisos de nuevas versiones.

La conversión se limita al correo abierto; no recorre masivamente toda la bandeja.

## Validación de la 3.6 RC

| Verificación | Resultado |
| --- | --- |
| Corpus público de TNEF (Microsoft Outlook) | **12/12 muestras** con los nombres y cantidades esperados |
| TNEF sintético y datos binarios | **11 categorías** de pruebas |
| Preservación de originales y formatos MIME protegidos | **8 escenarios** |
| Versiones Thunderbird 128 ESR, 140 ESR, 153 ESR y 158 | **APIs simuladas**, no instalación real |
| Revisión oficial `thunderbird/webext-linter` | **0 errores, 0 advertencias** |
| Compilación reproducible | Dos XPI generados con SHA-256 idéntico |

**Pendiente antes de anunciar 3.6 como estable:** instalación y prueba real dentro de Thunderbird (incluida migración 3.5.9 → 3.6.0, IMAP/POP y UI), firma y revisión mediante ATN, GitHub Release con XPI firmado y actualización del manifiesto público. [Seguimiento de liberación #5](https://github.com/LORDMANUEL/LookOut-Mily/issues/5).

## Compatibilidad

- **Declarada para 3.6 RC:** Thunderbird 128.0 o superior, MailExtensions / Manifest V2.
- **Probada automáticamente:** contratos de APIs simulados para 128, 140, 153 ESR y 158. Las pruebas automatizadas no equivalen a certificación de todas las versiones en cliente real.
- Thunderbird 115 no está dentro del rango soportado de 3.6.0.

## Desarrollo, pruebas y documentación

El código fuente de 3.6 está en [`v3.6/`](./v3.6/). El paquete XPI se construye desde el XPI base 3.5.10 aplicando parches versionados y auditablemente limitados:

```bash
python3 v3.6/scripts/build_xpi.py
python3 v3.6/tests/validate_xpi.py
python3 v3.6/scripts/build_xpi.py --verify
```

- [Notas de cambios](./CHANGELOG.md)
- [Arquitectura e instrucciones de la rama 3.6](./v3.6/README.md)
- [Resultados completos de las pruebas](./v3.6/QA_REPORT_2026-10-26.md)
- [Matriz manual de compatibilidad y migración](./v3.6/QA_COMPATIBILITY.md)
- [Guía de publicación y firma](./COMO_ACTUALIZAR.md)
- [Texto de ficha de ATN español/inglés](./ATN_LISTING_ES_EN.md)
- [Workflow de CI](./.github/workflows/lookout-mily-v36.yml)

**Aviso de seguridad:** no es necesario ni recomendable desactivar las comprobaciones de firmas de Thunderbird para utilizar el complemento en producción. La RC sin firmar solo es un artefacto de validación, pendiente de firma oficial.

## Créditos

Basado en LookOut v1.2.15, de Aron Rubin. Adaptación y mantenimiento de LookOut-Mily: **Luis Manuel Fajardo Rivera**. Consulte la licencia y el archivo `NOTICE` antes de su redistribución.
