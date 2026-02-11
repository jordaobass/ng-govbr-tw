# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [1.4.0] - 2026-02-10

### Adicionado — suíte ponta a ponta (`testes/`)

- Playwright sobre o showcase **buildado**, com Dockerfile e docker-compose
  próprios. 13 testes que cobrem o que build verde e unitário não pegam.
- `cobertura.spec.ts` deriva a lista de componentes **do código-fonte**: todo
  seletor declarado precisa aparecer renderizado no demo. Componente novo entra
  no teste sozinho.
- O teste do toast é o **canário do `OnPush`**: o toast muda estado por
  `setTimeout`, fora de evento de template — exatamente o que `OnPush` quebra
  em silêncio.

### Corrigido — encontrado pela suíte nova

- **`br-menu-bar-item`: o submenu não abria por clique para quem usa mouse.**
  O ponteiro passa por cima antes do clique, o `mouseenter` abria e o clique
  alternava de volta para fechado. Medido: hover → aberto; hover + clique →
  fechado; teclado → aberto. O clique logo após o hover agora confirma a
  abertura; do segundo em diante volta a alternar, preservando o toque.

### Adicionado — showcase

- Seções para os componentes que nunca eram renderizados: `toast`, `menu`,
  `menu-bar`, `success-check`, `skiplink` e `layout`; `br-sidebar-group` entrou
  no exemplo de sidebar. Dos 64 seletores da lib, os 64 agora aparecem no demo.
- `br-toast-container` e `br-skiplink` montados na casca da aplicação, que é
  onde eles realmente vivem.
- O toggle de contraste do showcase passa a usar o `BrContrastService` da
  biblioteca. Antes o demo tinha a própria cópia: a vitrine provava código que
  não vai para ninguém, enquanto o do pacote nunca era exercitado.

> A tag `v1.3.0` marca o commit `7f74029`, que trouxe o tema de alto contraste
> e nunca chegou ao npm — o `latest` parou na 1.2.7, de 08/02. Esta 1.4.0 vai
> publicada junto.

### Corrigido — defeitos que estavam invisíveis porque a suíte não rodava

- **`ng test` não compilava.** Três specs usavam `jest.spyOn` num projeto
  karma+jasmine, sem `jest` nas dependências: 5 erros `TS2304` derrubavam o
  build de teste inteiro, então **nenhum** dos 122 testes executava. Trocado por
  `spyOn` do jasmine. Com a suíte no ar, apareceram 6 falhas reais:
- **`br-input-cep`**: `writeValue` não limitava a 8 dígitos, enquanto `onInput`
  limitava. Formulário preenchido por código guardava CEP de 13 dígitos.
- **`br-input-money`**: `writeValue` adivinhava a unidade pela grandeza do
  número (`> 100` = centavos, senão reais) e multiplicava por 100 todo valor
  até 100 — `writeValue(100)` virava R$ 100,00 em vez de R$ 1,00. A unidade
  agora é declarada no novo `@Input() valueUnit: 'cents' | 'reais'` (padrão
  `cents`, que é a unidade interna de `value`/`valueInReais`).
- Quatro testes de `br-switch`, `br-divider` e `br-stepper` consultavam o DOM
  por `querySelector('span')`/`div > div` e casavam com o elemento errado. Os
  componentes estavam certos; os seletores foram corrigidos.
- `eslint` também estava vermelho: `no-case-declarations` em `br-mega-menu`.

### Corrigido — acessibilidade

- **Erro de validação agora é anunciado** em `br-input`, `br-textarea`,
  `br-input-cpf` e `br-input-cnpj`: `aria-invalid`, `role="alert"` e
  `aria-describedby` apontando para elemento que existe. Telefone, CEP e money
  já tinham — a correção havia sido aplicada em 3 das 7 cópias.
- **`br-modal` ganhou gestão de foco** (WCAG 2.4.3): foco inicial no diálogo,
  *focus trap* em Tab/Shift+Tab e devolução ao gatilho ao fechar. O componente
  anunciava `role="dialog"` + `aria-modal` sem uma única chamada a `focus()`.
  O backdrop deixou de ser `role="button"`/`tabindex="0"`.
- **Ícone de aviso do modal** usava amarelo puro sobre fundo claro: 1,50:1,
  abaixo até do mínimo de 3:1 da WCAG 1.4.11 para gráfico significativo.
- **Novo `br-skiplink`** — "ir para o conteúdo", exigido pelo Gov.br DS/eMAG.

### Corrigido — tema de alto contraste alcançava só parte dos componentes

- 11 componentes usavam a paleta padrão do Tailwind (`bg-red-50`, `bg-green-50`,
  `text-red-800`...) e 140 usos de `bg-white`/`text-white`. O
  `govbr-contrast.css` remapeava só variáveis `--govbr-*`, então toast, modal e
  mensagens **não mudavam de cor** no alto contraste. Medido no navegador: 11 de
  13 classes presas no tema claro antes; 16 de 16 respondem depois.
- O `tailwind.preset.js` tinha hex literal, então `bg-govbr-primary` compilava
  cor estática e o tema precisava de 311 `!important` para furar. Agora aponta
  para canais RGB (`rgb(var(--govbr-primary-rgb) / <alpha-value>)`), preservando
  o modificador de opacidade e com fallback embutido.
- Toda cor fora de token foi eliminada dos componentes: 0 classes da paleta
  padrão, 0 `-white`, 0 hex arbitrário.

### Adicionado

- **`BrContrastService`** (exportado): liga/desliga/alterna o alto contraste,
  **persiste em `localStorage`** e é seguro em SSR. Antes o estado vivia num
  booleano do `br-header` e o F5 desligava o tema.
- Tokens `--govbr-{danger,success,warning}-dark` (texto sobre superfície clara)
  e `-hover` (botão sólido), com contraste medido — a cor sólida sobre o `-bg`
  dava 3,70:1 e reprovava WCAG AA.
- Tokens `--govbr-on-primary`, `--govbr-bg`, `--govbr-pure-0` e os canais `-rgb`.

### Alterado

- **`styles/govbr-tw.css` não importa mais CDN.** Os dois `@import url(...)`
  (Rawline no SERPRO, Font Awesome no cdnjs) falhavam em silêncio em intranet
  sem internet ou com CSP restritiva, e duplicavam o que o `ng-add` já injeta no
  index.html. Quem precisa de ambiente offline deve auto-hospedar as fontes.
- **O mesmo arquivo deixou de embarcar `@tailwind base/components/utilities`.**
  CSS de biblioteca com essas diretivas faz todo consumidor Tailwind gerar o
  conjunto de utilitários duas vezes. Agora é CSS puro, sem `@layer`.
- `success-bg` era `#d4edda` — a cor do Bootstrap, não do Gov.br. Corrigido para
  `#e3f5e1` e `danger-bg` para `#fde0db`, conferidos contra `@govbr-ds/core`
  v3.7.0 (MIT, SERPRO).
- Os estilos `.showcase-*` saíram do `govbr-contrast.css` publicado: todo
  consumidor baixava o CSS da vitrine interna do projeto.

### Notas de compatibilidade

- Nenhuma assinatura de componente foi removida ou renomeada.
- **Mudança de comportamento:** `br-input-money.writeValue` com valor
  fracionário e `valueUnit="cents"` passa a arredondar e emitir aviso em dev, em
  vez de multiplicar por 100. Quem entregava reais deve declarar
  `valueUnit="reais"`.
- Quem usava `bg-white`/`text-white` **dentro** dos componentes não é afetado;
  as regras genéricas continuam no `govbr-contrast.css` para o código do app.

## [1.2.7] - 2026-02-08

### Adicionado
- **Alto Contraste**: Suporte completo ao modo de alto contraste (acessibilidade WCAG)
  - Estilos para `br-input` (fundo escuro, texto claro, focus amarelo)
  - Estilos para `br-select` (trigger, dropdown, opções)
  - Estilos para `br-checkbox` e `br-radio`
  - Estilos para `br-pagination` (inputs e layout contextual)
  - Estilos para `br-table` (hover legível no tema escuro)
  - Estilos para `br-card`, `br-accordion`, `br-modal`, `br-tooltip`
  - Estilos para `br-tab`, `br-list`, `br-message`, `br-badge`
  - Estilos para feedback messages (danger, success, warning, info)

### Corrigido
- Feedback messages dos inputs agora têm fundo colorido conforme padrão Gov.br
- Hover da tabela no modo contraste agora mantém texto legível
- Consistência de altura entre `br-input` e `br-select` usando CSS variables

## [1.2.6] - 2026-02-08

### Adicionado
- Layout contextual da paginação seguindo padrão Gov.br
- Fundo branco na paginação contextual
- Cor de focus corrigida para `#c2850c` (gold-vivid-40)

### Corrigido
- Padding da paginação dentro de tabelas
- Altura consistente entre input e select

## [1.2.5] - 2026-02-07

### Inicial
- Primeira versão estável da biblioteca
- Componentes Angular seguindo Gov.br Design System
- Integração com Tailwind CSS 3
- Suporte a Angular 17, 18 e 19
