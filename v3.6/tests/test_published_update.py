#!/usr/bin/env python3
"""Integration audit for real, publicly downloadable Thunderbird self-hosted add-on updates.

Verifies three independent sources: the public update feed, the release asset bytes,
and the XPI's own manifest. Does NOT publish a version or mutate the user's profile.
"""
from __future__ import annotations
import hashlib
import io
import json
import os
import re
import sys
import urllib.error
import urllib.request
import zipfile
from pathlib import Path
from urllib.parse import urlsplit

ADDON_ID = "lookout-modern@addons.thunderbird.net"
BASE = "https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/updates.json"
RELEASE = "https://github.com/LORDMANUEL/LookOut-Mily/releases/download/"
ROOT = Path(__file__).resolve().parents[2]

def download(url: str, *, limit: int) -> bytes:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "LookOut-Mily-Update-Integration-Test/3.6", "Accept": "*/*"},
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read(limit + 1)
        if len(data) > limit:
            raise AssertionError(f"Response exceeds maximum allowed {limit} bytes")
        assert response.status == 200, f"HTTP {response.status} for {url}"
        return data

def validate_feed(feed: dict) -> dict:
    assert isinstance(feed.get("addons"), dict)
    updates = feed["addons"].get(ADDON_ID, {}).get("updates")
    assert isinstance(updates, list) and updates, "Add-on has no updates"
    assert len({u.get("version") for u in updates}) == len(updates), "Duplicate version"
    assert len(updates) < 100, "Unexpectedly large update feed"
    # The latest stable version currently released is 3.6.0.
    latest = next((u for u in updates if u.get("version") == "3.6.0"), None)
    assert latest is not None, "Public 3.6.0 entry missing"
    assert re.fullmatch(r"sha256:[a-f0-9]{64}", latest.get("update_hash", ""))
    assert latest.get("update_link") == RELEASE + "v3.6.0/lookout-mily-3.6.0.xpi"
    assert latest.get("browser_specific_settings", {}).get("gecko", {}).get("strict_min_version") == "128.0"
    for u in updates:
        assert re.fullmatch(r"\d+(?:\.\d+){1,3}", u.get("version", ""))
        assert urlsplit(u["update_link"]).scheme == "https"
        assert u["update_link"].startswith(RELEASE), "Untrusted update source"
    return latest

def check_public_update() -> None:
    # Local source must match what existing clients actually download from public GitHub.
    local_feed = json.loads((ROOT / "updates.json").read_text(encoding="utf-8"))
    remote_bytes = download(BASE, limit=128 * 1024)
    remote_feed = json.loads(remote_bytes)
    assert remote_feed == local_feed, "GitHub main update feed differs from checked-out source"
    latest = validate_feed(remote_feed)
    print("PASS public HTTPS updates.json, add-on ID and version 3.6.0")

    package = download(latest["update_link"], limit=30 * 1024 * 1024)
    actual = hashlib.sha256(package).hexdigest()
    expected = latest["update_hash"].split(":", 1)[1]
    assert actual == expected, f"XPI digest mismatch: expected {expected}, got {actual}"
    print(f"PASS XPI downloaded from GitHub Releases: {len(package)} bytes, SHA-256 {actual}")

    with zipfile.ZipFile(io.BytesIO(package)) as archive:
        names = archive.namelist()
        assert len(names) == len(set(names)), "Duplicate ZIP paths"
        assert archive.testzip() is None, "ZIP checksum invalid"
        installed = json.loads(archive.read("manifest.json"))
    assert installed["version"] == latest["version"], "XPI and update feed versions differ"
    gecko = installed["browser_specific_settings"]["gecko"]
    assert gecko["id"] == ADDON_ID, "Installed XPI ID differs from update feed"
    assert gecko["update_url"] == BASE, "Installed XPI has no self-hosted update URL"
    assert gecko["strict_min_version"] == "128.0"
    print("PASS XPI manifest ID, version, min Thunderbird and native update_url")

    # This is a simulated FUTURE feed check; no bogus 3.6.1 release is published.
    future = {"version": "3.6.1", "update_link": RELEASE + "v3.6.1/lookout-mily-3.6.1.xpi"}
    def version_tuple(s: str) -> tuple[int, ...]:
        return tuple(int(piece) for piece in s.split("."))
    assert version_tuple(future["version"]) > version_tuple(installed["version"])
    assert version_tuple(installed["version"]) == version_tuple(latest["version"])
    print("PASS simulated 3.6.1 is eligible; installed 3.6.0 does NOT offer itself")

if __name__ == "__main__":
    try:
        check_public_update()
    except Exception as exc:
        print(f"FAIL public update chain: {exc}", file=sys.stderr)
        raise
