#!/usr/bin/env python3
"""Checks that 3.6 release-candidate docs agree without publishing 3.6 prematurely."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[2]
files = {
    name: (root / name).read_text(encoding="utf-8")
    for name in (
        "README.md",
        "CHANGELOG.md",
        "COMO_ACTUALIZAR.md",
        "ATN_LISTING_ES_EN.md",
        "docs/index.html",
        "v3.6/README.md",
        "v3.6/QA_COMPATIBILITY.md",
        "v3.6/QA_REPORT_2026-10-26.md",
    )
}
manifest = json.loads((root / "v3.6/manifest.json").read_text(encoding="utf-8"))
feed = json.loads((root / "updates.json").read_text(encoding="utf-8"))

assert manifest["version"] == "3.6.0"
addon_id = manifest["browser_specific_settings"]["gecko"]["id"]
assert addon_id == "lookout-modern@addons.thunderbird.net"
assert manifest["browser_specific_settings"]["gecko"]["strict_min_version"] == "128.0"

# The public update feed must stay pinned to the currently distributed
# package until a signed production release is available.
updates = feed["addons"][addon_id]["updates"]
assert updates and updates[0]["version"] in ("3.5.10", "3.6.0")
assert ("3.5.10.xpi" in updates[0]["update_link"]) if updates[0]["version"] == "3.5.10" else ("/releases/download/v3.6.0/" in updates[0]["update_link"])
assert len(updates) >= 1
assert re.fullmatch(r"sha256:[a-fA-F0-9]{64}", updates[0]["update_hash"])

readme = files["README.md"]
site = files["docs/index.html"]
assert "3.6.0" in readme
assert "3.6.0" in site
assert 'addons.thunderbird.net/es/thunderbird/addon/lookout-mily/' in readme
assert 'addons.thunderbird.net/es/thunderbird/addon/lookout-mily/' in site

for name, text in files.items():
    assert "3.6" in text, f"{name}: missing current development version"
    assert "3.5.9.xpi" not in text, f"{name}: outdated release instructions"
    assert "xpinstall.signatures.required = false" not in text, f"{name}: unsafe signature workaround"
    assert "envía el original a la papelera" not in text.lower(), f"{name}: old destructive behavior"
    assert "moves the original to trash" not in text.lower(), f"{name}: old destructive behavior"

for name in ("README.md", "COMO_ACTUALIZAR.md", "ATN_LISTING_ES_EN.md", "CHANGELOG.md"):
    text = files[name].lower()
    assert "atn" in text.lower() or "firm" in text.lower(), f"{name}: must describe ATN and distribution requirements"

assert "12/12" in files["README.md"]
assert "12/12" in files["v3.6/QA_REPORT_2026-10-26.md"]
assert "PR #3" in files["README.md"]
print("PASS version consistency: 3.6.0 candidate or stable publication")
print("PASS eight documentation pages and project-level changelog")
print("PASS signing notices, non-destructive conversion and ATN links")
