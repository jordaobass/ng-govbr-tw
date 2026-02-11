import { test, expect, type Page } from '@playwright/test';

/**
 * O tema de alto contraste tem de ALCANÇAR as classes que os componentes usam.
 *
 * Este teste nasceu de um defeito real: 11 componentes usavam a paleta padrão
 * do Tailwind (`bg-red-50`, `text-red-800`) e 140 usos de `bg-white`, enquanto
 * o `govbr-contrast.css` só remapeava variáveis `--govbr-*`. Toast, modal e
 * mensagens de erro simplesmente não mudavam de cor — justamente os
 * componentes que comunicam estado crítico.
 *
 * A medição é feita em PIXEL, não na string do CSS: cor vinda do navegador
 * pode chegar em `lab()`/`oklch()`, e extrair número com regex produz lixo.
 * Resolve-se desenhando a cor num canvas 1x1 e lendo `getImageData`.
 */

const CLASSES_FUNDO = [
  'bg-govbr-danger-bg',
  'bg-govbr-success-bg',
  'bg-govbr-warning-bg',
  'bg-govbr-info-bg',
  'bg-govbr-danger',
  'bg-govbr-success',
  'bg-govbr-warning',
  'bg-govbr-bg',
  'bg-govbr-primary',
  'bg-govbr-gray-2',
];

const CLASSES_TEXTO = [
  'text-govbr-on-primary',
  'text-govbr-danger-dark',
  'text-govbr-success-dark',
  'text-govbr-warning-dark',
  'text-govbr-primary-dark',
  'text-govbr-gray-80',
];

async function medirCores(page: Page, fundo: string[], texto: string[]) {
  return page.evaluate(
    ({ fundo, texto }) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 1;
      const ctx = cv.getContext('2d')!;
      const resolver = (valor: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = '#000';
        ctx.fillStyle = valor;
        ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data).join(',');
      };
      const saida: Record<string, string> = {};
      for (const c of fundo) {
        const el = document.createElement('div');
        el.className = c;
        document.body.appendChild(el);
        saida[c] = resolver(getComputedStyle(el).backgroundColor);
        el.remove();
      }
      for (const c of texto) {
        const el = document.createElement('span');
        el.className = c;
        el.textContent = 'x';
        document.body.appendChild(el);
        saida[c] = resolver(getComputedStyle(el).color);
        el.remove();
      }
      return saida;
    },
    { fundo, texto }
  );
}

test('toda classe de token responde ao tema de alto contraste', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const claro = await medirCores(page, CLASSES_FUNDO, CLASSES_TEXTO);

  await page.evaluate(() => document.documentElement.classList.add('govbr-contrast'));
  // Há transições declaradas: ler no instante da troca mede a animação pela
  // metade e produz falha intermitente.
  await page.waitForTimeout(600);

  const contraste = await medirCores(page, CLASSES_FUNDO, CLASSES_TEXTO);

  const presas = [...CLASSES_FUNDO, ...CLASSES_TEXTO].filter(
    (c) => claro[c] === contraste[c]
  );

  expect(
    presas,
    `classes que NÃO mudam no alto contraste (ficam presas no tema claro):\n  ${presas
      .map((c) => `${c}: ${claro[c]}`)
      .join('\n  ')}`
  ).toEqual([]);
});

test('as variáveis de token estão definidas na página', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Guarda contra o defeito que o demo teve: importava `govbr-components.css`
  // e `govbr-contrast.css` mas NÃO o `govbr-tw.css`, que define os tokens.
  // Ficou invisível enquanto os componentes usavam hex literal.
  const faltando = await page.evaluate(() => {
    const raiz = getComputedStyle(document.documentElement);
    const exigidas = [
      '--govbr-primary',
      '--govbr-danger-bg',
      '--govbr-success-bg',
      '--govbr-on-primary',
      '--govbr-primary-rgb',
      '--govbr-danger-bg-rgb',
    ];
    return exigidas.filter((v) => !raiz.getPropertyValue(v).trim());
  });

  expect(faltando, `variáveis de token ausentes: ${faltando.join(', ')}`).toEqual([]);
});
