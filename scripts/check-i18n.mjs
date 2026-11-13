// Checks that every language has every page, with the same fields as English.
// Run: npm run check:i18n   (no dependencies; checks structure, not wording)
import { readFileSync, existsSync, readdirSync } from 'node:fs'

const LANGS = ['es', 'zh', 'ko', 'ja']
const pages = readdirSync('docs').filter((f) => f.endsWith('.md'))
let problems = 0
const fail = (msg) => { problems++; console.error('x', msg) }

// The field names used in a page's front matter, in order (list items collapse to one).
function shape(file) {
  const fm = readFileSync(file, 'utf8').split('---')[1] ?? ''
  const keys = [...fm.matchAll(/^(\s*)(?:- )?([A-Za-z_]+):/gm)].map((m) => `${m[1].length}:${m[2]}`)
  // Optional per-language display settings are allowed to differ.
  return [...new Set(keys)].filter((k) => !/:(list_separator|list_end)$/.test(k)).join(' ')
}
// Produce lists differ in length per language, so compare only the page fields and group count.
const produceGroups = (file) => (readFileSync(file, 'utf8').match(/^    - heading:/gm) ?? []).length

for (const page of pages) {
  const base = `docs/${page}`
  for (const lang of LANGS) {
    const f = `docs/${lang}/${page}`
    if (!existsSync(f)) { fail(`${f} is missing (every page must exist in every language)`); continue }
    if (shape(base) !== shape(f)) fail(`${f} has different fields than ${base}`)
    if (page === 'produce.md' && produceGroups(base) !== produceGroups(f)) fail(`${f} has a different number of produce groups`)
  }
}

// Menu/form words
const keysOf = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keysOf(v, `${p}${k}.`) : [`${p}${k}`]))
const en = keysOf(JSON.parse(readFileSync('docs/.vitepress/i18n/en.json', 'utf8'))).sort().join()
for (const lang of LANGS) {
  const k = keysOf(JSON.parse(readFileSync(`docs/.vitepress/i18n/${lang}.json`, 'utf8'))).sort().join()
  if (k !== en) fail(`docs/.vitepress/i18n/${lang}.json has different words than en.json`)
}

console.log(problems ? `\n${problems} problem(s) found.` : 'Languages are in sync.')
process.exit(problems ? 1 : 0)
