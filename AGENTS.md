# Guide for AI agents (and people) working on this site

Times Produce is a wholesale produce distributor in Los Angeles. This is a VitePress site deployed to GitHub Pages on every push to `main`. Content is edited through Pages CMS (`.pages.yml`), so most changes are text, not code.

Read this before changing any page text.

## Audiences

1. **Wholesale buyers:** grocery stores, other distributors, select restaurants and casinos. Pages: Home, Services, Contact.
2. **Local farmers (growers):** Page: Grow With Us (`/grow`). Many are Spanish speakers and read on a phone.
3. `/produce` is a full produce list for search engines. It stays public and fully visible but is **not in the main menu**; only a small footer link points to it. Don't hide text from visitors.

## Languages: keep them in sync

Languages: English (root), Spanish `es`, Traditional Chinese `zh`, Korean `ko`, Japanese `ja`.

**Rule: any change to English page text must be made in all four other languages in the same change.** Don't leave a language stale.

- Every page lives in five places: `docs/<page>.md` and `docs/{es,zh,ko,ja}/<page>.md`. File names are identical in every language.
- Menu, form and footer words live in `docs/.vitepress/i18n/{en,es,zh,ko,ja}.json`. Same keys in all five.
- **Adding a page:** create it in all five languages, add it to `.pages.yml` for each language (copy the English entry; names are `es_<page>`, `zh_<page>`, ...), and add it to nav/footer in `theme/Layout.vue` if it should be linked. Search-engine language links assume every page exists in every language.
- **Adding a field:** add it to all five files and to every matching entry in `.pages.yml`.
- Run `npm run check:i18n` before committing. It checks that every language has every page and the same fields. It cannot check wording, so you still need to translate carefully.
- Then run `npm run build`.

### Translation rules

- Translate meaning, not word for word. Write headings the way a buyer or farmer would search.
- **Spanish:** Mexican register, always *usted* (never *tú*). Say *rancho*, not *finca*, for a grower's farm.
- **Chinese:** Traditional (`zh-Hant`), Taiwan vocabulary (青花菜, 青江菜, 白花椰菜), not mainland or Hong Kong terms.
- **Korean / Japanese:** polite register.
- Keep "select restaurants and casinos" meaning *carefully chosen*, not "some" (엄선한 / 厳選した / 精選 / selectos).
- Don't leave English sentences in other languages. Brand and place names (Times Produce, Bay Street, Ninth Street City Market, PrimusGFS) stay as they are.
- Machine-drafted translations have not been reviewed by native speakers yet. Mark anything uncertain in your reply so a reviewer sees it. Phone staff can review Spanish and Japanese; Chinese and Korean need an outside native reader.

## Writing rules

- **Reading level:** farmer pages (`grow`) about grade 6, short sentences, plain verbs. Buyer pages about grade 8. Explain any jargon in a few words.
- **Farmers:**
  - Never name specific certifications. Say growers must follow all required food safety guidelines.
  - Direct farmers to the **form**, not the phone number. Don't add call buttons, sticky call bars or phone numbers to the grow pages. (The phone stays small in the footer and menu.)
  - The grower form stays short: phone required, email optional.
- **Don't invent facts:** no delivery areas, minimums, delivery days, customer counts or licence numbers unless the owner supplied them. Copy on the site must be true and deliverable.
- Wholesale focus is grocery stores, distributors, and select restaurants and casinos. Don't re-add hotels or schools.
- Our own facility being PrimusGFS certified is a claim about us (buyers). It is not a requirement for farmers.

## SEO rules

- Each page has one search intent, and its own title and description per language (descriptions under about 160 characters; about 80 for Chinese, Korean and Japanese). Titles must not repeat "Times Produce"; the site adds it.
- Home = "wholesale produce". Services = "produce distributor". Grow = local farmers selling to a wholesaler.
- Default site address is `https://timesproduce.com` (no www). Don't change canonical, hreflang or sitemap logic without testing the built HTML.
- Don't create city-by-city or other near-duplicate pages.
- Phone staff speak English, Spanish and Japanese. Keep `PHONE_LANGUAGES` in `docs/.vitepress/config.ts` accurate.

## Mobile first

Most farmers will use phones. After any layout change, check the home, services, grow and contact pages in all five languages at 320px and 375px wide: no sideways scrolling, and the heading visible without scrolling. Inputs must stay at least 16px.

## Don'ts

- Don't push to `main` for unreviewed translations or copy changes unless the owner says to publish; `main` deploys immediately.
- Don't put the form recipient email or any secret in the repo (Formspree holds it).
- Don't commit `docs/.vitepress/dist` or `cache`.
