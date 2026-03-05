# @schenkerjon/ng-govbr-tw

<p align="center">
  <a href="https://jordaobass.github.io/ng-govbr-tw/">
    <img src="https://img.shields.io/badge/📖_STORYBOOK-Documentação_online-1351b4?style=for-the-badge&labelColor=071D41" alt="Storybook online" />
  </a>
</p>

<p align="center">
  <img src="https://www.gov.br/++theme++padrao_govbr/img/govbr-logo-large.png" alt="Gov.br" height="60" />
</p>

<p align="center">
  Biblioteca Angular <strong>open-source</strong> que implementa componentes visuais baseados no <strong>Gov.br Design System</strong>, utilizando <strong>Tailwind CSS 3 ou 4</strong> para estilização.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@schenkerjon/ng-govbr-tw"><img src="https://img.shields.io/npm/v/@schenkerjon/ng-govbr-tw.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@schenkerjon/ng-govbr-tw"><img src="https://img.shields.io/npm/dm/@schenkerjon/ng-govbr-tw.svg" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/Angular-17_a_22-dd0031.svg" alt="Angular 17 a 22" />
  <img src="https://img.shields.io/badge/Tailwind-3.x%20%7C%204.x-38bdf8.svg" alt="Tailwind CSS 3 ou 4" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" />
</p>

---

## Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Configuração](#configuração)
  - [Tailwind CSS 3](#1a-tailwind-css-3)
  - [Tailwind CSS 4](#1b-tailwind-css-4)
  - [Font Awesome](#2-font-awesome-opcional)
- [Uso Básico](#uso-básico)
- [Componentes](#componentes)
  - [Formulários](#formulários)
  - [Feedback](#feedback)
  - [Navegação](#navegação)
  - [Conteúdo](#conteúdo)
  - [Avançados](#avançados)
- [Animações](#animações)
  - [Configuração de Animações](#configuração-de-animações)
  - [Componentes Animados](#componentes-animados)
- [Acessibilidade](#acessibilidade)
- [Tokens Gov.br](#tokens-govbr)
- [Exemplos Detalhados](#exemplos-detalhados)
  - [Formulário Completo](#formulário-completo)
  - [Select com Busca](#select-com-busca)
  - [Modal](#modal)
  - [Tabs](#tabs)
  - [Accordion](#accordion)
  - [Sidebar com Menu](#sidebar-com-menu)
  - [Wizard Multi-etapas](#wizard-multi-etapas)
  - [Upload de Arquivos](#upload-de-arquivos)
  - [Toast Notifications](#toast-notifications)
- [Inputs Especializados](#inputs-especializados)
- [Documentação interativa](#documentação-interativa)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Visão Geral

O objetivo deste projeto é oferecer uma alternativa leve e moderna para construir interfaces de sistemas governamentais brasileiros com Angular, seguindo os padrões visuais definidos pelo Gov.br.

### Características

- **Standalone Components** — Compatível com **Angular 17 a 22**
- **Tailwind CSS 3 e 4** — Classes utilitárias para fácil customização
- **Acessibilidade** — ARIA labels, navegação por teclado, suporte a reduced-motion
- **Formulários Reativos** — ControlValueAccessor em todos os inputs
- **Animações Suaves** — Transições respeitando preferências do usuário
- **LGPD Ready** — Componente de cookies integrado
- **Sem dependências pesadas** — Não depende do Web Components oficial

---

## Instalação

```bash
npm install @schenkerjon/ng-govbr-tw
```

---

## Configuração

O jeito rápido é deixar o schematic configurar:

```bash
ng add @schenkerjon/ng-govbr-tw
```

Ele detecta se o projeto usa **Tailwind 3 ou 4** e escreve a configuração de
cada um — são incompatíveis entre si, e aplicar a errada deixa a aplicação sem
nenhuma classe `govbr-*`, sem erro algum. À mão, siga a seção da sua versão.

### 1a. Tailwind CSS 3

Preset no `tailwind.config.js`:

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

E no `styles.css` — os `@import` precisam vir **antes** das diretivas
`@tailwind`, senão o `postcss-import` os descarta e os estilos da lib
simplesmente não entram:

```css
@import '@schenkerjon/ng-govbr-tw/styles/govbr-tw.css';
@import '@schenkerjon/ng-govbr-tw/styles/govbr-contrast.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1b. Tailwind CSS 4

Não há `tailwind.config.js`: o tema é CSS-first. Tudo acontece no `styles.css`:

```css
@import "tailwindcss";
@import "@schenkerjon/ng-govbr-tw/styles/govbr-tw.css";
@import "@schenkerjon/ng-govbr-tw/styles/govbr-contrast.css";
@import "@schenkerjon/ng-govbr-tw/styles/govbr-tw-v4.css";

/* Sem esta linha o Tailwind 4 gera 7 das 52 classes govbr-* e a aplicação
   sobe quase sem estilo, SEM erro: o v4 ignora node_modules na varredura
   automática, de propósito. O caminho é relativo a ESTE arquivo. */
@source "../node_modules/@schenkerjon/ng-govbr-tw";
```

O `govbr-tw-v4.css` é **gerado** do `tailwind.preset.js`, então os dois têm
sempre os mesmos tokens — não há uma lista para o v3 e outra para o v4. Há um
teste que compila toda classe `govbr-*` da lib nas duas versões e reprova se
alguma funcionar numa e sumir na outra.

### 2. Font Awesome (Opcional)

Os ícones utilizam Font Awesome. Adicione no `index.html`:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
```

Ou instale via npm:

```bash
npm install @fortawesome/fontawesome-free
```

---

## Uso Básico

```typescript
import { BrButtonComponent } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrButtonComponent],
  template: `<br-button variant="primary">Entrar</br-button>`
})
export class MyComponent {}
```

---

## Componentes

### Formulários

| Componente | Seletor | Descrição |
|---|---|---|
| `BrButtonComponent` | `<br-button>` | Botão com variantes primary, secondary, danger, outline |
| `BrInputComponent` | `<br-input>` | Campo de entrada com validação e máscara |
| `BrSelectComponent` | `<br-select>` | Select com busca e multi-seleção |
| `BrTextareaComponent` | `<br-textarea>` | Área de texto com contagem de caracteres |
| `BrCheckboxComponent` | `<br-checkbox>` | Checkbox com estados valid/invalid/indeterminate |
| `BrCheckboxGroupComponent` | `<br-checkbox-group>` | Escolha múltipla com legenda, apoio e erro no grupo; valor `string[]` na ordem das opções |
| `BrRadioGroupComponent` | `<br-radio-group>` | Grupo de radio buttons |
| `BrSwitchComponent` | `<br-switch>` | Toggle switch on/off |
| `BrDatepickerComponent` | `<br-datepicker>` | Seletor de data com calendário |
| `BrTimepickerComponent` | `<br-timepicker>` | Seletor de horário |
| `BrDatetimepickerComponent` | `<br-datetimepicker>` | Seletor de data e hora combinado |
| `BrUploadComponent` | `<br-upload>` | Upload de arquivos com drag & drop |

### Feedback

| Componente | Seletor | Descrição |
|---|---|---|
| `BrBadgeComponent` | `<br-badge>` | Badge/tag de status |
| `BrChipComponent` | `<br-chip>` | Chip selecionável/removível |
| `BrMessageComponent` | `<br-message>` | Mensagem de feedback (success, danger, warning, info) |
| `BrTooltipComponent` | `<br-tooltip>` | Tooltip posicionável com variantes |
| `BrLoadingComponent` | `<br-loading>` | Spinner e barra de progresso |
| `BrSkeletonComponent` | `<br-skeleton>` | Placeholder de carregamento |
| `BrModalComponent` | `<br-modal>` | Dialog/modal com footer configurável |
| `BrNotificationComponent` | `<br-notification>` | Badge de notificação com contador |
| `BrToastComponent` | `<br-toast>` | Toast notifications |
| `BrToastContainerComponent` | `<br-toast-container>` | Container dos toasts; monte-o uma vez e dispare pelo `BrToastService` |

### Navegação

| Componente | Seletor | Descrição |
|---|---|---|
| `BrHeaderComponent` | `<br-header>` | Cabeçalho do sistema Gov.br |
| `BrFooterComponent` | `<br-footer>` | Rodapé do sistema |
| `BrMenuComponent` | `<br-menu>` | Menu lateral push |
| `BrMenuItemComponent` | `<br-menu-item>` | Item do menu |
| `BrMenuBarComponent` | `<br-menu-bar>` | Barra de menu horizontal |
| `BrSkiplinkComponent` | `<br-skiplink>` | Atalho "pular para o conteúdo", primeiro foco da página (WCAG 2.4.1) |
| `BrMegaMenuComponent` | `<br-mega-menu>` | Mega menu com painéis |
| `BrSidebarComponent` | `<br-sidebar>` | Sidebar colapsável com mobile drawer |
| `BrBreadcrumbComponent` | `<br-breadcrumb>` | Navegação breadcrumb |
| `BrTabComponent` | `<br-tab>` | Navegação por abas |
| `BrPaginationComponent` | `<br-pagination>` | Paginação com itens por página |

### Conteúdo

| Componente | Seletor | Descrição |
|---|---|---|
| `BrCardComponent` | `<br-card>` | Card informativo com ícone e link |
| `BrTableComponent` | `<br-table>` | Tabela com ordenação e paginação |
| `BrListComponent` | `<br-list>` | Lista estruturada |
| `BrItemComponent` | `<br-item>` | Item de lista com avatar/ícone/tag |
| `BrAccordionComponent` | `<br-accordion>` | Accordion com modo single/multiple |
| `BrDividerComponent` | `<br-divider>` | Divisor horizontal/vertical |
| `BrIconComponent` | `<br-icon>` | Ícone do Font Awesome; sem `label` é decorativo e some para o leitor de tela, com `label` é anunciado |
| `BrAvatarComponent` | `<br-avatar>` | Avatar com imagem ou iniciais |
| `BrTimelineComponent` | `<br-timeline>` | Timeline de eventos |
| `BrLayoutComponent` | `<br-layout>` | Layout principal (header + menu + content + footer) |

### Avançados

| Componente | Seletor | Descrição |
|---|---|---|
| `BrWizardComponent` | `<br-wizard>` | Stepper para fluxos multi-etapas |
| `BrStepperComponent` | `<br-stepper>` | Indicador de progresso em etapas |
| `BrCookiebarComponent` | `<br-cookiebar>` | Barra de consentimento de cookies (LGPD) |
| `BrMagicButtonComponent` | `<br-magic-button>` | Botão flutuante (FAB) com speed dial |
| `BrSigninComponent` | `<br-signin>` | Botão de login Gov.br |

---

## Tabela com Paginação

A `br-table` possui paginação integrada com suporte a duas variantes:

### Uso Básico

```html
<!-- Tabela com paginação Contextual (Gov.br) -->
<br-table
  [page]="currentPage"
  [totalPages]="10"
  [totalItems]="100"
  [itemsPerPage]="10"
  [showPagination]="true"
  [showItemsPerPage]="true"
  [showSummary]="true"
  paginationVariant="contextual"
  (pageChange)="onPageChange($event)"
  (itemsPerPageChange)="onItemsChange($event)"
>
  <thead>
    <tr>
      <th>Coluna 1</th>
      <th>Coluna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Dado 1</td><td>Dado 2</td></tr>
  </tbody>
</br-table>
```

### Parâmetros da Tabela

| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `page` | `number` | `1` | Página atual |
| `totalPages` | `number` | `1` | Total de páginas |
| `totalItems` | `number` | `0` | Total de itens |
| `itemsPerPage` | `number` | `10` | Itens por página |
| `itemsPerPageOptions` | `number[]` | `[10,25,50,100]` | Opções do dropdown |
| `showPagination` | `boolean` | `true` | Exibir paginação |
| `showItemsPerPage` | `boolean` | `false` | Mostrar dropdown "Exibir" |
| `showSummary` | `boolean` | `false` | Mostrar "X-Y de Z itens" |
| `showGoToPage` | `boolean` | `true` | Mostrar dropdown "Página" |
| `showFirstLast` | `boolean` | `true` | Mostrar botões ≪ ≫ |
| `paginationVariant` | `'default' \| 'contextual'` | `'default'` | Variante da paginação |
| `paginationDensity` | `'small' \| 'medium' \| 'large'` | `'small'` | Tamanho da paginação |
| `headerStyle` | `'primary' \| 'secondary' \| 'light'` | `'primary'` | Estilo do header |
| `responsive` | `'scroll' \| 'cards'` | `'scroll'` | Modo responsivo |

### Variantes de Paginação

- **`default`**: Input numérico para ir para página + setas
- **`contextual`**: Dropdowns no padrão Gov.br (Exibir X | 1-10 de 100 | Página X | ‹ ›)

---

## Paginação Standalone

Use `br-pagination` separadamente para listas, cards ou layouts customizados:

```html
<br-pagination
  variant="contextual"
  [page]="page"
  [totalPages]="10"
  [totalItems]="100"
  [itemsPerPage]="10"
  [showItemsPerPage]="true"
  [showSummary]="true"
  [showGoToPage]="true"
  (pageChange)="onPageChange($event)"
></br-pagination>
```

---

## Animações

A biblioteca inclui animações suaves em vários componentes, todas respeitando a preferência do usuário por movimento reduzido (`prefers-reduced-motion`).

### Configuração de Animações

```typescript
import { BrAnimationService } from '@schenkerjon/ng-govbr-tw';

@Component({...})
export class AppComponent {
  private animationService = inject(BrAnimationService);

  // Desabilitar animações globalmente
  disableAnimations() {
    this.animationService.setEnabled(false);
  }

  // Verificar status
  isEnabled() {
    return this.animationService.isEnabled();
  }
}
```

### Componentes Animados

| Componente | Tipo de Animação | Descrição |
|---|---|---|
| `br-message` | Slide-in | Mensagens deslizam ao aparecer |
| `br-select` | Dropdown | Menu abre com fade + slide |
| `br-notification` | Bounce | Badge pulsa ao aparecer |
| `br-sidebar` | Slide + Fade | Drawer mobile desliza, overlay faz fade |
| `br-tab` | Fade-in | Conteúdo das abas faz fade suave |
| `br-datepicker` | Dropdown | Calendário abre com animação |
| `br-timepicker` | Dropdown | Painel de horário abre com animação |
| `br-cookiebar` | Slide-up | Barra sobe da parte inferior |
| `br-menu` | Slide-in | Menu desliza da esquerda |
| `br-mega-menu` | Dropdown | Painel mega menu abre com animação |
| `br-wizard` | Fade-slide | Steps deslizam horizontalmente |
| `br-upload` | Enter | Arquivos aparecem com animação |
| `br-modal` | Scale + Fade | Modal escala ao abrir |
| `br-accordion` | Collapse | Conteúdo expande/colapsa suavemente |
| `br-tooltip` | Fade | Tooltip aparece com fade |
| `br-loading` | Spin/Pulse | Animação contínua de loading |

---

## Acessibilidade

Todos os componentes seguem as diretrizes WCAG 2.1:

- **ARIA Labels** — Atributos aria-label, aria-describedby, role
- **Navegação por Teclado** — Tab, Enter, Escape, Arrow keys
- **Focus Visible** — Indicadores de foco visíveis
- **Reduced Motion** — Respeita `prefers-reduced-motion`
- **Contraste** — Cores seguem o padrão Gov.br (AA/AAA)
- **Screen Readers** — Textos alternativos e live regions

```html
<!-- Exemplo de acessibilidade -->
<br-button
  variant="primary"
  ariaLabel="Enviar formulário de contato"
  [loading]="true"
  loadingText="Enviando..."
>
  Enviar
</br-button>
```

---

## Tokens Gov.br

O preset Tailwind mapeia os tokens oficiais do Design System:

### Cores

| Token | Valor | Uso |
|---|---|---|
| `govbr-primary` | #1351b4 | Cor principal (blue-warm-vivid-70) |
| `govbr-primary-dark` | #0c326f | Hover/active |
| `govbr-primary-lightest` | #d4e5ff | Backgrounds suaves |
| `govbr-success` | #168821 | Sucesso, confirmação |
| `govbr-danger` | #e52207 | Erro, alerta crítico |
| `govbr-warning` | #ffcd07 | Atenção |
| `govbr-info` | #155bcb | Informação |
| `govbr-gray-80` | #333333 | Texto principal |
| `govbr-gray-60` | #636363 | Texto secundário |
| `govbr-gray-20` | #cccccc | Bordas |

### Tipografia

```css
font-rawline    /* Rawline, Raleway, sans-serif */
text-govbr-xs   /* 11px */
text-govbr-sm   /* 13px */
text-govbr-base /* 14px */
text-govbr-lg   /* 16px */
text-govbr-xl   /* 20px */
```

### Bordas e Espaçamentos

```css
rounded-govbr-sm   /* 4px */
rounded-govbr-md   /* 8px */
rounded-govbr-pill /* 100em */
```

---

## Exemplos Detalhados

### Formulário Completo

```typescript
import {
  BrInputComponent,
  BrSelectComponent,
  BrCheckboxComponent,
  BrButtonComponent
} from '@schenkerjon/ng-govbr-tw';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, BrInputComponent, BrSelectComponent, BrCheckboxComponent, BrButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <br-input
        label="Nome completo"
        formControlName="nome"
        [required]="true"
        placeholder="Digite seu nome"
      ></br-input>

      <br-input
        label="E-mail"
        type="email"
        formControlName="email"
        [required]="true"
        hint="Usaremos para contato"
      ></br-input>

      <br-select
        label="Estado"
        formControlName="estado"
        [options]="estados"
        [searchable]="true"
        placeholder="Selecione"
      ></br-select>

      <br-checkbox
        label="Aceito os termos de uso"
        formControlName="termos"
      ></br-checkbox>

      <br-button
        type="submit"
        variant="primary"
        [disabled]="form.invalid"
        [loading]="submitting"
      >
        Enviar
      </br-button>
    </form>
  `
})
export class FormularioComponent {
  submitting = false;

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    estado: new FormControl(''),
    termos: new FormControl(false, Validators.requiredTrue)
  });

  estados = [
    { label: 'São Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
  ];

  onSubmit() {
    this.submitting = true;
    // ...
  }
}
```

### Select com Busca

```typescript
import { BrSelectComponent, BrSelectOption } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrSelectComponent],
  template: `
    <br-select
      label="Município"
      [options]="municipios"
      [searchable]="true"
      [multiple]="true"
      searchPlaceholder="Digite para buscar..."
      [(ngModel)]="selecionados"
    ></br-select>
  `
})
export class SelectComponent {
  selecionados: string[] = [];
  municipios: BrSelectOption[] = [
    { label: 'São Paulo', value: 'sao-paulo' },
    { label: 'Campinas', value: 'campinas' },
    { label: 'Santos', value: 'santos' },
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
    <br-button (click)="modalOpen = true">Abrir Modal</br-button>

    <br-modal
      [isOpen]="modalOpen"
      title="Confirmar ação"
      size="medium"
      [showCloseButton]="true"
      (closed)="modalOpen = false"
      (confirmed)="onConfirm()"
    >
      <p>Você tem certeza que deseja continuar com esta ação?</p>
      <p class="text-sm text-govbr-gray-60 mt-2">Esta ação não pode ser desfeita.</p>
    </br-modal>
  `
})
export class ModalComponent {
  modalOpen = false;

  onConfirm() {
    console.log('Confirmado!');
    this.modalOpen = false;
  }
}
```

### Tabs

```typescript
import { BrTabComponent, BrTabItem } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrTabComponent],
  template: `
    <br-tab
      [tabs]="tabs"
      [(activeIndex)]="activeTab"
      density="medium"
    >
      @switch (activeTab) {
        @case (0) {
          <div class="p-4">
            <h3>Dados Pessoais</h3>
            <p>Conteúdo da primeira aba...</p>
          </div>
        }
        @case (1) {
          <div class="p-4">
            <h3>Endereço</h3>
            <p>Conteúdo da segunda aba...</p>
          </div>
        }
        @case (2) {
          <div class="p-4">
            <h3>Documentos</h3>
            <p>Conteúdo da terceira aba...</p>
          </div>
        }
      }
    </br-tab>
  `
})
export class TabsComponent {
  activeTab = 0;
  tabs: BrTabItem[] = [
    { label: 'Dados Pessoais', icon: 'user' },
    { label: 'Endereço', icon: 'location-dot' },
    { label: 'Documentos', icon: 'file', counter: 3 },
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
    <br-accordion mode="single" [negative]="false">
      <br-accordion-item title="O que é o Gov.br?" [open]="true">
        <p>O Gov.br é a plataforma de relacionamento digital única entre cidadão e Governo.</p>
      </br-accordion-item>

      <br-accordion-item title="Como criar uma conta?">
        <p>Acesse gov.br/conta e siga as instruções para criar sua conta.</p>
      </br-accordion-item>

      <br-accordion-item title="Esqueci minha senha" [disabled]="true">
        <p>Conteúdo indisponível.</p>
      </br-accordion-item>
    </br-accordion>
  `
})
export class AccordionComponent {}
```

### Sidebar com Menu

```typescript
import {
  BrSidebarComponent,
  BrSidebarGroupComponent,
  BrSidebarGroupLabelComponent,
  BrSidebarItemComponent,
  BrSidebarSubComponent
} from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [
    BrSidebarComponent,
    BrSidebarGroupComponent,
    BrSidebarGroupLabelComponent,
    BrSidebarItemComponent,
    BrSidebarSubComponent
  ],
  template: `
    <br-sidebar
      [(collapsed)]="collapsed"
      [collapsible]="true"
      [hasHeader]="true"
      [hasFooter]="true"
    >
      <div sidebar-header>
        <img src="logo.png" alt="Logo" class="h-8" />
      </div>

      <br-sidebar-group>
        <br-sidebar-group-label>Principal</br-sidebar-group-label>
        <br-sidebar-item
          route="/dashboard"
          label="Dashboard"
          icon="home"
          [collapsed]="collapsed"
        ></br-sidebar-item>
        <br-sidebar-item
          route="/usuarios"
          label="Usuários"
          icon="users"
          badge="5"
          [collapsed]="collapsed"
        ></br-sidebar-item>
      </br-sidebar-group>

      <br-sidebar-group>
        <br-sidebar-group-label>Configurações</br-sidebar-group-label>
        <br-sidebar-sub
          label="Sistema"
          icon="gear"
          [collapsed]="collapsed"
        >
          <br-sidebar-item route="/config/geral" label="Geral"></br-sidebar-item>
          <br-sidebar-item route="/config/seguranca" label="Segurança"></br-sidebar-item>
        </br-sidebar-sub>
      </br-sidebar-group>

      <div sidebar-footer>
        <span class="text-xs text-govbr-gray-40">v1.0.0</span>
      </div>
    </br-sidebar>
  `
})
export class SidebarComponent {
  collapsed = false;
}
```

### Wizard Multi-etapas

```typescript
import { BrWizardComponent, BrWizardStepComponent } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrWizardComponent, BrWizardStepComponent],
  template: `
    <br-wizard
      [(currentStep)]="step"
      [showNavigation]="true"
      (complete)="onComplete()"
    >
      <br-wizard-step label="Dados Pessoais" icon="user">
        <h3 class="text-lg font-semibold mb-4">Informações Pessoais</h3>
        <p>Preencha seus dados pessoais...</p>
      </br-wizard-step>

      <br-wizard-step label="Endereço" icon="location-dot">
        <h3 class="text-lg font-semibold mb-4">Endereço</h3>
        <p>Informe seu endereço...</p>
      </br-wizard-step>

      <br-wizard-step label="Confirmação" icon="check">
        <h3 class="text-lg font-semibold mb-4">Revisar dados</h3>
        <p>Confira as informações antes de enviar...</p>
      </br-wizard-step>
    </br-wizard>
  `
})
export class WizardComponent {
  step = 0;

  onComplete() {
    console.log('Wizard finalizado!');
  }
}
```

### Upload de Arquivos

```typescript
import { BrUploadComponent, BrUploadFile } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrUploadComponent],
  template: `
    <br-upload
      label="Documentos"
      accept=".pdf,.doc,.docx"
      [multiple]="true"
      [maxSizeMB]="5"
      [maxFiles]="3"
      helperText="Arquivos PDF ou Word, máximo 5MB cada"
      (filesChange)="onFilesChange($event)"
      (fileAdded)="onFileAdded($event)"
      (fileRemoved)="onFileRemoved($event)"
    ></br-upload>
  `
})
export class UploadComponent {
  onFilesChange(files: BrUploadFile[]) {
    console.log('Arquivos:', files);
  }

  onFileAdded(file: BrUploadFile) {
    console.log('Adicionado:', file.name);
  }

  onFileRemoved(file: BrUploadFile) {
    console.log('Removido:', file.name);
  }
}
```

### Toast Notifications

```typescript
import { BrToastService } from '@schenkerjon/ng-govbr-tw';

@Component({...})
export class ToastComponent {
  private toastService = inject(BrToastService);

  showSuccess() {
    this.toastService.success('Operação realizada com sucesso!');
  }

  showError() {
    this.toastService.danger('Erro ao processar solicitação.');
  }

  showWarning() {
    this.toastService.warning('Atenção: verifique os dados.');
  }

  showInfo() {
    this.toastService.info('Nova atualização disponível.', {
      duration: 5000,
      position: 'top-right'
    });
  }
}
```

---

## Inputs Especializados

A biblioteca inclui inputs com máscaras brasileiras:

| Componente | Seletor | Formato |
|---|---|---|
| `BrInputCpfComponent` | `<br-input-cpf>` | 000.000.000-00 |
| `BrInputCnpjComponent` | `<br-input-cnpj>` | 00.000.000/0000-00 |
| `BrInputCepComponent` | `<br-input-cep>` | 00000-000 |
| `BrInputTelefoneComponent` | `<br-input-telefone>` | (00) 00000-0000 |
| `BrInputMoneyComponent` | `<br-input-money>` | R$ 1.234,56 |

```typescript
import { BrInputCpfComponent, BrInputCepComponent } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrInputCpfComponent, BrInputCepComponent],
  template: `
    <br-input-cpf
      label="CPF"
      [(ngModel)]="cpf"
      [required]="true"
    ></br-input-cpf>

    <br-input-cep
      label="CEP"
      [(ngModel)]="cep"
      (cepChange)="onCepChange($event)"
    ></br-input-cep>
  `
})
export class InputsComponent {
  cpf = '';
  cep = '';

  onCepChange(cep: string) {
    // Buscar endereço por CEP...
  }
}
```

---

## Documentação interativa

**[🔗 Storybook online](https://jordaobass.github.io/ng-govbr-tw/)** — todos os
componentes, cada um com suas variações, controles ao vivo e painel de
acessibilidade.

Para rodar localmente:

```bash
git clone https://github.com/jordaobass/ng-govbr-tw.git
cd ng-govbr-tw
npm install
npm run build                              # a lib, que o Storybook consome
npx ng run ng-govbr-tw:storybook           # dev server
npx ng run ng-govbr-tw:build-storybook     # build estático em dist/storybook
```

O Storybook substituiu o antigo app de showcase: a documentação deixou de ser
uma página só, mantida à mão, e passou a sair das próprias stories — que são
também o alvo da suíte ponta a ponta.

---

## Contribuição

Contribuições são bem-vindas!

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Reportar Bugs

Abra uma issue em [github.com/jordaobass/ng-govbr-tw/issues](https://github.com/jordaobass/ng-govbr-tw/issues)

---

## Licença

MIT © [jordaobass](https://github.com/jordaobass)

---

<p align="center">
  Feito com ❤️ para a comunidade brasileira de desenvolvedores Angular
</p>
