import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { extractText } from './extractText.js';
import { fetchPage, FetchPageError } from './fetchPage.js';

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static(PUBLIC_DIR));

app.post('/api/fetch-text', async (req, res) => {
  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
  if (!url) {
    return res.status(400).json({ error: 'Informe uma URL.' });
  }

  try {
    const { html, isPlain } = await fetchPage(url);
    const text = isPlain ? html : extractText(html);
    if (!text) {
      return res.status(422).json({ error: 'Não foi encontrado texto na página.' });
    }
    res.json({ text });
  } catch (error) {
    if (error instanceof FetchPageError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao processar a URL.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
