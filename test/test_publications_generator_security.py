import importlib.util
from pathlib import Path
from types import SimpleNamespace


ROOT = Path(__file__).parents[1]


def load_generator():
    path = ROOT / "markdown_generator/publications.py"
    spec = importlib.util.spec_from_file_location("publications_generator", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def publication(**overrides):
    values = {
        "pub_date": "2026-01-02",
        "title": "A safe title",
        "venue": "Journal: One",
        "excerpt": "A safe excerpt",
        "citation": "Author, A. (2026). A safe title.",
        "url_slug": "a-safe-title",
        "paper_url": "https://example.com/paper.pdf",
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def assert_raises(expected, callback):
    try:
        callback()
    except expected:
        return
    raise AssertionError(f"{expected.__name__} was not raised")


def test_front_matter_serializes_newlines_as_data():
    generator = load_generator()
    injected_title = 'Research"\nvisibility: public\nx: "'
    _, rendered = generator.render_publication(publication(title=injected_title))

    assert "\nvisibility: public\n" not in rendered
    assert "title: \"Research\\\"\\nvisibility: public\\nx: \\\"\"" in rendered


def test_legitimate_publication_remains_renderable():
    generator = load_generator()
    filename, rendered = generator.render_publication(publication())

    assert filename == "2026-01-02-a-safe-title.md"
    assert 'paperurl: "https://example.com/paper.pdf"' in rendered
    assert 'href="https://example.com/paper.pdf"' in rendered


def test_unsafe_slug_and_paper_url_fail_closed():
    generator = load_generator()

    assert_raises(
        ValueError,
        lambda: generator.render_publication(publication(url_slug="../escape")),
    )
    assert_raises(
        ValueError,
        lambda: generator.render_publication(publication(paper_url="javascript:alert(1)")),
    )


if __name__ == "__main__":
    test_front_matter_serializes_newlines_as_data()
    test_legitimate_publication_remains_renderable()
    test_unsafe_slug_and_paper_url_fail_closed()
