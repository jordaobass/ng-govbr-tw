# Publicar `@schenkerjon/ng-govbr-tw` no npm

Runbook de release. **Como usar a biblioteca não está aqui** — está no
[README](README.md) e na [documentação interativa](https://jordaobass.github.io/ng-govbr-tw/).
Manter um terceiro lugar com instrução de uso só produz três versões que
discordam entre si; foi o que aconteceu com este arquivo.

> ### O que havia aqui até 27/02/2026
>
> Um guia de uso escrito quando o pacote ainda se chamava `@aspect-br/ng-govbr-tw`.
> Ele errava **tudo**: 8 ocorrências de um escopo que não existe, 5 caminhos
> `C:\03_dev\...` de outra máquina, um `@import` que quebra o `ng build`,
> `<br-button variant="primary">` quando o input é `emphasis`, versões de
> exemplo em `0.0.x`, e uma tabela com 11 dos 65 componentes.
>
> Nada apontava para ele e nada o verificava. Documento sem dono e sem portão
> apodrece em silêncio — e este chegou ao ponto de instruir a criar uma
> organização npm com o nome errado.

---

## 1. Antes de publicar

A sequência abaixo é a mesma que o CI roda. Rode tudo da raiz do projeto.

```bash
# 1) a biblioteca — o build tem três portões embutidos
npm run build
#    ✔ verificar:templates   — backtick dentro de template literal
#    ✔ tema:v4:verificar     — govbr-tw-v4.css em sincronia com o preset
#    ✔ ng-packagr + schematics

# 2) testes unitários
export CHROME_BIN=$(npx playwright install chromium --dry-run 2>/dev/null; \
  echo "$HOME/.cache/ms-playwright/chromium-*/chrome-linux64/chrome")
npx ng test ng-govbr-tw --watch=false --browsers=ChromeHeadlessNoSandbox

# 3) lint
npx ng lint

# 4) Storybook (os E2E testam o BUILD dele, não o dev server)
npx ng run ng-govbr-tw:build-storybook

# 5) ponta a ponta
cd testes && npx playwright test && cd ..
```

Tudo verde é pré-requisito. Em especial, `documentacao.spec.ts` reprova se:

- algum componente exportado não aparecer **nos dois** READMEs;
- a versão do `package.json` não tiver entrada no `CHANGELOG.md`;
- algum `export` apontar para arquivo inexistente;
- algum README documentar caminho de import interno (`src/lib/...`), que o
  `exports` bloqueia e faz o `ng build` do consumidor morrer.

## 2. Versão e CHANGELOG

A versão vive em `projects/ng-govbr-tw/package.json` — **não** no `package.json`
da raiz, que é do workspace e nunca é publicado.

```bash
# semver: componente exportado novo ou artefato publicado novo = minor
#         correção sem mudança de API = patch
#         remoção ou mudança de API pública = major
```

Escreva a entrada do `CHANGELOG.md` **antes** de publicar. O teste cobra.

## 3. Publicar

⚠️ **O diretório é `dist/ng-govbr-tw`, não a raiz.** Publicar da raiz enviaria
o workspace inteiro.

```bash
npm login                       # uma vez por máquina

cd dist/ng-govbr-tw
npm publish --dry-run --access public   # confira versão, nº de arquivos e tamanho
npm publish --access public
```

`--access public` é obrigatório: pacote com escopo nasce privado no npm.

## 4. Depois de publicar — conferir o que está NO AR

Publicar não é o fim: o registro é outra máquina, e "corrigir o fonte não é
corrigir o site" vale aqui também.

```bash
# a versão chegou?
npm view @schenkerjon/ng-govbr-tw version

# o README certo subiu? (o npm mostra projects/ng-govbr-tw/README.md,
# copiado pelo ng-packagr — NÃO o README da raiz)
npm view @schenkerjon/ng-govbr-tw readme | head -8

# o artefato do Tailwind 4 foi junto?
npm view @schenkerjon/ng-govbr-tw exports
```

E a prova que vale mais que todas: instalar num app limpo e compilar.

```bash
npx @angular/cli@17 new consumidor --skip-git --style=css --defaults
cd consumidor
npm i -D tailwindcss@3 postcss autoprefixer
npm i @schenkerjon/ng-govbr-tw
npx ng add @schenkerjon/ng-govbr-tw
npx ng build
# o token tem de estar no bundle, não só o build passar:
grep -c -- '--govbr-primary:' dist/consumidor/browser/styles-*.css
```

## 5. Marcar a release no git

```bash
git tag -a v1.5.0 -m "1.5.0"
git push origin v1.5.0
```

## Resumo

```
npm run build  →  testes  →  CHANGELOG  →  cd dist/ng-govbr-tw
               →  npm publish --access public  →  conferir no ar  →  git tag
```
