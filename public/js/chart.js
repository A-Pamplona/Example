import { PALETTE } from './palette.js';

export const DEFAULT_TOP_N = 10;

const container = document.getElementById('chart-container');
const canvas = document.getElementById('frequency-chart');
let chart = null;

export function hideChart() {
  chart?.destroy();
  chart = null;
  container.hidden = true;
}

/** Lê as cores do tema atual para texto e linhas de grade do gráfico. */
function applyThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  Chart.defaults.color = styles.getPropertyValue('--color-muted').trim();
  Chart.defaults.borderColor = styles.getPropertyValue('--color-border').trim();
}

function buildConfig(type, top) {
  const labels = top.map((e) => e.word);
  const data = top.map((e) => e.count);
  const colors = top.map((_, i) => PALETTE[i % PALETTE.length]);

  if (type === 'doughnut') {
    return {
      type: 'doughnut',
      data: { labels, datasets: [{ label: 'Ocorrências', data, backgroundColor: colors }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } },
      },
    };
  }

  const horizontal = type === 'horizontalBar';
  const valueAxis = { beginAtZero: true, ticks: { precision: 0 } };
  return {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Ocorrências', data, backgroundColor: colors }] },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: horizontal ? { x: valueAxis } : { y: valueAxis },
    },
  };
}

/** Desenha as N palavras mais frequentes. Ignora se o Chart.js (CDN) não carregou. */
export function renderChart(entries, topN = DEFAULT_TOP_N, type = 'bar') {
  hideChart();
  if (typeof Chart === 'undefined' || entries.length === 0) return;

  const top = entries.slice(0, topN);
  container.hidden = false;
  applyThemeColors();
  canvas.setAttribute('aria-label', `Gráfico das palavras mais frequentes: ${top.map((e) => `${e.word} ${e.count}`).join(', ')}`);

  const config = buildConfig(type, top);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) config.options.animation = false;
  chart = new Chart(canvas, config);
}
