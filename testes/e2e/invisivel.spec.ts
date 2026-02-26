import { test, expect, type Page } from '@playwright/test';
import { BASE_STORYBOOK } from '../playwright.config';

/**
 * Procura o que FICA INVISÍVEL — principalmente no alto contraste.
 *
 * Esta suíte existe porque as outras **não pegaram** um defeito real: no alto
 * contraste, os links do rodapé ficavam brancos sobre fundo branco (1:1) e o
 * texto de botão de aviso branco sobre amarelo (1,07:1). Os testes que havia
 * verificavam presença no DOM, largura e axe — nenhum deles enxerga texto
 * pintado da cor do próprio fundo dentro de um componente.
 *
 * A diferença para o teste de tokens é essencial: lá se prova que a variável
 * MUDA de valor; aqui se prova que o resultado é LEGÍVEL contra o fundo real
 * em que o texto foi pintado.
 */

/** Lido no navegador: percorre tudo que é visível e mede contra o fundo real. */
async function procurarInvisiveis(page: Page) {
  return page.evaluate(() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d')!;

    const rgba = (v: string): [number, number, number, number] => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };

    const lum = ([r, g, b]: number[]) => {
      const f = (c: number) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const razao = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
      return (x + 0.05) / (y + 0.05);
    };

    /**
     * Fundo transparente herda o do ancestral — sem subir a árvore, mede-se a
     * cor errada. ⚠️ Limitação conhecida: gradiente (`background-image`) não é
     * detectado, então elemento sobre gradiente é ignorado para não gerar
     * falso positivo.
     */
    const fundoReal = (el: Element): [number, number, number, number] | null => {
      let no: Element | null = el;
      while (no && no !== document.documentElement) {
        const cs = getComputedStyle(no);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
        const c = rgba(cs.backgroundColor);
        if (c[3] > 0.5) return c;
        no = no.parentElement;
      }
      const corpo = rgba(getComputedStyle(document.body).backgroundColor);
      return corpo[3] > 0.5 ? corpo : [255, 255, 255, 1];
    };

    const invisiveis: string[] = [];

    for (const el of Array.from(document.querySelectorAll('*'))) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (parseFloat(cs.opacity) < 0.1) continue;
      const cx = el.getBoundingClientRect();
      if (cx.width === 0 || cx.height === 0) continue;

      // A WCAG isenta componente inativo de contraste.
      if (el.closest('[disabled], [aria-disabled="true"]')) continue;

      const temTexto = Array.from(el.childNodes).some(
        (n) => n.nodeType === 3 && (n.textContent || '').trim().length > 1
      );
      const temIcone = /fa-|fas /.test((el.className || '').toString());
      if (!temTexto && !temIcone) continue;

      const fundo = fundoReal(el);
      if (!fundo) continue; // sobre gradiente: não dá para medir com segurança

      const r = razao(rgba(cs.color), fundo);
      // Limiar propositalmente baixo: aqui se caça o INVISÍVEL (cor igual ao
      // fundo), não o que apenas está abaixo do ideal — disso cuida o axe.
      if (r < 1.5) {
        invisiveis.push(
          `${r.toFixed(2)}:1  <${el.tagName.toLowerCase()}> "${(el.textContent || '').trim().slice(0, 40)}"`
        );
      }
    }
    return invisiveis;
  });
}

test.describe('Nada pode ficar invisível', () => {
  /*
   * Os dois temas, e não só o alto contraste: o defeito pode nascer do lado
   * claro também, e varrer um só deles é medir metade. Antes havia uma
   * passagem pelo showcase para o tema claro; com o Storybook virando a
   * documentação (D19), as 136 stories cobrem muito mais superfície do que
   * cobria a página única.
   */
  for (const contraste of [false, true]) {
    const nome = contraste ? 'no alto contraste' : 'no tema claro';

    test(`storybook: nenhum texto ou ícone some ${nome}`, async ({ page }) => {
      test.setTimeout(240_000);
      const { readFileSync } = await import('node:fs');
      const { join } = await import('node:path');
      const indice = JSON.parse(
        readFileSync(join(__dirname, '../../dist/storybook/index.json'), 'utf-8')
      );
      const ids = Object.values(indice.entries as Record<string, { id: string; type: string }>)
        .filter((e) => e.type === 'story')
        .map((e) => e.id);

      const achados: string[] = [];
      for (const id of ids) {
        /*
         * ⚠️ O tema entra pelo GLOBAL do Storybook, não forçando a classe no
         * `<html>`. O decorator faz as duas coisas — põe a classe E pinta o
         * fundo do `<body>` com o token do tema. Forçar só a classe deixa
         * texto escuro-de-contraste sobre fundo claro, e a sonda acusou
         * breadcrumb e checkbox-group a 1,06:1 num defeito que era meu.
         */
        const global = contraste ? '&globals=contraste:true' : '';
        await page.goto(
          `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story${global}`,
          { waitUntil: 'domcontentloaded' }
        );
        // Há transições declaradas: medir no instante da troca pega a animação
        // pela metade e produz falha intermitente.
        await page.waitForTimeout(contraste ? 300 : 160);

        for (const a of await procurarInvisiveis(page)) achados.push(`${id} — ${a}`);
      }

      expect(
        achados,
        `invisíveis ${nome}:\n  ${achados.slice(0, 12).join('\n  ')}`
      ).toEqual([]);
    });
  }
});
