# sean-heakes-website

Personal site of Sean Heakes, served by GitHub Pages at
<https://sheakes.github.io/sean-heakes-website>. Plain HTML, CSS and JavaScript; there is no build step.

## Layout

| File | Purpose |
| --- | --- |
| `index.html`, `about.html`, `projects.html`, `research.html`, `gallery.html`, `cv.html` | The pages |
| `404.html` | Shown by GitHub Pages for missing pages (uses absolute `/sean-heakes-website/` links) |
| `style.css` | All styling. Colours and widths are variables at the top |
| `script.js` | Footer year, and the orbiting-stars easter egg on the home page |
| `images/` | Photos |
| `Sean_Heakes_CV.pdf` | The downloadable CV |

The header, nav and footer are repeated in every page. If you change one, change it in all seven files.

## Common edits

- **Add a project or research entry:** copy an `<article class="entry">` block in `projects.html` or `research.html` and give it a new `id`.
- **Add a photo:** save it in `images/` at about 1200px on the long side, then follow the comment at the top of `gallery.html` or `projects.html`.
- **Update the CV:** replace `Sean_Heakes_CV.pdf`, then update `cv.html` to match.
- **Open items:** search the HTML files for `TODO`.

## Preview locally

```bash
python3 -m http.server
```

Then open <http://localhost:8000>.
