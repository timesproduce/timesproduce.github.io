# Times Produce website

VitePress site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content (no code needed)

Use [Pages CMS](https://app.pagescms.org): sign in with GitHub, install its GitHub app on this repo,
and pick the `main` branch. You'll see the Home, Services, Produce, Contact and Grow With Us pages (plus a copy of each in every language),
and "Address, phone & footer". Saving commits to `main`, and the site redeploys in a minute or two.
Photos go in `docs/public/images`; upload them through the CMS media tab.

## Local development

    npm install
    npm run dev      # http://localhost:5173
    npm run build
    npm run check:i18n   # every language has every page and field

For anyone (or any AI assistant) changing page text, read `AGENTS.md` first: it covers keeping the five languages in sync and the writing and SEO rules.

## Settings

- **Custom domain:** `timesproduce.com` (no www). The domain is set in GitHub: Settings -> Pages -> Custom domain.
  Because the site deploys with GitHub Actions, the root `CNAME` file is only a record of the domain; it is not used by the deploy.
  DNS: apex `A` records for `timesproduce.com` -> `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
  and a `CNAME` for `www` -> `timesproduce.github.io` so www redirects to the main address. Keep "Enforce HTTPS" on in Settings -> Pages.
- **Canonical URL:** defaults to https://timesproduce.com. If the `SITE_URL` repo variable (Settings -> Variables) is set, it overrides the default, so leave it empty or set it to https://timesproduce.com.
- **Forms:** the contact form and the farmer (grower) form post to Formspree
  (`docs/.vitepress/components/ContactForm.vue` and `GrowerForm.vue`; override with `VITE_FORM_ENDPOINT`).
  The recipient email is set in the Formspree dashboard, not in this repo.
  Grower submissions include `inquiry_type=grower` and the page language.

## Languages

The site is in English (root), Spanish (`/es/`), Traditional Chinese (`/zh/`), Korean (`/ko/`) and Japanese (`/ja/`).
Each language has its own copy of every page (`docs/es/`, `docs/zh/`, ...) and its own menu/form words in
`docs/.vitepress/i18n/<language>.json`. All of these are editable in Pages CMS.
Keep page file names the same in every language, and when adding a new page, add it in all five languages
(search-engine language links assume every page exists in every language).
