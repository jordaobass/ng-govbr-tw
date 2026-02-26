#!/usr/bin/env node
/*
 * Gera o tema do Tailwind 4 A PARTIR do preset do Tailwind 3.
 *
 * Por que gerar e não escrever à mão: seriam duas listas dos mesmos ~40
 * tokens, e a lição de campo desta biblioteca é exatamente essa — `br-input-cpf`
 * e `br-input-cnpj` eram cópias, a correção de acessibilidade chegou a uma e
 * não à outra. Token novo no preset que não chegasse ao tema v4 produziria uma
 * classe que funciona no Tailwind 3 e some no 4, em silêncio.
 *
 * O `scripts/verificar-tema-v4.mjs` reprova o build se o arquivo no repo não
 * for igual ao que este gerador produz agora.
 *
 * ⚠️ O `<alpha-value>` do v3 NÃO existe no v4: lá o modificador de opacidade é
 * resolvido pelo próprio Tailwind com `color-mix`. Medido em 4.3.3 — com
 * `--color-x: rgb(var(--canal))`, `bg-x/60` gera
 * `color-mix(in oklab, var(--color-x) 60%, transparent)` e continua seguindo o
 * tema de alto contraste. Deixar o placeholder no v4 produziria cor inválida.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const preset = require(join(raiz, 'projects/ng-govbr-tw/tailwind.preset.js'));
const destino = join(raiz, 'projects/ng-govbr-tw/src/lib/styles/govbr-tw-v4.css');

/** `rgb(var(--x, 1 2 3) / <alpha-value>)` → `rgb(var(--x, 1 2 3))` */
const semAlpha = (valor) => valor.replace(/\s*\/\s*<alpha-value>/, '');

/** `{ 'govbr-gray': { 2: cor } }` → `{ 'govbr-gray-2': cor }` */
function achatarCores(cores, prefixo = '') {
  const saida = {};
  for (const [chave, valor] of Object.entries(cores)) {
    const nome = prefixo ? `${prefixo}-${chave}` : chave;
    if (typeof valor === 'string') saida[nome] = semAlpha(valor);
    else Object.assign(saida, achatarCores(valor, nome));
  }
  return saida;
}

const linhas = [];
const secao = (titulo) => linhas.push('', `  /* ${titulo} */`);

const t = preset.theme.extend;

secao('Cores — mesmos canais `--govbr-*-rgb` do preset v3');
for (const [nome, valor] of Object.entries(achatarCores(t.colors ?? {}))) {
  linhas.push(`  --color-${nome}: ${valor};`);
}

secao('Tipografia');
for (const [nome, familia] of Object.entries(t.fontFamily ?? {})) {
  linhas.push(`  --font-${nome}: ${familia.join(', ')};`);
}
for (const [nome, def] of Object.entries(t.fontSize ?? {})) {
  const [tamanho, extra] = Array.isArray(def) ? def : [def, null];
  linhas.push(`  --text-${nome}: ${tamanho};`);
  if (extra?.lineHeight) linhas.push(`  --text-${nome}--line-height: ${extra.lineHeight};`);
}

secao('Raio e espaçamento');
for (const [nome, valor] of Object.entries(t.borderRadius ?? {})) {
  linhas.push(`  --radius-${nome}: ${valor};`);
}
for (const [nome, valor] of Object.entries(t.spacing ?? {})) {
  linhas.push(`  --spacing-${nome}: ${valor};`);
}

secao('Animação');
for (const [nome, valor] of Object.entries(t.animation ?? {})) {
  linhas.push(`  --animate-${nome}: ${valor};`);
}

// No v4 os keyframes vão DENTRO do `@theme` para serem incluídos só quando a
// animação correspondente é usada.
const quadros = [];
for (const [nome, passos] of Object.entries(t.keyframes ?? {})) {
  quadros.push('', `  @keyframes ${nome} {`);
  for (const [momento, props] of Object.entries(passos)) {
    const corpo = Object.entries(props)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}: ${v};`)
      .join(' ');
    quadros.push(`    ${momento} { ${corpo} }`);
  }
  quadros.push('  }');
}

const conteudo = `/*
 * Tema do Gov.br para Tailwind CSS 4.
 *
 * ⚠️ ARQUIVO GERADO por \`scripts/gerar-tema-v4.mjs\` a partir de
 * \`tailwind.preset.js\`. Não edite à mão: o build reprova se os dois
 * divergirem. Token novo entra no preset e se regenera aqui.
 *
 * Uso num projeto Tailwind 4 (CSS-first, sem \`tailwind.config.js\`):
 *
 *   @import "tailwindcss";
 *   @import "@schenkerjon/ng-govbr-tw/styles/govbr-tw.css";
 *   @import "@schenkerjon/ng-govbr-tw/styles/govbr-components.css";
 *   @import "@schenkerjon/ng-govbr-tw/styles/govbr-contrast.css";
 *   @import "@schenkerjon/ng-govbr-tw/styles/govbr-tw-v4.css";
 *
 * No Tailwind 3 nada disto se aplica — lá vale \`presets: [require(...)]\` com
 * o \`tailwind.preset.js\`.
 *
 * As cores apontam para os MESMOS canais \`--govbr-*-rgb\` do preset v3, e é o
 * que faz o tema de alto contraste alcançar as classes: trocar o tema é
 * trocar a variável, não reescrever a classe. Verificado no navegador —
 * \`bg-govbr-primary\` vai de rgb(19,81,180) para rgb(255,203,0) ao ligar o
 * contraste, e \`bg-govbr-primary/60\` acompanha.
 */
@theme {${linhas.join('\n')}
${quadros.join('\n')}
}
`;

const anterior = (() => {
  try {
    return readFileSync(destino, 'utf-8');
  } catch {
    return null;
  }
})();

if (process.argv.includes('--verificar')) {
  if (anterior !== conteudo) {
    console.error(
      'govbr-tw-v4.css está fora de sincronia com tailwind.preset.js.\n' +
        'Rode `npm run tema:v4` e commite o resultado.'
    );
    process.exit(1);
  }
  console.log('govbr-tw-v4.css em sincronia com o preset.');
} else {
  writeFileSync(destino, conteudo);
  console.log(
    `${destino.split('/').pop()} gerado — ${linhas.filter((l) => l.startsWith('  --')).length} tokens.`
  );
}
