# 002 — `OnPush` e custo dos getters de classe

**Entra em:** 1.3.0

## Estado atual — medido em 10/10/2026

```bash
grep -rc 'ChangeDetectionStrategy' --include='*.ts' projects/ng-govbr-tw/src   # nenhum arquivo casa
grep -rc 'ChangeDetectorRef' --include='*.ts' projects/ng-govbr-tw/src          # nenhum arquivo casa
grep -r 'standalone: true' --include='*.ts' projects/ng-govbr-tw/src | wc -l    # 66
```

Nenhum dos 63 símbolos exportados declara `ChangeDetectionStrategy.OnPush`. Todos rodam
em `Default`.

## Por que importa aqui especificamente

Os componentes montam a string de classe em **getters**, não em campo calculado. Os dois
piores medidos: `br-input.component.ts:573` (`get containerClasses()`, 37 linhas) e
`br-notification.component.ts:95` (`get badgeClasses()`, 37 linhas). Getter em template é
reavaliado a **cada ciclo de change detection da aplicação consumidora** — não a cada
mudança do componente. Numa tela de portal gov.br com dezenas desses componentes, todo
clique em qualquer lugar da página recalcula todas as strings.

Isso não é hipótese sobre o Angular, é o modelo de CD `Default`. O que **é** hipótese: o
tamanho do ganho em ms. Não medimos, e a spec não promete número.

## O que implementar

### 2.1 `OnPush` em todos os componentes

Adicionar `changeDetection: ChangeDetectionStrategy.OnPush` ao decorator de todos os
componentes exportados. A lib está em condição favorável para isso:

- 100% standalone, zero `NgModule` (medido: 66 / 0)
- zero `ChangeDetectorRef` manual — não há código que dependa de `markForCheck()` hoje
- control flow novo em tudo (272 `@if`/`@for`, nenhum `*ngIf` real)
- os componentes de formulário usam `ControlValueAccessor`, e o `writeValue` do Angular
  já dispara CD pelo caminho do `ControlValueAccessor`

### 2.2 Onde `OnPush` vai quebrar — e o que fazer

`OnPush` só re-renderiza em: mudança de referência de `@Input`, evento disparado no
template do próprio componente, `async` pipe, ou `markForCheck()` explícito. Os pontos de
risco reais nesta lib, a conferir um por um durante a implementação:

1. **Mutação de array/objeto de `@Input` pelo consumidor.** Ex.: `br-select` recebe
   `options` e `br-table` recebe dados; se o consumidor faz `options.push(...)`, com
   `OnPush` a tela não atualiza. **Decisão:** manter `OnPush` e documentar que inputs de
   coleção precisam de nova referência — é o contrato normal de lib Angular moderna.
2. **Callback assíncrono fora de evento de template.** `setTimeout` em auto-dismiss de
   toast, `requestAnimationFrame` nas animações, listener de `window.scroll` no header
   (`br-header.component.ts:408`). Esses mudam estado **sem** passar por evento do
   template → exigem `ChangeDetectorRef.markForCheck()` injetado.
3. **`BrToastService`** emite de fora da árvore do `br-toast-container`; conferir que o
   container reage (o caminho é um `Observable`/signal consumido no template — se for
   getter sobre array interno, precisa de `markForCheck`).

### 2.3 Getters → campo recalculado só quando muda

Para os getters grandes (`br-input`, `br-notification`, e qualquer outro acima de ~15
linhas), trocar getter por valor calculado em `ngOnChanges`/setter de input e guardado em
campo. Com `OnPush` o getter já é chamado muito menos, então isso é otimização de segunda
ordem — **só aplicar onde o getter tem mais de ~15 linhas**, para não inflar o diff.

## Critério de aceite

- `grep -r 'ChangeDetectionStrategy.OnPush' projects/ng-govbr-tw/src | wc -l` igual ao
  número de componentes exportados
- `npx ng test --watch=false` verde (os 122 `it()` existentes + os novos da spec 007)
- **prova de comportamento, não só de compilação:** o showcase (spec 008) exercitado à
  mão nos componentes com estado assíncrono — toast aparecendo e sumindo sozinho, header
  compactando no scroll, animações rodando. `OnPush` quebrado não falha build nem teste
  unitário; falha na tela, calado. Este é o item que mais pede o passo "rodei e funcionou".

## Fora de escopo

Migrar `@Input()`/`@Output()` (414 e 59 ocorrências medidas) para `input()`/`output()`.
Isso muda a API pública — `component.disabled = true` deixa de funcionar e os specs
atuais quebram. É major bump próprio, registrado em `DECISOES.md`.
