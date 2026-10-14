#!/usr/bin/env python3
"""Build the blog index for Boring by design.

Scans every root documentation/*.md carrying a ``date:`` field, reads its
frontmatter and first paragraph, and writes a newest-first JSON index to
documentation/public/posts.json.

Standard library only — post frontmatter is a small, known subset of YAML
(scalars plus an inline ``tags: [a, b]`` list), so no PyYAML dependency.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "documentation"
OUT = DOCS / "public" / "posts.json"

# Pages that are never posts even if edited to carry a date.
EXCLUDE = {"index.md", "about.md", "blog-structure.md", "identity.md"}

FRONTMATTER = re.compile(r"^---\n(.*?)\n---\n?(.*)$", re.DOTALL)


def parse_scalar(value: str) -> object:
    """Parse a frontmatter scalar or inline list into a Python value."""
    value = value.strip()
    if value.startswith("[") and value.endswith("]"):
        inner = value[1:-1].strip()
        if not inner:
            return []
        return [item.strip().strip("\"'") for item in inner.split(",")]
    return value.strip("\"'")


def parse_frontmatter(block: str) -> dict[str, object]:
    """Parse the simple key: value frontmatter subset used by posts."""
    data: dict[str, object] = {}
    for line in block.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, raw = line.partition(":")
        data[key.strip()] = parse_scalar(raw)
    return data


def first_paragraph(body: str) -> str:
    """Return the first non-heading, non-empty paragraph of the body."""
    paragraph: list[str] = []
    for line in body.splitlines():
        stripped = line.strip()
        if not stripped:
            if paragraph:
                break
            continue
        if stripped.startswith("#"):
            continue
        paragraph.append(stripped)
    return " ".join(paragraph)


def collect_posts() -> list[dict[str, object]]:
    posts: list[dict[str, object]] = []
    for path in sorted(DOCS.glob("*.md")):
        if path.name in EXCLUDE:
            continue
        match = FRONTMATTER.match(path.read_text(encoding="utf-8"))
        if not match:
            continue
        meta = parse_frontmatter(match.group(1))
        if "date" not in meta:
            continue
        slug = path.stem
        posts.append(
            {
                "title": meta.get("title", slug),
                "url": f"/{slug}",
                "date": meta.get("date", ""),
                "tags": meta.get("tags", []),
                "excerpt": meta.get("excerpt") or first_paragraph(match.group(2)),
            }
        )
    posts.sort(key=lambda p: str(p["date"]), reverse=True)
    return posts


def main() -> None:
    posts = collect_posts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} with {len(posts)} post(s)")


if __name__ == "__main__":
    main()
