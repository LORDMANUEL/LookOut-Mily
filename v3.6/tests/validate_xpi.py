#!/usr/bin/env python3
"""Verificación estructural y de regresión del XPI 3.6 (no sustituye QA en Thunderbird)."""
from pathlib import Path
from zipfile import ZipFile
import json
import hashlib
import re
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from safety_overrides import patch_decoder, patch_backend, patch_options
ROOT = Path(__file__).resolve().parents[2]
XPI = ROOT / "lookout-mily-3.6.0.xpi"
BASE = ROOT / "lookout-mily-3.5.10.xpi"
BACKEND_FILES = ("mapi_props.js",
  "popup/popup.js","preview/preview.js","i18n.js")
with ZipFile(XPI) as z, ZipFile(BASE) as old:
    assert z.testzip() is None, "CRC inválido"
    names = z.namelist()
    assert len(names) == len(set(names)), "Rutas ZIP duplicadas"
    manifest = json.loads(z.read("manifest.json"))
    assert manifest["version"] == "3.6.0"
    assert manifest["manifest_version"] == 2
    assert manifest["browser_specific_settings"]["gecko"]["strict_min_version"] == "128.0"
    assert manifest["browser_specific_settings"]["gecko"]["id"] == "lookout-modern@addons.thunderbird.net"
    assert manifest["browser_specific_settings"]["gecko"]["update_url"] == "https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/updates.json"
    assert manifest["message_display_action"]["default_popup"] == "popup/popup.html"
    for script in manifest["background"]["scripts"]:
        assert script in names, f"Script ausente: {script}"
    for key in BACKEND_FILES:
        assert z.read(key) == old.read(key), f"Regresión en código original: {key}"
    for key, patch in (("background.js", patch_backend),
                       ("tnef_decoder.js", patch_decoder),
                       ("options/options.js", patch_options)):
        assert z.read(key).decode("utf8") == patch(old.read(key).decode("utf8")), f"Parche inesperado: {key}"
    for key in ("options/options.html","popup/popup.html"):
        page = z.read(key).decode("utf8")
        assert "../ui/theme.css" in page
        assert "../ui/updates.js" in page
    expected = {
      "options/options.html": ("autoConvert","autoSave","showNotif","replaceOriginal",
        "saveSubfolder","enableLogs","btn-save","saved-msg","btn-export-logs",
        "btn-clear-logs","logs-status","update-card"),
      "popup/popup.html": ("status","extracted-section","extracted-list","toolbar",
        "btn-save-all","original-section","original-list","divider","repo-link","opts-link","update-card")
    }
    for file,ids in expected.items():
        html=z.read(file).decode("utf8")
        for name in ids:
            assert f'id="{name}"' in html, f"{file} no tiene #{name}"
    # Detect missing UI elements used by the ORIGINAL popup/options scripts.
    # Without this check, a redesigned popup could render but fail at runtime.
    for page, script in (("popup/popup.html", "popup/popup.js"),
                         ("options/options.html", "options/options.js")):
        html = z.read(page).decode("utf8")
        js = z.read(script).decode("utf8")
        declared = re.findall(r'id="([^"]+)"', html)
        assert len(declared) == len(set(declared)), f"Duplicate HTML IDs: {page}"
        expected_ids = re.findall(r'getElementById\("([^"]+)"\)', js)
        missing = set(expected_ids) - set(declared)
        assert not missing, f"{page} is missing UI controls used by {script}: {sorted(missing)}"
    assert "https://raw.githubusercontent.com/*" in manifest["permissions"]
    assert "alarms" in manifest["permissions"]
print("OK: XPI íntegro, núcleo original + 3 parches de seguridad exactos, 2 interfaces y manifest verificados")
print("SHA256:",hashlib.sha256(XPI.read_bytes()).hexdigest().upper())
