import { PALETTE } from './palette.js';

const MIN_FONT_REM = 0.9;
const MAX_FONT_REM = 3.6;

/**
 * Calcula tamanho e cor de cada palavra da nuvem (sem tocar no DOM).
 * O tamanho cresce com a contagem, entre MIN_FONT_REM e MAX_FONT_REM.
 * @param {{ word: string, count: number }[]} entries ordenadas por contagem
 * @param {number} limit quantas palavras entram na nuvem
 */
export function computeCloudItems(entries, limit) {
  const top = entries.slice(0, limit);
  if (top.length === 0) return [];

  const max = top[0].count;
  const min = top[top.length - 1].count;
  const range = max - min;

  const items = top.map(({ word, count }, index) => {
    const weight = range === 0 ? 1 : (count - min) / range;
    return {
      word,
      count,
      fontSize: MIN_FONT_REM + weight * (MAX_FONT_REM - MIN_FONT_REM),
      color: PALETTE[index % PALETTE.length],
    };
  });

  // Ordem alfabética distribui as palavras grandes e pequenas de forma mais natural
  return items.sort((a, b) => a.word.localeCompare(b.word));
}

const container = typeof document === 'undefined' ? null : document.getElementById('cloud-container');

export function hideCloud() {
  container.replaceChildren();
  container.hidden = true;
}

export function renderCloud(entries, limit) {
  hideCloud();
  const items = computeCloudItems(entries, limit);
  if (items.length === 0) return;

  const words = items.map(({ word, count, fontSize, color }) => {
    const span = document.createElement('span');
    span.className = 'cloud-word';
    span.setAttribute('role', 'listitem');
    span.setAttribute('aria-label', `${word}: ${count}`);
    span.textContent = word;
    span.title = `${word}: ${count}`;
    span.style.fontSize = `${fontSize.toFixed(2)}rem`;
    span.style.color = color;
    return span;
  });
  container.append(...words);
  container.hidden = false;
}
