export const MAX_CHARS = 2048;
export const MAX_FILE_BYTES = 1024 * 1024;

// Letras/números (qualquer idioma), com apóstrofos ou hífens internos (ex.: "don't", "guarda-chuva")
const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

// Pontuação que encerra um trecho: termos de várias palavras não atravessam essas quebras
const SEGMENT_BREAK = /[.!?…;:,()\n\r"“”]+/;

/**
 * Conta a frequência de palavras (size 1) ou de sequências de palavras (size 2 = pares, 3 = trios).
 * Sequências só são formadas dentro do mesmo trecho, sem cruzar pontuação.
 * @param {string} text
 * @param {{ stopwords?: Set<string>, size?: number }} [options]
 *   Com size > 1, descarta a sequência que começa ou termina em stopword.
 * @returns {{ word: string, count: number }[]} ordenado por contagem (desc) e depois alfabético
 */
export function countWords(text, { stopwords, size = 1 } = {}) {
  const counts = new Map();

  for (const segment of text.toLowerCase().split(SEGMENT_BREAK)) {
    const words = segment.match(WORD_PATTERN) ?? [];

    for (let start = 0; start + size <= words.length; start++) {
      const term = words.slice(start, start + size);
      if (stopwords && (stopwords.has(term[0]) || stopwords.has(term[size - 1]))) continue;
      const key = term.join(' ');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}

/**
 * Resume o resultado de countWords.
 * @param {{ word: string, count: number }[]} entries
 * @returns {{ total: number, unique: number, top: { word: string, count: number } | null }}
 */
export function summarize(entries) {
  const total = entries.reduce((sum, { count }) => sum + count, 0);
  return { total, unique: entries.length, top: entries[0] ?? null };
}

/**
 * Filtra por trecho da palavra (sem diferenciar maiúsculas) e por contagem mínima.
 * Mantém a ordem original.
 */
export function filterEntries(entries, { query = '', minCount = 1 } = {}) {
  const needle = query.trim().toLowerCase();
  return entries.filter(({ word, count }) => count >= minCount && word.includes(needle));
}
