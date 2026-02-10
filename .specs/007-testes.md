# 007 — Testes: consertar o herdado e provar o caminho quente

**Entra em:** 1.3.0 · **§1 é passo 0 de tudo**

## Estado atual — medido em 10/10/2026

```bash
find projects/ng-govbr-tw -name '*.spec.ts' | wc -l                      # 11
grep -rho '  it(' --include='*.spec.ts' projects/ng-govbr-tw/src | wc -l # 122
```

| Spec | `it()` | Cobre |
|---|---|---|
| input-cpf 15 · input-cnpj 14 · input-telefone 13 · input-money 12 · input-cep 10 | 64 | máscara e validação |
| toast.service | 13 | service |
| stepper 10 · chip 10 · timeline 9 · divider 8 · switch 8 | 45 | componentes pequenos |

**Sem nenhum teste**: `button`, `br-input` (o principal, 670 linhas), `select`, `modal`,
`pagination` (873 linhas), `header`, `table`, `datepicker`, `accordion`, `wizard`,
`upload` e todo o sistema de animações.

A leitura honesta: 122 testes que cobrem a periferia. É o padrão "940 testes verdes e
nenhuma linha de resultado" — o número tranquiliza e não protege o que é usado.

## 1. O `ng test` já está vermelho (antes de qualquer mudança nossa)

```bash
grep -rn 'jest\.' --include='*.spec.ts' projects/ng-govbr-tw/src
# br-chip.component.spec.ts:54,64 · br-stepper.component.spec.ts:66,77 · br-switch.component.spec.ts:38

grep -n 'builder' angular.json | grep karma     # @angular-devkit/build-angular:karma
grep '"jest"' package.json                      # ausente
```

Três specs usam `jest.spyOn` num projeto que roda **karma + jasmine**, e `jest` não está
nas dependências. Esses 5 pontos lançam `ReferenceError: jest is not defined`.

**Isto é passo 0 e não é opcional.** Sem baseline verde, qualquer falha depois é
ambígua: não se distingue regressão nova de defeito herdado. Trocar por
`spyOn(component.algumEvento, 'emit')` (jasmine).

> Hipótese declarada: que esses 5 pontos são a *única* causa de vermelho. Não foi
> executado — `node_modules` não está instalado. Rodar `npm ci && npx ng test
> --watch=false` e registrar o resultado real **antes** de mexer em qualquer outra spec.

## 2. Teste que acompanha cada correção — e que fica vermelho primeiro

Regra: **teste novo só conta depois de ficar vermelho.** Para cada item abaixo, escrever o
teste, ver falhar contra o código atual, então corrigir.

| Spec | Teste mínimo |
|---|---|
| [001](001-a11y-wcag.md) §1.1 | campo inválido e tocado → DOM tem `aria-invalid="true"` e erro com `role="alert"`, em `br-input`, `cpf`, `cnpj`, `textarea` |
| 001 §1.2 | select aberto: `ArrowDown` move `aria-activedescendant` sem mover `document.activeElement`; `Escape` devolve foco ao trigger |
| 001 §1.3 | modal aberto: `document.activeElement` dentro do diálogo; `Tab` no último focável volta ao primeiro; ao fechar, foco no gatilho |
| 001 §1.5 | `br-skiplink` é o primeiro focável e aponta para o alvo configurado |
| [003](003-dry-inputs-e-field-wrapper.md) | os 64 `it()` de máscara passam **sem alteração** — se precisarem mudar, a refatoração mudou comportamento |
| [004](004-tokens-e-contraste.md) | nenhum componente usa classe da paleta Tailwind default (teste de guarda, abaixo) |
| [005](005-portabilidade-ssr-e-cdn.md) | com `PLATFORM_ID` = `'server'`, os 3 componentes instanciam sem lançar |
| 005 §5.3 | `BrContrastService` persiste e recupera o estado |

### Teste de guarda contra regressão de token

Teste que varre os fontes e falha se aparecer classe da paleta default ou hex cru fora de
fallback. Barato, roda em milissegundos, e impede que a spec 004 seja desfeita por
distração em seis meses. Mesma ideia para `@import url(` no CSS da lib (spec 005 §5.1).

## 3. A prova do caminho quente — o que hoje não existe

Nenhum teste monta mais de um componente junto. O caminho quente desta lib é:

> **um formulário reativo com vários componentes da lib, preenchido, validado, submetido —
> com o tema de alto contraste ativo.**

Escrever **um** teste de integração que faz isso: um componente-hospedeiro de teste com
`FormGroup` contendo `br-input`, `br-input-cpf`, `br-select`, `br-checkbox` e
`br-textarea`; preencher com valor inválido e conferir que o erro aparece e é anunciado;
corrigir, submeter, conferir o valor do form; ligar o contraste e conferir que a classe
chega ao `<html>`.

Se esse teste não puder ser escrito, a lib **não está pronta** — independentemente dos
122 unitários.

## 4. Cobertura dos componentes grandes sem teste

Prioridade pelo uso real, não pelo tamanho: `button` → `br-input` → `select` → `modal` →
`pagination`. **Um teste por comportamento distinto, não por método**: variantes de
`button` que só diferem na string de classe são um teste, não cinco.

Meta honesta: cobrir os 5 acima nesta release; `header`, `table`, `datepicker`,
`accordion`, `wizard`, `upload` e animações ficam declarados como dívida no
`MELHORIAS.md`. Prometer cobertura total nesta release seria promessa que a release não
cumpre.

## Critério de aceite

1. `npx ng test --watch=false` verde — e o resultado **colado** no `CHANGELOG`/PR, não
   descrito ("os testes passam" não é a mesma afirmação que "rodei e vi 1xx passando").
2. Cada teste da tabela §2 demonstrado vermelho antes da correção.
3. O teste de caminho quente (§3) existe e passa.
4. `npx ng lint` verde — incluindo a remoção do `eslint-disable` de
   `schematics/ng-add/index.ts:139`, que deixa de ser necessário após a spec 006 §6.3.
