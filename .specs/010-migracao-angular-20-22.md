# 010 — Migração: piso Angular 20, suporte 20–22

**Entra em:** 2.0.0 · **Não** faz parte da 1.3.0

## Decisão e o raciocínio que a sustenta

**Compilar no Angular 20 e declarar `peerDependencies: ^20 || ^21 || ^22`.**

A compatibilidade do Angular é assimétrica: o pacote é publicado em *partial compilation*
e o compilador do app finaliza no build, então **lib compilada no major X roda em apps
≥ X**, nunca o contrário. A recomendação oficial é compilar com a **versão mais antiga que
se quer suportar**. O piso 20 cobre 20, 21 e 22 com um único artefato.

## Fatos de versão — verificados em 10/10/2026

```bash
curl -s https://registry.npmjs.org/@angular/core | python3 -c "..."
```

| Fato | Valor |
|---|---|
| `latest` | **22.2.2** |
| dist-tags de LTS | `v20-lts` = 20.3.33 · `v21-lts` = 21.2.25 |
| v20.0.0 publicada | 2025-05-28 |
| v21.0.0 publicada | 2025-11-19 |
| v22.0.0 publicada | 2026-06-03 |
| Node desta máquina | v22.22.2 — atende todos os saltos, nada a fazer |

**Dívida aceita e registrada:** pela política do Angular (6 meses ativo + 12 de LTS), o
suporte do v20 termina por volta de **nov/2026**. Quem perde patch é o **toolchain de
desenvolvimento da lib** (`@angular-devkit/build-angular@20`), não os consumidores — com
peers `^20 || ^21 || ^22` ninguém fica de fora. Quando o v20 sair do LTS, subir o piso
para 21. Ver `DECISOES.md`.

## Requisitos por salto — verificados no registry

| Pacote | v18 | v19 | v20 | Quem atualiza |
|---|---|---|---|---|
| `@angular/*`, `@angular/cli`, `@angular-devkit/build-angular` | 18.2.x | 19.2.x | 20.3.x | `ng update` |
| `ng-packagr` | 18.2.1 | 19.2.2 | **20.3.2** | **manual** — não tem metadata `ng-update` |
| `typescript` | ≥5.4 <5.6 | ≥5.5 <5.9 | **≥5.8 <6.0** | `ng update` (conferir) |
| `zone.js` | ~0.14.10 (já está) | **~0.15.0** | ~0.15.0 | `ng update` (conferir) |
| `karma`/`jasmine` | sem mudança — `karma ^6.3` é peer até no 20 | | | — |
| `eslint` / `angular-eslint` / `typescript-eslint` | **já estão em 9.39 / 21.0.1 / 8.46.4** | | | nada |
| `tailwindcss` | **TW3 é peer aceito do build 20** (`^2 \|\| ^3 \|\| ^4`) | | | nada |

## Breaking changes que atingem esta lib — lista real, não changelog genérico

A lib está bem posicionada, medido em 10/10/2026:

- 100% standalone (66 `standalone: true`, 0 `NgModule`)
- control flow novo (272 `@if`/`@for`, único `*ngFor` é comentário JSDoc em
  `animations/animate.directive.ts:38`)
- zero `@angular/animations` (animações via Web Animations API própria)
- zero `HttpClient`, zero `ComponentFactoryResolver`/`InjectFlags`/`TestBed.get`/`platformBrowserDynamic`
- schematic usa só `Tree`/`Rule`/`SchematicContext` — API estável

O que de fato muda:

1. **v19 — standalone passa a ser padrão.** A migration remove os 66 `standalone: true`
   redundantes. Diff grande, 100% mecânico, zero mudança de comportamento. Não existe
   `standalone: false` em lugar nenhum.
2. **v19 — zone.js 0.15.** Só bump; a lib não importa `zone` e os testes usam
   `zone.js/testing` via `angular.json:31-34`.
3. **v20 — TypeScript 5.8+.** `tsconfig.json` já é `strict` com `strictTemplates`; a
   migration deve trocar `moduleResolution: "node"` (`tsconfig.json:21`) por `bundler`.
   Deixar o schematic fazer.

## Sequência — um major por vez, `ng update` não salta

```bash
git switch -c migracao/angular-20     # nunca na main

npx ng update @angular/cli@18 @angular/core@18 && npm i -D ng-packagr@18.2.1
npm run build && npx ng test --watch=false && npx ng lint
git commit -am "chore: atualiza workspace para Angular 18"

npx ng update @angular/cli@19 @angular/core@19 && npm i -D ng-packagr@19.2.2
# conferir no package.json: zone.js virou ~0.15.0
npm run build && npx ng test --watch=false && npx ng lint
git commit -am "chore: atualiza workspace para Angular 19"

npx ng update @angular/cli@20 @angular/core@20 && npm i -D ng-packagr@20.3.2
npm run build && npx ng test --watch=false && npx ng lint
git commit -am "chore: atualiza workspace para Angular 20"
```

## Prova de que os 3 majors funcionam — o passo que não pode faltar

A compatibilidade forward é garantia de design, não resultado medido. Para cada major:

```bash
cd /tmp && ng new app<N> --style=css --routing=false    # N = 20, 21, 22
cd app<N> && npm i tailwindcss@3 postcss autoprefixer
npm i <repo>/dist/ng-govbr-tw && ng add @schenkerjon/ng-govbr-tw
# usar br-button, br-input-cpf, br-modal, ligar o contraste
ng build && ng serve    # abrir e clicar
```

**Major que não for provado não entra no `peerDependencies`.**

## Onde trava — em ordem de probabilidade

1. **Os 3 specs com `jest.spyOn`** (`br-chip:54,64`, `br-stepper:66,77`, `br-switch:38`)
   — já vermelhos hoje. Resolvidos na spec [007](007-testes.md) §1, que é passo 0 da 1.3.0;
   se por algum motivo a migração vier antes, consertar aqui primeiro, senão não se
   distingue falha de migração de defeito herdado.
2. **Esquecer o bump manual do `ng-packagr`** num dos saltos → `ng build ng-govbr-tw`
   falha com conflito de peer ou erro de schema do `ng-package`.
3. **Erros novos de template no TS 5.8+** com `strictTemplates` ligado — sinal: `NG8xxx`
   / `TS2xxx` apontando templates inline.
4. **Peers desatualizados dentro do `dist/`** na hora de publicar (o `ng-packagr` copia o
   `package.json` da lib).
5. Budget `anyComponentStyle` (16kb, `angular.json:109-112`) estourando se o CSS mudar de
   empacotamento.

## `peerDependencies` da 2.0.0 e política de suporte

```json
"@angular/core": "^20.0.0 || ^21.0.0 || ^22.0.0"
```

- Consumidores em **17–19** ficam na linha **1.x** — e isso tem de estar escrito no README
  e no CHANGELOG, senão vira promessa implícita de suporte eterno.
- Correção crítica na 1.x sai de uma branch `1.x`, se e quando houver.
- `npm` não puxa a 2.0.0 sozinho em quem declara `^1.3.0`; ninguém quebra por atualização
  automática.

## Fora de escopo — deliberadamente

| Item | Por quê |
|---|---|
| `input()`/`output()` em vez de `@Input`/`@Output` (414 + 59 usos) | muda a API pública: `component.disabled = true` para de funcionar e os specs atuais quebram. Major próprio |
| Tailwind 4 | a lib **exporta** `tailwind.preset.js` (modelo v3, config JS) e o `ng-add` escreve `presets: [require(...)]` e procura `@tailwind utilities` — tudo sintaxe v3. TW4 é CSS-first (`@theme`), exigiria dois caminhos no schematic e forçaria a migração dos consumidores |
| Salto para o 21 ou 22 como piso | cortaria consumidores que o piso 20 atende. Reavaliar quando o v20 sair do LTS |
| `ngClass` → `[class.x]` | não deprecado; cosmético |

## Estimativa honesta

Passo 0 (baseline + specs herdados) ≈ 45 min · cada salto ≈ 30–45 min · prova nos 3 apps
+ publicação ≈ 1h30 · **total 4 a 6 horas**. Não inclui nada da seção "fora de escopo".
