# 009 — Release 1.3.0

**Fecha:** specs 001–008

## O problema que esta release resolve antes de qualquer código

```bash
curl -s https://registry.npmjs.org/@schenkerjon%2fng-govbr-tw | python3 -c "..."
# latest: 1.2.7 · publicada 2026-02-08T20:26:36Z · 1.2.5 foi pulada · 22 versões
git log -1 --format='%h %ad %s' --date=short    # 7f74029 2026-02-09 Tema de alto contraste
git tag -l                                       # VAZIO
```

O último commit é **um dia depois** da última publicação. Ou seja, o trabalho mais recente
da lib — o tema de alto contraste inteiro — nunca foi publicado. Medido:

```bash
git show --stat 7f74029
# 16 arquivos, +2.301 −620
#   govbr-contrast.css      +545   ← o tema de alto contraste em si
#   br-pagination           431 linhas reescritas
#   br-mega-menu            +343   ← drawer mobile
#   br-table                 +60
#   public-api.ts             +1   ← a 1.2.7 no npm NÃO exporta este símbolo
#   CHANGELOG.md            −298   ← o changelog ENCOLHEU neste commit
#   README.md                +78   ← documenta o contraste
```

Duas consequências concretas:

1. **O README público promete o que o pacote não entrega.** Quem lê a documentação e
   instala a 1.2.7 não tem alto contraste.
2. **O `public-api.ts` do npm está incompleto** — falta um export que o código atual tem.

E nenhuma das 22 versões publicadas é rastreável a um commit, porque não há tag nenhuma.

## 9.1 Versionamento e tags

- Bump de `projects/ng-govbr-tw/package.json:3` para **`1.3.0`**. Não é `1.2.8`: há feature
  nova (tema de contraste, `BrContrastService`, `br-skiplink`, `br-field-wrapper`) e
  reescrita de componente. Republicar `1.2.7` é recusado pelo npm.
- **Tag `v1.3.0` em `7f74029`**, conforme decisão registrada em `DECISOES.md` — a tag marca
  o conteúdo que fecha a linha do tema de contraste.
- Retro-taggear a `v1.2.7` em `b9c964d` (pela cronologia: a 1.2.7 saiu em 08/02 e esse é o
  último commit anterior a ela). **Marcar como inferida**, não como certa — não há
  evidência de qual commit gerou o publish.

## 9.2 `peerDependencies`

Hoje (`projects/ng-govbr-tw/package.json:24-29`): `^17.0.0 || ^18.0.0 || ^19.0.0`.

A 1.3.0 continua **compilada no Angular 17** (a migração é a 2.0.0, spec
[010](010-migracao-angular-20-22.md)). Como lib compilada no major X roda em apps ≥ X, a
1.3.0 pode declarar:

```json
"@angular/core": "^17.0.0 || ^18.0.0 || ^19.0.0 || ^20.0.0 || ^21.0.0 || ^22.0.0"
```

⚠️ **Isso não se declara, se prova.** Antes de publicar, build + render de 2–3 componentes
num app de cada major que entrar na lista. A garantia do linker é de design; se a lib usa
algo que o 22 removeu, só o build do app revela. Major que não for provado **não entra na
lista** — peer mentiroso é pior que peer restritivo.

## 9.3 CHANGELOG

O `7f74029` removeu ~298 linhas do CHANGELOG. Reconstruir a entrada da 1.3.0 com:

- o que o commit de fevereiro trouxe e nunca foi publicado (contraste, paginação, mega-menu)
- o que as specs 001–008 entregam, agrupado por tema
- seção **Breaking changes: nenhuma** — a 1.3.0 é retrocompatível com a 1.2.7 por
  decisão de escopo (spec 003 §3.3 proíbe mudar API pública)
- a saída real de `npx ng test --watch=false` colada, não parafraseada

## 9.4 Sequência de publicação

```bash
# 0. baseline verde ANTES de qualquer coisa (spec 007 §1)
npm ci && npm run build && npx ng test --watch=false && npx ng lint

# 1. implementar 001–008, cada uma com seu critério de aceite

# 2. bump + changelog + peers provados

# 3. build do pacote e inspeção do que vai subir
npm run build
npm publish dist/ng-govbr-tw --dry-run      # conferir arquivos, peers e versão

# 4. provar o pacote de fora, como consumidor
cd /tmp && ng new consumidor-teste --style=css
cd consumidor-teste && npm i tailwindcss@3 postcss autoprefixer
npm i <repo>/dist/ng-govbr-tw && ng add @schenkerjon/ng-govbr-tw
# usar br-button, br-input-cpf, br-modal; ng build; abrir e clicar

# 5. publicar e taggear
npm publish dist/ng-govbr-tw
git tag -a v1.3.0 7f74029 -m "..."   # ver DECISOES.md
git push --tags
```

⚠️ **O `ng-packagr` copia o `package.json` da lib para o `dist`.** Atualizar versão e
peers **antes** do build — peer errado dentro do `dist` é o erro clássico desta etapa.

⚠️ `npm whoami` nesta máquina retorna `ENEEDAUTH` (medido em 10/10/2026). O publish exige
login (`npm login`) — não está automatizado e **quem roda é o dono**.

## 9.5 CI de publish (opcional nesta release)

`.github/workflows/` tem só `deploy-demo.yml`. Pendência aberta em `MELHORIAS.md:85`.
Workflow disparado por tag `v*` que roda build + test + `npm publish` com `NPM_TOKEN`.
Fica como item separado: envolve criar segredo no repo, que é ação do dono.

## Critério de aceite

1. `npm view @schenkerjon/ng-govbr-tw version` → `1.3.0`
2. `git tag -l` → `v1.2.7` e `v1.3.0`
3. O app consumidor de teste (passo 4) renderiza e o alto contraste liga nele
4. README não promete nada que o pacote publicado não tenha — reler depois do publish
