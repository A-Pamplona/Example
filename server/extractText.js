import * as cheerio from 'cheerio';

const IGNORED_TAGS = 'script, style, noscript, template, svg, iframe, head, nav, footer';

const BLOCK_TAGS =
  'p, div, br, li, tr, td, th, h1, h2, h3, h4, h5, h6, section, article, header, ' +
  'blockquote, pre, ul, ol, table, main, aside, figcaption';

/** Extrai o texto visível de um documento HTML. */
export function extractText(html) {
  const $ = cheerio.load(html);
  $(IGNORED_TAGS).remove();
  // Sem isso, "<h1>A</h1><p>B</p>" viraria "AB" e juntaria palavras vizinhas
  $(BLOCK_TAGS).after(' ');
  const root = $('body').length ? $('body') : $.root();
  return root.text().replace(/\s+/g, ' ').trim();
}
