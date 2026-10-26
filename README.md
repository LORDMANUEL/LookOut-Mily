# LookOut-Mily — convertidor TNEF para Thunderbird

[![LookOut-Mily 3.6.0](https://img.shields.io/badge/LookOut--Mily-3.6.0-13ad9c?style=for-the-badge)](https://github.com/LORDMANUEL/LookOut-Mily/releases/tag/v3.6.0)
[![Website](https://img.shields.io/badge/Website-GitHub_Pages-236393?style=for-the-badge)](https://lordmanuel.github.io/LookOut-Mily/)
[![Thunderbird](https://img.shields.io/badge/Thunderbird-128%2B-3c74c5?style=for-the-badge)](https://www.thunderbird.net/)

**LookOut-Mily 3.6.0** ayuda a recuperar documentos, hojas de cálculo, imágenes y otros adjuntos enviados desde Microsoft Outlook en un contenedor **`winmail.dat` / TNEF**, para trabajar con ellos directamente en Mozilla Thunderbird.

## Versión pública 3.6.0

| Canal | Versión | Estado |
| --- | --- | --- |
| [GitHub Releases: 3.6.0](https://github.com/LORDMANUEL/LookOut-Mily/releases/tag/v3.6.0) | **3.6.0** | **Versión pública autohospedada en GitHub**, compatible con Thunderbird 128+ |
| [Manifiesto de actualizaciones](./updates.json) | **3.6.0** | Se actualiza después de publicar y verificar el XPI de GitHub |

**[Descargar XPI 3.6.0](https://github.com/LORDMANUEL/LookOut-Mily/releases/download/v3.6.0/lookout-mily-3.6.0.xpi)** · **[Ver nueva web con explicación y guía](https://lordmanuel.github.io/LookOut-Mily/)**

La 3.6.0 es la **versión pública de GitHub**, aprobada para distribución por el mantenedor y probada mediante una batería automatizada. La instalación en Thunderbird ya fue confirmada. La validación seguirá ampliándose con correos reales y pruebas de migración; la revisión en el catálogo ATN es opcional e independiente. Thunderbird no exige firma ATN para instalar el XPI.

## Qué mejora la versión 3.6

- **Nueva interfaz:** panel de adjuntos y opciones más simples, tema claro/oscuro y diseño adaptable.
- **Motor TNEF optimizado:** compatibilidad mejorada con adjuntos múltiples, nombres Unicode, objetos MAPI, atributos vacíos y el caso en que los datos llegan antes del nombre.
- **Seguridad:** valida el contenedor, checksums y truncamientos; no da por correcta una extracción parcial.
- **Correo original conservado:** la creación de una copia MIME es opcional y no elimina el mensaje original.
- **Cifrado protegido:** no reescribe mensajes S/MIME ni OpenPGP cifrados o firmados. Un correo cifrado, incluso sin firma digital, necesita la clave privada autorizada.
- **Actualizaciones desde GitHub:** consulta nuevas versiones compatibles y avisa sin instalarlas silenciosamente.
- **Registros locales:** diagnóstico exportable para soporte.

## Cómo funciona

1. Abre en Thunderbird un mensaje que contenga un adjunto `winmail.dat`.
2. Abre el panel de LookOut-Mily y revisa los archivos extraídos.
3. Guarda los adjuntos individualmente o en conjunto.
4. Opcionalmente, crea una copia MIME con adjuntos convencionales: **el mensaje original permanece intacto**.

No se procesan de forma masiva todos los correos de la cuenta.

## Pruebas y compatibilidad

| Comprobación | Resultado de la 3.6.0 |
| --- | --- |
| 12 muestras públicas reales de TNEF | **12/12**, nombres y cantidades de adjuntos esperados |
| Categorías de pruebas TNEF sintéticas | **11**, incluidos datos binarios y archivos vacíos |
| Protección de mensajes originales | **8** escenarios automatizados |
| Linter oficial de Thunderbird | **0 errores y 0 advertencias** |
| Compatibilidad de APIs | **Simulada** para Thunderbird 128, 140, 153 y 158 |
| Instalación/migración 3.5.9 → 3.6.0 en Thunderbird | Validación de migración ampliada pendiente |
| Firma oficial ATN | Opcional para figurar en el catálogo ATN |

La compatibilidad declarada es **Thunderbird 128 o superior** mediante MailExtensions / Manifest V2. No se anuncia compatibilidad de la versión 3.6 con Thunderbird 115.

## Cómo probarla

Descarga el [XPI 3.6.0 público de GitHub Releases](https://github.com/LORDMANUEL/LookOut-Mily/releases/download/v3.6.0/lookout-mily-3.6.0.xpi). Para validarlo en un perfil de Thunderbird:

1. Haz una copia de seguridad del perfil y abre **Complementos y temas**.
2. Abre el menú del engranaje y selecciona **Instalar complemento desde archivo**.
3. Selecciona el XPI. Thunderbird admite extensiones autohospedadas sin firma obligatoria de ATN; no se necesitan modificaciones de seguridad.
4. Abre un correo de prueba con `winmail.dat`, comprueba la extracción y la descarga.
5. Verifica que el mensaje original permanezca intacto, sin duplicaciones.

## Seguridad, privacidad y límites

**TNEF no equivale a cifrado criptográfico.** La extensión recupera archivos de un formato de encapsulado, no intenta eludir el cifrado S/MIME/OpenPGP. Los avisos de GitHub consultan metadatos públicos de versión, no el cuerpo de tus mensajes ni sus adjuntos.

Las pruebas automáticas no garantizan compatibilidad universal con todos los correos de Outlook. Para despliegues amplios, continúa validando con mensajes Outlook reales y prueba una actualización controlada. La firma ATN no es un requisito de instalación de Thunderbird.

## Código, documentación y soporte

- [Sitio oficial con instrucciones, funcionalidades y preguntas frecuentes](https://lordmanuel.github.io/LookOut-Mily/)
- [Versión pública 3.6.0](https://github.com/LORDMANUEL/LookOut-Mily/releases/tag/v3.6.0)
- [Rama de desarrollo 3.6, código y pruebas](https://github.com/LORDMANUEL/LookOut-Mily/tree/feature/lookout-mily-v3.6)
- [Informe técnico de QA](https://github.com/LORDMANUEL/LookOut-Mily/blob/feature/lookout-mily-v3.6/v3.6/QA_REPORT_2026-10-26.md)
- [Seguimiento de pruebas y futuras mejoras](https://github.com/LORDMANUEL/LookOut-Mily/issues/5)
- [Reporte de problemas](https://github.com/LORDMANUEL/LookOut-Mily/issues)
- [Thunderbird Add-ons](https://addons.thunderbird.net/es/thunderbird/addon/lookout-mily/) — consultar las versiones distribuidas mediante el catálogo ATN; la edición de GitHub es independiente.

## Créditos y licencia

Basado en LookOut v1.2.15 por **Aron Rubin**. Continuación, adaptación y mantenimiento: **Luis Manuel Fajardo Rivera**. Consulta la licencia del repositorio y el archivo `NOTICE` antes de redistribuirlo.
