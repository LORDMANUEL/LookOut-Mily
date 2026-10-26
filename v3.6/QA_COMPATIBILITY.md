# QA manual — LookOut-Mily 3.6.0

## Canales recomendados
| Cliente | Nivel |
|---|---|
| Thunderbird 128 ESR | Compatibilidad mínima declarada, pendiente prueba funcional |
| Thunderbird 140 ESR | Pendiente QA en perfil aislado |
| Thunderbird 153.5.1 ESR | Pendiente QA en perfil aislado |
| Thunderbird 158.0.1 Release | Pendiente QA en perfil aislado |
| Thunderbird 115 | No garantizado por esta rama (requiere paquete/pruebas adicionales) |

## Prueba de migración
1. Crear perfil separado y respaldar el perfil real.
2. Instalar 3.5.9 y conservar sus preferencias en \`storage.local\`.
3. Instalar 3.6.0 de prueba sobre el mismo ID de extensión. Si Thunderbird impide instalar un XPI no firmado, NO desactivar controles en producción. Firmar mediante ATN.
4. Confirmar que las seis preferencias existentes persisten.
5. Importar correo TNEF de prueba y extraer PDF, Excel, TXT y archivos con caracteres Unicode.
6. Verificar conversiones repetidas del mismo mensaje (deduplicación).
7. Ensayar con reemplazo desactivado y activado en una carpeta temporal, asegurando que el mensaje original no se pierde.
8. Comprobar descarga manual, descarga múltiple y visor de adjuntos.
9. Verificar popup, opciones, logs, teclado, escala 125%-200%, tema oscuro/claro.
10. Probar \`updates.json\` en servidor de ensayo para 3.6.1, comprobar aviso, versión compatible, sin notificación duplicada y botón a GitHub.
11. Simular desconexión: debe continuar el convertidor sin bloqueo ni errores críticos.
12. Comprobar versión en Complementos e inspeccionar Consola de Errores.

## Seguridad y distribución
- La consulta remota usa solo metadatos de versión, no correos ni adjuntos.
- Los enlaces de actualización se restringen al repositorio esperado.
- El botón dirige a GitHub Releases y no instala XPI silenciosamente.
- Esta compilación de prueba no incluye firma de ATN: no anunciar como versión productiva.
- Antes de cambiar \`updates.json\` en \`main\`: firmar XPI final, publicar versión, calcular SHA256 del archivo firmado y realizar prueba de instalación real.
