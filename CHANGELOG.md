# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [1.4.0] - 2026-02-10

### Corrigido — o que ficava INVISÍVEL no alto contraste

Encontrado por você olhando a tela, não pelos testes. Os 20 testes que havia
verificavam presença no DOM, largura e axe — **nenhum enxerga texto pintado
da cor do próprio fundo** dentro de um componente. Medido no navegador:

- **Rodapé: links a 1:1** (branco sobre branco). A regra global
  `html.govbr-contrast a { color: #ffff00 }` existe para link sobre a página
  PRETA, mas alguns componentes têm superfície própria que vira CLARA no
  contraste (`--govbr-primary-darkest` passa a branco). Ali o amarelo some.
  A regra ganhou exceção: dentro de `br-footer`, `br-menu-bar`, `br-mega-menu`
  e de superfícies `primary`, o link herda a cor do componente.
- **Texto branco sobre amarelo a 1,07:1** em `br-modal`, `br-tooltip`,
  `br-notification` e `br-avatar`. Os quatro usavam `text-govbr-gray-80` sobre
  `bg-govbr-warning`; no contraste o gray-80 vira branco e o amarelo continua
  amarelo. Novo token **`--govbr-on-warning`**, que não inverte, porque a
  superfície de aviso é clara nos dois temas.
- **`br-menu-bar` não informava a variante aos seus itens.** Com
  `variant="white"`, a barra ficava preta no contraste e os itens seguiam em
  `primary` com texto preto: 1:1. Agora o item **herda** a variante da barra
  quando não recebe uma — exigir que o consumidor repita em cada item uma
  informação que o pai já tem era a própria causa do defeito.

### Corrigido — Storybook sem ícones e sem a tipografia

O `govbr-tw.css` deixou de importar CDN (D7) e quem passou a oferecer fonte e
ícones foi o `index.html` do consumidor. O Storybook tem a **própria casca**, e
eu não a configurei: nenhum `<i class="fa-solid …">` renderizava e o Rawline
caía no fallback do sistema. Verificado: `font-awesome` e `rawline` não eram
sequer requisitados. Corrigido com `.storybook/preview-head.html` — o mesmo
par que o `ng-add` injeta, então o que se vê ali é o que o consumidor recebe.

O addon de backgrounds também foi desligado: ele fixava `#f8f8f8` e brigava
com o tema, deixando **118 stories** com texto branco sobre fundo claro no
alto contraste. O fundo agora vem do token `--govbr-bg`.

### Adicionado — o teste que faltava

`testes/e2e/invisivel.spec.ts`: percorre todo texto e ícone visível, sobe a
árvore até achar quem **realmente** pinta o fundo, e reprova o que ficar
abaixo de 1,5:1. Roda no showcase (tema claro e alto contraste) e nas 114
stories. Isenta controle inativo, como manda a WCAG 1.4.3, e ignora elemento
sobre gradiente, que a medição por `background-color` não alcança.

Total: 23 testes ponta a ponta.

### Corrigido — acessibilidade, medida com axe-core nas 114 stories

O Storybook com addon de a11y expôs 7 regras violadas, 5 delas críticas. A
biblioteca afirmava no README ser "acessível e pronta para produção"; para
órgão público isso é obrigação legal, não adorno. Todas corrigidas:

- **`button-name`** — `br-modal` e `br-signin` renderizavam botão **sem texto**
  quando o rótulo vinha indefinido: "botão" e mais nada no leitor de tela.
  Ambos passaram a ter piso (`rotuloPrimario`, `rotuloCancelar`, `rotulo`).
- **`aria-required-parent`** — os itens de `br-menu` usavam
  `role="menuitem"`/`"treeitem"`, que exigem ancestral `role="menu"` e
  pertencem a menu de **aplicação**, não de navegação. Removidos: dentro do
  `<nav>` um `<a>`/`<button>` já é anunciado corretamente.
- **`aria-required-children`** — `br-list` tinha `role="list"` envolvendo o
  `<h3>` do título, e os itens não eram `listitem`. O cabeçalho saiu do
  elemento com o papel e `br-item` passou a declarar `role="listitem"`.
- **`select-name`** — o seletor de itens por página do `br-pagination` não
  tinha nome acessível.
- **`aria-allowed-attr`** — `aria-expanded` num `<input type="text">` sem
  papel, nos pickers (agora `role="combobox"` com `aria-controls` apontando
  para o painel), e `aria-orientation` em `role="presentation"` no
  `br-divider` (agora condicionado ao texto, que é quando vira `separator`).
- **`label-content-name-mismatch`** — `aria-label` que não contém o texto
  visível quebra comando de voz: quem fala, fala o que lê. Removido de
  `br-signin`, da área de soltar do `br-upload` e dos passos do `br-wizard`,
  onde `aria-current` já anuncia o estado.
- **`color-contrast`** (36 nós) — mesma raiz já tratada nos tokens, aplicada
  agora aos usos que faltavam: cor **sólida** usada como texto sobre fundo
  claro. `text-govbr-danger`/`success` viraram as variantes `-dark`, e
  `text-govbr-gray-40` (3,33:1 — nunca serve para texto) virou `gray-60`
  (7,02:1) em 40 usos.

**Exceção declarada:** o rótulo de controle desabilitado continua em 2,78:1.
A WCAG 1.4.3 isenta "texto que faz parte de componente de interface inativo",
e o padrão de opacidade é o mesmo que o DS usa em `.govbr-input:disabled`. O
teste E2E ignora `color-contrast` **apenas** dentro de controle inativo —
suprimir a regra inteira esconderia os casos reais.

### Adicionado — suíte E2E do Storybook

20 testes ao todo. Sobre o Storybook: toda story renderiza, nenhuma estoura a
largura a 360/768/1280px, e nenhuma tem violação séria ou crítica no axe. A
lista de casos sai do `index.json` do build — story nova entra sozinha.

### Corrigido — `ng-add` estava quebrado de seis formas

O schematic é o primeiro contato de quem instala a lib. Cada item abaixo foi
reproduzido e depois provado corrigido em app descartável.

1. **Não rodava no Angular 20+.** O `schema.json` usava `"id"` em vez de
   `"$id"`; o CLI moderno rejeita com *NOT SUPPORTED: keyword "id"* e **aborta
   o schematic inteiro**. Nenhum arquivo era tocado — o `ng add` simplesmente
   não fazia nada.
2. **A URL da fonte Rawline estava morta.** O host
   `cdn.dsgovserp.estaleiro.serpro.gov.br` não resolve DNS (medido: HTTP 000).
   Todo projeto configurado por `ng add` recebeu um `<link>` quebrado e ficou
   sem a tipografia do Gov.br, sem erro na tela. Corrigido para
   `cdngovbr-ds.estaleiro.serpro.gov.br` (HTTP 200).
3. **O patch do `tailwind.config` só conhecia CommonJS.** Em
   `tailwind.config.ts` com `export default {} satisfies Config`, ou em projeto
   ESM, o `String.replace` não casava, devolvia o texto intacto e o arquivo era
   gravado **sem o preset** — com o log dizendo "configurado". Agora cobre CJS,
   ESM, TS e `const config = {}`, importa o preset quando não há `require`, e
   **avisa alto** quando não reconhece o formato, em vez de falhar calado.
4. **O `@import` entrava depois do `@tailwind utilities`.** A especificação CSS
   exige `@import` antes de qualquer regra; `postcss-import` estrito descarta a
   regra nessa posição e os estilos da lib não entram. Agora entra no topo.
5. **`addGlobalStyles` ignorava workspace multi-projeto.** Só olhava
   `src/styles.*` e desistia — enquanto a função vizinha, para o index.html, já
   tratava o caso. As duas passaram a ler o `angular.json`, que é a fonte de
   verdade.
6. **O `govbr-contrast.css` nunca era importado.** Quem instalava pelo caminho
   recomendado não tinha alto contraste, e nada avisava.

Extra: o schematic agora confere se `tailwindcss` está nas dependências e
avisa se faltar — a lib não funciona sem ele.

**Provado executando** em três variações, cada uma criada do zero, com
`ng add` a partir do tarball e `ng build` depois: `tailwind.config.ts` com
`satisfies Config`; workspace multi-projeto sem aplicação na raiz; e
`tailwind.config.js` CommonJS. No app resultante, medido no navegador: botão
primário em `rgb(19,81,180)`, fonte Rawline, token `--govbr-primary` definido,
e o alto contraste invertendo as cores. Zero erro de runtime.

### Alterado — anel de foco e easing

- **Anel de foco do tema claro: `#ffbe2e` → `#c2850c`.** O valor antigo é o
  `--focus-color-dark` do `@govbr-ds/core` — foco do tema **escuro**, usado no
  claro por engano. Medido contra branco: 1,66:1 antes (reprova a WCAG 1.4.11,
  que pede 3:1) e **3,16:1** agora. O novo é o `--focus-color-light` oficial
  (`gold-vivid-40`). ⚠️ Sobre o cinza de página (`--govbr-gray-2`) dá 2,97:1 —
  0,03 abaixo do mínimo, mesma situação do DS oficial, já que o tom é o dele.
- O brilho do foco estava fixo em `rgba(255, 190, 46, 0.45)` em **9 lugares**,
  então mudar o token não teria mudado o halo. Todos passaram a derivar de
  `rgb(var(--govbr-focus-color-rgb) / 0.45)`.
- **Modal e tooltip deixam de entrar com quique.** Usavam `easeOutBack`, cujo
  `1.275` ultrapassa o valor final. Passaram para o novo `easeOutQuint`
  (`cubic-bezier(0.22, 1, 0.36, 1)`), que desacelera sem ultrapassar.
  O `easeOutBack` **continua existindo** com o mesmo valor: é um easing
  nomeado e público, e "Back" significa overshoot — mudar o valor dele faria
  o nome mentir.

### Alterado — `OnPush` em todos os 67 componentes

`ChangeDetectionStrategy.OnPush` passa a ser a estratégia de todos os
componentes. Antes, todos rodavam em `Default`, e as strings de classe são
montadas em getters de até 37 linhas — reavaliados a **cada** ciclo de change
detection da aplicação consumidora, não a cada mudança do componente.

**Defeito encontrado pela migração (e corrigido):** `br-input`, `br-textarea`,
`br-input-cpf`, `br-input-cnpj` e `br-select` leem o estado de validação de
`ngControl.control.errors` num getter. Esse caminho não passa por `@Input` nem
por evento do template, então com `OnPush` a mensagem de erro **deixava de
aparecer** quando o formulário ficava inválido (um `markAllAsTouched()` no
submit, por exemplo). Os cinco agora assinam `statusChanges`/`valueChanges` e
chamam `markForCheck()`. A assinatura vive no `ngOnInit`: no construtor,
`ngControl.control` ainda é `null`.

**Contrato que muda para quem consome:** mutar um array de `@Input` no lugar
(`options.push(...)`) deixa de atualizar a tela — é preciso nova referência.
É o contrato normal de biblioteca Angular moderna.

Os 13 testes ponta a ponta passam com `OnPush` ativo, incluindo o do toast,
que muda estado por `setTimeout` fora de evento de template.

### Adicionado — `br-select` com padrão combobox (WAI-ARIA)

Não tinha `aria-haspopup`, `aria-expanded` nem `aria-activedescendant`, e as
opções eram `<li tabindex="0">` com só `keydown.enter`: sem navegação por
setas, e o Tab atravessava a lista inteira. Para um leitor de tela não era um
combobox, era uma pilha de itens focáveis.

Agora: `role="combobox"` no gatilho com `aria-haspopup="listbox"`,
`aria-expanded`, `aria-controls` e `aria-activedescendant`; opções com
`role="option"` e `tabindex="-1"`; navegação por ↑/↓ (pulando desabilitadas),
`Home`/`End`, `Enter`/`Espaço` para escolher e `Escape` para fechar mantendo o
foco no gatilho. A opção ativa recebe marca visual com barra lateral — o foco
do DOM fica no gatilho, então sem pista visível quem usa teclado não vê nada
acontecer.

### Adicionado — `br-table` e `br-badge`

- `br-table` ganhou `ariaLabel` e `caption`, e a área rolável virou
  `role="region"` com `tabindex="0"` (região rolável precisa ser alcançável por
  teclado — WCAG 2.1.1). ⚠️ `scope` nos `<th>` continua sendo do consumidor: a
  tabela inteira é projetada por `<ng-content>`.
- `br-badge` ganhou `ariaLabel` opcional, para quando o conteúdo é só um número.

### Nota — levantamento de a11y corrigido

O relatório inicial apontou 8 componentes "sem nenhum `aria-`/`role`". Na
inspeção, a maioria **já estava correta** usando semântica nativa, que um grep
por `aria-`/`role=` não enxerga: `br-footer` usa `<footer>`, `br-layout` usa
`<main>`, `br-radio` usa `<fieldset>`/`<legend>`, `br-menu` usa `<nav>` com
`aria-label`, e `br-list` já expõe `role="list"`. Dos 8, só o `br-badge`
precisava de mudança.

### Alterado — `peerDependencies` ampliadas para Angular 17 a 22

Eram `^17 || ^18 || ^19`. Com o Angular 22 como `latest`, isso impedia a
instalação em projeto moderno: `npm install` falhava com `ERESOLVE` em um app
Angular 21 — verificado.

Agora: `^17.0.0 || ^18.0.0 || ^19.0.0 || ^20.0.0 || ^21.0.0 || ^22.0.0`.

A biblioteca continua **compilada no Angular 17**. A compatibilidade para
frente é garantia do *partial compilation*: pacote compilado no major X roda em
app ≥ X. Mas garantia de design não substitui medição — cada major novo foi
provado num app descartável, instalando o tarball, usando
`br-input-cpf` com Reactive Forms, `br-button`, `br-modal`, `br-skiplink` e
`br-toast-container`, e abrindo no navegador:

| Angular | instala | compila | renderiza | toast | focus trap | contraste | erros |
|---|---|---|---|---|---|---|---|
| 20.3.33 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | nenhum |
| 21.2.25 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | nenhum |
| 22.2.2  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | nenhum |

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
