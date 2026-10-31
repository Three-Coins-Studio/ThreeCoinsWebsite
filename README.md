# Three Coins Games Studio — website

Landing page for Three Coins Games Studio, featuring **Gumball Hero** (live on Steam).
Plain HTML, CSS and a little JavaScript — no build step, no framework.

## Run locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Structure

| Path | What |
| --- | --- |
| `index.html` | The page |
| `css/style.css` | Styles (palette: white, black, `#fde50f`) |
| `js/main.js` | Scroll focus animation, dot navigation, lightbox |
| `Assets/web/` | Web-optimized images the site serves (hero art, screenshots, logo, share image, favicons) |
| `404.html`, `robots.txt`, `sitemap.xml` | Error page and search-engine files |
| `Assets/GumballHeroScreenshot/` | Original 800px screenshots (not deployed) |

The full-size promo art and original logo are kept out of git (see `.gitignore`);
`Assets/web/` holds the optimized versions the site actually uses.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which publishes the site to GitHub Pages.
All asset paths are relative, so it works under a project subpath or a custom domain.
