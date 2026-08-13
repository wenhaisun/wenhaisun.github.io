# Wenhai Sun — whsun.org

This repository contains the source for [whsun.org](https://whsun.org), Wenhai Sun’s personal academic website. It is a Jekyll site built on the Academic Pages theme.

## Site structure

- `_pages/about.md` — the single public content page and homepage
- `_config.yml` — site identity, profile, SEO, and Jekyll settings
- `_data/navigation.yml` — intentionally empty because the site uses one main page
- `_layouts/` and `_includes/` — page templates and reusable components
- `assets/` and `_sass/` — stylesheets and JavaScript
- `images/` and `files/` — static assets

Former collection and template routes redirect to the homepage. Add new biography, news, publication, service, teaching, or student information to `_pages/about.md`.

## Updating the site

1. Open this repository in GitHub Desktop.
2. Edit the relevant files locally.
3. Preview and verify the generated site.
4. Review the diff, commit the changes, and push them to GitHub.

GitHub Pages publishes the `master` branch to the custom domain in `CNAME`.
