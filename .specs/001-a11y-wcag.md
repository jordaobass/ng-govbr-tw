# 001 — Acessibilidade (WCAG 2.2 / eMAG)

**Entra em:** 1.3.0 · **Pendência declarada em** `projects/ng-govbr-tw/MELHORIAS.md:96`

## Por que isso é prioridade

O `README.md` afirma que os componentes são "acessíveis e prontos para produção". A lib
mira órgão público, onde a11y é obrigação legal (eMAG / ABNT NBR 17225), não melhoria.
Hoje a afirmação do README não se sustenta nos pontos abaixo.

## Estado atual — medido em 10/10/2026

```bash
cd projects/ng-govbr-tw/src/lib/components
for c in input input-cpf input-cnpj input-telefone input-cep input-money textarea select table; do
  f=$(find $c -name '*.component.ts'); printf "%-16s aria-invalid=%s role=alert=%s aria-total=%s\n" \
    "$c" "$(grep -c 'aria-invalid' $f)" "$(grep -c 'role="alert"' $f)" "$(grep -co 'aria-' $f)"
done
```

| Componente | `aria-invalid` | `role="alert"` | total `aria-` |
|---|---|---|---|
| `br-input` (principal) | 0 | 0 | 10 |
| `br-input-cpf` | 0 | 0 | **0** |
| `br-input-cnpj` | 0 | 0 | **0** |
| `br-input-telefone` | 1 | 1 | 5 |
| `br-input-cep` | 1 | 1 | 6 |
| `br-input-money` | 1 | 1 | 5 |
| `br-textarea` | 0 | 0 | **0** |
| `br-select` | 0 | 0 | 1 |
| `br-table` | 0 | 0 | **0** |

Componentes sem **nenhum** `aria-`/`role` (11 de 47, medido com laço sobre os diretórios):
`badge`, `datetimepicker`, `footer`, `input-cnpj`, `input-cpf`, `layout`, `list`, `menu`,
`radio`, `table`, `textarea`.

## O que implementar

### 1.1 Erro anunciado nos form-controls (WCAG 3.3.1 / 4.1.3)

Aplica-se a `br-input`, `br-input-cpf`, `br-input-cnpj`, `br-textarea` — os três últimos
preferencialmente **já via `br-field-wrapper`** da spec [003](003-dry-inputs-e-field-wrapper.md).

Padrão a seguir, **já existente e correto** em `br-input-telefone.component.ts:56-69`
(usar como referência para não inventar um segundo padrão):

- `[attr.aria-invalid]` no controle quando inválido e tocado
- `[attr.aria-describedby]` apontando para o id do helper e/ou da mensagem de erro
- `role="alert"` no `<span>` de erro, para o leitor anunciar sem o usuário navegar até lá
- id derivado do `nextId` estático que os componentes já usam

**Critério de aceite:** nos 4 componentes, com campo inválido e tocado, o DOM tem
`aria-invalid="true"` e o elemento de erro tem `role="alert"` e é referenciado por
`aria-describedby`. Teste: ver spec [007](007-testes.md) §2.

### 1.2 `br-select` — padrão combobox WAI-ARIA

Estado medido: o trigger é `<button>` (`br-select.component.ts:47-52`) **sem**
`aria-haspopup`/`aria-expanded`/`aria-controls`. As opções **já têm** `aria-selected`
(`:92`) mas são `<li tabindex="0">` com apenas `(keydown.enter)` (`:95`) — não há
navegação por setas.

Implementar:
- trigger: `aria-haspopup="listbox"`, `[attr.aria-expanded]="isOpen"`, `aria-controls` com o id da lista
- lista: `role="listbox"` (+ `aria-multiselectable` quando `multiple`)
- itens: `role="option"` (mantendo `aria-selected`)
- navegação: `ArrowDown`/`ArrowUp` move o item ativo, `Home`/`End`, `Enter`/`Space`
  seleciona, `Escape` fecha e devolve foco ao trigger, digitar letra pula para a opção
- `[attr.aria-activedescendant]` no trigger apontando para o item ativo
- os `<li>` deixam de ser focáveis (`tabindex="-1"`); o foco fica no trigger —
  é o que o padrão combobox exige e evita que Tab atravesse a lista

**Critério de aceite:** com o select aberto, as setas movem a opção ativa sem mover o
foco do DOM, `aria-activedescendant` acompanha, e `Escape` devolve o foco ao trigger.

### 1.3 `br-modal` — gestão de foco (WCAG 2.4.3)

Estado medido: `role="dialog"` + `aria-modal` + `aria-labelledby` presentes
(`br-modal.component.ts:23-25`), `Escape` tratado (`:231`), e **zero ocorrências de
`focus(`** no arquivo (`grep -c 'focus(' br-modal.component.ts` → `0`). Anunciar
`role="dialog"` sem gerir foco é pior que não anunciar: promete contrato que não cumpre.

Implementar:
- foco inicial: primeiro elemento focável do diálogo, ou o próprio container se não houver
- **focus trap**: `Tab`/`Shift+Tab` circulam dentro do diálogo
- devolução do foco ao elemento que abriu o modal, ao fechar
- remover `role="button"` + `tabindex="0"` do scrim (`:32-35`): backdrop focável polui a
  ordem de tabulação e duplica o fechamento que o `Escape` e o botão de fechar já dão.
  O clique continua fechando — `(click)` em `<div>` sem papel interativo é aceitável aqui
  porque **não é** o único caminho (há `Escape` e botão), então não viola 2.1.1.

**Critério de aceite:** teste que abre o modal, verifica `document.activeElement` dentro
do diálogo, dispara `Tab` no último focável e confirma que voltou ao primeiro; ao fechar,
`document.activeElement` é o gatilho.

### 1.4 `br-table` — o que a lib pode e o que não pode

**Ressalva importante, medida:** `br-table.component.ts:26` projeta `<ng-content>` — o
`<table>`/`<thead>`/`<th>` é escrito **pelo consumidor**, a lib só estiliza via seletores
de host (`:57-92`). Portanto a lib **não consegue** injetar `scope` nos `<th>` do usuário.

O que cabe à lib:
- aceitar `@Input() caption?: string` e `@Input() ariaLabel?: string`, aplicando
  `aria-label` no host ou renderizando um `<caption>` projetado
- `role="region"` + `aria-label` no wrapper quando a tabela tiver scroll horizontal
  (tabela rolável precisa ser alcançável por teclado — WCAG 2.1.1)
- documentar no README, na seção da tabela, que `<th scope="col">` e `<caption>` são
  responsabilidade do consumidor, com exemplo correto

**Critério de aceite:** `ariaLabel` chega ao DOM; o README traz o exemplo com `scope`.
Não prometer no README que a tabela "é acessível" — ela é acessível *se* o consumidor
fizer a parte dele, e isso tem de estar escrito.

### 1.5 Skiplink (componente novo)

O Gov.br DS exige "ir para o conteúdo". Não existe na lib (`grep -ri skiplink src` → 0).
Criar `br-skiplink`: link visualmente oculto que aparece ao receber foco, com
`href` configurável (padrão `#main`), primeiro na ordem de tabulação.

### 1.6 Os 11 sem `aria-` — triagem, não varredura cega

Nem todos precisam: `divider` decorativo precisa de `aria-hidden`, não de `role`.
Tratar por papel real:

| Componente | O que falta |
|---|---|
| `menu` | `role="navigation"` + `aria-label`; `aria-current` no item ativo |
| `list` | `role="list"`/`listitem` quando não usar `<ul>` nativo |
| `radio` | `role="radiogroup"` + `aria-labelledby` no grupo (o nativo não agrupa só com `name`) |
| `table`, `textarea`, `input-cpf`, `input-cnpj` | cobertos por §1.1 e §1.4 |
| `badge` | `aria-label` quando o conteúdo é só número/ícone |
| `footer`, `layout` | landmarks: `role="contentinfo"`, `<main>`/`role="main"` |
| `datetimepicker` | herda de datepicker/timepicker; conferir `aria-label` dos botões de ícone |

## Fora de escopo

Auditoria de **fidelidade ao Gov.br DS** (se o hover do botão usa o tom oficial). Isso
exige comparação com `gov.br/ds` e não é a11y — fica registrado em `DECISOES.md`.
