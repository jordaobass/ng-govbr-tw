import { test, expect, type Page } from '@playwright/test';
import { BASE_STORYBOOK } from '../playwright.config';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * A página de DOCS — a metade do Storybook que nenhum teste tocava.
 *
 * Todas as suítes anteriores abriam `iframe.html?…&viewMode=story`. Mas o
 * link que se compartilha é `?path=/docs/…`, e é lá que o leitor chega pela
 * barra lateral. Era outro produto, sem nenhuma verificação — e estava assim:
 *
 *  - `.docs-story` vem do Storybook com `padding: 0`, e os campos ficavam
 *    encostados na borda, um colado no outro;
 *  - e com `overflow: hidden`, que recortava o painel do mega-menu: 102px de
 *    conteúdo dentro de um bloco de 44px. O componente parecia não funcionar;
 *  - mesmo com `overflow: visible`, o wrapper de zoom usa `transform` — que
 *    cria contexto de empilhamento — então o exemplo SEGUINTE pintava por
 *    cima do painel aberto. Medido: date-time-picker transbordava 657px,
 *    time-picker 629px, date-picker 279px.
 */

const RAIZ = resolve(__dirname, '../..');

function paginasDeDocs(): string[] {
  const indice = JSON.parse(readFileSync(join(RAIZ, 'dist/storybook/index.json'), 'utf-8'));
  return [
    ...new Set(
      Object.values(indice.entries as Record<string, { id: string; type: string }>)
        .filter((e) => e.type === 'docs')
        .map((e) => e.id)
    ),
  ];
}

const irPara = (page: Page, id: string) =>
  page.goto(`${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=docs`, {
    waitUntil: 'domcontentloaded',
  });

test.describe('Página de documentação', () => {
  test('nenhum exemplo fica colado na borda do bloco', async ({ page }) => {
    test.setTimeout(240_000);

    const semRespiro: string[] = [];
    for (const id of paginasDeDocs()) {
      await irPara(page, id);
      await page.waitForTimeout(350);

      const ruins = await page.evaluate(() => {
        const fora: string[] = [];
        document.querySelectorAll('.docs-story').forEach((bloco, i) => {
          const pad = parseFloat(getComputedStyle(bloco).paddingTop);
          if (pad < 8) fora.push(`bloco ${i}: padding ${pad}px`);
        });
        return fora;
      });
      for (const r of ruins) semRespiro.push(`${id} · ${r}`);
    }

    expect(
      semRespiro,
      `exemplos sem respiro na página de docs:\n  ${semRespiro.slice(0, 10).join('\n  ')}`
    ).toEqual([]);
  });

  test('painel aberto não é coberto pelo exemplo de baixo', async ({ page }) => {
    test.setTimeout(240_000);

    const cobertos: string[] = [];
    for (const id of paginasDeDocs()) {
      await irPara(page, id);
      await page.waitForTimeout(400);

      // abre o que expande no primeiro exemplo da página
      const gatilhos = await page
        .locator('.docs-story')
        .first()
        .locator('[role="combobox"], [aria-haspopup]')
        .all();
      if (!gatilhos.length) continue;

      for (const g of gatilhos.slice(0, 2)) {
        await g.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(400);
      }

      const r = await page.evaluate(() => {
        const painel = document.querySelector('[role="listbox"], [role="dialog"], [role="grid"]');
        if (!painel) return null;
        const cx = painel.getBoundingClientRect();
        if (cx.height < 4) return null;

        /*
         * ⚠️ Sondar o TOPO do painel não prova nada: ali ele ainda está
         * dentro do próprio bloco, e nunca é coberto. O transbordo acontece
         * EMBAIXO, que é onde o exemplo seguinte pinta por cima. A primeira
         * versão deste teste sobreviveu à mutação que desligava a regra de
         * empilhamento — foi assim que o furo apareceu.
         */
        const topo = document.elementFromPoint(
          Math.round(cx.left + cx.width / 2),
          Math.round(cx.bottom - 8)
        );
        /*
         * ⚠️ ANCESTRAL não é "por cima". A primeira versão desta checagem
         * reprovava sempre, porque `elementFromPoint` devolvia o próprio
         * `.docs-story` que CONTÉM o painel.
         */
        const proprio = topo && (painel.contains(topo) || topo === painel || topo.contains(painel));
        return proprio
          ? null
          : `${topo?.tagName.toLowerCase()}.${(topo?.className || '').toString().split(' ')[0]}`;
      });

      if (r) cobertos.push(`${id} · coberto por ${r}`);
    }

    expect(
      cobertos,
      `painéis cobertos na página de docs:\n  ${cobertos.join('\n  ')}`
    ).toEqual([]);
  });
});

/**
 * Story que liga `[input]="arg"` sem o arg existir.
 *
 * Em Angular, `undefined` num `@Input` NÃO cai no default da classe — ele
 * sobrescreve. O `br-button` ligava `[size]="size"` com `size` fora de
 * `args`: a densidade virava `undefined`, `densityMap[undefined]` também, e o
 * botão saía SEM `px-5 py-2`. Na tela virava um texto azul colado, sem forma
 * de botão — exatamente o que foi reportado.
 *
 * Eram 20 stories com o mesmo padrão. É checagem estática de propósito: vale
 * para todo componente, inclusive os que ainda não têm story.
 *
 * ⚠️ LIMITE CONHECIDO: os args são coletados do ARQUIVO inteiro, não por
 * story. Um `variant` declarado só na story `Grande` faz a `Padrao` parecer
 * coberta — foi assim que o `br-success-check` passou por aqui e chegou
 * quebrado ao site. Quem fecha essa brecha é o teste de runtime abaixo, que
 * mede o sintoma em vez da causa.
 */
test('nenhuma story apaga o default de um @Input', () => {
  const LIB = join(RAIZ, 'projects/ng-govbr-tw/src/lib');

  function* arquivos(dir: string): Generator<string> {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) yield* arquivos(p);
      else yield p;
    }
  }

  const problemas: string[] = [];
  for (const arq of arquivos(LIB)) {
    if (!arq.endsWith('.stories.ts')) continue;
    const s = readFileSync(arq, 'utf-8');

    const ligados = new Set(
      [...s.matchAll(/\[([a-zA-Z]\w*)\]="([a-zA-Z]\w*)"/g)].map((m) => m[2])
    );
    const argsTxt = [...s.matchAll(/args:\s*\{([\s\S]*?)\}\s*as never/g)]
      .map((m) => m[1])
      .join(',');
    const temArg = new Set([...argsTxt.matchAll(/([a-zA-Z]\w*)\s*:/g)].map((m) => m[1]));

    const faltando = [...ligados].filter((x) => !temArg.has(x));
    if (!faltando.length) continue;

    const dir = arq.slice(0, arq.lastIndexOf('/'));
    const fonte = readdirSync(dir)
      .filter((f) => f.endsWith('.component.ts'))
      .map((f) => readFileSync(join(dir, f), 'utf-8'))
      .join('\n');

    for (const nome of faltando) {
      // só é defeito quando o input TEM default: `[error]="error"` indefinido
      // é normal, porque o default dele já é undefined
      const campo = new RegExp(`@Input\\(\\)\\s+${nome}\\s*(?::[^=\\n]+?)?\\s*=\\s*([^;\\n]+)`);
      const setter = new RegExp(`@Input\\(\\)\\s+set\\s+${nome}\\b`);
      const m = fonte.match(campo);
      if ((m && m[1].trim() !== 'undefined') || setter.test(fonte)) {
        problemas.push(`${arq.replace(LIB + '/', '')} → [${nome}] sem valor em args`);
      }
    }
  }

  expect(
    problemas,
    `stories que passam undefined e apagam o default do componente:\n  ${problemas.join('\n  ')}`
  ).toEqual([]);
});

test('componentes com densidade renderizam com espaçamento', async ({ page }) => {
  /*
   * O caso concreto que o defeito acima produziu: botão sem padding nenhum,
   * um texto azul colado em vez de um botão. Medir a classe não bastaria —
   * ela estava lá; o que faltava era o resultado.
   */
  /*
   * ⚠️ Só botão. A primeira versão incluía o `br-switch` e reprovava com
   * "altura 24px" — mas `h-6` É o tamanho correto do interruptor médio. A
   * expectativa estava errada, não o componente; um limiar único não serve
   * para componentes de escalas diferentes.
   */
  const alvos = [
    { id: 'formulários-button--primario', seletor: 'br-button button' },
    { id: 'formulários-button--secundario', seletor: 'br-button button' },
    { id: 'formulários-button--perigo', seletor: 'br-button button' },
    { id: 'formulários-button--carregando', seletor: 'br-button button' },
  ];

  const achatados: string[] = [];
  for (const { id, seletor } of alvos) {
    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(300);

    const r = await page.locator(seletor).first().evaluate((el) => {
      const cs = getComputedStyle(el);
      const cx = el.getBoundingClientRect();
      return {
        padX: parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight),
        altura: Math.round(cx.height),
      };
    });

    // Botão `medium` do DS: `px-5 py-2 text-base` → ~40px de altura e 40px
    // de padding horizontal. Sem as classes de densidade ele colapsa na
    // altura da linha de texto, com zero padding.
    if (r.altura < 32 || r.padX < 16) {
      achatados.push(`${id}: altura ${r.altura}px, padding-x ${r.padX}px`);
    }
  }

  expect(
    achatados,
    `componentes achatados (classes de densidade perdidas?):\n  ${achatados.join('\n  ')}`
  ).toEqual([]);
});

/**
 * Nenhum elemento pode ter a classe literal `undefined`.
 *
 * É o sintoma de um mapa de classes indexado por valor indefinido:
 * `variantStyles[undefined]` é `undefined`, e o template literal interpola
 * isso como TEXTO. O `br-success-check` saía com
 * `class="… rounded-full h-10 undefined w-10"` — sem fundo e sem cor de
 * traço, invisível na página branca. Reportado olhando a tela.
 *
 * Este teste mede o RESULTADO, não a causa: pega qualquer origem, em qualquer
 * story, sem depender de a análise estática estar certa. Há 56 mapas
 * indexados por `@Input` na biblioteca — guardar todos seria um diff enorme;
 * um portão que acusa o sintoma protege os 56.
 */
test('nenhum elemento renderiza com a classe "undefined"', async ({ page }) => {
  test.setTimeout(240_000);

  const indice = JSON.parse(readFileSync(join(RAIZ, 'dist/storybook/index.json'), 'utf-8'));
  const ids = Object.values(indice.entries as Record<string, { id: string; type: string }>)
    .filter((e) => e.type === 'story')
    .map((e) => e.id);

  const achados: string[] = [];
  for (const id of ids) {
    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(130);

    for (const r of await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('#storybook-root *').forEach((e) => {
        const c = e.getAttribute('class') || '';
        if (/(^|\s)undefined(\s|$)/.test(c)) {
          out.push(`${e.tagName.toLowerCase()}: ${c.slice(0, 60)}`);
        }
      });
      return out;
    })) {
      achados.push(`${id} · ${r}`);
    }
  }

  expect(
    achados,
    `elementos com classe "undefined" (mapa indexado por valor indefinido):\n  ${achados.join('\n  ')}`
  ).toEqual([]);
});
