#!/usr/bin/env python3
"""
Test script for SAP YouTube video links.
Validates that all 100+ video URLs are accessible (HTTP 200 or redirect to valid YouTube page).
"""
import json
import urllib.request
import urllib.error
from pathlib import Path

VIDEOS_JSON = Path(__file__).parent / "sap_youtube_videos.json"
VIDEOS_JS = Path(__file__).parent / "website" / "videos.js"

def load_videos():
    """Load videos from JSON or JS file."""
    if VIDEOS_JSON.exists():
        with open(VIDEOS_JSON, encoding="utf-8") as f:
            return json.load(f)
    # Parse from videos.js - extract array between [ and ], strip // comments
    with open(VIDEOS_JS, encoding="utf-8") as f:
        content = f.read()
    start = content.find("[")
    end = content.rfind("]") + 1
    if start >= 0 and end > start:
        arr_content = content[start:end]
        import re
        arr_content = re.sub(r'//[^\n]*', '', arr_content)
        return json.loads(arr_content)
    return []

def test_url(url, timeout=10):
    """Test if URL returns 200 or valid redirect."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status in (200, 301, 302, 303, 307, 308), resp.status
    except urllib.error.HTTPError as e:
        return False, e.code
    except Exception as e:
        return False, str(e)

def main():
    videos = load_videos()
    print(f"Testing {len(videos)} YouTube video links...\n")

    passed = 0
    failed = []

    for i, v in enumerate(videos):
        url = v.get("url", "")
        title = v.get("title", "Unknown")[:50]
        ok, status = test_url(url)
        if ok:
            passed += 1
            print(f"  [{i+1:3d}] OK   {status} - {title}...")
        else:
            failed.append((url, title, status))
            print(f"  [{i+1:3d}] FAIL {status} - {title}...")

    print(f"\n{'='*60}")
    print(f"Results: {passed}/{len(videos)} links passed")
    if failed:
        print(f"\nFailed links ({len(failed)}):")
        for url, title, status in failed:
            print(f"  - {title}: {url} (status: {status})")
    else:
        print("All links are accessible!")

    return len(failed) == 0

if __name__ == "__main__":
    exit(0 if main() else 1)
