import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractText } from '../server/extractText.js';

test('extrai o texto do body', () => {
  const html = '<html><body><h1>Título</h1><p>Um  parágrafo</p></body></html>';
  assert.equal(extractText(html), 'Título Um parágrafo');
});

test('remove scripts, estilos e head', () => {
  const html = `<html><head><title>Oculto</title><style>p{color:red}</style></head>
    <body><script>var x = 1;</script><p>Visível</p></body></html>`;
  assert.equal(extractText(html), 'Visível');
});

test('funciona com fragmento sem body', () => {
  assert.equal(extractText('<p>Olá</p> <p>mundo</p>'), 'Olá mundo');
});

test('HTML vazio retorna string vazia', () => {
  assert.equal(extractText(''), '');
});
