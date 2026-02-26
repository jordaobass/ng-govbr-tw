import { test, expect, type Page } from '@playwright/test';
import { BASE_STORYBOOK } from '../playwright.config';

/**
 * Prova que a CAMADA DE CIMA aparece quando se abre um painel flutuante.
 *
 * Esta suíte nasceu de um defeito que nenhuma das outras pegou: no showcase,
 * **8 de 8** painéis (select, datepicker, timepicker) abriam recortados pelo
 * cartão `rounded-lg overflow-hidden` que os continha. O painel existia no DOM,
 * estava `visible`, tinha fundo e sombra — e mesmo assim metade dele não
 * chegava à tela, porque quem recorta é um ANCESTRAL.
 *
 * Daí as duas perguntas que se fazem aqui, e que presença no DOM não responde:
 *
 *  1. algum ancestral com `overflow` diferente de `visible` corta a caixa?
 *  2. a camada tem z-index alto o bastante para não perder dos vizinhos?
 *
 * ⚠️ `elementFromPoint` NÃO serve de juiz: tooltip usa `pointer-events: none`
 * de propósito, então o navegador devolve o que está atrás e a sonda acusa um
 * defeito inexistente. Foi o que aconteceu na primeira versão desta medição.
 */

/** Menor z-index entre os overlays da lib — abaixo dele o painel perde. */
const Z_MINIMO_DE_CAMADA = 40;

/**
 * Sobe a árvore a partir do painel e devolve quem o recorta.
 *
 * Mede a SUPERFÍCIE (o elemento posicionado que pinta fundo e sombra), não o
 * `ul[role=listbox]` interno — este é `static` e transparente de propósito, e
 * medi-lo faz parecer que não existe camada alguma.
 */
async function medirCamada(page: Page, seletorPainel: string) {
  return page.evaluate((seletor) => {
    const painel = document.querySelector(seletor);
    if (!painel) return { achou: false as const };

    let superficie: Element = painel;
    for (let i = 0; i < 4 && superficie.parentElement; i++) {
      const pos = getComputedStyle(superficie).position;
      if (pos === 'absolute' || pos === 'fixed') break;
      superficie = superficie.parentElement;
    }

    const cs = getComputedStyle(superficie);
    const caixa = superficie.getBoundingClientRect();

    const recortes: string[] = [];
    let no = superficie.parentElement;
    while (no && no !== document.documentElement) {
      const s = getComputedStyle(no);
      const recorta = (v: string) => ['hidden', 'clip', 'auto', 'scroll'].includes(v);
      if (recorta(s.overflowX) || recorta(s.overflowY)) {
        const r = no.getBoundingClientRect();
        if (caixa.bottom > r.bottom + 1 || caixa.right > r.right + 1 || caixa.top < r.top - 1) {
          const classe = (no.className || '').toString().split(' ').slice(0, 3).join('.');
          recortes.push(`${no.tagName.toLowerCase()}.${classe} (overflow ${s.overflowX}/${s.overflowY})`);
        }
      }
      no = no.parentElement;
    }

    return {
      achou: true as const,
      zIndex: cs.zIndex,
      posicao: cs.position,
      temFundo: cs.backgroundColor !== 'rgba(0, 0, 0, 0)',
      temSombra: cs.boxShadow !== 'none',
      recortadoPor: recortes,
    };
  }, seletorPainel);
}

test.describe('A camada de cima tem de aparecer', () => {
  /**
   * O defeito original apareceu no showcase: 8 de 8 painéis recortados pelo
   * cartão `rounded-lg overflow-hidden` que os continha. Com o Storybook
   * substituindo o showcase (D19), a varredura passa a ser sobre as stories
   * — cada uma com seu gatilho —, e o que se mede continua o mesmo: nenhum
   * ancestral pode cortar a caixa do painel.
   */
  test('nenhum painel flutuante é recortado por um ancestral', async ({ page }) => {
    test.setTimeout(180_000);

    const comPainel = [
      'formulários-select--padrao',
      'formulários-select--com-busca',
      'formulários-select--multipla-escolha',
      'formulários-select--com-erro',
      'formulários-date-picker--padrao',
      'formulários-time-picker--padrao',
      'formulários-date-time-picker--padrao',
    ];

    const recortados: string[] = [];
    for (const id of comPainel) {
      await page.goto(
        `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
        { waitUntil: 'networkidle' }
      );

      const gatilho = page.locator('[role="combobox"]').first();
      if (!(await gatilho.count())) continue;
      await gatilho.click();
      // Há transição de 300ms: medir no instante pega a animação pela metade.
      await page.waitForTimeout(400);

      const m = await medirCamada(page, '[role="listbox"], [role="grid"], [role="dialog"]');
      if (m.achou && m.recortadoPor.length) {
        recortados.push(`${id}: ${m.recortadoPor.join(' · ')}`);
      }
    }

    expect(recortados, `painéis recortados:\n  ${recortados.join('\n  ')}`).toEqual([]);
  });

  test('select: o painel sobe acima dos outros overlays', async ({ page }) => {
    await page.goto(
      `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent('formulários-select--padrao')}&viewMode=story`
    );
    await page.waitForLoadState('networkidle');
    await page.locator('[role="combobox"]').first().click();
    await page.waitForTimeout(400);

    const m = await medirCamada(page, '[role="listbox"]');
    expect(m.achou).toBe(true);
    if (!m.achou) return;

    expect(m.posicao, 'o painel tem de flutuar, não empurrar o conteúdo').toBe('absolute');
    expect(m.temFundo, 'sem fundo opaco o painel deixa o conteúdo de trás aparecer').toBe(true);
    expect(m.temSombra, 'a sombra é o que separa visualmente a camada').toBe(true);
    // O menor z-index entre os overlays da lib é 40 (magic-button, cookiebar).
    // Abaixo disso, o dropdown abre ATRÁS deles num formulário real.
    expect(
      Number(m.zIndex),
      `z-index ${m.zIndex} perde dos demais overlays (mínimo ${Z_MINIMO_DE_CAMADA})`
    ).toBeGreaterThanOrEqual(Z_MINIMO_DE_CAMADA);
  });
});
