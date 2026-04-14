import type { LangName } from './constants'

const translations: Record<string, Record<LangName, string>> = {
  search_placeholder: {
    french: 'Chercher un mot...',
    english: 'Search for a word...',
  },
  dictionary_title: {
    french: 'Dictionnaire Mbay',
    english: 'Mbay Dictionary',
  },
  entry: {
    french: 'entree',
    english: 'entry',
  },
  entries: {
    french: 'entrees',
    english: 'entries',
  },
  results: {
    french: 'Resultats',
    english: 'Results',
  },
  no_results: {
    french: 'Aucun resultat',
    english: 'No results',
  },
  no_results_desc: {
    french: "Aucune entree ne correspond. Essayez un autre terme ou parcourez l'index.",
    english: 'No entries match. Try another term or browse the index.',
  },
  view_index: {
    french: "Voir l'index",
    english: 'View index',
  },
  back: {
    french: 'Retour',
    english: 'Back',
  },
  search: {
    french: 'Recherche',
    english: 'Search',
  },
  see_index: {
    french: "Voir l'index",
    english: 'See Index',
  },
  expressions: {
    french: 'Expressions',
    english: 'Expressions',
  },
  usage_examples: {
    french: "Exemples d'usage",
    english: 'Usage examples',
  },
  grammatical_note: {
    french: 'Note grammaticale',
    english: 'Grammatical note',
  },
  see_also: {
    french: 'Voir aussi',
    english: 'See also',
  },
  entry_not_found: {
    french: 'Entree introuvable',
    english: 'Entry not found',
  },
  entry_not_found_desc: {
    french: "Cette entree n'existe pas ou a ete supprimee.",
    english: 'This entry does not exist or has been deleted.',
  },
  back_home: {
    french: "Retour a l'accueil",
    english: 'Back to home',
  },
  'dir_mb-fr': {
    french: 'Mbay → Fr',
    english: 'Mbay → Fr',
  },
  'dir_fr-mb': {
    french: 'Fr → Mbay',
    english: 'Fr → Mbay',
  },
  'dir_mb-en': {
    french: 'Mbay → En',
    english: 'Mbay → En',
  },
  'dir_en-mb': {
    french: 'En → Mbay',
    english: 'En → Mbay',
  },
}

export function t(key: string, lang: LangName = 'french'): string {
  return translations[key]?.[lang] ?? key
}
