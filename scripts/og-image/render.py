#!/usr/bin/env python3
"""Render Dose de Telemetria social cards with bundled assets and Chromium."""
import argparse
import base64
import json
import os
from pathlib import Path
import subprocess
import sys

SKILL = Path(__file__).resolve().parent
ROOT = SKILL.parents[1]
VENV = Path(os.environ.get("OG_IMAGE_VENV", Path("/tmp/dosedetelemetria-og-venv")))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("setup")
    batch = commands.add_parser("batch")
    batch.add_argument("--manifest", type=Path, default=ROOT / "src/data/og-cards.json")
    render = commands.add_parser("render")
    render.add_argument("--headline", required=True)
    render.add_argument("--body", default="")
    render.add_argument("--label", default="OPENTELEMETRY EDUCATION")
    render.add_argument("--out", type=Path, required=True)
    batch.set_defaults(scale=1)
    render.add_argument("--scale", type=int, choices=(1, 2), default=1)
    args = parser.parse_args()
    python = VENV / "bin/python"
    if args.command == "setup":
        if not python.exists():
            subprocess.run([sys.executable, "-m", "venv", str(VENV)], check=True)
        subprocess.run([str(python), "-m", "pip", "install", "playwright==1.60.0"], check=True)
        subprocess.run([str(python), "-m", "playwright", "install", "chromium"], check=True)
        return
    if python.exists() and Path(sys.prefix) != VENV.resolve():
        os.execv(str(python), [str(python), str(Path(__file__).resolve()), *sys.argv[1:]])
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        parser.error("Playwright is missing; run the setup command first")
    font = base64.b64encode((SKILL / "assets/fonts/Inter-Variable.ttf").read_bytes()).decode()
    logo = base64.b64encode((SKILL / "assets/logo.svg").read_bytes()).decode()
    cards = json.loads(args.manifest.read_text()) if args.command == "batch" else [vars(args)]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        try:
            page = browser.new_page()
            for card in cards:
                page.goto((SKILL / "assets/renderer.html").as_uri())
                result = page.evaluate("([card, scale, font, logo]) => renderCard(card, scale, font, logo)", [
                    {key: card.get(key, "") for key in ("headline", "body", "label")}, args.scale, font, logo])
                out = (ROOT / "public" / card["image"].lstrip("/")) if args.command == "batch" else args.out.resolve()
                summary = {"out": str(out), "width": 1200 * args.scale, "height": 630 * args.scale, **result["metrics"]}
                print(json.dumps(summary), flush=True)
                if result["metrics"]["overflow"]:
                    raise ValueError("Copy does not fit; shorten it before rendering")
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_bytes(base64.b64decode(result["png"].split(",", 1)[1]))
        finally:
            browser.close()

if __name__ == "__main__":
    main()
