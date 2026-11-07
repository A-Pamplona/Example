import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countWords, summarize, filterEntries } from '../public/js/wordFrequency.js';

test('texto vazio retorna lista vazia', () => {
  assert.deepEqual(countWords(''), []);
  assert.deepEqual(countWords('   \n\t '), []);
});

test('texto só com pontuação retorna lista vazia', () => {
  assert.deepEqual(countWords('!!! ... ??? --- ,,,'), []);
});

test('ignora maiúsculas e minúsculas', () => {
  assert.deepEqual(countWords('Casa casa CASA'), [{ word: 'casa', count: 3 }]);
});

test('remove pontuação ao redor das palavras', () => {
  assert.deepEqual(countWords('Olá, mundo! Olá.'), [
    { word: 'olá', count: 2 },
    { word: 'mundo', count: 1 },
  ]);
});

test('preserva acentos', () => {
  const result = countWords('ação ação coração');
  assert.deepEqual(result, [
    { word: 'ação', count: 2 },
    { word: 'coração', count: 1 },
  ]);
});

test('preserva apóstrofos e hífens internos', () => {
  const words = countWords("don't guarda-chuva").map((e) => e.word);
  assert.deepEqual(words.sort(), ["don't", 'guarda-chuva']);
});

test('ordena por frequência decrescente', () => {
  const result = countWords('a b b c c c');
  assert.deepEqual(result.map((e) => e.word), ['c', 'b', 'a']);
});

test('desempata em ordem alfabética', () => {
  const result = countWords('zebra maçã abelha');
  assert.deepEqual(result.map((e) => e.word), ['abelha', 'maçã', 'zebra']);
});

test('conta números como palavras', () => {
  assert.deepEqual(countWords('2024 2024 ano'), [
    { word: '2024', count: 2 },
    { word: 'ano', count: 1 },
  ]);
});

test('ignora stopwords quando fornecidas', () => {
  const result = countWords('o gato e o rato', { stopwords: new Set(['o', 'e']) });
  assert.deepEqual(result.map((e) => e.word), ['gato', 'rato']);
});

test('summarize calcula total, únicas e mais frequente', () => {
  const entries = countWords('o gato e o rato, o gato come');
  assert.deepEqual(summarize(entries), { total: 8, unique: 5, top: { word: 'o', count: 3 } });
});

test('summarize de lista vazia não tem palavra mais frequente', () => {
  assert.deepEqual(summarize([]), { total: 0, unique: 0, top: null });
});

test('filterEntries filtra por trecho sem diferenciar maiúsculas', () => {
  const entries = countWords('Gato gato rato');
  assert.deepEqual(filterEntries(entries, { query: ' GA ' }).map((e) => e.word), ['gato']);
});

test('filterEntries aplica contagem mínima e mantém a ordem', () => {
  const entries = countWords('b b a a c');
  assert.deepEqual(filterEntries(entries, { minCount: 2 }).map((e) => e.word), ['a', 'b']);
  assert.deepEqual(filterEntries(entries), entries);
});

test('size 2 conta pares de palavras seguidas', () => {
  const result = countWords('o gato come o gato come', { size: 2 });
  assert.deepEqual(result[0], { word: 'gato come', count: 2 });
  assert.deepEqual(result.find((e) => e.word === 'come o'), { word: 'come o', count: 1 });
});

test('size 3 conta trios', () => {
  const result = countWords('a b c a b c', { size: 3 });
  assert.deepEqual(result.find((e) => e.word === 'a b c'), { word: 'a b c', count: 2 });
});

test('pares não cruzam pontuação', () => {
  const words = countWords('gato. rato, queijo', { size: 2 }).map((e) => e.word);
  assert.deepEqual(words, []);
});

test('pares descartam sequências que começam ou terminam em stopword', () => {
  const words = countWords('o gato de casa', { size: 2, stopwords: new Set(['o', 'de']) }).map((e) => e.word);
  assert.deepEqual(words, []);
  const kept = countWords('gato preto', { size: 2, stopwords: new Set(['o']) }).map((e) => e.word);
  assert.deepEqual(kept, ['gato preto']);
});

test('texto menor que size retorna vazio', () => {
  assert.deepEqual(countWords('um', { size: 2 }), []);
});
