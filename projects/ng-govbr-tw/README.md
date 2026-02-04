# @schenkerjon/ng-govbr-tw

Biblioteca Angular de componentes baseados no **Design System do Governo Federal (GovBR DS)**, estilizados com **Tailwind CSS 3**. Componentes standalone, acessíveis e prontos para produção.

Compatível com Angular 17, 18 e 19.

## Instalação

```bash
npm install @schenkerjon/ng-govbr-tw
```

### Configuração automática (recomendado)

```bash
ng add @schenkerjon/ng-govbr-tw
```

O schematic configura automaticamente:
- Preset Tailwind no `tailwind.config.js`
- Fontes Rawline e Font Awesome no `index.html`
- Import do CSS no `styles.css`

### Configuração manual

1. Adicione o preset ao `tailwind.config.js`:

```js
const govbrPreset = require('@schenkerjon/ng-govbr-tw/tailwind.preset');

module.exports = {
  presets: [govbrPreset],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@schenkerjon/ng-govbr-tw/**/*.{mjs,js}"
  ],
};
```

2. Adicione as fontes no `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;300;400;500;600;700;900&display=swap" rel="stylesheet" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
```

3. Importe o CSS base:

```css
/* styles.css */
@import '@schenkerjon/ng-govbr-tw/src/lib/styles/govbr-tw.css';
```

---

## Uso

Todos os componentes são **standalone** — importe diretamente:

```typescript
import { BrButtonComponent, BrInputComponent } from '@schenkerjon/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrButtonComponent, BrInputComponent],
})
```

---

## Sumário de Componentes

| Categoria | Componentes |
|-----------|-------------|
| **Layout** | `br-layout`, `br-header`, `br-footer`, `br-menu`, `br-menu-item`, `br-sidebar` |
| **Navegação** | `br-menu-bar`, `br-mega-menu`, `br-breadcrumb`, `br-tab`, `br-pagination` |
| **Formulários** | `br-input`, `br-select`, `br-checkbox`, `br-radio-group`, `br-textarea`, `br-datepicker`, `br-timepicker`, `br-datetimepicker` |
| **Botões** | `br-button`, `br-magic-button` |
| **Dados** | `br-table`, `br-card`, `br-item`, `br-list`, `br-badge` |
| **Feedback** | `br-message`, `br-modal`, `br-loading`, `br-tooltip` |
| **Utilitários** | `br-accordion`, `br-wizard`, `br-cookiebar` |

---

## Layout

### br-layout

Estrutura principal da aplicação. Organiza header, menu lateral (push), conteúdo e footer.

```html
<br-layout>
  <br-header
    systemTitle="Meu Sistema"
    logoSrc="assets/logo.png"
    (menuToggle)="menuOpen = $event"
  ></br-header>

  <br-menu [open]="menuOpen" (openChange)="menuOpen = $event">
    <br-menu-item label="Início" icon="house" route="/"></br-menu-item>
    <br-menu-item label="Documentos" icon="file" route="/docs"></br-menu-item>
  </br-menu>

  <div>Conteúdo da página</div>

  <br-footer logoSrc="assets/logo.png"></br-footer>
</br-layout>
```

---

### br-header

Header GovBR DS com duas linhas: logo/ações (topo) e título/busca (inferior).

```html
<br-header
  systemTitle="Nome do Sistema"
  systemSubtitle="Órgão responsável"
  logoSrc="assets/gov-logo.png"
  logoHref="/"
  signature="gov.br"
  variant="primary"
  density="medium"
  [sticky]="true"
  menuMode="sidebar"
  [showSearch]="true"
  [showLogin]="true"
  [hasLinks]="true"
  [hasFunctions]="true"
  userName="João Silva"
  userRole="Administrador"
  avatarSrc="assets/avatar.jpg"
  (menuToggle)="menuOpen = $event"
  (searchSubmit)="onSearch($event)"
  (signIn)="onLogin()"
  (logout)="onLogout()"
>
  <!-- Links de acesso rápido (dropdown ⋮) -->
  <a header-links href="/acessibilidade" class="block px-4 py-2 text-sm hover:bg-gray-50">
    Acessibilidade
  </a>
  <a header-links href="/mapa-do-site" class="block px-4 py-2 text-sm hover:bg-gray-50">
    Mapa do site
  </a>

  <!-- Funcionalidades do sistema (dropdown ⊞) -->
  <a header-functions href="/notificacoes" class="block px-4 py-2 text-sm hover:bg-gray-50">
    Notificações
  </a>

  <!-- Menu do avatar -->
  <a avatar-menu href="/perfil" class="block px-4 py-2 text-sm hover:bg-gray-50">
    Meu perfil
  </a>
</br-header>
```

| Input | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `systemTitle` | `string` | `''` | Título do sistema |
| `systemSubtitle` | `string` | — | Subtítulo (órgão, departamento) |
| `logoSrc` | `string` | `''` | URL do logo |
| `logoHref` | `string` | — | Link do logo |
| `signature` | `string` | — | Assinatura (ex: "gov.br") |
| `variant` | `'primary' \| 'white'` | `'primary'` | Tema de cores |
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamanho do header |
| `sticky` | `boolean` | `false` | Header fixo no topo |
| `menuMode` | `'sidebar' \| 'mega' \| 'none'` | `'sidebar'` | Tipo de menu |
| `showSearch` | `boolean` | `true` | Exibir busca |
| `showContrast` | `boolean` | `false` | Exibir botão de alto contraste |
| `contrastActive` | `boolean` | `false` | Alto contraste ativo |
| `showLogin` | `boolean` | `true` | Exibir botão entrar |
| `hasLinks` | `boolean` | `false` | Exibir dropdown de links rápidos |
| `hasFunctions` | `boolean` | `false` | Exibir dropdown de funcionalidades |
| `userName` | `string` | — | Nome do usuário logado |
| `userRole` | `string` | — | Cargo/papel do usuário |
| `avatarSrc` | `string` | — | URL da foto do avatar |

| Output | Tipo | Descrição |
|--------|------|-----------|
| `menuToggle` | `boolean` | Menu abriu/fechou |
| `searchSubmit` | `string` | Texto pesquisado |
| `signIn` | `void` | Clicou em "Entrar" |
| `logout` | `void` | Clicou em "Sair" |
| `contrastChange` | `boolean` | Alto contraste alterado |

**Slots de conteúdo:** `[header-links]`, `[header-functions]`, `[avatar-menu]`

---

### br-menu

Menu lateral push — quando aberto, empurra o conteúdo para o lado.

```html
<br-menu [open]="menuOpen" (openChange)="menuOpen = $event" variant="white" width="default">
  <br-menu-item label="Início" icon="house" route="/" [exact]="true"></br-menu-item>
  <br-menu-item label="Usuários" icon="users" route="/usuarios"></br-menu-item>

  <!-- Item com submenu -->
  <br-menu-item label="Configurações" icon="gear" [hasChildren]="true" [expanded]="configExpanded" (expandedChange)="configExpanded = $event">
    <br-menu-item label="Geral" route="/config/geral"></br-menu-item>
    <br-menu-item label="Segurança" route="/config/seguranca"></br-menu-item>
  </br-menu-item>

  <!-- Footer do menu -->
  <div menu-footer>
    <span class="text-xs text-gray-500">v1.0.0</span>
  </div>
</br-menu>
```

| Input | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `open` | `boolean` | `true` | Menu aberto/fechado |
| `variant` | `'white' \| 'light'` | `'white'` | Cor de fundo |
| `width` | `'narrow' \| 'default' \| 'wide'` | `'default'` | Largura (60/64/72) |
| `hasFooter` | `boolean` | `false` | Exibir área de footer |
| `ariaLabel` | `string` | `'Menu principal'` | Label de acessibilidade |

### br-menu-item

| Input | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `route` | `string \| unknown[]` | — | Rota Angular (routerLink) |
| `label` | `string` | `''` | Texto do item |
| `icon` | `string` | — | Nome Font Awesome (sem `fa-`) |
| `badge` | `string \| number` | — | Badge/contador vermelho |
| `exact` | `boolean` | `false` | routerLinkActive exato |
| `hasChildren` | `boolean` | `false` | Tem submenu |
| `expanded` | `boolean` | `false` | Submenu expandido |

---

### br-footer

```html
<br-footer logoSrc="assets/logo-footer.png">
  <div class="text-sm text-gray-600">© 2024 Governo Federal</div>
</br-footer>
```

---

## Navegação

### br-menu-bar

Barra de navegação horizontal abaixo do header.

```html
<br-menu-bar variant="primary">
  <br-menu-bar-item label="Início" icon="house" route="/"></br-menu-bar-item>
  <br-menu-bar-item label="Serviços" icon="grid" [hasSubmenu]="true">
    <br-menu-bar-sub-item label="Consulta" route="/servicos/consulta"></br-menu-bar-sub-item>
    <br-menu-bar-sub-item label="Solicitação" route="/servicos/solicitacao"></br-menu-bar-sub-item>
  </br-menu-bar-item>
</br-menu-bar>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `variant` | `'primary' \| 'dark' \| 'white'` | `'primary'` |

---

### br-mega-menu

Menu mega com colunas e categorias.

```html
<br-mega-menu variant="primary" [activePanel]="activePanel" (activePanelChange)="activePanel = $event">
  <br-mega-menu-trigger label="Serviços" panelId="servicos" icon="grid"></br-mega-menu-trigger>
  <br-mega-menu-trigger label="Institucional" panelId="institucional"></br-mega-menu-trigger>

  <br-mega-menu-panel panelId="servicos" [isActive]="activePanel === 'servicos'">
    <br-mega-menu-column title="Cidadão">
      <br-mega-menu-link label="CPF" route="/servicos/cpf" icon="id-card"></br-mega-menu-link>
      <br-mega-menu-link label="Passaporte" route="/servicos/passaporte"></br-mega-menu-link>
    </br-mega-menu-column>
  </br-mega-menu-panel>
</br-mega-menu>
```

---

### br-breadcrumb

```html
<br-breadcrumb [items]="breadcrumbs" [showHome]="true" homeRoute="/"></br-breadcrumb>
```

```typescript
import { BrBreadcrumbItem } from '@schenkerjon/ng-govbr-tw';

breadcrumbs: BrBreadcrumbItem[] = [
  { label: 'Serviços', route: '/servicos' },
  { label: 'Consulta', route: '/servicos/consulta' },
  { label: 'Resultado' },
];
```

---

### br-tab

```html
<br-tab density="medium" [activeIndex]="0" (activeIndexChange)="onTabChange($event)">
  <br-tab-panel label="Dados" icon="file">
    Conteúdo da aba Dados
  </br-tab-panel>
  <br-tab-panel label="Histórico" icon="clock" [counter]="5">
    Conteúdo da aba Histórico
  </br-tab-panel>
  <br-tab-panel label="Desativada" [disabled]="true">
    ...
  </br-tab-panel>
</br-tab>
```

| Input (br-tab) | Tipo | Padrão |
|-------|------|--------|
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `activeIndex` | `number` | `0` |
| `inverted` | `boolean` | `false` |

| Input (br-tab-panel) | Tipo | Padrão |
|-------|------|--------|
| `label` | `string` | `''` |
| `icon` | `string` | — |
| `counter` | `number` | — |
| `disabled` | `boolean` | `false` |

---

### br-pagination

```html
<br-pagination
  [page]="currentPage"
  [totalPages]="20"
  [maxVisible]="5"
  [showFirstLast]="true"
  density="medium"
  (pageChange)="currentPage = $event"
></br-pagination>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `page` | `number` | `1` |
| `totalPages` | `number` | `1` |
| `maxVisible` | `number` | `5` |
| `showFirstLast` | `boolean` | `false` |
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` |

---

## Formulários

Todos os componentes de formulário implementam `ControlValueAccessor` — funcionam com `[(ngModel)]` e `formControl`.

### br-input

```html
<br-input
  label="Nome completo"
  placeholder="Digite seu nome"
  [(ngModel)]="nome"
  [required]="true"
  icon="user"
  density="medium"
  helperText="Informe seu nome completo"
></br-input>

<!-- Com validação -->
<br-input label="E-mail" type="email" [(ngModel)]="email" error="E-mail inválido"></br-input>

<!-- Busca -->
<br-input type="search" placeholder="Pesquisar..." [(ngModel)]="busca" (searchSubmit)="pesquisar($event)"></br-input>

<!-- Arquivo -->
<br-input label="Documento" type="file" (fileSelected)="onFile($event)"></br-input>
```

| Input | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `label` | `string` | — | Rótulo do campo |
| `type` | `string` | `'text'` | text, email, password, number, search, file, select, textarea |
| `placeholder` | `string` | `''` | Placeholder |
| `required` | `boolean` | `false` | Obrigatório |
| `error` | `string` | — | Mensagem de erro |
| `successMessage` | `string` | — | Mensagem de sucesso |
| `warningMessage` | `string` | — | Mensagem de aviso |
| `helperText` | `string` | — | Texto auxiliar |
| `icon` | `string` | — | Ícone Font Awesome |
| `iconRight` | `boolean` | `false` | Ícone à direita |
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamanho |
| `highlight` | `boolean` | `false` | Destaque visual |
| `maxLength` | `number` | — | Máximo de caracteres |

---

### br-select

```html
<br-select
  label="Estado"
  placeholder="Selecione o estado"
  [(ngModel)]="estado"
  [options]="estados"
  [searchable]="true"
  [required]="true"
></br-select>

<!-- Seleção múltipla -->
<br-select label="Categorias" [(ngModel)]="categorias" [options]="categoriasOpts" [multiple]="true"></br-select>
```

```typescript
import { BrSelectOption } from '@schenkerjon/ng-govbr-tw';

estados: BrSelectOption[] = [
  { label: 'São Paulo', value: 'SP' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Minas Gerais', value: 'MG' },
];
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `label` | `string` | — |
| `placeholder` | `string` | `'Selecione'` |
| `options` | `BrSelectOption[]` | `[]` |
| `required` | `boolean` | `false` |
| `error` | `string` | — |
| `multiple` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` |

---

### br-checkbox

```html
<br-checkbox label="Aceito os termos de uso" [(ngModel)]="aceitoTermos"></br-checkbox>

<br-checkbox label="Selecionar todos" [indeterminate]="algumSelecionado" [(ngModel)]="todosSelecionados"></br-checkbox>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `label` | `string` | — |
| `indeterminate` | `boolean` | `false` |
| `error` | `string` | — |
| `size` | `'default' \| 'small'` | `'default'` |
| `state` | `'default' \| 'valid' \| 'invalid'` | `'default'` |

---

### br-radio-group

```html
<br-radio-group
  legend="Tipo de pessoa"
  [(ngModel)]="tipoPessoa"
  [options]="tipoPessoaOpts"
  [inline]="true"
></br-radio-group>
```

```typescript
import { BrRadioOption } from '@schenkerjon/ng-govbr-tw';

tipoPessoaOpts: BrRadioOption[] = [
  { label: 'Pessoa Física', value: 'PF' },
  { label: 'Pessoa Jurídica', value: 'PJ' },
];
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `legend` | `string` | — |
| `options` | `BrRadioOption[]` | `[]` |
| `required` | `boolean` | `false` |
| `error` | `string` | — |
| `inline` | `boolean` | `false` |
| `size` | `'default' \| 'small'` | `'default'` |

---

### br-textarea

```html
<br-textarea
  label="Observações"
  placeholder="Digite suas observações..."
  [(ngModel)]="observacoes"
  [rows]="5"
  [maxLength]="500"
  helperText="Máximo de 500 caracteres"
  resizable="vertical"
></br-textarea>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `label` | `string` | — |
| `placeholder` | `string` | `''` |
| `rows` | `number` | `4` |
| `maxLength` | `number` | — |
| `helperText` | `string` | — |
| `error` | `string` | — |
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `resizable` | `'none' \| 'vertical' \| 'both'` | `'vertical'` |

---

### br-datepicker

Seletor de data com calendário dropdown. Valor no formato `"dd/mm/aaaa"`.

```html
<br-datepicker
  label="Data de nascimento"
  [(ngModel)]="dataNascimento"
  [required]="true"
  hint="Formato: dd/mm/aaaa"
></br-datepicker>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `label` | `string` | — |
| `placeholder` | `string` | `'dd/mm/aaaa'` |
| `hint` | `string` | — |
| `error` | `string` | — |
| `required` | `boolean` | `false` |
| `block` | `boolean` | `true` |

---

### br-timepicker

Seletor de hora com painel de horas e minutos. Valor no formato `"HH:MM"`.

```html
<br-timepicker label="Horário" [(ngModel)]="horario" [step]="15"></br-timepicker>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `label` | `string` | — |
| `placeholder` | `string` | `'HH:MM'` |
| `step` | `number` | `5` |
| `hint` | `string` | — |
| `error` | `string` | — |
| `required` | `boolean` | `false` |

---

### br-datetimepicker

Composição de `br-datepicker` + `br-timepicker`. Valor no formato `"dd/mm/aaaa HH:MM"`.

```html
<br-datetimepicker
  label="Agendamento"
  [(ngModel)]="agendamento"
  [minuteStep]="15"
  layout="horizontal"
></br-datetimepicker>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `label` | `string` | — |
| `dateLabel` | `string` | `'Data'` |
| `timeLabel` | `string` | `'Hora'` |
| `minuteStep` | `number` | `5` |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `hint` | `string` | — |
| `dateError` | `string` | — |
| `timeError` | `string` | — |

---

## Botões

### br-button

Botão seguindo o padrão GovBR DS com suporte a emphasis, density, modo escuro e mais.

```html
<!-- Emphasis (ênfase) -->
<br-button emphasis="primary" (clicked)="salvar()">Salvar</br-button>
<br-button emphasis="secondary" icon="download">Download</br-button>
<br-button emphasis="tertiary" icon="trash">Excluir</br-button>
<br-button emphasis="danger" icon="warning">Remover</br-button>

<!-- Density (densidade) -->
<br-button emphasis="primary" density="small">Pequeno</br-button>
<br-button emphasis="primary" density="medium">Médio</br-button>
<br-button emphasis="primary" density="large">Grande</br-button>

<!-- Circular (icon-only) -->
<br-button emphasis="primary" [circle]="true" icon="plus" density="large"></br-button>

<!-- Block (largura total) -->
<br-button emphasis="primary" [block]="true">Largura total</br-button>

<!-- Loading -->
<br-button emphasis="primary" [loading]="salvando">Salvando...</br-button>

<!-- Modo escuro (para fundos escuros) -->
<br-button emphasis="primary" [dark]="true">Modo escuro</br-button>
<br-button emphasis="secondary" [dark]="true">Outlined escuro</br-button>

<!-- Ícone à direita -->
<br-button emphasis="primary" icon="arrow-right" iconPosition="right">Próximo</br-button>

<!-- Estado ativo -->
<br-button emphasis="primary" [active]="true">Ativo</br-button>
```

| Input | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `emphasis` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'primary'` | Nível de ênfase: primary (preenchido), secondary (outlined), tertiary (somente texto), danger |
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` | Densidade/tamanho |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo do botão HTML |
| `icon` | `string` | — | Ícone Font Awesome (sem `fa-`) |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posição do ícone |
| `circle` | `boolean` | `false` | Botão circular (icon-only) |
| `block` | `boolean` | `false` | Largura total |
| `loading` | `boolean` | `false` | Estado de carregamento com spinner |
| `disabled` | `boolean` | `false` | Desabilitado |
| `active` | `boolean` | `false` | Estado ativo/pressionado |
| `dark` | `boolean` | `false` | Modo escuro (cores invertidas para fundos escuros) |

> **Backward compatibility:** `variant` e `size` ainda funcionam como aliases para `emphasis` e `density`.

---

### br-magic-button

Botão flutuante (FAB) com speed dial de ações rápidas.

```html
<!-- FAB simples -->
<br-magic-button icon="plus" (fabClick)="criarNovo()"></br-magic-button>

<!-- FAB com ações -->
<br-magic-button icon="plus" [actions]="acoes" position="bottom-right" (actionClick)="onAction($event)"></br-magic-button>
```

```typescript
import { BrMagicAction } from '@schenkerjon/ng-govbr-tw';

acoes: BrMagicAction[] = [
  { id: 'doc', label: 'Novo documento', icon: 'file' },
  { id: 'foto', label: 'Tirar foto', icon: 'camera' },
  { id: 'msg', label: 'Nova mensagem', icon: 'envelope' },
];
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `icon` | `string` | `'plus'` |
| `actions` | `BrMagicAction[]` | `[]` |
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` |
| `size` | `'medium' \| 'large'` | `'large'` |
| `position` | `'bottom-right' \| 'bottom-left' \| 'bottom-center'` | `'bottom-right'` |
| `showLabels` | `boolean` | `true` |

---

## Dados

### br-card

```html
<!-- Card com imagem -->
<br-card
  cardTitle="Título"
  subtitle="Descrição breve"
  imageSrc="assets/imagem.jpg"
  imageRatio="16:9"
  tag="Novo"
  linkText="Ver mais"
  linkRoute="/detalhes"
></br-card>

<!-- Card horizontal -->
<br-card layout="horizontal" cardTitle="Documento" imageSrc="assets/thumb.jpg"></br-card>

<!-- Card com ícone e footer customizado -->
<br-card cardTitle="Estatísticas" icon="chart-bar">
  <p class="text-2xl font-bold">1.234</p>
  <div card-footer>
    <a href="#">Ver relatório</a>
  </div>
</br-card>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `cardTitle` | `string` | — |
| `subtitle` | `string` | — |
| `icon` | `string` | — |
| `tag` | `string` | — |
| `imageSrc` | `string` | — |
| `imageAlt` | `string` | — |
| `imageRatio` | `'16:9' \| '4:3' \| '1:1'` | `'16:9'` |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` |
| `linkText` | `string` | — |
| `linkRoute` | `string \| unknown[]` | — |
| `clickable` | `boolean` | `false` |

**Slots:** `[card-footer]`

---

### br-table

```html
<br-table headerVariant="blue" [page]="page" [totalPages]="10" (pageChange)="page = $event">
  <thead>
    <tr><th>Nome</th><th>E-mail</th><th>Status</th></tr>
  </thead>
  <tbody>
    @for (u of users; track u) {
    <tr>
      <td>{{ u.nome }}</td>
      <td>{{ u.email }}</td>
      <td><br-badge [variant]="u.ativo ? 'success' : 'danger'">{{ u.ativo ? 'Ativo' : 'Inativo' }}</br-badge></td>
    </tr>
    }
  </tbody>
</br-table>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `headerVariant` | `'blue' \| 'light'` | `'blue'` |
| `page` | `number` | `1` |
| `totalPages` | `number` | `1` |

---

### br-badge

```html
<br-badge variant="success">Ativo</br-badge>
<br-badge variant="danger">Inativo</br-badge>
<br-badge variant="warning">Pendente</br-badge>
<br-badge variant="neutral">Rascunho</br-badge>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `variant` | `'primary' \| 'success' \| 'danger' \| 'warning' \| 'neutral'` | `'primary'` |

---

### br-item / br-list

Lista estruturada de itens.

```html
<br-list title="Documentos recentes" variant="card">
  <br-item
    title="Relatório Anual 2024"
    subtitle="Atualizado em 15/01/2024"
    icon="file-pdf"
    tag="PDF"
    [clickable]="true"
    [showArrow]="true"
    (itemClick)="abrirDoc('relatorio')"
  >
    <span item-meta class="text-xs text-gray-500">2.4 MB</span>
  </br-item>

  <br-item
    title="João da Silva"
    subtitle="Analista de Sistemas"
    avatarSrc="assets/avatar.jpg"
    [clickable]="true"
  >
    <div item-actions>
      <br-button density="small" emphasis="secondary" icon="envelope" [circle]="true"></br-button>
    </div>
  </br-item>
</br-list>
```

**br-list:**

| Input | Tipo | Padrão |
|-------|------|--------|
| `title` | `string` | — |
| `subtitle` | `string` | — |
| `variant` | `'default' \| 'bordered' \| 'card'` | `'default'` |
| `role` | `'list' \| 'listbox' \| 'menu'` | `'list'` |

**br-item:**

| Input | Tipo | Padrão |
|-------|------|--------|
| `title` | `string` | `''` |
| `subtitle` | `string` | — |
| `icon` | `string` | — |
| `avatarSrc` | `string` | — |
| `tag` | `string` | — |
| `clickable` | `boolean` | `false` |
| `showArrow` | `boolean` | `false` |
| `selected` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `variant` | `'default' \| 'compact'` | `'default'` |

**Slots:** `[item-meta]`, `[item-actions]`

---

## Feedback

### br-message

```html
<br-message type="info" title="Informação">Sua solicitação foi recebida.</br-message>
<br-message type="success" [dismissible]="true">Cadastro realizado!</br-message>
<br-message type="warning" [autoDismiss]="5000" title="Atenção">Sessão expira em breve.</br-message>
<br-message type="danger" title="Erro">Falha ao processar.</br-message>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `type` | `'success' \| 'danger' \| 'warning' \| 'info'` | `'info'` |
| `title` | `string` | — |
| `dismissible` | `boolean` | `false` |
| `autoDismiss` | `number` | — |

**Método público:** `show()` — reexibe a mensagem após dismiss.

---

### br-modal

```html
<br-modal
  [isOpen]="modalAberto"
  title="Confirmar exclusão"
  size="small"
  primaryText="Excluir"
  (confirmed)="excluir()"
  (canceled)="modalAberto = false"
  (closed)="modalAberto = false"
>
  <p>Tem certeza que deseja excluir?</p>
</br-modal>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `isOpen` | `boolean` | `false` |
| `title` | `string` | `''` |
| `size` | `'xsmall' \| 'small' \| 'medium' \| 'large' \| 'auto'` | `'medium'` |
| `showCloseButton` | `boolean` | `true` |
| `primaryText` | `string` | `'Confirmar'` |
| `cancelText` | `string` | `'Cancelar'` |
| `primaryDisabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `closeOnScrim` | `boolean` | `true` |
| `closeOnEscape` | `boolean` | `true` |
| `hasCustomFooter` | `boolean` | `false` |

**Slot:** `[modal-footer]` — footer customizado (com `[hasCustomFooter]="true"`)

---

### br-loading

```html
<br-loading size="medium"></br-loading>
<br-loading [progress]="75" [showPercentage]="true" label="Carregando..."></br-loading>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `progress` | `number` | — |
| `showPercentage` | `boolean` | `true` |
| `label` | `string` | — |

---

### br-tooltip

```html
<br-tooltip text="Informação adicional" place="top">
  <i class="fa-solid fa-circle-info"></i>
</br-tooltip>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `text` | `string` | `''` |
| `place` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `variant` | `'info' \| 'success' \| 'danger' \| 'warning'` | `'info'` |
| `timer` | `number` | — |

---

## Utilitários

### br-accordion

```html
<br-accordion mode="single" [bordered]="true">
  <br-accordion-item title="Seção 1" icon="file" [open]="true">
    Conteúdo da seção 1.
  </br-accordion-item>
  <br-accordion-item title="Seção 2" badge="3">
    Conteúdo da seção 2.
  </br-accordion-item>
</br-accordion>
```

| Input (accordion) | Tipo | Padrão |
|-------|------|--------|
| `mode` | `'single' \| 'multiple'` | `'multiple'` |
| `variant` | `'default' \| 'negative'` | `'default'` |
| `bordered` | `boolean` | `true` |

| Input (item) | Tipo | Padrão |
|-------|------|--------|
| `title` | `string` | `''` |
| `icon` | `string` | — |
| `badge` | `string \| number` | — |
| `open` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `density` | `'small' \| 'medium' \| 'large'` | `'medium'` |

---

### br-wizard

Stepper para fluxos multi-etapas.

```html
<br-wizard [currentStep]="step" (stepChange)="step = $event" (complete)="onComplete()">
  <br-wizard-step label="Dados Pessoais" icon="user">
    <br-input label="Nome" [(ngModel)]="nome"></br-input>
    <br-input label="CPF" [(ngModel)]="cpf"></br-input>
  </br-wizard-step>

  <br-wizard-step label="Endereço" icon="location-dot">
    <br-input label="CEP" [(ngModel)]="cep"></br-input>
  </br-wizard-step>

  <br-wizard-step label="Confirmação" icon="check">
    <p>Revise seus dados antes de enviar.</p>
  </br-wizard-step>
</br-wizard>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `currentStep` | `number` | `0` |
| `variant` | `'simple' \| 'numbered'` | `'numbered'` |
| `showNavigation` | `boolean` | `true` |
| `allowJump` | `boolean` | `false` |

| Output | Tipo |
|--------|------|
| `stepChange` | `number` |
| `complete` | `void` |

**Métodos públicos:** `next()`, `previous()`, `goToStep(index)`

---

### br-cookiebar

Barra de consentimento de cookies (LGPD).

```html
<br-cookiebar
  [(visible)]="showCookies"
  [cookieGroups]="cookieGroups"
  (acceptAll)="onAcceptAll()"
  (acceptSelected)="onAcceptSelected($event)"
  (reject)="onReject()"
>
  <p>
    Este site utiliza cookies para melhorar sua experiência.
    <a href="/politica" class="underline font-semibold">Política de Privacidade</a>.
  </p>
</br-cookiebar>
```

```typescript
import { BrCookieGroup } from '@schenkerjon/ng-govbr-tw';

cookieGroups: BrCookieGroup[] = [
  { id: 'essential', label: 'Essenciais', description: 'Necessários para o site funcionar.', required: true, enabled: true },
  { id: 'analytics', label: 'Analíticos', description: 'Nos ajudam a entender o uso do site.', enabled: false },
  { id: 'marketing', label: 'Marketing', description: 'Exibir anúncios relevantes.', enabled: false },
];
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `visible` | `boolean` | `false` |
| `cookieGroups` | `BrCookieGroup[]` | `[]` |

| Output | Tipo |
|--------|------|
| `acceptAll` | `void` |
| `acceptSelected` | `BrCookieGroup[]` |
| `reject` | `void` |
| `visibleChange` | `boolean` |

---

## Sidebar (alternativa ao br-menu)

Para layouts com sidebar colapsável estilo shadcn:

```html
<br-sidebar [collapsed]="collapsed" (collapsedChange)="collapsed = $event" [collapsible]="true" [hasHeader]="true">
  <div sidebar-header>Logo</div>

  <br-sidebar-group>
    <br-sidebar-group-label>Menu</br-sidebar-group-label>
    <br-sidebar-item label="Dashboard" icon="gauge" route="/dashboard"></br-sidebar-item>
    <br-sidebar-item label="Relatórios" icon="chart-bar" route="/relatorios" badge="5"></br-sidebar-item>
    <br-sidebar-sub label="Configurações" icon="gear" [open]="true">
      <br-sidebar-item label="Geral" route="/config/geral"></br-sidebar-item>
    </br-sidebar-sub>
  </br-sidebar-group>

  <div sidebar-footer>Footer</div>
</br-sidebar>
```

| Input | Tipo | Padrão |
|-------|------|--------|
| `collapsed` | `boolean` | `false` |
| `collapsible` | `boolean` | `true` |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` |
| `hasHeader` | `boolean` | `false` |
| `hasFooter` | `boolean` | `false` |
| `mobileOpen` | `boolean` | `false` |

---

## Tokens de Cor

| Token | Cor |
|-------|-----|
| `govbr-primary` | `#1351b4` |
| `govbr-primary-dark` | `#0c326f` |
| `govbr-primary-darkest` | `#071d41` |
| `govbr-primary-light` | `#c5d4eb` |
| `govbr-primary-lightest` | `#dbe8fb` |
| `govbr-success` | `#168821` |
| `govbr-danger` | `#e52207` |
| `govbr-warning` | `#ffcd07` |
| `govbr-info` | `#155bcb` |
| `govbr-focus` | `#c2850c` |

---

## Exemplo Completo

```typescript
import { Component } from '@angular/core';
import {
  BrLayoutComponent, BrHeaderComponent, BrMenuComponent,
  BrMenuItemComponent, BrFooterComponent, BrCardComponent,
} from '@schenkerjon/ng-govbr-tw';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BrLayoutComponent, BrHeaderComponent, BrMenuComponent,
    BrMenuItemComponent, BrFooterComponent, BrCardComponent,
  ],
  template: `
    <br-layout>
      <br-header
        systemTitle="Portal de Serviços"
        systemSubtitle="Ministério da Economia"
        logoSrc="assets/gov-logo.png"
        (menuToggle)="menuOpen = $event"
        (searchSubmit)="onSearch($event)"
      ></br-header>

      <br-menu [open]="menuOpen" (openChange)="menuOpen = $event">
        <br-menu-item label="Início" icon="house" route="/" [exact]="true"></br-menu-item>
        <br-menu-item label="Serviços" icon="grid" route="/servicos"></br-menu-item>
        <br-menu-item label="Documentos" icon="file" route="/docs" badge="3"></br-menu-item>
      </br-menu>

      <div class="max-w-4xl mx-auto">
        <h2 class="text-xl font-bold mb-4">Bem-vindo</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <br-card cardTitle="Consultar CPF" icon="id-card" linkText="Acessar" linkRoute="/cpf"></br-card>
          <br-card cardTitle="Emitir certidão" icon="file-certificate" linkText="Acessar" linkRoute="/certidao"></br-card>
        </div>
      </div>

      <br-footer logoSrc="assets/gov-logo.png"></br-footer>
    </br-layout>
  `,
})
export class AppComponent {
  menuOpen = true;
  onSearch(query: string) { console.log('Busca:', query); }
}
```

---

## Licença

MIT
