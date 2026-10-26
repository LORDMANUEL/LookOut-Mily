#!/usr/bin/env python3
"""Repaqueta sin alterar el motor TNEF. --verify compara los contenidos con el XPI confirmado."""
import argparse
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import sys
from safety_overrides import patch_decoder, patch_backend, patch_options

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "lookout-mily-3.5.10.xpi"
OUTPUT = ROOT / "lookout-mily-3.6.0.xpi"
OVERLAY = ROOT / "v3.6"
NEW_FILES = {
    "manifest.json": "manifest.json",
    "options/options.html": "options/options.html",
    "popup/popup.html": "popup/popup.html",
    "ui/theme.css": "ui/theme.css",
    "ui/updates.js": "ui/updates.js",
    "updates/background.js": "updates/background.js",
}

def components():
    with ZipFile(SOURCE) as z:
        data = {n: z.read(n) for n in z.namelist()}
    for destination,source in NEW_FILES.items():
        data[destination] = (OVERLAY / source).read_bytes()
    for name, patch in (
        ("tnef_decoder.js", patch_decoder),
        ("background.js", patch_backend),
        ("options/options.js", patch_options),
    ):
        data[name] = patch(data[name].decode("utf-8")).encode("utf-8")
    return data

def verify(expected):
    with ZipFile(OUTPUT) as z:
        assert set(z.namelist()) == set(expected), "Different archive paths"
        assert len(z.namelist()) == len(set(z.namelist())), "Duplicate paths"
        for name,content in expected.items():
            assert z.read(name) == content, f"Content out of sync: {name}"
    print("OK: packaged 3.6.0 XPI exactly matches preserved 3.5.10 engine and v3.6 sources.")

def build(expected):
    with ZipFile(OUTPUT,"w",compression=ZIP_DEFLATED,compresslevel=9) as z:
        for name in sorted(expected):
            z.writestr(name, expected[name])
    print(f"Built {OUTPUT}: {OUTPUT.stat().st_size} bytes")
    print("SHA256:",hashlib.sha256(OUTPUT.read_bytes()).hexdigest().upper())

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify",action="store_true")
    args = parser.parse_args()
    expected = components()
    if args.verify:
        verify(expected)
    else:
        build(expected)

if __name__ == "__main__":
    main()
