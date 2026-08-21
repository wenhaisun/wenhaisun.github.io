import json
from pathlib import Path


ROOT = Path(__file__).parents[1]


def test_section_navigation_rejects_inherited_fragment_keys():
    script = (ROOT / "assets/js/section-navigation.js").read_text()

    assert "Object.create(null)" in script
    assert "!pendingEntry || !pendingEntry.section" in script


def test_staticman_comment_fields_are_context_safe():
    template = (ROOT / "_includes/comment.html").read_text()

    assert "comment_scheme == 'http'" in template
    assert "comment_scheme == 'https'" in template
    assert "comment_url | escape" in template
    assert "include.name | escape" in template
    assert "markdownify | strip_html | escape | newline_to_br" in template


def test_docker_build_inputs_are_pinned_and_locked():
    dockerfile = (ROOT / "Dockerfile").read_text()
    lockfile = (ROOT / "Gemfile.lock").read_text()

    assert "FROM ruby:3.2.2-bookworm@sha256:" in dockerfile
    assert "snapshot.debian.org/archive/debian/20250101T000000Z" in dockerfile
    assert "COPY Gemfile Gemfile.lock ./" in dockerfile
    assert "bundle _2.4.7_ install" in dockerfile
    assert "aarch64-linux" in lockfile
    assert "x86_64-linux" in lockfile


def test_npm_build_uses_the_committed_lockfile():
    package = json.loads((ROOT / "package.json").read_text())
    gitignore = (ROOT / ".gitignore").read_text().splitlines()

    assert package["scripts"]["build:js"] == "npm ci --ignore-scripts && npm run uglify"
    assert (ROOT / "package-lock.json").is_file()
    assert "package-lock.json" not in gitignore


if __name__ == "__main__":
    test_section_navigation_rejects_inherited_fragment_keys()
    test_staticman_comment_fields_are_context_safe()
    test_docker_build_inputs_are_pinned_and_locked()
    test_npm_build_uses_the_committed_lockfile()
