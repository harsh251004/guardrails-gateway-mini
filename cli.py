import argparse
import json
import os
import sys
from pathlib import Path
from urllib import error, request


def run_analyze(input_path: str, output_path: str, api_base_url: str) -> int:
    in_file = Path(input_path)
    out_file = Path(output_path)

    if not in_file.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    try:
        payload = json.loads(in_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"Invalid input JSON: {exc}", file=sys.stderr)
        return 1

    req = request.Request(
        url=f"{api_base_url.rstrip('/')}/analyze",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=10) as response:
            body = response.read().decode("utf-8")
    except error.HTTPError as exc:
        print(f"API returned HTTP {exc.code}: {exc.read().decode('utf-8')}", file=sys.stderr)
        return 1
    except error.URLError as exc:
        print(f"Could not reach API at {api_base_url}: {exc}", file=sys.stderr)
        return 1

    out_file.write_text(body, encoding="utf-8")
    print(f"Wrote analysis output to {output_path}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Guardrails Gateway CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    analyze_parser = subparsers.add_parser("analyze", help="Analyze request JSON against running API")
    analyze_parser.add_argument("--input", required=True, help="Path to input JSON file")
    analyze_parser.add_argument("--output", required=True, help="Path to output JSON file")
    analyze_parser.add_argument(
        "--api-base-url",
        default=os.getenv("API_BASE_URL", "http://localhost:8000"),
        help="FastAPI base URL (default: http://localhost:8000)",
    )

    args = parser.parse_args()
    return run_analyze(args.input, args.output, args.api_base_url)


if __name__ == "__main__":
    raise SystemExit(main())
