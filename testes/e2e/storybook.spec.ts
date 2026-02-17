import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_STORYBOOK } from '../playwright.config';

/**
 * Suíte do Storybook — a documentação da biblioteca (decisão D19).
 *
 * A lista de casos sai do `index.json` gerado pelo build, não é digitada:
 * story nova entra sozinha, e story que para de renderizar reprova.
 */

const DIST = join(__dirname, '../../dist/storybook');
const AXE = readFileSync(join(__dirname, '../node_modules/axe-core/axe.min.js'), 'utf-8');

type Entrada = { id: string; title: string; name: string; type: string };

function stories(): Entrada[] {
  const indice = JSON.parse(readFileSync(join(DIST, 'index.json'), 'utf-8'));
  return Object.values(indice.entries as Record<string, Entrada>).filter((e) => e.type === 'story');
}

function urlDa(id: string): string {
  return `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`;
}

/**
 * Recursos que podem faltar sem que isso seja defeito da biblioteca: a fonte
 * e os ícones vêm de CDN, e o favicon não existe no build estático.
 */
const RUIDO = [/favicon/i, /cdnjs\.cloudflare/i, /estaleiro\.serpro/i, /net::ERR_/i, /\/index\.json$/];

function vigiarErros(page: Page) {
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(`[pageerror] ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (RUIDO.some((r) => r.test(t))) return;
    // A mensagem de recurso que falha é genérica e NÃO traz a URL — quem sabe
    // a URL é o evento `response`, tratado abaixo.
    if (/Failed to load resource/i.test(t)) return;
    erros.push(t);
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && !RUIDO.some((re) => re.test(r.url()))) {
      erros.push(`HTTP ${r.status()} ${r.url()}`);
    }
  });
  return erros;
}

test.describe('Storybook', () => {
  test('o build expõe uma quantidade plausível de stories', () => {
    expect(stories().length).toBeGreaterThan(100);
  });

  test('toda story renderiza um componente da lib, sem erro de runtime', async ({ page }) => {
    // 114 stories por teste nao cabem no timeout padrao de 30s.
    test.setTimeout(180_000);
    const erros = vigiarErros(page);
    const falhas: string[] = [];

    for (const s of stories()) {
      await page.goto(urlDa(s.id), { waitUntil: 'networkidle' });
      const qtd = await page.evaluate(() => {
        const raiz = document.querySelector('#storybook-root') || document.body;
        return Array.from(raiz.querySelectorAll('*')).filter((e) =>
          e.tagName.toLowerCase().startsWith('br-')
        ).length;
      });
      if (qtd === 0) falhas.push(`${s.title} › ${s.name}: nenhum componente br-* renderizado`);
    }

    expect(falhas, falhas.join('\n')).toEqual([]);
    expect(erros, `erros de runtime:\n${erros.slice(0, 5).join('\n')}`).toEqual([]);
  });

  /**
   * "Cabe na tela" é requisito, não detalhe: 360px é a largura onde componente
   * estoura. O `br-stepper` horizontal chegava a 465px numa janela de 360 e
   * empurrava a página inteira.
   */
  for (const largura of [360, 768, 1280]) {
    test(`nenhuma story estoura a largura a ${largura}px`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width: largura, height: 900 });
      const estouram: string[] = [];

      for (const s of stories()) {
        await page.goto(urlDa(s.id), { waitUntil: 'networkidle' });
        const r = await page.evaluate(() => ({
          conteudo: document.documentElement.scrollWidth,
          janela: document.documentElement.clientWidth,
        }));
        // Conteúdo largo deve rolar DENTRO do próprio container; a página
        // nunca rola na horizontal.
        if (r.conteudo > r.janela + 1) {
          estouram.push(`${s.title} › ${s.name}: ${r.conteudo}px > ${r.janela}px`);
        }
      }

      expect(estouram, estouram.join('\n')).toEqual([]);
    });
  }

  test('nenhuma story tem violação séria ou crítica de acessibilidade', async ({ page }) => {
    test.setTimeout(180_000);
    const achados: string[] = [];

    for (const s of stories()) {
      await page.goto(urlDa(s.id), { waitUntil: 'networkidle' });
      await page.addScriptTag({ content: AXE });

      const violacoes = await page.evaluate(async () => {
        const res = await (window as unknown as { axe: { run: (c: Element, o: object) => Promise<{ violations: { id: string; impact: string; help: string; nodes: { html: string; element?: Element; target: string[] }[] }[] }> } })
          .axe.run(document.querySelector('#storybook-root') || document.body, { resultTypes: ['violations'], elementRef: true });

        return res.violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .flatMap((v) =>
            v.nodes
              .filter((n) => {
                /*
                 * A WCAG 1.4.3 isenta de contraste "texto que faz parte de um
                 * componente de interface INATIVO". O axe não sabe disso e
                 * acusa o rótulo de controle desabilitado. Não é defeito — e
                 * suprimir a regra inteira esconderia os casos reais, por isso
                 * a exceção é só para nó dentro de controle inativo.
                 */
                if (v.id !== 'color-contrast') return true;
                const el =
                  (n.element as HTMLElement | undefined) ??
                  (document.querySelector((n as unknown as { target: string[] }).target.join(' ')) as HTMLElement | null);
                return !el?.closest('[disabled], [aria-disabled="true"], .opacity-50');
              })
              .map((n) => `${v.impact}/${v.id}: ${n.html.slice(0, 90)}`)
          );
      });

      for (const v of violacoes) achados.push(`${s.title} › ${s.name} — ${v}`);
    }

    expect(achados, `violações de acessibilidade:\n${achados.slice(0, 10).join('\n')}`).toEqual([]);
  });
});
