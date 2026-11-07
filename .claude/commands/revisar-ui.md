---
description: Revisa a interface com a skill ui-ux-pro-max (acessibilidade, contraste, responsivo, temas) sem alterar nada
---

Revise a interface do Word Frequency usando a skill instalada em `.claude/skills/ui-ux-pro-max`. Não altere arquivos: só relate e espere minha aprovação.

1. Leia `.claude/skills/ui-ux-pro-max/SKILL.md` e `references/pro-rules.md` (checklist de entrega).
2. Rode buscas da skill, por exemplo:
   `python .claude/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --domain ux`
   para foco visível, contraste, alvos de toque e formulários, e `--domain chart` para gráficos. Use `$ARGUMENTS` como foco extra, se houver.
3. Compare com `public/index.html` e `public/css/styles.css`:
   - foco visível em todos os controles;
   - contraste mínimo de 4,5:1 nos dois temas (inclusive as cores da paleta em `palette.js`);
   - rótulos visíveis nos campos, erros perto do campo;
   - gráfico e nuvem com alternativa em texto;
   - `prefers-reduced-motion` respeitado.
4. No navegador, teste em 375px (celular), 768px e desktop, nos modos claro e escuro: sem rolagem horizontal, sem texto cortado, botões fáceis de tocar.
5. Entregue uma lista curta de problemas por prioridade (crítico, alto, médio), cada um com o arquivo e a correção sugerida. Se nada for encontrado, diga isso.
