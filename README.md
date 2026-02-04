# @aspect-br/ng-govbr-tw

Biblioteca Angular open-source com componentes que seguem o padrao visual do **Gov.br Design System**, estilizados com **Tailwind CSS 3**.

## Instalacao

```bash
npm install @aspect-br/ng-govbr-tw
```

## Configuracao

### 1. Tailwind CSS

Adicione o preset da biblioteca no seu `tailwind.config.js`:

```js
module.exports = {
  presets: [require('@aspect-br/ng-govbr-tw/tailwind.preset')],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@aspect-br/ng-govbr-tw/**/*.{html,ts,mjs}"
  ],
  // ...
};
```

### 2. CSS Base

Importe o CSS base no seu `styles.css`:

```css
@import '@aspect-br/ng-govbr-tw/src/lib/styles/govbr-tw.css';
```

## Uso

```typescript
import { BrButtonComponent } from '@aspect-br/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrButtonComponent],
  template: `<br-button variant="primary">Entrar</br-button>`
})
export class MyComponent {}
```

## Componentes

| Componente | Seletor | Descricao |
|---|---|---|
| BrButtonComponent | `<br-button>` | Botao com variantes primary, secondary, danger |
| BrInputComponent | `<br-input>` | Campo de entrada com ControlValueAccessor |
| BrBadgeComponent | `<br-badge>` | Badge/tag de status |
| BrMessageComponent | `<br-message>` | Mensagem de feedback |
| BrTableComponent | `<br-table>` | Tabela com paginacao |
| BrCardComponent | `<br-card>` | Card informativo |
| BrHeaderComponent | `<br-header>` | Cabecalho do sistema |
| BrFooterComponent | `<br-footer>` | Rodape do sistema |
| BrMenuComponent | `<br-menu>` | Menu lateral de navegacao |
| BrMenuItemComponent | `<br-menu-item>` | Item do menu |
| BrLayoutComponent | `<br-layout>` | Layout principal com header, menu e footer |

## Tokens Gov.br

O preset Tailwind mapeia os tokens oficiais:

- `govbr-primary` — #1351b4 (blue-warm-vivid-70)
- `govbr-primary-dark` — #0c326f
- `govbr-success` — #168821
- `govbr-danger` — #e52207
- `govbr-warning` — #ffcd07
- `font-rawline` — Rawline, Raleway, sans-serif
- `rounded-govbr-pill` — 100em

## Licenca

MIT
