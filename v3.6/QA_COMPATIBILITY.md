# QA manual de LookOut-Mily 3.6

| Thunderbird | Contrato de API probado | Instalación real |
|---|---|---|
| 128 ESR | Sí, con simulaciones | Pendiente |
| 140 ESR | Sí, con simulaciones | Pendiente |
| 153 ESR | Sí, con simulaciones | Pendiente |
| 158 Release | Sí, con simulaciones | Pendiente |
| 115 | No soportado por 3.6.0 | No procede |

## Matriz obligatoria antes de producción
1. Respaldar el perfil productivo y preparar perfil aislado de Thunderbird con .eml sintéticos.
2. Instalar 3.5.9, guardar preferencias y migrar a 3.6.0 firmado usando el mismo ID de complemento; comprobar persistencia.
3. Convertir winmail.dat con TXT, PDF, Office, RTF, HTML, Unicode, vCards, ICS, adjuntos múltiples y vacíos.
4. Verificar nombres, bytes, tamaños, asunto, fecha, remitente, destinatarios, cuerpo y cabeceras del mensaje convertido.
5. Probar corrupción de checksum, truncamiento, atributo final de cero bytes y relleno NUL; no producir resultados parciales.
6. Comprobar que el mensaje original siempre permanece después de importar una copia en una carpeta de pruebas, incluidas cuentas POP e IMAP.
7. Probar S/MIME firmado, S/MIME cifrado con y sin firma, PGP cifrado y mensajes rfc822 anidados. Nunca eliminar el original ni prometer descifrado sin clave.
8. Confirmar descargas manuales y múltiples, visor, logs, deduplicación y comportamiento al reiniciar.
9. Verificar popup, opciones, tema oscuro/claro, zoom 200%, teclado, español/inglés y tamaños 360, 390, 768, 1024 y 1440 px.
10. Comprobar aviso de versiones con feed de ensayo, cambios 3.6.1, versiones incompatibles, falla de red y ausencia de notificaciones repetidas.
11. Registrar evidencias por versión Thunderbird y verificar Consola de errores sin excepciones.
12. Firmar con ATN, publicar release, comprobar hash firmado y probar actualización instalada antes de modificar updates.json.

**Bloqueos externos:** firma del XPI, instalación real en Thunderbird y pruebas de migración. GitHub Actions no simula el renderizado del cliente completo.
