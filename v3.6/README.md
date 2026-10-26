# LookOut-Mily 3.6.0

**Estado:** versión 3.6.0 pública en [GitHub Releases](https://github.com/LORDMANUEL/LookOut-Mily/releases/tag/v3.6.0-rc.2), sin firma ATN. No publicada como estable ni instalada en producción. main y updates.json no se modifican.

## Funciones
- Decodificación Outlook TNEF/winmail.dat para adjuntos MIME normales, cuerpo RTF/HTML, nombres Unicode y objetos MAPI admitidos.
- Arreglos de atributos vacíos, DATA antes de TITLE, atributo final corto, nombre alternativo unknown.dat y validación del encuadre TNEF completo.
- Mejor rendimiento: fragmentos acumulados y unidos una sola vez por archivo, evitando concatenaciones cuadráticas.
- Sin resultados parciales de atributos corruptos, checksum inválido o truncamiento.
- Si un correo está firmado/cifrado con S/MIME o OpenPGP, el complemento no lo reescribe ni borra. Un mensaje cifrado sin firma necesita igualmente la clave privada autorizada.
- La copia convertida conserva el original; crear copias está desactivado por defecto.
- Popup y opciones rediseñados, tema claro/oscuro, responsive, accesibilidad.
- Actualizaciones GitHub cada 12 horas, consulta manual, avisos sin duplicación, enlaces a Releases; nunca instala XPI silenciosamente.

## Compatibilidad
Manifest V2, Thunderbird **128 o posterior**. La invocación messages.getFull distingue 128 (decrypt) de 140+ (decodeContent/decodeHeaders). Se probaron mediante mocks 128 ESR, 140 ESR, 153 ESR y 158. Thunderbird 115 NO es objetivo de 3.6.0. La instalación real en Thunderbird no se ha probado aún.

## Arquitectura
- v3.6/scripts/build_xpi.py: genera XPI del código versionado sobre la base 3.5.10.
- v3.6/scripts/safety_overrides.py: parches precisos y auditables al decodificador, opciones y flujo de mensajes.
- v3.6/ui/, popup/, options/, updates/, manifest.json: fuentes de la interfaz y actualización.
- v3.6/tests/: TNEF sintético y corpus público real, S/MIME, preservación de mensaje, compatibilidad y notificaciones.
- .github/workflows/lookout-mily-v36.yml: compila, compara fuentes y XPI, ejecuta pruebas, linter oficial Thunderbird y publica artefacto unsigned-test.

## Reconstruir
En un clon del proyecto, ejecutar:
    python3 v3.6/scripts/build_xpi.py
    python3 v3.6/tests/validate_xpi.py
    python3 v3.6/scripts/build_xpi.py --verify

El XPI correcto se obtiene como artefacto del workflow. La rama no contiene un XPI obsoleto.

## Pasos de salida
1. QA de migración 3.5.9 -> 3.6.0 en perfil Thunderbird aislado, con correos .eml de prueba.
2. Obtener firma y revisión ATN, calcular SHA256 del XPI firmado.
3. Publicar la versión firmada en GitHub Releases y validar descarga.
4. Modificar updates.json de main solo entonces, con la versión, HTTPS, ID invariable e integridad del paquete.
5. Verificar la actualización real sin pérdida de datos ni preferencias.

Importante: los avisos de GitHub no sustituyen el mecanismo nativo de instalación y firma de Thunderbird. Los complementos listados en ATN no deben forzar update_url autohospedada.
