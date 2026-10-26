#!/usr/bin/env python3
"""Thunderbird linter gate for a deliberately self-hosted GitHub release.
ATN forbids externally hosted update_url only for add-ons listed in ATN.
We accept EXACTLY that known cataloging-policy finding; all other issues fail.
"""
import json
from pathlib import Path

report = json.loads(Path("v3.6-lint-report.json").read_text(encoding="utf-8"))
findings = report.get("findings")
assert isinstance(findings, list), "Malformed Thunderbird linter report"
EXPECTED_URL = "https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/updates.json"
allowed = []
blocking = []
for finding in findings:
    if (finding.get("ruleId") == "update-url"
            and finding.get("severity") == "error"
            and finding.get("file") == "manifest.json"
            and finding.get("item") == EXPECTED_URL):
        allowed.append(finding)
    else:
        blocking.append(finding)
assert len(allowed) == 1, f"Expected exactly one ATN catalog-only update-url restriction; found {len(allowed)}"
assert not blocking, "Unexpected Thunderbird linter findings: " + json.dumps(blocking, ensure_ascii=False)
summary = report.get("summary", {})
assert summary.get("hold", 0) == 0
assert summary.get("warning", 0) == 0
assert summary.get("info", 0) == 0
assert summary.get("error") == 1
print("PASS Thunderbird linter: 0 unexpected findings")
print("ATN-only catalog exception: update_url intentionally self-hosted on GitHub")
print("This GitHub-distributed build CANNOT be listed on ATN with update_url unchanged.")
