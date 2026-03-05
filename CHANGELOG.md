# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [1.5.1] - 2026-02-27

> **Não publicada no npm.** As correções desta versão são do Storybook — as
> stories e o `.storybook/` não vão para o pacote. Medido: zero alteração em
> `.component.ts`, e o único efeito visível no pacote seria a linha de
> atribuição do README. Quem instala do npm continua na **1.5.0**, que é
> idêntica em código.

### Corrigido — botão sem forma de botão

O `br-button` renderizava como texto azul colado, sem padding nem altura. A
causa não estava no componente: a story ligava `[size]="size"` com `size`
**fora de `args`**.

Em Angular, `undefined` num `@Input` **não cai no default da classe — ele
sobrescreve**. `density` virava `undefined`, `densityMap[undefined]` também, e
as classes `px-5 py-2` nunca eram emitidas. Pior: `variant` e `size` são
aliases depreciados cujos setters escrevem em `emphasis` e `density`, então
ligar os dois pares com um lado indefinido apagava o valor do outro.

Eram **20 stories** com o mesmo padrão. Todas receberam os defaults reais do
componente em `meta.args`, e o botão parou de ligar os aliases depreciados.

### Corrigido — a página de documentação (`?path=/docs/…`)

Metade do Storybook não tinha verificação nenhuma: todas as suítes abriam
`viewMode=story`. A página de docs, que é o link que se compartilha, estava
assim:

- **campos colados na borda** — `.docs-story` vem do Storybook com
  `padding: 0`;
- **painel do mega-menu invisível** — 102px de conteúdo recortado por um bloco
  de 44px. O componente parecia não funcionar;
- **calendário trocado por barra de rolagem** — exatamente o sintoma
  reportado. Medido: date-time-picker transbordava 657px, time-picker 629px,
  date-picker 279px.

⚠️ Eram **três** níveis de recorte, e cada um só apareceu depois de destravar
o anterior: `.sbdocs-preview` (`overflow-y: hidden`), `.docs-story` (classe
gerada do emotion) e o filho direto dele (`overflow: auto` com a altura do
conteúdo FECHADO — 64px). Como as classes do emotion mudam de nome a cada
build, a correção vem de especificidade estrutural.

Junto, o bloco com painel aberto sobe na pilha (`z-index`), porque o wrapper
de zoom usa `transform` e prende o `z-index` do painel lá dentro.

### Corrigido — atribuição no README

Dizia "Jordan Bass"; o usuário do GitHub é `jordaobass`.

### Removido

`.specs/` e `.impeccable/` saíram do repositório (seguem ignorados). As nove
referências do `DECISOES.md` viraram texto, sem link morto.

### Testes

De 40 para 44 E2E. O novo `docs.spec.ts` cobre a página de documentação:
respiro em cada exemplo, painel aberto não coberto, e uma checagem **estática**
que reprova qualquer story que passe `undefined` a um `@Input` com default.

⚠️ Dois furos do próprio teste apareceram por mutação: sondar o TOPO do painel
nunca acusa cobertura (o transbordo é embaixo), e tratar ANCESTRAL como "por
cima" reprovava sempre. E o limiar de altura reprovava o `br-switch` com 24px
— que é o tamanho CORRETO do interruptor médio.

---

## [1.5.0] - 2026-02-26

### Adicionado — suporte a Tailwind CSS 4, ao lado do 3

A lib passa a publicar **dois** artefatos de tema: `tailwind.preset.js` (v3) e
`styles/govbr-tw-v4.css` (v4, CSS-first com `@theme`). O `ng add` detecta a
major instalada e escreve a configuração de cada uma — são incompatíveis entre
si, e aplicar a errada deixa a aplicação sem nenhuma classe `govbr-*`.

O tema do v4 é **gerado** do preset por `scripts/gerar-tema-v4.mjs`, e o build
reprova se os dois divergirem. Duas listas dos mesmos 57 tokens seria a mesma
duplicação que já separou `br-input-cpf` de `br-input-cnpj`.

⚠️ **Para quem usa Tailwind 4, o `@source` não é detalhe.** Medido num
consumidor real: sem
`@source "../node_modules/@schenkerjon/ng-govbr-tw"`, o v4 gera **7 das 52**
classes e a aplicação sobe quase sem estilo, sem erro nenhum — o v4 varre o
projeto automaticamente mas ignora `node_modules` de propósito. O `ng add`
escreve a linha; quem configura à mão precisa dela.

### Adicionado — `br-checkbox-group` e `br-icon`

- **`br-checkbox-group`**: escolha múltipla com legenda, apoio e erro no
  grupo. O `br-checkbox` existente é uma caixa sozinha, booleana; o caso comum
  em formulário de governo é "marque os que você possui". O valor é `string[]`
  na ordem das **opções**, não na do clique.
- **`br-icon`**: a regra de acessibilidade vira estrutural — sem `label` o
  ícone é decorativo e some para o leitor de tela; com `label` vira
  `role="img"` e é anunciado. Havia 115 `<i class="fa-…">` escritos à mão,
  misturando `fa-solid` e `fas`.

### Corrigido — texto de apoio e de erro que o leitor de tela nunca anunciava

Oito componentes pintavam apoio ou erro logo abaixo do campo **sem nenhum
vínculo com ele**: claro para quem enxerga, inexistente para quem usa leitor
de tela (WCAG 3.3.1 e 3.3.2).

- `datepicker`, `timepicker`: apoio e erro ganharam id e entraram no
  `aria-describedby`; o timepicker não tinha `aria-invalid` nenhum
- `telefone`, `cep`, `money`: o `aria-describedby` apontava **só** para o erro
  — o texto de apoio, que é o que aparece no caso normal, ficava mudo
- `datetimepicker`: a descrição é do PAR data+hora, então foi para o grupo
- `radio-group`: `role="radiogroup"` explícito e erro referenciado
- `upload`: a descrição chega à zona de soltar **e** ao input de arquivo
- `checkbox`: o erro não tinha id, nem `role="alert"`, nem `aria-invalid`

O axe passou limpo nos 114 stories **com o defeito presente**, e não é falha
dele: nenhuma ferramenta adivinha que um parágrafo vizinho descreve o campo.

### Corrigido — três violações sérias escondidas por falta de story

Cinco componentes exportados nunca tinham aparecido em lugar nenhum (header,
layout, toast-container e as cinco peças do mega-menu). Escrever as stories
deles revelou:

- `aria-controls="main-navigation"` fixo no `br-header` apontava para um id
  **que não existe** — o menu vive fora do componente. Virou `@Input() menuId`,
  emitido só quando há valor
- o `<li>` do `br-mega-menu-link` ficava dentro do próprio elemento
  customizado, nunca da `<ul>` da coluna: lista sem semântica de lista
- o botão de usuário tinha nome acessível que **não continha o texto visível**
  — quem usa controle por voz dizia o que via e nada acontecia (WCAG 2.5.3)

### Corrigido — a camada de cima não aparecia

- **`br-select` usava `z-10`**, o menor overlay da lib. `datepicker` e
  `timepicker`, da mesma família, já usavam `z-50`. Com `z-10` o dropdown abre
  **atrás** de toast, tooltip, cookiebar e magic-button num formulário real
- **`ring-govbr-focus-color` não existe** em versão nenhuma do Tailwind: o
  token do preset chama-se `govbr-focus`. Quatro elementos do `br-mega-menu`
  caíam no anel padrão do Tailwind em vez da cor de foco do DS
- o alto contraste do `br-message` mirava `.bg-govbr-*-light`, classe que o
  componente **nunca emite** (ele usa `-bg`): quatro regras de CSS morto, e os
  quatro tipos de mensagem perdiam a distinção no alto contraste

### Alterado — `br-input-cpf` e `br-input-cnpj` compartilham uma base

Eram cópia com 18% de divergência, e a duplicação já tinha cobrado o preço: a
correção de acessibilidade de uma rodada anterior chegou a três das cinco
cópias de campo mascarado e deixou justamente cpf e cnpj para trás.

457 → 334 linhas de código no par, uma cópia só do comportamento. **A API
pública não muda** e os 65 `it()` de máscara passam sem uma linha alterada —
era esse o critério.

Medido: só cpf e cnpj são gêmeos. `telefone`↔`cep` divergem 49% e `cep`↔`money`
75% — ViaCEP, spinner de carga e unidade monetária são comportamento próprio,
e as duas famílias têm API pública incompatível. Unificar os cinco seria
abstração por simetria.

### Alterado — Storybook substitui o showcase (BREAKING para o site, não para o pacote)

O app de demo sai inteiro — 2.940 linhas mantidas à mão — e o **Storybook
assume a raiz** do GitHub Pages, com 138 stories, controles ao vivo e painel
de acessibilidade.

⚠️ Quebra para quem usava `ng serve demo` ou linkava
`jordaobass.github.io/ng-govbr-tw/showcase`. **Não afeta o pacote publicado**:
nada do demo ia para o npm.

Junto, duas queixas visuais do Storybook:

- componentes apareciam pela metade, colados no topo e nas laterais — o canvas
  vinha com `padding: 0`. Agora há respiro, altura mínima para painel abrir e
  largura de leitura; cromo de página (rodapé, barras, menu) fica de ponta a
  ponta
- dropdown abria recortado: no showcase, **8 de 8** painéis eram cortados pelo
  cartão `rounded-lg overflow-hidden` que os continha — quem recorta um
  elemento `absolute` é um **ancestral**

### Adicionado — testes

De 25 para 33 E2E e de 167 para 177 unitários:

- `tailwind.spec.ts`: toda classe `govbr-*` da lib compila no 3 **e** no 4,
  rodando os dois compiladores de verdade
- `ng-add.spec.ts`: cinco comportamentos do schematic, que **não tinha teste
  nenhum** e já acumulava seis defeitos corrigidos à mão
- `descricao-acessivel.spec.ts`: apoio e erro anunciados, `aria-invalid` e
  `role="alert"` em toda story de erro
- `camada.spec.ts`: painel flutuante não recortado e com z-index suficiente
- `cobertura.spec.ts`: componente exportado sem story reprova — e composto
  precisa renderizar as **partes** (`<br-tab>` tinha story e renderizava casca
  vazia)

Cada correção foi provada por **mutação**: desfeita, exigida vermelha,
restaurada.

### Adicionado — guarda contra uma armadilha recorrente

`scripts/verificar-templates.mjs` roda no build: backtick dentro de
`template:` encerra o literal no meio do HTML. ⚠️ Contar paridade **não
basta** — um comentário com dois backticks fecha e reabre o literal, o total
fica par e o erro que sai é "Cannot find name 'expanded'", apontando para uma
linha inocente.

---

## [1.4.0] - 2026-02-19

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
