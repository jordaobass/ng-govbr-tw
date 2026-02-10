# 004 — Preset apontando para CSS vars e fim da cor fora de token

**Entra em:** 1.3.0 · **Executar antes da [001](001-a11y-wcag.md)** no que toca contraste

## O defeito, medido em 10/10/2026

O tema de alto contraste **não alcança 11 dos 47 componentes**. Prova:

```bash
# o contrast.css remapeia variáveis --govbr-* e utilitárias .*-govbr-*, e nada mais
grep -nE '\.(bg|text|border)-(red|green|blue|yellow|gray)-[0-9]' \
  projects/ng-govbr-tw/src/lib/styles/govbr-contrast.css       # ZERO resultados

# mas 11 componentes usam a paleta default do Tailwind
grep -rlE '(bg|text|border)-(red|green|blue|yellow|gray|slate|zinc)-[0-9]{2,3}' \
  --include='*.component.ts' projects/ng-govbr-tw/src/lib/components | wc -l   # 11
```

Os 11: `toast`, `modal`, `message`, `upload`, `wizard`, `button`, `chip`, `magic-button`,
`input-money`, `input-cep`, `input-telefone`.

Consequência: com `html.govbr-contrast` ativo, o toast de erro, o modal de confirmação e
as mensagens de feedback **mantêm a cor original**. São exatamente os componentes que
comunicam estado crítico — os que mais precisam do contraste.

## A causa raiz: fonte dupla de verdade

```bash
sed -n '6,27p' projects/ng-govbr-tw/tailwind.preset.js      # hex literal: '#1351b4', '#168821', ...
sed -n '14,33p' projects/ng-govbr-tw/src/lib/styles/govbr-tw.css  # as MESMAS cores como --govbr-*
```

O preset tem hex literal, então as classes `bg-govbr-primary` compilam para `#1351b4`
estático. Trocar a variável `--govbr-primary` não muda nada nessas classes — e é por isso
que o tema de contraste precisou re-estilizar componente por componente à força:

```bash
wc -l projects/ng-govbr-tw/src/lib/styles/govbr-contrast.css    # 1054
grep -c '!important' projects/ng-govbr-tw/src/lib/styles/govbr-contrast.css   # 311
```

**1.054 linhas e 311 `!important` são sintoma, não causa.**

## O que implementar

### 4.1 Preset referenciando as CSS vars

Trocar o hex literal do `tailwind.preset.js` por `var(--govbr-*)`:

```js
colors: {
  'govbr-primary': 'var(--govbr-primary)',
  'govbr-success': 'var(--govbr-success)',
  // ...
}
```

Com isso `bg-govbr-primary` compila para `background-color: var(--govbr-primary)`, e o
tema de contraste volta a ser **só a troca das ~20 variáveis** das linhas 2-23 do
`govbr-contrast.css`.

**Pegadinha conhecida (tratar, não descobrir em produção):** cor como `var()` quebra o
modificador de opacidade do Tailwind — `bg-govbr-primary/50` não funciona com `var()`
simples. O caminho correto é declarar a variável como **canal** e usar
`rgb(var(--govbr-primary-rgb) / <alpha-value>)`. Antes de aplicar, medir se a lib usa
modificador de opacidade:

```bash
grep -rnE '(bg|text|border)-govbr-[a-z0-9-]+/[0-9]' --include='*.ts' projects/ng-govbr-tw/src
```

Se houver uso, adotar a forma de canal (`--govbr-primary-rgb: 19 81 180`) para os tokens
afetados. Se não houver, `var()` direto basta — e o `<alpha-value>` fica como dívida
anotada no `DECISOES.md`.

### 4.2 Reduzir o `govbr-contrast.css`

Depois de 4.1, remover as regras que existiam só para furar a especificidade. Alvo
honesto: cair de 1.054 para a ordem de 150–250 linhas, mantendo (a) a redefinição das
variáveis, (b) os ajustes de `box-shadow`/`outline` que não vêm de cor, (c) os ajustes de
`img`/`pre code`.

⚠️ **Não remover regra sem provar na tela.** O critério é visual: ativar o contraste no
showcase e comparar antes/depois componente por componente. Regra apagada que era
necessária não falha build nem teste — só volta a ter contraste insuficiente.

### 4.3 Vazamento do demo para dentro do pacote

O `govbr-contrast.css` publicado contém estilos da vitrine interna:

```bash
grep -c 'showcase-' projects/ng-govbr-tw/src/lib/styles/govbr-contrast.css
```

`.showcase-topbar`, `.showcase-sidebar`, `.showcase-nav-item`, `.showcase-section-title`.
Esse arquivo é exportado em `projects/ng-govbr-tw/package.json` (`"./styles/govbr-contrast.css"`),
ou seja **todo consumidor baixa CSS do demo**. Mover essas regras para
`projects/demo/src/styles.css`.

### 4.4 Cor hardcoded — a lista fechada

| Arquivo:linha | Hoje | Vira |
|---|---|---|
| `pagination/br-pagination.component.ts:462` | `background: #d1d5db` | `var(--govbr-gray-10)` |
| `sidebar/br-sidebar.component.ts:95-96` | `#1351b4 !important` / `#ffffff !important` | `var(--govbr-primary)` / `var(--govbr-pure-0)` |
| `mega-menu/br-mega-menu.component.ts:110,118,153,193,204,336` | `bg-[#F3F4F6]`, `border-[#E5E7EB]` | `govbr-gray-2` / `govbr-gray-5` |
| `checkbox/br-checkbox.component.ts:242,247,252` | `#fde0dc`, `#d4edda`, `#fff3cd` | tokens de feedback (criar `--govbr-danger-bg`, `--govbr-success-bg`; `--govbr-warning-bg` já existe no preset) |
| os 11 componentes com paleta Tailwind | `bg-red-50`, `bg-green-50`, `bg-blue-50`, ... | token `govbr-*` equivalente |

Os `var(--x, #hex)` com fallback que existem no resto do `br-checkbox` são padrão
aceitável e **não** entram nesta lista.

## Critério de aceite

1. `grep -rlE '(bg|text|border)-(red|green|blue|yellow|gray|slate|zinc)-[0-9]{2,3}' --include='*.component.ts' .../components | wc -l` → **0**
2. `grep -rnE '#[0-9a-fA-F]{6}' --include='*.component.ts' .../components` → só ocorrências com fallback `var(--x, #hex)`
3. `grep -c 'showcase-' .../styles/govbr-contrast.css` → **0**
4. **Prova visual obrigatória:** showcase aberto, contraste ligado, e os 11 componentes
   antes furados agora mudam de cor. Sem isso a spec não está cumprida — build verde aqui
   não significa nada.
