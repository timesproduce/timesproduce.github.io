import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import en from '../i18n/en.json'
import es from '../i18n/es.json'
import zh from '../i18n/zh.json'
import ko from '../i18n/ko.json'
import ja from '../i18n/ja.json'

export const LOCALES = ['root', 'es', 'zh', 'ko', 'ja'] as const
const all: Record<string, typeof en> = { root: en, es, zh, ko, ja }

// UI strings for the current language (nav labels, form labels, footer...).
export function useUi() {
  const { localeIndex } = useData()
  return computed(() => all[localeIndex.value] ?? en)
}

// Builds a link that stays inside the current language: href('/grow') -> /es/grow.
export function useHref() {
  const { localeIndex } = useData()
  return (path: string) => withBase((localeIndex.value === 'root' ? '' : `/${localeIndex.value}`) + path)
}
