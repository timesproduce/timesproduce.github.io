# Times Produce website

VitePress site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content (no code needed)

Use [Pages CMS](https://app.pagescms.org): sign in with GitHub, install its GitHub app on this repo,
and pick the `main` branch. You'll see Home, Services, Produce and Contact pages, plus
"Address, phone & footer". Saving commits to `main`, and the site redeploys in a minute or two.
Photos go in `docs/public/images`; upload them through the CMS media tab.

## Local development

    npm install
    npm run dev      # http://localhost:5173
    npm run build

## Settings

- **Custom domain:** `docs/public/CNAME` (www.timesproduce.com). Point DNS at GitHub Pages:
  CNAME `www` -> `timesproduce.github.io`, then enable "Enforce HTTPS" in Settings -> Pages.
- **Canonical URL:** defaults to https://www.timesproduce.com; override with the `SITE_URL` repo variable.
- **Contact form:** posts to Formspree (endpoint in `docs/.vitepress/components/ContactForm.vue`).
  The recipient email is set in the Formspree dashboard, not in this repo.
