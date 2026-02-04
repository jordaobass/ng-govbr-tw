# @schenkerjon/ng-govbr-tw

Biblioteca Angular **open-source** que implementa componentes visuais baseados no **Gov.br Design System**, utilizando **Tailwind CSS 3** para estilizacao.

O objetivo deste projeto e oferecer uma alternativa leve e moderna para construir interfaces de sistemas governamentais brasileiros com Angular, seguindo os padroes visuais definidos pelo Gov.br, sem depender do Web Components oficial. Os componentes sao standalone, compativeis com Angular 17+ e utilizam classes utilitarias do Tailwind, facilitando a customizacao e a manutencao.

## Instalacao

```bash
npm install @schenkerjon/ng-govbr-tw
```

## Configuracao

### 1. Tailwind CSS

Adicione o preset da biblioteca no seu `tailwind.config.js`:

```js
module.exports = {
  presets: [require('@schenkerjon/ng-govbr-tw/tailwind.preset')],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@schenkerjon/ng-govbr-tw/**/*.{html,ts,mjs}"
  ],
  // ...
};
```

### 2. CSS Base

Importe o CSS base no seu `styles.css`:

```css
@import '@schenkerjon/ng-govbr-tw/styles/govbr-tw.css';
```

## Uso

```typescript
import { BrButtonComponent } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrButtonComponent],
  template: `<br-button variant="primary">Entrar</br-button>`
})
export class MyComponent {}
```

## Componentes

### Formularios

| Componente | Seletor | Descricao |
|---|---|---|
| BrButtonComponent | `<br-button>` | Botao com variantes primary, secondary, danger |
| BrInputComponent | `<br-input>` | Campo de entrada com ControlValueAccessor |
| BrSelectComponent | `<br-select>` | Select com busca e multi-selecao |
| BrTextareaComponent | `<br-textarea>` | Area de texto com contagem de caracteres |
| BrCheckboxComponent | `<br-checkbox>` | Checkbox com estados valid/invalid/indeterminate |
| BrRadioGroupComponent | `<br-radio-group>` | Grupo de radio buttons |
| BrDatepickerComponent | `<br-datepicker>` | Seletor de data com calendario |
| BrTimepickerComponent | `<br-timepicker>` | Seletor de horario |
| BrDatetimepickerComponent | `<br-datetimepicker>` | Seletor de data e hora combinado |

### Feedback

| Componente | Seletor | Descricao |
|---|---|---|
| BrBadgeComponent | `<br-badge>` | Badge/tag de status |
| BrMessageComponent | `<br-message>` | Mensagem de feedback (success, danger, warning, info) |
| BrTooltipComponent | `<br-tooltip>` | Tooltip posicionavel com variantes |
| BrLoadingComponent | `<br-loading>` | Spinner e barra de progresso circular |
| BrModalComponent | `<br-modal>` | Dialog/modal com footer configuravel |

### Navegacao

| Componente | Seletor | Descricao |
|---|---|---|
| BrHeaderComponent | `<br-header>` | Cabecalho do sistema Gov.br |
| BrFooterComponent | `<br-footer>` | Rodape do sistema |
| BrMenuComponent | `<br-menu>` | Menu lateral push |
| BrMenuItemComponent | `<br-menu-item>` | Item do menu |
| BrMenuBarComponent | `<br-menu-bar>` | Barra de menu horizontal |
| BrMegaMenuComponent | `<br-mega-menu>` | Mega menu com paineis |
| BrSidebarComponent | `<br-sidebar>` | Sidebar colapsavel com mobile drawer |
| BrBreadcrumbComponent | `<br-breadcrumb>` | Navegacao breadcrumb |
| BrTabComponent | `<br-tab>` | Navegacao por abas |
| BrPaginationComponent | `<br-pagination>` | Paginacao standalone |

### Conteudo

| Componente | Seletor | Descricao |
|---|---|---|
| BrCardComponent | `<br-card>` | Card informativo com icone e link |
| BrTableComponent | `<br-table>` | Tabela com paginacao integrada |
| BrListComponent | `<br-list>` | Lista estruturada |
| BrItemComponent | `<br-item>` | Item de lista com avatar/icone/tag |
| BrAccordionComponent | `<br-accordion>` | Accordion com modo single/multiple |
| BrLayoutComponent | `<br-layout>` | Layout principal (header + menu + content + footer) |

### Avancados

| Componente | Seletor | Descricao |
|---|---|---|
| BrWizardComponent | `<br-wizard>` | Stepper para fluxos multi-etapas |
| BrCookiebarComponent | `<br-cookiebar>` | Barra de consentimento de cookies (LGPD) |
| BrMagicButtonComponent | `<br-magic-button>` | Botao flutuante (FAB) com speed dial |

## Exemplos de uso

### Select com busca

```typescript
import { BrSelectComponent, BrSelectOption } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrSelectComponent],
  template: `
    <br-select
      label="Estado"
      [options]="states"
      [searchable]="true"
      [(ngModel)]="selected"
    ></br-select>
  `
})
export class MyComponent {
  selected = '';
  states: BrSelectOption[] = [
    { label: 'Sao Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
  ];
}
```

### Modal

```typescript
import { BrModalComponent, BrButtonComponent } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrModalComponent, BrButtonComponent],
  template: `
    <br-button (click)="open = true">Abrir</br-button>
    <br-modal
      [isOpen]="open"
      title="Confirmar"
      (closed)="open = false"
      (confirmed)="onConfirm()"
    >
      <p>Deseja continuar?</p>
    </br-modal>
  `
})
export class MyComponent {
  open = false;
  onConfirm() { this.open = false; }
}
```

### Tabs

```typescript
import { BrTabComponent, BrTabPanelComponent, BrTabItem } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrTabComponent, BrTabPanelComponent],
  template: `
    <br-tab [tabs]="tabs" [(activeIndex)]="active">
      <br-tab-panel label="Aba 1">Conteudo 1</br-tab-panel>
      <br-tab-panel label="Aba 2">Conteudo 2</br-tab-panel>
    </br-tab>
  `
})
export class MyComponent {
  active = 0;
  tabs: BrTabItem[] = [
    { label: 'Aba 1', icon: 'user' },
    { label: 'Aba 2', icon: 'gear' },
  ];
}
```

### Accordion

```typescript
import { BrAccordionComponent, BrAccordionItemComponent } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrAccordionComponent, BrAccordionItemComponent],
  template: `
    <br-accordion mode="single">
      <br-accordion-item title="Pergunta 1" [open]="true">
        Resposta 1
      </br-accordion-item>
      <br-accordion-item title="Pergunta 2">
        Resposta 2
      </br-accordion-item>
    </br-accordion>
  `
})
export class MyComponent {}
```

### Checkbox e Radio

```typescript
import { BrCheckboxComponent, BrRadioGroupComponent, BrRadioOption } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrCheckboxComponent, BrRadioGroupComponent],
  template: `
    <br-checkbox label="Aceito os termos" [(ngModel)]="accepted"></br-checkbox>

    <br-radio-group
      legend="Tipo"
      [options]="options"
      [(ngModel)]="tipo"
    ></br-radio-group>
  `
})
export class MyComponent {
  accepted = false;
  tipo = 'pf';
  options: BrRadioOption[] = [
    { label: 'Pessoa Fisica', value: 'pf' },
    { label: 'Pessoa Juridica', value: 'pj' },
  ];
}
```

## Demo

O projeto inclui uma aplicacao demo com exemplos interativos de todos os componentes:

```bash
git clone https://github.com/jordaobass/ng-govbr-tw.git
cd ng-govbr-tw
npm install
npm run build
ng serve demo
```

Acesse `http://localhost:4200` para ver o showcase.

## Tokens Gov.br

O preset Tailwind mapeia os tokens oficiais do Design System:

- `govbr-primary` — #1351b4 (blue-warm-vivid-70)
- `govbr-primary-dark` — #0c326f
- `govbr-success` — #168821
- `govbr-danger` — #e52207
- `govbr-warning` — #ffcd07
- `font-rawline` — Rawline, Raleway, sans-serif
- `rounded-govbr-pill` — 100em

## Contribuicao

Contribuicoes sao bem-vindas! Abra uma issue ou envie um pull request no repositorio.

## Licenca

MIT
