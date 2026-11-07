const PORTUGUESE = [
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem', 'e', 'ou', 'mas',
  'que', 'se', 'ao', 'aos', 'à', 'às', 'é', 'são', 'foi', 'ser', 'como', 'mais',
  'não', 'já', 'também', 'seu', 'sua', 'seus', 'suas', 'me', 'te', 'lhe',
];

const ENGLISH = [
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
  'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'it', 'its', 'this',
  'that', 'these', 'those', 'not', 'no', 'he', 'she', 'they', 'we', 'you', 'i',
  'his', 'her', 'their', 'our', 'your', 'my', 'so', 'if', 'than', 'then',
];

/** Listas por idioma; as chaves são os valores do seletor na interface. */
export const STOPWORD_SETS = {
  pt: new Set(PORTUGUESE),
  en: new Set(ENGLISH),
  both: new Set([...PORTUGUESE, ...ENGLISH]),
};
