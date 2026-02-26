# Specs — `@schenkerjon/ng-govbr-tw`

Especificações de implementação levantadas em **10/10/2026** sobre o commit `7f74029`
(HEAD de `main`, 09/02/2026).

## Método

Toda afirmação sobre o estado atual do código nestas specs carrega **o comando que a
provou** e a data. Afirmação sem comando é hipótese e está marcada como tal.

As medições abaixo foram executadas em 10/10/2026 na raiz do repositório:

```bash
# 47 diretórios de componente, 62 linhas de export, 0 templates .html (tudo inline)
ls -d projects/ng-govbr-tw/src/lib/components/*/ | wc -l        # 47
grep -c 'export' projects/ng-govbr-tw/src/public-api.ts         # 62
find projects/ng-govbr-tw -name '*.html' | wc -l                # 0

# arquitetura
grep -rc 'ChangeDetectionStrategy' --include='*.ts' projects/ng-govbr-tw/src   # nenhum arquivo
grep -r 'standalone: true' --include='*.ts' projects/ng-govbr-tw/src | wc -l   # 66
grep -r '@NgModule' --include='*.ts' projects/ng-govbr-tw/src | wc -l          # 0
grep -rho '@Input()' --include='*.ts' projects/ng-govbr-tw/src | wc -l         # 414
grep -rhoE '= (input|output|model)[<(]' --include='*.ts' projects/ng-govbr-tw/src | wc -l  # 0
grep -rhoE '@(if|for)\b' --include='*.ts' projects/ng-govbr-tw/src | wc -l     # 272
grep -rhoE '\*ng(If|For)' --include='*.ts' projects/ng-govbr-tw/src | wc -l    # 1 (comentário JSDoc)

# testes
find projects/ng-govbr-tw -name '*.spec.ts' | wc -l             # 11
grep -rho '  it(' --include='*.spec.ts' projects/ng-govbr-tw/src | wc -l       # 122

# tema
grep -c '!important' projects/ng-govbr-tw/src/lib/styles/govbr-contrast.css    # 311
wc -l projects/ng-govbr-tw/src/lib/styles/govbr-contrast.css                   # 1054

# SSR
grep -rc 'isPlatformBrowser\|PLATFORM_ID' --include='*.ts' projects/ng-govbr-tw/src  # nenhum
```

## Índice

| Spec | Tema | Entra em |
|---|---|---|
| [001](001-a11y-wcag.md) | Acessibilidade — erro anunciado, combobox, table, focus trap, Skiplink | 1.3.0 |
| [002](002-performance-onpush.md) | `OnPush` nos 63 símbolos + getters de classe | 1.3.0 |
| [003](003-dry-inputs-e-field-wrapper.md) | Base dos inputs mascarados (⚠️ corrigida pela medição: vale só para cpf/cnpj; `br-field-wrapper` não foi construído — ver D23) | 1.3.0 |
| [004](004-tokens-e-contraste.md) | Preset apontando para CSS vars; matar cor fora de token | 1.3.0 |
| [005](005-portabilidade-ssr-e-cdn.md) | Guardas de SSR e remoção dos `@import` de CDN | 1.3.0 |
| [006](006-ng-add.md) | Quatro furos do schematic | 1.3.0 |
| [007](007-testes.md) | Consertar os 3 specs herdados + prova do caminho quente | 1.3.0 |
| ~~[008](008-showcase.md)~~ | ~~Showcase: quebrar o monolito~~ — **superada em 26/02/2026**: o showcase foi removido e o Storybook assumiu (D19) | — |
| [009](009-release-1.3.0.md) | Bump, CHANGELOG, tag, peers, publish | 1.3.0 |
| [010](010-migracao-angular-20-22.md) | Piso Angular 20, suporte 20–22 | 2.0.0 |

Decisões abertas e já tomadas: [`DECISOES.md`](../DECISOES.md) na raiz.

## Ordem de execução

As specs 001–008 são independentes entre si **exceto** por duas arestas:

- **003 antes de 001** nos inputs mascarados: extrair a base primeiro evita aplicar a
  mesma correção de a11y em 5 cópias (foi exatamente o que já aconteceu — ver 003).
- **004 antes de 001** no que toca contraste: trocar cor fora de token primeiro, senão
  a correção de a11y é medida sobre um tema que ainda está furado.

A spec 007 (testes) acompanha cada uma, não vem depois: o critério de aceite de 001–006
inclui teste. A 009 fecha a release e a 010 é a entrega seguinte.
