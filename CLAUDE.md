# CLAUDE.md

## Descrição

**Word Frequency** é um app de nível iniciante (Tier 1) que conta a frequência de palavras em um bloco de texto e exibe uma tabela com cada palavra única e sua contagem, em ordem decrescente de frequência. A especificação completa está em [App.md](App.md).

Regras principais da especificação:
- Caixa de texto com no máximo **2048 caracteres**, com suporte a colar.
- Botão de análise (rotulado "Translate" no enunciado, embora o app não traduza nada).
- Mensagem de erro quando a caixa está vazia.
- Tabela ordenada por frequência, da maior para a menor.
- Bônus: gráfico de frequência e análise a partir de uma URL.

## Status

- [x] Especificação lida e plano definido
- [x] Fase 1: estrutura da interface
- [x] Fase 2: lógica de contagem (`public/js/wordFrequency.js`, 14 testes passando)
- [x] Fase 3: integração do botão com a tabela
- [x] Fase 4: validação, contador de caracteres, responsivo
- [x] Fase 5: gráfico das 10 palavras mais frequentes (Chart.js via CDN)
- [x] Fase 6: análise por URL (`server/`), com proteção contra SSRF
- [x] Fase 7: stopwords, exportar CSV e alternar texto/URL

- [x] Melhorias de uso: botão "Analisar", Ctrl+Enter, sumário, busca/mínimo de ocorrências na tabela, top N do gráfico, stopwords por idioma (18 testes)
- [x] Visualizações: colunas, barras horizontais, rosca e nuvem de palavras (`cloud.js`, `palette.js`; 23 testes)
- [x] Upload de `.txt` (arrastar e soltar, até 1 MB), pares e trios de palavras (`size` em `countWords`), modo escuro com preferência salva (28 testes)

Todas as fases estão implementadas. Falta apenas uma verificação visual no navegador.

Atualize esta seção ao concluir cada fase.

## Fases de desenvolvimento

1. **Estrutura da interface**: HTML e CSS com caixa de texto, botão e tabela vazia.
2. **Lógica de contagem**: função que normaliza o texto, conta as palavras e ordena por frequência, testável isoladamente.
3. **Integração**: o botão chama a função e preenche a tabela.
4. **Validação e acabamento**: erro para texto vazio, limite de 2048 caracteres com contador, casos extremos (só pontuação, acentos, apóstrofos) e layout responsivo.
5. **Bônus 1, gráfico**: top N palavras (ex.: 10) em Chart.js ou D3.
6. **Bônus 2, URL**: campo de URL, backend Node.js que busca a página e extrai o texto visível, com tratamento de erros (URL inválida, site fora do ar).
7. **Extras opcionais**: stopwords, exportar CSV, alternar entre texto e URL.

Implemente uma fase por vez e não avance sem a anterior funcionando.

## Stack

- Frontend: HTML + CSS + JavaScript puro (ES modules), sem framework e sem etapa de build.
- Gráfico (fase 5): Chart.js ou D3.js.
- Backend (fase 6, somente para URL): Node.js + Express, porque o navegador bloqueia requisições a outros sites por CORS.
- Testes: runner nativo do Node (`node --test`), sem dependências extras.

## Estrutura de pastas

```
World Fre/
├── CLAUDE.md
├── App.md                  # especificação do projeto
├── package.json
├── public/                 # frontend servido como estático
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── main.js         # eventos e ligação com o DOM
│       ├── wordFrequency.js# lógica pura de contagem (sem DOM)
│       ├── ui.js           # renderização da tabela e mensagens
│       ├── stopwords.js    # palavras comuns (pt e en)
│       ├── chart.js        # gráficos (Chart.js)
│       ├── cloud.js        # nuvem de palavras (cálculo puro + render)
│       └── palette.js      # cores compartilhadas
├── server/                 # fase 6
│   ├── index.js            # Express: serve public/ e expõe /api/fetch-text
│   ├── fetchPage.js        # baixa a URL com limites e bloqueio de endereços internos
│   └── extractText.js      # extrai texto visível de HTML
└── tests/
    ├── wordFrequency.test.js
    └── extractText.test.js
```

## Comandos

```bash
npm install          # uma vez, instala express e cheerio
npm start            # sobe http://localhost:3000 (frontend + API de URL)
npm test             # roda todos os testes (node --test)
node --test tests/wordFrequency.test.js   # um arquivo só
```

O app **não funciona** abrindo `public/index.html` direto (`file://`): o navegador bloqueia os módulos ES. Sempre use `npm start` e acesse http://localhost:3000.

## Comandos customizados (`.claude/commands/`)

- `/verificar`: roda os testes e confere o app no navegador (tabela, gráficos, nuvem, temas), sem alterar código.
- `/fase <descrição>`: implementa uma funcionalidade seguindo estas regras, com testes e atualização do Status.
- `/revisar-ui [foco]`: revisa a interface com a skill `ui-ux-pro-max` e só relata os problemas.

## Convenções de código

- **Idioma**: identificadores e nomes de arquivo em inglês. Textos exibidos ao usuário e comentários em português. Os rótulos devem ficar em um único lugar para facilitar mudanças (ex.: o botão "Translate" pode virar "Analisar").
- **Estilo JS**: ES modules, `const` por padrão, `let` só quando necessário, nunca `var`. Ponto e vírgula, aspas simples, indentação de 2 espaços. Funções pequenas, com um único propósito.
- **Nomes**: `camelCase` para variáveis e funções, `PascalCase` para classes, `UPPER_SNAKE_CASE` para constantes (ex.: `MAX_CHARS = 2048`). Arquivos em `camelCase.js`.
- **Separação de responsabilidades**: `wordFrequency.js` não toca no DOM e é testável sozinho. Só `main.js` e `ui.js` acessam o DOM.
- **Regras de contagem**: converter para minúsculas, remover pontuação, preservar letras acentuadas e apóstrofos internos (ex.: "don't"), desempatar por ordem alfabética.
- **HTML/CSS**: HTML semântico (`<label>`, `<table>`, `<th scope>`), mensagens de erro com `role="alert"`, classes em `kebab-case`, sem estilos inline.
- **Segurança**: inserir texto do usuário na página com `textContent`, nunca `innerHTML`. No backend, validar a URL (apenas `http` e `https`) e limitar tempo e tamanho da resposta.
- **Testes**: cada função de lógica tem testes cobrindo texto vazio, só pontuação, maiúsculas e minúsculas, acentos e empates.
- **Commits**: mensagens curtas no imperativo, um commit por fase ou por mudança coerente.
