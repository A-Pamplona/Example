import dns from 'node:dns/promises';
import net from 'node:net';

const TIMEOUT_MS = 8000;
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;

export class FetchPageError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function isPrivateIPv4(ip) {
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

function isPrivateAddress(ip) {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  const lower = ip.toLowerCase();
  if (lower.startsWith('::ffff:')) return isPrivateIPv4(lower.slice(7));
  return lower === '::1' || lower === '::' || lower.startsWith('fc') ||
    lower.startsWith('fd') || lower.startsWith('fe80');
}

/** Valida o formato da URL e bloqueia endereços internos (SSRF). */
export async function assertPublicUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new FetchPageError('URL inválida.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new FetchPageError('Apenas URLs http e https são aceitas.');
  }

  const host = url.hostname.replace(/^\[|\]$/g, '');
  let addresses;
  try {
    addresses = net.isIP(host)
      ? [{ address: host }]
      : await dns.lookup(host, { all: true });
  } catch {
    throw new FetchPageError('Não foi possível encontrar o endereço do site.', 502);
  }
  if (addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new FetchPageError('Este endereço não é permitido.', 403);
  }
  return url;
}

async function readLimited(response) {
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_BYTES) {
      await reader.cancel();
      throw new FetchPageError('A página é grande demais (limite de 2 MB).', 413);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

/** Baixa o HTML de uma URL pública, com limite de tempo, tamanho e redirecionamentos. */
export async function fetchPage(rawUrl) {
  let url = await assertPublicUrl(rawUrl);

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    let response;
    try {
      response = await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'User-Agent': 'WordFrequencyApp/1.0', Accept: 'text/html,text/plain' },
      });
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new FetchPageError('O site demorou demais para responder.', 504);
      }
      throw new FetchPageError('Não foi possível acessar o site.', 502);
    }

    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      url = await assertPublicUrl(new URL(response.headers.get('location'), url).href);
      continue;
    }
    if (!response.ok) {
      throw new FetchPageError(`O site respondeu com erro ${response.status}.`, 502);
    }

    const type = response.headers.get('content-type') ?? '';
    if (!/text\/(html|plain)|application\/xhtml/i.test(type)) {
      throw new FetchPageError('O conteúdo da URL não é uma página de texto.', 415);
    }
    return { html: await readLimited(response), isPlain: /text\/plain/i.test(type) };
  }

  throw new FetchPageError('Redirecionamentos demais.', 508);
}
