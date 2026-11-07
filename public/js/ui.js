const tableBody = document.getElementById('frequency-table-body');
const errorMessage = document.getElementById('error-message');
const charCounter = document.getElementById('char-counter');
const exportButton = document.getElementById('export-button');

function createCell(text, className) {
  const cell = document.createElement('td');
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

const summary = document.getElementById('summary');
const tools = document.getElementById('results-tools');

/** Mostra o total de palavras, as únicas e a mais frequente; esconde tudo se não há resultado. */
export function renderSummary({ total, unique, top }) {
  summary.replaceChildren();
  summary.hidden = total === 0;
  tools.hidden = total === 0;
  if (total === 0) return;

  const items = [
    ['Termos', total],
    ['Únicas', unique],
    ['Mais frequente', `${top.word} (${top.count})`],
  ];
  for (const [label, value] of items) {
    const item = document.createElement('div');
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    item.append(term, detail);
    summary.append(item);
  }
}

/**
 * @param {{ word: string, count: number }[]} entries linhas a exibir
 * @param {{ filtered?: boolean }} [options] filtered: a lista vazia vem de um filtro, não do texto
 */
export function renderTable(entries, { filtered = false } = {}) {
  tableBody.replaceChildren();

  if (entries.length === 0) {
    const row = document.createElement('tr');
    row.className = 'empty-row';
    const cell = createCell(filtered ? 'Nenhuma palavra corresponde ao filtro.' : 'Nenhuma palavra encontrada.');
    cell.colSpan = 2;
    row.append(cell);
    tableBody.append(row);
    exportButton.hidden = filtered ? exportButton.hidden : true;
    return;
  }

  const rows = entries.map(({ word, count }) => {
    const row = document.createElement('tr');
    row.append(createCell(word), createCell(count, 'numeric'));
    return row;
  });
  tableBody.append(...rows);
  exportButton.hidden = false;
}

export function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

export function clearError() {
  errorMessage.textContent = '';
  errorMessage.hidden = true;
}

export function updateCounter(length, max) {
  charCounter.textContent = `${length} / ${max}`;
}

export function setMode(mode) {
  document.getElementById('text-field').hidden = mode !== 'text';
  document.getElementById('url-field').hidden = mode !== 'url';
  document.getElementById('file-field').hidden = mode !== 'file';
}

export function setLoading(isLoading) {
  const button = document.getElementById('translate-button');
  button.disabled = isLoading;
  button.setAttribute('aria-busy', String(isLoading));
}

export function setFileLabel(text) {
  document.getElementById('file-label').textContent = text;
}

export function setTermHeader(text) {
  document.getElementById('term-header').textContent = text;
}
