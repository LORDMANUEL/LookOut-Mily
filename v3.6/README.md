# LookOut-Mily 3.6.0 — Rama de validación

**Estado:** candidato a pruebas, no publicado. La versión productiva en \`main\` permanece intacta.

## Alcance
- Motor TNEF, opciones, logs y código del convertidor recuperados sin modificaciones del XPI 3.5.10.
- Rediseño de pantalla de opciones y popup (light/dark, responsive, accesibilidad).
- Búsqueda desde \`https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/updates.json\` cada 12 horas.
- Comparación numérica de versiones, ventana de estado y notificación del SO al detectar una actualización compatible.
- Botón de actualización dirige a GitHub Releases, **sin auto-instalar** XPI o manipular firmas.
- Compatibilidad declarada 128+; requiere QA real en 128, 140, 153 ESR y 158.0.1.

## Importante
No actualizar el \`updates.json\` público hasta haber firmado, verificado el SHA256, publicado y probado el XPI final.

## Construcción
El paquete \`lookout-mily-3.6.0.xpi\` se arma copiando intactos los archivos del XPI base y sobrescribiendo las rutas de interfaz/manifiesto; código de extracción TNEF no cambia.

## Validación
Inspeccionar el manifest, los archivos ZIP y las cadenas UI; después hacer pruebas sobre perfiles Thunderbird aislados. Importar correo de prueba \`winmail.dat\`, validar extracción, descarga, reemplazo opcional, logs y actualización 3.5.9 -> 3.6.0.
