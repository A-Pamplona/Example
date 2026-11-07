import { countWords, summarize, filterEntries, MAX_CHARS, MAX_FILE_BYTES } from './wordFrequency.js';
import { STOPWORD_SETS } from './stopwords.js';
import { renderTable, renderSummary, showError, clearError, updateCounter, setMode, setLoading, setFileLabel, setTermHeader } from './ui.js';
import { renderChart, hideChart } from './chart.js';
import { renderCloud, hideCloud } from './cloud.js';

const form = document.getElementById('input-form');
const textInput = document.getElementById('text-input');
const urlInput = document.getElementById('url-input');
const stopwordsSelect = document.getElementById('stopwords-select');
const searchInput = document.getElementById('search-input');
const minCountSelect = document.getElementById('min-count-select');
const topNSelect = document.getElementById('top-n-select');
const viewSelect = document.getElementById('view-select');
const exportButton = document.getElementById('export-button');
const unitSelect = document.getElementById('unit-select');
const fileInput = document.getElementById('file-input');
const dropzone = document.getElementById('dropzone');
const themeToggle = document.getElementById('theme-toggle');

const FILE_PROMPT = 'Arraste um arquivo .txt aqui ou clique para escolher (até 1 MB)';
const UNIT_LABELS = { 1: 'Palavra', 2: 'Par de palavras', 3: 'Trio de palavras' };

let currentEntries = [];
let currentText = null;

function getMode() {
  return form.elements.mode.value;
}

async function fetchTextFromUrl(url) {
  let response;
  try {
    response = await fetch('/api/fetch-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw new Error('Não foi possível contatar o servidor. Inicie-o com "npm start".');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Erro ao buscar a página.');
  }
  return data.text;
}

async function readFile(file) {
  if (!file) throw new Error('Escolha um arquivo .txt para analisar.');
  if (!/\.txt$/i.test(file.name) && file.type !== 'text/plain') {
    throw new Error('Formato não suportado. Envie um arquivo .txt.');
  }
  if (file.size > MAX_FILE_BYTES) throw new Error('O arquivo passa de 1 MB.');

  const text = await file.text();
  if (!text.trim()) throw new Error('O arquivo está vazio.');
  return text;
}

async function getSourceText() {
  if (getMode() === 'url') {
    const url = urlInput.value.trim();
    if (!url) throw new Error('Informe a URL de uma página.');
    return fetchTextFromUrl(url);
  }

  if (getMode() === 'file') return readFile(fileInput.files[0]);

  const text = textInput.value;
  if (!text.trim()) throw new Error('Digite ou cole um texto para analisar.');
  return text;
}

/** Mostra o gráfico ou a nuvem conforme o seletor de visualização. */
function renderVisualization() {
  const topN = Number(topNSelect.value);
  if (viewSelect.value === 'cloud') {
    hideChart();
    renderCloud(currentEntries, topN);
  } else {
    hideCloud();
    renderChart(currentEntries, topN, viewSelect.value);
  }
}

/** Aplica busca e contagem mínima à tabela; o gráfico e o CSV usam sempre a lista completa. */
function renderVisibleTable() {
  const visible = filterEntries(currentEntries, {
    query: searchInput.value,
    minCount: Number(minCountSelect.value),
  });
  const isFiltered = visible.length !== currentEntries.length;
  renderTable(visible, { filtered: isFiltered });
}

/** Conta e redesenha tudo a partir do último texto, com as opções atuais. */
function analyze() {
  const size = Number(unitSelect.value);
  const stopwords = STOPWORD_SETS[stopwordsSelect.value];
  currentEntries = countWords(currentText, { stopwords, size });
  setTermHeader(UNIT_LABELS[size]);
  renderSummary(summarize(currentEntries));
  renderVisualization();
  renderVisibleTable();
}

function reanalyzeIfPossible() {
  if (currentText !== null) analyze();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();
  setLoading(true);

  try {
    currentText = await getSourceText();
    analyze();
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
});

textInput.addEventListener('input', () => {
  updateCounter(textInput.value.length, MAX_CHARS);
});

textInput.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'Enter') form.requestSubmit();
});

unitSelect.addEventListener('change', reanalyzeIfPossible);
stopwordsSelect.addEventListener('change', reanalyzeIfPossible);

fileInput.addEventListener('change', () => {
  setFileLabel(fileInput.files[0]?.name ?? FILE_PROMPT);
});

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('is-dragging');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragging'));
dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('is-dragging');
  if (event.dataTransfer.files.length === 0) return;
  fileInput.files = event.dataTransfer.files;
  setFileLabel(fileInput.files[0].name);
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
  renderVisualization();
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', next); } catch { /* sem armazenamento: vale só nesta sessão */ }
  applyTheme(next);
});

searchInput.addEventListener('input', renderVisibleTable);
minCountSelect.addEventListener('change', renderVisibleTable);
topNSelect.addEventListener('change', renderVisualization);
viewSelect.addEventListener('change', renderVisualization);

form.elements.mode.forEach((radio) => {
  radio.addEventListener('change', () => {
    clearError();
    setMode(getMode());
  });
});

exportButton.addEventListener('click', () => {
  // Aspas duplas escapadas para o CSV continuar válido com palavras como "don't"
  const lines = currentEntries.map(({ word, count }) => `"${word.replaceAll('"', '""')}",${count}`);
  const csv = ['termo,ocorrencias', ...lines].join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  link.download = 'word-frequency.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});

updateCounter(textInput.value.length, MAX_CHARS);
themeToggle.textContent = document.documentElement.dataset.theme === 'dark' ? 'Modo claro' : 'Modo escuro';
