import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeCloudItems } from '../public/js/cloud.js';

const entries = [
  { word: 'zebra', count: 5 },
  { word: 'gato', count: 3 },
  { word: 'ave', count: 1 },
];

test('lista vazia gera nuvem vazia', () => {
  assert.deepEqual(computeCloudItems([], 10), []);
});

test('a palavra mais frequente tem a maior fonte e a menos frequente a menor', () => {
  const items = computeCloudItems(entries, 10);
  const size = Object.fromEntries(items.map((i) => [i.word, i.fontSize]));
  assert.ok(size.zebra > size.gato && size.gato > size.ave);
});

test('respeita o limite de palavras', () => {
  assert.equal(computeCloudItems(entries, 2).length, 2);
});

test('contagens iguais geram o mesmo tamanho', () => {
  const items = computeCloudItems([{ word: 'a', count: 2 }, { word: 'b', count: 2 }], 10);
  assert.equal(items[0].fontSize, items[1].fontSize);
});

test('ordena alfabeticamente', () => {
  assert.deepEqual(computeCloudItems(entries, 10).map((i) => i.word), ['ave', 'gato', 'zebra']);
});
