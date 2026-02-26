import { test, expect, type Page } from '@playwright/test';
import { BASE_STORYBOOK } from '../playwright.config';

/**
 * Qualquer story serve de superfície de medição: o que importa é uma página
 * com o CSS da biblioteca carregado, e toda story carrega o mesmo conjunto que
 * o `ng-add` configura num projeto consumidor. Esta é escolhida por ter fundo,
 * texto e borda de token na mesma tela.
 */
const PAGINA = `${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(
  'serviços-alto-contraste--padrao'
)}&viewMode=story`;

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
  await page.goto(PAGINA);
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
  await page.goto(PAGINA);
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

/**
 * O anel de foco precisa de 3:1 contra as cores adjacentes (WCAG 1.4.11).
 *
 * O valor antigo (`#ffbe2e`, que no DS oficial é o foco do tema ESCURO) dava
 * 1,66:1 sobre branco — reprovava com folga. O atual é o `--focus-color-light`
 * oficial (`#c2850c`, gold-vivid-40).
 *
 * ⚠️ Medido: 3,16:1 sobre `--govbr-bg` (branco) e **2,97:1 sobre
 * `--govbr-gray-2`**, que é o fundo de página. Fica 0,03 abaixo do mínimo
 * contra o cinza — mesma situação do DS oficial, já que o tom é o dele. O
 * teste trava o valor para que uma regressão (voltar ao amarelo claro) não
 * passe despercebida.
 */
test('o anel de foco contrasta com a superfície do componente', async ({ page }) => {
  await page.goto(PAGINA);
  await page.waitForLoadState('networkidle');

  const medir = () =>
    page.evaluate(() => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 1;
      const ctx = cv.getContext('2d')!;
      const rgb = (v: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = '#000';
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]] as [number, number, number];
      };
      const lum = ([r, g, b]: [number, number, number]) => {
        const f = (c: number) => {
          c /= 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const raiz = getComputedStyle(document.documentElement);
      const foco = rgb(raiz.getPropertyValue('--govbr-focus-color').trim());
      const superficie = rgb(raiz.getPropertyValue('--govbr-bg').trim());
      const [a, b] = [lum(foco), lum(superficie)].sort((x, y) => y - x);
      return +(((a + 0.05) / (b + 0.05)).toFixed(2));
    });

  const claro = await medir();
  expect(claro, `foco sobre a superfície do componente: ${claro}:1`).toBeGreaterThanOrEqual(3);

  await page.evaluate(() => document.documentElement.classList.add('govbr-contrast'));
  await page.waitForTimeout(600);
  const escuro = await medir();
  expect(escuro, `foco no alto contraste: ${escuro}:1`).toBeGreaterThanOrEqual(3);
});
