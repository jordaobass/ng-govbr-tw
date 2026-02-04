# Changelog

## [0.0.4] - 2026-02-04

### Corrigido

- **Exports do package.json** — Adicionados exports para `./tailwind.preset` e `./styles/govbr-tw.css`. Antes, `require('@schenkerjon/ng-govbr-tw/tailwind.preset')` e `@import '@schenkerjon/ng-govbr-tw/styles/govbr-tw.css'` falhavam dependendo do bundler/Node.
- **README** — Path do CSS corrigido de `src/lib/styles/govbr-tw.css` para `styles/govbr-tw.css` (usando o export publico).

### Melhorado

- **Tipagem `as const` em todos os componentes** — Substituido `Record<string, string>` e `Record<string, number>` por `as const` em 46 ocorrencias across 22 componentes (badge, button, message, accordion, card, checkbox, header, input, list, loading, radio, select, sidebar, textarea, tooltip, tab, pagination, modal, mega-menu, menu-bar, menu, magic-button). Isso da ao TypeScript conhecimento exato das chaves validas, melhorando autocomplete e deteccao de erros.

### Documentacao

- **README reescrito** — Tabela completa dos 32 componentes organizada por categoria (formularios, feedback, navegacao, conteudo, avancados). Adicionados 6 exemplos de codigo (select, modal, tabs, accordion, checkbox/radio, button) e instrucoes para rodar a demo app.
- **Showcase expandido** — Demo app (`ng serve demo`) agora com 20 secoes interativas cobrindo todos os componentes: botoes, inputs, select, textarea, checkbox, radio, badges, mensagens, tooltip, cards, accordion, tabs, list, tabela, paginacao, breadcrumb, loading, modal, wizard e datepicker/timepicker.

## [0.0.3] - 2026-02-04

### Adicionado

- Primeira publicacao no npm
- 32 componentes standalone (Angular 17+)
- Tailwind preset com tokens Gov.br (cores, fontes, espacamentos, border-radius)
- Schematics (`ng add`) com configuracao automatica de Tailwind e fontes
- CSS base (`govbr-tw.css`), componentes (`govbr-components.css`) e alto contraste (`govbr-contrast.css`)
- Suporte a Angular 17, 18 e 19
