import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/**
 * Paridade entre Tailwind 3 e Tailwind 4.
 *
 * A lib publica DOIS artefatos de tema: `tailwind.preset.js` (v3, config JS) e
 * `styles/govbr-tw-v4.css` (v4, CSS-first com `@theme`). Duas listas dos
 * mesmos ~57 tokens é exatamente a duplicação que já custou caro aqui —
 * `br-input-cpf` e `br-input-cnpj` divergiram e a correção de acessibilidade
 * chegou só a um deles.
 *
 * Por isso o v4 é GERADO do preset, e aqui se prova o que importa de verdade:
 * a mesma classe que funciona no 3 funciona no 4. Comparar os dois arquivos
 * não bastaria — o que vale é o CSS que cada compilador produz.
 *
 * ⚠️ Rodar o compilador de verdade, não ler o preset: `<alpha-value>` existe
 * só no v3, e no v4 o modificador de opacidade é resolvido por `color-mix`.
 * São caminhos diferentes para o mesmo resultado, e só o compilador diz se
 * chegaram lá.
 *
 * As duas versões convivem por alias do npm (`tw3`/`tw4` no package.json).
 */

const RAIZ = resolve(__dirname, '../..');
const ESTILOS = join(RAIZ, 'projects/ng-govbr-tw/src/lib/styles');

/*
 * ⚠️ Os dois pacotes declaram um bin chamado `tailwindcss`, e quem chega ao
 * `node_modules/.bin` é só um deles — aqui o v3 venceu, e o teste do v4
 * rodava o compilador v3 em silêncio, falhando com erro de `@import` que não
 * tinha nada a ver com a causa. Por isso cada compilador é chamado pelo
 * caminho do seu próprio pacote.
 */
const CLI_V3 = resolve(__dirname, '../node_modules/tw3/lib/cli.js');
const CLI_V4 = resolve(__dirname, '../node_modules/tw4-cli/dist/index.mjs');

/*
 * ⚠️ `@import "tailwindcss"` é resolvido pelo NOME a partir da pasta do CSS, e
 * o alias do npm instalou o pacote como `tw4` — de uma pasta temporária, esse
 * nome não existe. Importar pelo caminho do próprio pacote é o que faz o
 * compilador achar o que precisa sem depender de onde o arquivo está.
 */
const ENTRADA_V4 = resolve(__dirname, '../node_modules/tw4/index.css');

/** Classes `govbr-*` que a biblioteca realmente usa nos componentes. */
function classesEmUso(): string[] {
  const dir = join(RAIZ, 'projects/ng-govbr-tw/src/lib/components');
  const padrao =
    /\b(?:bg|text|border|ring|fill|stroke|from|via|to|divide|outline|decoration|shadow|accent|caret|placeholder|font|rounded|gap|w|h)-govbr-[a-z0-9-]+(?:\/[0-9]+)?/g;

  const achadas = new Set<string>();
  for (const pasta of readdirSync(dir, { withFileTypes: true })) {
    if (!pasta.isDirectory()) continue;
    for (const arq of readdirSync(join(dir, pasta.name))) {
      if (!arq.endsWith('.component.ts')) continue;
      const texto = readFileSync(join(dir, pasta.name, arq), 'utf-8');
      for (const m of texto.match(padrao) ?? []) achadas.add(m);
    }
  }
  return [...achadas].sort();
}

/**
 * Nomes de classe presentes no CSS compilado.
 *
 * ⚠️ Casar `.classe {` não serve: utilitário de placeholder sai como
 * `.placeholder-x::placeholder {`, e a primeira versão desta sonda reprovou
 * uma classe que funciona nas duas versões do Tailwind.
 */
function classesGeradas(css: string): Set<string> {
  const nomes = new Set<string>();
  for (const m of css.matchAll(/\.((?:[\w-]|\\\/|\\:)+)(?=[\s,:{>~+[])/g)) {
    nomes.add(m[1].replace(/\\/g, ''));
  }
  return nomes;
}

function compilar(versao: 3 | 4, classes: string[]): Set<string> {
  const dir = mkdtempSync(join(tmpdir(), `tw${versao}-`));
  writeFileSync(join(dir, 'pagina.html'), `<div class="${classes.join(' ')}"></div>`);

  if (versao === 3) {
    writeFileSync(
      join(dir, 'tailwind.config.js'),
      `module.exports = {
        presets: [require(${JSON.stringify(join(RAIZ, 'projects/ng-govbr-tw/tailwind.preset.js'))})],
        content: [${JSON.stringify(join(dir, 'pagina.html'))}],
      };`
    );
    writeFileSync(join(dir, 'entrada.css'), '@tailwind base;@tailwind components;@tailwind utilities;');
    execFileSync(
      'node',
      [CLI_V3, '-c', join(dir, 'tailwind.config.js'), '-i', join(dir, 'entrada.css'), '-o', join(dir, 'saida.css')],
      { stdio: 'pipe' }
    );
  } else {
    /*
     * ⚠️ `--content` é flag do v3 e o v4 a ignora: lá a varredura sai do
     * DIRETÓRIO do CSS de entrada. Sem `@source` explícito o compilador
     * acabava varrendo a pasta de estilos da lib (que os `@import` trazem
     * junto) em vez da página de prova, e o teste acusava dezenas de classes
     * "faltando no v4" que na verdade nunca haviam sido pedidas.
     */
    writeFileSync(
      join(dir, 'entrada.css'),
      `@import ${JSON.stringify(ENTRADA_V4)};\n` +
        `@import ${JSON.stringify(join(ESTILOS, 'govbr-tw.css'))};\n` +
        `@import ${JSON.stringify(join(ESTILOS, 'govbr-tw-v4.css'))};\n` +
        `@source ${JSON.stringify(join(dir, 'pagina.html'))};\n`
    );
    execFileSync(
      'node',
      [CLI_V4, '-i', join(dir, 'entrada.css'), '-o', join(dir, 'saida.css')],
      { stdio: 'pipe' }
    );
  }

  return classesGeradas(readFileSync(join(dir, 'saida.css'), 'utf-8'));
}

test.describe('Tailwind 3 e 4', () => {
  test('o tema v4 está em sincronia com o preset v3', () => {
    // O v4 é gerado do preset. Editar um sem regerar o outro produziria uma
    // classe que funciona numa versão e some na outra, em silêncio.
    execFileSync('node', [join(RAIZ, 'scripts/gerar-tema-v4.mjs'), '--verificar'], {
      stdio: 'pipe',
    });
  });

  test('toda classe govbr da lib compila nas duas versões', () => {
    test.setTimeout(120_000);

    const classes = classesEmUso();
    expect(classes.length, 'nenhuma classe govbr encontrada — o caminho mudou?').toBeGreaterThan(60);

    const v3 = compilar(3, classes);
    const v4 = compilar(4, classes);

    const faltamNoV4 = classes.filter((c) => v3.has(c) && !v4.has(c));
    const faltamNoV3 = classes.filter((c) => v4.has(c) && !v3.has(c));

    expect(faltamNoV4, `compilam no Tailwind 3 e somem no 4:\n  ${faltamNoV4.join('\n  ')}`).toEqual([]);
    expect(faltamNoV3, `compilam no Tailwind 4 e somem no 3:\n  ${faltamNoV3.join('\n  ')}`).toEqual([]);

    // Classe que NENHUM dos dois gera é token inexistente no preset — foi
    // assim que apareceu `ring-govbr-focus-color`, que não existe (o token
    // chama-se `govbr-focus`) e deixava o mega-menu sem anel de foco.
    const inexistentes = classes.filter((c) => !v3.has(c) && !v4.has(c));
    expect(
      inexistentes,
      `classes que não existem em nenhuma versão (token errado?):\n  ${inexistentes.join('\n  ')}`
    ).toEqual([]);
  });
});
