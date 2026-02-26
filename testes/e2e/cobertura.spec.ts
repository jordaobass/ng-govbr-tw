import { test, expect } from '@playwright/test';
import { BASE_STORYBOOK } from '../playwright.config';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Todo componente exportado precisa aparecer em alguma story.
 *
 * Antes isto mirava o showcase; com o Storybook virando a documentação
 * oficial (D19), a pergunta é a mesma e o lugar mudou: componente exportado
 * no `public-api.ts` sem story é componente que ninguém vê, ninguém testa
 * visualmente e ninguém sabe usar.
 *
 * ⚠️ Não basta o ARQUIVO de story existir: `<br-tab>` tinha story e
 * renderizava uma casca vazia — zero abas, zero painéis — porque as abas vêm
 * de `[tabs]` e a story não passava. Por isso aqui se olha o DOM renderizado,
 * não o diretório.
 */

const RAIZ = resolve(__dirname, '../..');
const LIB = join(RAIZ, 'projects/ng-govbr-tw/src');

/** Seletores dos componentes exportados no `public-api.ts`. */
function seletoresExportados(): Map<string, string> {
  const api = readFileSync(join(LIB, 'public-api.ts'), 'utf-8');
  const pastas = new Set<string>();
  for (const m of api.matchAll(/from '\.\/lib\/components\/([\w-]+)\//g)) pastas.add(m[1]);

  const seletores = new Map<string, string>();
  for (const pasta of pastas) {
    const dir = join(LIB, 'lib/components', pasta);
    for (const arq of readdirSync(dir)) {
      if (!arq.endsWith('.component.ts')) continue;
      const texto = readFileSync(join(dir, arq), 'utf-8');
      for (const m of texto.matchAll(/selector:\s*'(br-[\w-]+)'/g)) {
        seletores.set(m[1], pasta);
      }
    }
  }
  return seletores;
}

test('todo componente exportado é renderizado por alguma story', async ({ page }) => {
  test.setTimeout(240_000);

  const seletores = seletoresExportados();
  expect(seletores.size, 'nenhum seletor encontrado — o caminho da lib mudou?').toBeGreaterThan(40);

  const indice = JSON.parse(
    readFileSync(join(RAIZ, 'dist/storybook/index.json'), 'utf-8')
  );
  const ids = Object.values(indice.entries as Record<string, { id: string; type: string }>)
    .filter((e) => e.type === 'story')
    .map((e) => e.id);

  const vistos = new Set<string>();
  const alvos = [...seletores.keys()];

  for (const id of ids) {
    if (vistos.size === seletores.size) break;

    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(140);

    const presentes = (lista: string[]) =>
      page.evaluate((l) => l.filter((sel) => !!document.querySelector(sel)), lista);

    for (const s of await presentes(alvos)) vistos.add(s);

    /*
     * Alguns componentes só existem com o painel ABERTO — o subitem da barra
     * de menu é um deles. Hover antes do clique porque o submenu da barra
     * abre no `mouseenter`, e há painel que só vive enquanto o ponteiro está
     * sobre o item.
     */
    const gatilhos = await page.locator('[aria-haspopup], [aria-expanded="false"]').all();
    for (const g of gatilhos.slice(0, 4)) {
      await g.hover({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(120);
      for (const s of await presentes(alvos)) vistos.add(s);

      await g.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(120);
      for (const s of await presentes(alvos)) vistos.add(s);
    }
  }

  const ausentes = alvos.filter((s) => !vistos.has(s)).sort();
  expect(
    ausentes,
    `componentes exportados que nenhuma story renderiza:\n  ${ausentes
      .map((s) => `${s} (${seletores.get(s)})`)
      .join('\n  ')}`
  ).toEqual([]);
});

/**
 * Componente composto tem de renderizar as PARTES, não só a casca.
 *
 * `<br-tab>` passava no teste genérico — o elemento estava lá — enquanto a
 * barra de abas nascia vazia. Checagem genérica de "tem conteúdo" não serve:
 * medida em 136 stories, ela acusa 14 e 13 são legítimas (ícone, divisor,
 * botão flutuante fechado, container de toast vazio). O que funciona é dizer
 * explicitamente o que cada composto precisa mostrar.
 */
test('componentes compostos renderizam suas partes', async ({ page }) => {
  const esperado: Array<{ id: string; seletor: string; minimo: number }> = [
    { id: 'navegação-tabs--padrao', seletor: '[role="tab"]', minimo: 2 },
    { id: 'navegação-tabs--segunda-aba', seletor: '[role="tab"]', minimo: 2 },
    { id: 'dados-accordion--padrao', seletor: 'br-accordion-item', minimo: 2 },
    { id: 'navegação-layout--padrao', seletor: 'br-header, br-footer', minimo: 2 },
    { id: 'formulários-radio-group--padrao', seletor: 'input[type=radio]', minimo: 2 },
    { id: 'formulários-checkbox-group--padrao', seletor: 'input[type=checkbox]', minimo: 2 },
    { id: 'dados-wizard--padrao', seletor: '[role="tab"], button', minimo: 2 },
    { id: 'navegação-menu-bar--primario', seletor: '[role="menuitem"]', minimo: 2 },
  ];

  const vazios: string[] = [];
  for (const { id, seletor, minimo } of esperado) {
    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(200);

    const n = await page.locator(seletor).count();
    if (n < minimo) vazios.push(`${id}: ${n} de ${minimo} "${seletor}"`);
  }

  expect(vazios, `stories que renderizam casca vazia:\n  ${vazios.join('\n  ')}`).toEqual([]);
});
