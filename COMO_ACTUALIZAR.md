# Como publicar una nueva version de LookOut-Mily

## Archivos que se actualizan

En este repositorio se publican principalmente:

- `lookout-mily-X.Y.Z.xpi`
- `updates.json`
- `README.md`

## Pasos recomendados

1. Actualiza la version del addon en `manifest.json` dentro del codigo fuente local.
2. Empaqueta el complemento como `.xpi`.
3. Calcula el hash SHA256 del nuevo archivo.
4. Sube el nuevo `lookout-mily-X.Y.Z.xpi`.
5. Actualiza `updates.json` para apuntar a la version nueva.
6. Ajusta `README.md` para reflejar la version publicada y sus cambios principales.
7. Haz commit y push al repositorio.

## Ejemplo para 3.5.8

- Archivo: `lookout-mily-3.5.8.xpi`
- URL publica:
  `https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/lookout-mily-3.5.8.xpi`
- Manifiesto:
  `https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/updates.json`

## Formato de updates.json

```json
{
  "addons": {
    "lookout-modern@addons.thunderbird.net": {
      "updates": [
        {
          "version": "3.5.8",
          "update_link": "https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/lookout-mily-3.5.8.xpi",
          "update_hash": "sha256:HASH_AQUI",
          "browser_specific_settings": {
            "gecko": {
              "strict_min_version": "115.0"
            }
          }
        }
      ]
    }
  }
}
```

## Nota

Si el complemento se instala sin firma, Thunderbird puede requerir:

- `xpinstall.signatures.required = false`

para permitir instalaciones manuales en entornos controlados.

## Nota para 3.5.8

Esta publicacion agrega logs exportables desde la pagina de opciones. Antes de marcar una incidencia como corregida en produccion, conviene pedir al usuario el archivo JSON exportado para confirmar si hubo reproceso, reapertura en otra pestaña o fallo en el reemplazo del mensaje.
