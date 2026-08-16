import re
from pathlib import Path


def test_custom_head_has_no_remote_scripts():
    custom_head = Path(__file__).parents[1] / "_includes/head/custom.html"
    assert not re.search(
        r"<script\b[^>]*\bsrc\s*=\s*['\"]https?://",
        custom_head.read_text(),
        re.IGNORECASE,
    )


if __name__ == "__main__":
    test_custom_head_has_no_remote_scripts()
