# Word Frequency

App que conta a frequência de palavras em um texto (ou em uma página web) e mostra uma tabela com cada palavra única e sua contagem, em ordem decrescente.

## Funcionalidades

- Caixa de texto com limite de 2048 caracteres e contador, com suporte a colar
- Tabela ordenada por frequência (desempate alfabético), com busca e mínimo de ocorrências
- Mensagem de erro quando a entrada está vazia
- Gráficos: colunas, barras horizontais, rosca e nuvem de palavras (top N configurável)
- Análise a partir de uma URL (backend Node.js com proteção contra SSRF)
- Upload de arquivos `.txt` (arrastar e soltar, até 1 MB)
- Stopwords por idioma, pares e trios de palavras, exportação em CSV
- Modo escuro com preferência salva e atalho Ctrl+Enter

## Stack

- Frontend: HTML, CSS e JavaScript puro (ES modules), sem build
- Gráficos: Chart.js via CDN
- Backend: Node.js + Express + Cheerio (somente para o modo URL)
- Testes: runner nativo do Node (`node --test`)

## Como usar

```bash
npm install
npm start    # http://localhost:3000
npm test     # roda os testes
```

O app não funciona abrindo `public/index.html` direto (`file://`), pois o navegador bloqueia módulos ES. Use sempre `npm start`.

## Estrutura

```
public/   frontend estático (index.html, css/, js/)
server/   Express: serve public/ e expõe /api/fetch-text
tests/    testes da contagem e da extração de texto
App.md    especificação do projeto
```

A lógica de contagem (`public/js/wordFrequency.js`) não toca no DOM e é testável isoladamente. Mais detalhes sobre convenções e fases em [CLAUDE.md](CLAUDE.md).
