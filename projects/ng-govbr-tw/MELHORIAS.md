# Melhorias — @schenkerjon/ng-govbr-tw

Comparativo com o [Gov.br Design System oficial](https://www.gov.br/ds/home) e roadmap de evolucao da lib.

## Componentes existentes (cobertura atual)

| Lib (`ng-govbr-tw`)         | Gov.br DS oficial |
|-----------------------------|-------------------|
| `br-button`                 | Button            |
| `br-input` (unificado)      | Input             |
| `br-select`                 | Select            |
| `br-textarea`               | Textarea          |
| `br-checkbox`               | Checkbox          |
| `br-radio-group`            | Radio             |
| `br-upload`                 | Upload            |
| `br-table`                  | Table             |
| `br-card`                   | Card              |
| `br-header`                 | Header            |
| `br-footer`                 | Footer            |
| `br-menu` / `br-menu-item`  | Menu              |
| `br-menu-bar`               | Menu (horizontal) |
| `br-mega-menu`              | Menu (mega)       |
| `br-sidebar`                | Menu (sidebar)    |
| `br-message`                | Message           |
| `br-badge`                  | Tag               |
| `br-modal`                  | Modal             |
| `br-loading`                | Loading           |
| `br-skeleton`               | Loading (skeleton)|
| `br-tab`                    | Tab               |
| `br-pagination`             | Pagination        |
| `br-breadcrumb`             | Breadcrumb        |
| `br-tooltip`                | Tooltip           |
| `br-accordion`              | Accordion         |
| `br-list` / `br-item`       | List / Item       |
| `br-wizard`                 | Wizard            |
| `br-cookiebar`              | Cookiebar         |
| `br-datepicker`             | Datepicker        |
| `br-timepicker`             | Timepicker        |
| `br-datetimepicker`         | DateTimePicker    |
| `br-magic-button`           | Magic Button      |
| `br-avatar`                 | Avatar            |
| `br-layout`                 | —                 |

## Diferenciais da lib

Funcionalidades que a lib oferece e o Gov.br DS oficial nao possui:

- **`br-layout`** — Componente estrutural que organiza header + menu + content + footer num layout pronto.
- **`br-input` unificado** — Combina text, email, password, select e file num unico componente com `ControlValueAccessor`.
- **Tailwind Preset** — Preset Tailwind com tokens oficiais do Gov.br (cores, fontes, espacamentos, border-radius).
- **`br-modal` com variantes** — Variantes `danger`, `warning`, `success` com icone e botao colorido automaticamente.
- **`br-table` com selecao** — Suporte a selecao de linhas com `selectable`, `toggleRow()`, `toggleAll()` e `selectionChange`.
- **`br-skeleton`** — Placeholders de loading com variantes line, circle, card, table e list.

## Melhorias planejadas

### Alta prioridade

| Melhoria | Descricao |
|---|---|
| `br-input` — Mascaras brasileiras | CPF, CNPJ, telefone, CEP com formatacao automatica |
| `br-select` — Criacao inline | `allowCreate` para digitar opcoes que nao existem na lista |
| `br-table` — Ordenacao de colunas | Clicar no header para ordenar asc/desc |
| `br-message` — Auto-dismiss | `[duration]="5000"` para fechar automaticamente |
| `br-notification` (novo) | Toast/snackbar no canto da tela para feedback de acoes |

### Media prioridade

| Melhoria | Descricao |
|---|---|
| `br-switch` (novo) | Toggle on/off para configuracoes |
| `br-card` — Variante horizontal | Card com imagem lateral |
| `br-header` — Mobile responsivo | Menu hamburguer melhorado para mobile |
| Testes unitarios | Jest/Karma para todos os componentes |
| Storybook | Documentacao interativa dos componentes |

### Baixa prioridade

| Melhoria | Descricao |
|---|---|
| `br-divider` (novo) | Separador horizontal/vertical simples |
| `br-sign-in` (novo) | Componente de login padrao Gov.br |
| `br-tag` (novo) | Tag com variantes e botao de remocao |
| Temas claro/escuro | Suporte a dark mode alem do alto contraste |
| CI/CD npm | Publish automatico via GitHub Actions |

## Melhorias de infraestrutura

- [x] Adicionar schematics (`ng add @schenkerjon/ng-govbr-tw`)
- [x] Criar app demo com showcase de componentes
- [x] CI/CD para deploy do showcase via GitHub Pages
- [x] Tipagem `as const` em todos os mapas de variantes
- [x] Exports corretos no package.json
- [ ] Adicionar testes unitarios para todos os componentes
- [ ] Adicionar suporte a temas (claro/escuro)
- [ ] Documentar acessibilidade (WCAG 2.2 / ABNT NBR 17225)
- [ ] Storybook para documentacao interativa
