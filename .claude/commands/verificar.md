---
description: Roda os testes e confere o app no navegador (tabela, gráfico, nuvem, temas)
---

Verifique se o Word Frequency está saudável. Não altere código; só relate.

1. Rode `npm test` e resuma: total, passaram, falharam. Se algo falhar, mostre o teste e o erro.
2. Veja se http://localhost:3000 responde. Se não, suba o servidor com `npm start` em segundo plano.
3. No navegador, abra o app, cole um texto de exemplo com palavras repetidas e clique em "Analisar". Confira:
   - a tabela está em ordem decrescente de frequência;
   - o resumo (termos, únicas, mais frequente) aparece;
   - o gráfico aparece em Colunas, Barras horizontais e Rosca, e a Nuvem mostra as palavras;
   - "Analisar por" Pares e Trios muda a tabela;
   - o erro aparece com a caixa vazia.
4. Alterne para o modo escuro e volte; confira que gráfico e nuvem continuam legíveis.
5. Leia o console do navegador e liste qualquer erro.

Termine com uma lista curta: o que está OK e o que precisa de atenção. $ARGUMENTS
