# coding: utf-8

"""Generate Jekyll publication pages from a tab-separated metadata file.

The TSV needs the columns pub_date, title, venue, excerpt, citation, url_slug,
paper_url, and optionally slides_url.  pub_date must use YYYY-MM-DD format;
url_slug becomes both the output filename component and the publication URL.
"""

import json
import math
import re
from datetime import date
from html import escape
from pathlib import Path
from urllib.parse import urlparse


def text_value(value):
    """Return a scalar TSV value as text, treating pandas NaN as blank."""
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return ""
    return str(value)


def required_text(item, field):
    value = text_value(getattr(item, field)).strip()
    if not value:
        raise ValueError(f"{field} must not be blank")
    return value


def yaml_string(value):
    """Serialize a value as a YAML-compatible JSON double-quoted scalar."""
    return json.dumps(text_value(value), ensure_ascii=False)


def html_escape(value):
    """Escape generated body text and attribute values for HTML output."""
    return escape(text_value(value), quote=True)


def validated_date(value):
    try:
        date.fromisoformat(value)
    except ValueError as error:
        raise ValueError("pub_date must use YYYY-MM-DD format") from error
    return value


def validated_slug(value):
    slug = text_value(value).strip()
    if not re.fullmatch(r"[\w][\w.-]*", slug, re.UNICODE) or slug in {".", ".."}:
        raise ValueError(
            "url_slug must contain only letters, numbers, dots, hyphens, or underscores"
        )
    return slug


def validated_paper_url(value):
    url = text_value(value).strip()
    if not url:
        return ""
    parsed = urlparse(url)
    if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
        raise ValueError("paper_url must be an absolute http(s) URL")
    return url


def render_publication(item):
    """Render one TSV row without allowing input to alter front-matter structure."""
    pub_date = validated_date(required_text(item, "pub_date"))
    title = required_text(item, "title")
    venue = required_text(item, "venue")
    citation = required_text(item, "citation")
    slug = validated_slug(getattr(item, "url_slug"))
    excerpt = text_value(getattr(item, "excerpt")).strip()
    paper_url = validated_paper_url(getattr(item, "paper_url"))
    html_filename = f"{pub_date}-{slug}"

    front_matter = [
        "---",
        f"title: {yaml_string(title)}",
        "collection: publications",
        f"permalink: {yaml_string('/publication/' + html_filename)}",
    ]
    if excerpt:
        front_matter.append(f"excerpt: {yaml_string(excerpt)}")
    front_matter.extend([
        f"date: {pub_date}",
        f"venue: {yaml_string(venue)}",
    ])
    if paper_url:
        front_matter.append(f"paperurl: {yaml_string(paper_url)}")
    front_matter.extend([
        f"citation: {yaml_string(citation)}",
        "---",
    ])

    markdown = "\n".join(front_matter)
    if paper_url:
        markdown += f'\n\n<a href="{html_escape(paper_url)}">Download paper here</a>\n'
    if excerpt:
        markdown += f"\n{html_escape(excerpt)}\n"
    markdown += f"\nRecommended citation: {html_escape(citation)}"
    return f"{html_filename}.md", markdown


def generate_publications(source_path="publications.tsv", output_dir="../_publications"):
    import pandas as pd

    publications = pd.read_csv(source_path, sep="\t", header=0)
    output_path = Path(output_dir)
    for _, item in publications.iterrows():
        filename, markdown = render_publication(item)
        (output_path / filename).write_text(markdown, encoding="utf-8")


if __name__ == "__main__":
    generate_publications()
