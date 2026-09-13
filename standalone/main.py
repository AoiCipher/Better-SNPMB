"""CLI entrypoint for Better SNPMB Data Explorer (B-SNPMB) standalone data pull."""

import asyncio
import sys
from pathlib import Path

from fetcher import pull_all_data


def main() -> None:
    out_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("unifinfo.json")
    print(f"Pulling SNPMB university and study program data to {out_path}...")
    results = asyncio.run(pull_all_data(out_path=out_path))
    print(f"Data pull complete! {len(results)} prodi entries saved to {out_path}")


if __name__ == "__main__":
    main()
