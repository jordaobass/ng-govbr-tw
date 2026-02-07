# Changelog

## [1.0.0] - 2026-02-07

### Adicionado

- **Sistema de Animações** — Arquitetura completa e configurável:
  - `BrAnimationService` — Serviço central com configuração global
  - `BrAnimateDirective` — Diretiva para animar qualquer elemento
  - `BrSuccessCheckComponent` — Checkmark animado para feedback
  - Animações desabilitadas por padrão (opt-in)
  - Respeita `prefers-reduced-motion` automaticamente
  - 20+ keyframes: fadeIn, scaleIn, slideIn, pulse, shake, bounce, shimmer, etc.

- **Interfaces de Animação** — Tipos TypeScript completos:
  - `BrAnimationType`, `BrAnimationConfig`, `BrTransitionConfig`
  - `BrAnimationEasing`, `BrAnimationDuration`
  - `BrAnimationTrigger`: immediate, visible, hover, focus, click, manual
  - `BrStaggerConfig` para animações em sequência

### Melhorado

- **`br-accordion`** — Animação de collapse/expand suave no painel
- **`br-modal`** — Animação de entrada fade+scale no modal e backdrop
- **`br-tooltip`** — Animação de entrada com fade+translate
- **`br-skeleton`** — Nova animação shimmer (além de pulse e wave)
- **`br-button`** — Novo input `hoverEffect` com opções: `lift`, `grow`, `none`
- **`br-card`** — Novo input `hoverEffect` com opções: `lift`, `glow`, `shadow`, `none`

### Como habilitar animações

```typescript
// No módulo principal ou providers
import { BR_ANIMATION_CONFIG } from '@schenkerjon/ng-govbr-tw';

providers: [
  {
    provide: BR_ANIMATION_CONFIG,
    useValue: { enabled: true }
  }
]

// Ou programaticamente
constructor(private animationService: BrAnimationService) {
  this.animationService.enable();
}
```

## [0.5.1] - 2026-02-07

### Adicionado

- **`br-notification` (novo)** — Badge de notificação (contador no ícone):
  - Contador numérico com máximo configurável (ex: `99+`)
  - Modo dot (apenas ponto)
  - Variantes: `danger`, `warning`, `success`, `info`, `primary`
  - Posições: `top-right`, `top-left`, `bottom-right`, `bottom-left`
  - Animação pulse opcional

- **`br-signin` (novo)** — Botão "Entrar com Gov.br":
  - Identidade visual oficial Gov.br
  - Variantes: `primary` (azul), `secondary` (branco), `dark` (azul escuro)
  - Tamanhos: `small`, `medium`, `large`
  - Loading state com spinner
  - Logo Gov.br integrado

### Acessibilidade

- Adicionadas regras de alto contraste para `br-notification` e `br-signin`

## [0.5.0] - 2026-02-07

### Adicionado

- **`br-timeline` (novo)** — Componente de linha do tempo com estados:
  - Status: `completed`, `current`, `pending`
  - Orientação vertical ou horizontal
  - Ícones customizáveis
  - Suporte a data e descrição

- **`br-switch` (novo)** — Toggle on/off estilo Gov.br:
  - Suporte a ReactiveForms e ngModel
  - Tamanhos: `small`, `medium`
  - Label opcional

- **`br-chip` (novo)** — Tags/chips selecionáveis:
  - Variantes: `default`, `primary`, `success`, `warning`, `danger`, `info`
  - Tamanhos: `small`, `medium`, `large`
  - Selecionável com `selectable`
  - Removível com `removable`

- **`br-divider` (novo)** — Linha divisória:
  - Variantes: `solid`, `dashed`, `dotted`
  - Texto central opcional
  - Orientação horizontal ou vertical

- **`br-stepper` (novo)** — Indicador de etapas (diferente do wizard):
  - Orientação horizontal ou vertical
  - Modo compacto
  - Clicável para navegação
  - Etapas opcionais

- **`br-input-telefone` (novo)** — Input especializado para telefone:
  - Máscara automática: `(XX) XXXXX-XXXX` (celular) ou `(XX) XXXX-XXXX` (fixo)
  - Validação de DDD (11-99) e primeiro dígito de celular (9)
  - Suporte a ReactiveForms e ngModel

- **`br-input-cep` (novo)** — Input especializado para CEP:
  - Máscara automática: `XXXXX-XXX`
  - Busca automática via ViaCEP API
  - Output `addressFound` com dados do endereço
  - Suporte a ReactiveForms e ngModel

- **`br-input-money` (novo)** — Input monetário:
  - Máscara brasileira: `R$ 1.234,56`
  - Prefixo configurável
  - Validação de min/max
  - Valor armazenado em centavos para precisão

### Melhorado

- **`br-pagination`** — Melhorias para uso em sistemas:
  - Novo input `showItemsPerPage` com seletor de itens por página
  - Novo input `showSummary` exibe "Mostrando X-Y de Z"
  - Input `itemsPerPageOptions` para customizar opções
  - Output `itemsPerPageChange` para paginação server-side

### Acessibilidade

- Adicionadas regras de alto contraste para todos os novos componentes
- Timeline, Switch, Chip, Stepper, Divider e Pagination com suporte completo

## [0.4.1] - 2026-02-07

### Corrigido

- **Alto Contraste — `br-sidebar`** — Corrigido suporte a modo de alto contraste:
  - Fundo escuro (#111) para o container
  - Item ativo com fundo branco e texto preto
  - Hover com destaque amarelo
  - Labels de grupo visíveis

- **Alto Contraste — `br-table`** — Corrigido suporte a modo de alto contraste:
  - Header com fundo branco e texto preto (independente do headerStyle)
  - Linhas com fundo preto e texto branco
  - Zebrado com cinza escuro (#111)
  - Linha selecionada com borda amarela de destaque

## [0.4.0] - 2026-02-06

### Adicionado

- **`br-header` — Propriedade `fullWidth`** — Quando `true`, o conteúdo ocupa 100% da largura. Quando `false` (padrão), limita a 1280px e centraliza.

- **`br-table` — Modo responsivo cards** — Nova propriedade `responsive` com valores:
  - `scroll` (padrão): scroll horizontal no mobile
  - `cards`: transforma linhas em cards no mobile

  Uso:
  ```html
  <br-table responsive="cards">
    <thead>...</thead>
    <tbody>
      <tr>
        <td data-label="Nome">João</td>
        <td data-label="Email">joao@email.com</td>
      </tr>
    </tbody>
  </br-table>
  ```

## [0.3.1] - 2026-02-06

### Corrigido

- **`br-toast`** — Ajustado para seguir o padrão visual Gov.br:
  - Border-left de 4px colorida (ao invés de borda completa)
  - Fundos suaves (green-50, red-50, amber-50, blue-50)
  - Ícones padronizados: `fa-circle-check`, `fa-circle-xmark`, `fa-triangle-exclamation`, `fa-circle-info`
  - Consistente com o componente `br-message`

## [0.3.0] - 2026-02-06

### Adicionado

- **`br-toast` (novo)** — Sistema de notificações toast no estilo Gov.br:
  - `BrToastService` — Service injetável com métodos `success()`, `danger()`, `warning()`, `info()`
  - `BrToastContainerComponent` — Container para renderizar os toasts
  - Suporte a título, auto-dismiss configurável, botão de fechar
  - 6 posições disponíveis: `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`
  - Animação de slide-in

- **`br-input-cpf` (novo)** — Input especializado para CPF:
  - Máscara automática: `000.000.000-00`
  - Validação de dígitos verificadores integrada
  - Erros automáticos: `required`, `cpfIncomplete`, `cpfInvalid`
  - Suporte a ReactiveForms e ngModel

- **`br-input-cnpj` (novo)** — Input especializado para CNPJ:
  - Máscara automática: `00.000.000/0000-00`
  - Validação de dígitos verificadores integrada
  - Erros automáticos: `required`, `cnpjIncomplete`, `cnpjInvalid`
  - Suporte a ReactiveForms e ngModel

### Testes

- Adicionados 44 testes unitários para os novos componentes (Toast, CPF, CNPJ)

## [0.2.1] - 2026-02-06

### Melhorado

- **`br-input`, `br-select`, `br-textarea` — Validação automática com Angular Forms** — Agora detectam erros de validators automaticamente quando usados com `formControlName` ou `ngModel`. O erro só aparece quando o campo **específico** está inválido E foi tocado/modificado (não mais quando o form inteiro é inválido). Mensagens padrão incluídas:
  - `required`: "Campo obrigatório"
  - `email`: "Email inválido"
  - `minlength`: "Mínimo de X caracteres"
  - `maxlength`: "Máximo de X caracteres"
  - `min`/`max`: "Valor mínimo/máximo: X"
  - `pattern`: "Formato inválido"
- **Novo input `errorMessages`** — Permite customizar mensagens de erro por validator:
  ```html
  <br-input formControlName="cpf" [errorMessages]="{ pattern: 'CPF inválido' }">
  ```

## [0.2.0] - 2026-02-06

### Adicionado

- **`br-table` — Propriedade `headerStyle`** — Nova propriedade para escolher o estilo do header da tabela com 3 opções:
  - `primary` (default): Azul Gov.br #1351b4 (blue-warm-vivid-70)
  - `secondary`: Azul escuro #0c326f (blue-warm-vivid-80)
  - `light`: Fundo branco com texto azul
- **Showcase** — Secao de tabela atualizada com exemplos das 3 variantes de header.

### Alterado

- **`br-table`** — Propriedade `headerVariant` renomeada para `headerStyle` (breaking change para quem usava `headerVariant="light"`).

## [0.1.0] - 2026-02-05

### Corrigido

- **`br-breadcrumb` — Alinhamento vertical** — Icone home, chevrons separadores e texto dos itens agora ficam alinhados verticalmente no centro. Adicionado `leading-none` e `inline-flex items-center` em todos os elementos internos.

## [0.0.5] - 2026-02-04

### Adicionado

- **`br-upload`** (novo) — Componente de upload de arquivos com drag & drop, preview de imagens, lista de arquivos com icone por tipo, barra de progresso, remocao individual e suporte a `ControlValueAccessor` (ngModel/ReactiveForms). Inputs: `multiple`, `maxSizeMB`, `maxFiles`, `accept`.
- **`br-avatar`** (novo) — Avatar de usuario com imagem ou iniciais automaticas. Suporta 5 tamanhos (xsmall a xlarge), 5 variantes de cor e indicador de status (online/offline/busy/away).
- **`br-skeleton`** (novo) — Placeholder de loading com 5 variantes: `line`, `circle`, `card`, `table` e `list`. Animacao de pulse integrada. Configuravel com `rows` e `cols`.

### Melhorado

- **`br-modal` — Variantes de confirmacao** — Novo input `variant` com valores `default`, `danger`, `warning` e `success`. Cada variante adiciona icone no header e colore o botao primario automaticamente. Ex: `variant="danger"` mostra icone de alerta e botao vermelho.
- **`br-table` — Selecao de linhas** — Novo input `selectable` e output `selectionChange`. Metodos publicos: `toggleRow(id)`, `toggleAll(ids)`, `isSelected(id)`, `isAllSelected(ids)`, `clearSelection()`. Barra de selecao com contagem aparece automaticamente.
- **Showcase** — Adicionadas secoes para avatar, upload, skeleton e modais com variantes (danger, success).

### Documentacao

- **MELHORIAS.md** — Reescrito com tabela completa dos 35 componentes, diferenciais da lib e roadmap organizado por prioridade.

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
