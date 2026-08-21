import re
from pathlib import Path


REMOTE_PROVIDER_FILES = (
    "_includes/analytics-providers/google.html",
    "_includes/analytics-providers/google-universal.html",
    "_includes/analytics-providers/google-analytics-4.html",
    "_includes/comments-providers/disqus.html",
    "_includes/comments-providers/discourse.html",
    "_includes/comments-providers/facebook.html",
    "_includes/comments-providers/google-plus.html",
)


def test_custom_head_has_no_remote_scripts():
    custom_head = Path(__file__).parents[1] / "_includes/head/custom.html"
    assert not re.search(
        r"<script\b[^>]*\bsrc\s*=\s*['\"]https?://",
        custom_head.read_text(),
        re.IGNORECASE,
    )


def test_remote_provider_scripts_require_sri_and_cross_origin():
    root = Path(__file__).parents[1]
    for relative_path in REMOTE_PROVIDER_FILES:
        source = (root / relative_path).read_text()
        assert "integrity" in source, relative_path
        assert "crossOrigin" in source or "crossorigin" in source, relative_path


if __name__ == "__main__":
    test_custom_head_has_no_remote_scripts()
    test_remote_provider_scripts_require_sri_and_cross_origin()
