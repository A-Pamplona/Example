---
description: Implementa uma funcionalidade seguindo as regras do CLAUDE.md (testes, separação de camadas, status)
argument-hint: <descrição da funcionalidade>
---

Implemente esta funcionalidade, uma fase por vez: $ARGUMENTS

Siga o CLAUDE.md do projeto:

1. Leia o CLAUDE.md e os arquivos que serão afetados antes de editar.
2. Coloque a lógica pura em `public/js/` sem tocar no DOM (testável com `node --test`); só `main.js` e `ui.js` acessam o DOM. Texto do usuário entra na página com `textContent`, nunca `innerHTML`.
3. Escreva os testes em `tests/` cobrindo texto vazio, só pontuação, maiúsculas e minúsculas, acentos e empates, no que se aplicar.
4. Siga as convenções: ES modules, aspas simples, ponto e vírgula, 2 espaços, identificadores em inglês, textos ao usuário e comentários em português.
5. Rode `npm test` e só avance se tudo passar.
6. Execute o roteiro do comando `/verificar` para confirmar no navegador.
7. Atualize a seção "Status" do CLAUDE.md (novo item e contagem de testes) e a estrutura de pastas, se mudou.
8. Sugira uma mensagem de commit curta, no imperativo. Não faça o commit.

Ao final, resuma o que mudou e o que não foi verificado.
