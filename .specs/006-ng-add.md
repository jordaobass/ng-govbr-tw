# 006 — Os quatro furos do schematic `ng-add`

**Entra em:** 1.3.0

O `ng-add` é o primeiro contato de quem instala a lib. Furo aqui não gera bug report —
gera desistência silenciosa. Os quatro itens abaixo foram lidos no código em 10/10/2026
(`projects/ng-govbr-tw/schematics/ng-add/index.ts`), não executados: **não há
`node_modules` instalado no repo hoje**, então nenhum deles foi reproduzido rodando o
schematic. Reproduzir é o passo 0 desta spec.

## 6.1 `@import` injetado depois de `@tailwind utilities` — CSS inválido

`index.ts:165-169`:

```ts
if (content.includes('@tailwind')) {
  const updated = content.replace(
    /(@tailwind\s+utilities\s*;)/,
    `$1\n\n/* Gov.br Design System */\n${importLine}`
  );
```

A especificação CSS exige que todo `@import` venha **antes** de qualquer regra. Aqui ele
cai depois das três diretivas do Tailwind. O bundler do Angular tolera hoje, mas
`postcss-import` em modo estrito descarta a regra — e aí os estilos da lib simplesmente
não entram, sem erro.

**Correção:** inserir o `@import` **antes** do primeiro `@tailwind`, ou usar
`@use`/`@import` no topo do arquivo. Mantém a ordem de cascata desejada porque o
`govbr-tw.css` declara as próprias camadas com `@layer`.

## 6.2 Patch do `tailwind.config` falha calado em ESM e TS

`index.ts:89-92`:

```ts
const updated = content.replace(
  /module\.exports\s*=\s*\{/,
  `module.exports = {\n  presets: [require('@schenkerjon/ng-govbr-tw/tailwind.preset')],`
);
```

O regex só casa CommonJS. Não casa:

- `export default {` — `tailwind.config.mjs` / projeto com `"type": "module"`
- `export default { ... } satisfies Config` — `tailwind.config.ts`, cada vez mais comum

Nesses casos `String.replace` não encontra nada, devolve o conteúdo intacto, e
`tree.overwrite` grava o arquivo **sem o preset**. O log imprime sucesso. O usuário
descobre quando nenhuma classe `govbr-*` funciona.

**Correção:** detectar o formato (`module.exports` / `export default`) e aplicar o patch
correspondente — `presets: [require(...)]` em CJS, `import preset from '...'` +
`presets: [preset]` em ESM/TS. Se nenhum formato for reconhecido, **avisar em `warn` com
a instrução manual** em vez de gravar silenciosamente.

## 6.3 `addGlobalStyles` ignora workspace multi-projeto

`index.ts:140-154`: a função recebe `_project` e **não usa** (há um
`eslint-disable-next-line @typescript-eslint/no-unused-vars` na linha 139 admitindo isso).
Só procura `src/styles.{css,scss,sass,less}`.

Em workspace multi-projeto — como **este próprio repositório** — o arquivo está em
`projects/<app>/src/styles.css`. A função emite `warn` e desiste.

A assimetria é evidente: `findIndexHtml` (`index.ts:178-189`) **já trata** o caso, com
`projects/${project}/src/index.html` na lista. Duas funções vizinhas, uma correta e outra
não.

**Correção:** `addGlobalStyles` passa a usar `_project` e monta a mesma lista de
candidatos que `findIndexHtml`. Melhor ainda: ler o `angular.json` e pegar o
`styles[0]` do target de build do projeto — é a fonte de verdade, em vez de adivinhar
caminho.

## 6.4 O tema de alto contraste não é importado

O schematic importa apenas `styles/govbr-tw.css` (`index.ts:157`). O
`styles/govbr-contrast.css` — a feature mais recente da lib, exportada em
`projects/ng-govbr-tw/package.json` — **nunca entra** numa instalação por `ng add`.

Resultado: quem instala pelo caminho recomendado não tem alto contraste, e não há nada
avisando. A funcionalidade existe, está documentada no README, e é inalcançável.

**Correção:** importar os dois arquivos; ou criar uma opção `--skipContrast` que por
padrão é `false`. Depois da spec [004](004-tokens-e-contraste.md) o arquivo de contraste
fica pequeno, então importar por padrão é barato.

## 6.5 Extra — validar o pré-requisito

O schematic não verifica se `tailwindcss` está instalado no projeto. A lib não funciona
sem ele. Acrescentar checagem no `package.json` do consumidor e, se faltar, instruir
(`ng add` não deve instalar Tailwind por conta própria — é decisão do dono do projeto).

## Critério de aceite

Os quatro furos exigem **prova executada**, não leitura:

```bash
# fora do repo da lib
ng new teste-ngadd --style=css --routing=false
cd teste-ngadd && npm i tailwindcss@3 postcss autoprefixer
npm i <caminho>/ng-govbr-tw/dist/ng-govbr-tw
ng add @schenkerjon/ng-govbr-tw
```

E repetir com as três variações que hoje falham:
1. `tailwind.config.ts` com `export default { } satisfies Config`
2. workspace multi-projeto (`ng generate application segundo`)
3. conferir no `styles.css` resultante que o `@import` está **antes** do `@tailwind`, e
   que o `govbr-contrast.css` foi importado

Critério final: um `br-button` renderiza com as cores do Gov.br e o alto contraste liga,
nas três variações. Build verde não basta — o furo 6.2 não quebra build.
