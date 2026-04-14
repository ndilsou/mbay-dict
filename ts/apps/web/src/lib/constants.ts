export const LETTERS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
] as const

export type Lang = 'fr' | 'en'
export type LangName = 'french' | 'english'

export type Direction = 'mb-fr' | 'mb-en' | 'fr-mb' | 'en-mb'

export type IndexColumn = 'head_letter' | 'french_letter' | 'english_letter'

const DIRECTION_META = {
  'mb-fr': { source: 'mbay' as const, target: 'french' as const, indexCol: 'head_letter' as IndexColumn, lang: 'french' as LangName },
  'mb-en': { source: 'mbay' as const, target: 'english' as const, indexCol: 'head_letter' as IndexColumn, lang: 'english' as LangName },
  'fr-mb': { source: 'french' as const, target: 'mbay' as const, indexCol: 'french_letter' as IndexColumn, lang: 'french' as LangName },
  'en-mb': { source: 'english' as const, target: 'mbay' as const, indexCol: 'english_letter' as IndexColumn, lang: 'english' as LangName },
}

export function parseDirection(dir: string): Direction {
  if (dir in DIRECTION_META) return dir as Direction
  return 'mb-fr'
}

export function directionMeta(dir: Direction) {
  return DIRECTION_META[dir]
}

export function flipDirection(dir: Direction): Direction {
  return { 'mb-fr': 'fr-mb', 'fr-mb': 'mb-fr', 'mb-en': 'en-mb', 'en-mb': 'mb-en' }[dir] as Direction
}

export function directionLang(dir: Direction): LangName {
  return DIRECTION_META[dir].lang
}

// Keep these for backward compat with i18n
export function langCodeToName(code: string): LangName {
  if (code === 'en') return 'english'
  if (code === 'fr') return 'french'
  throw new Error(`Unknown language code: ${code}`)
}

export function languageToCode(language: string): Lang {
  if (language === 'english') return 'en'
  if (language === 'french') return 'fr'
  throw new Error(`Unknown language: ${language}`)
}
