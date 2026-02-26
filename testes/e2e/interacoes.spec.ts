import { test, expect, type Page } from '@playwright/test';
import { BASE_STORYBOOK } from '../playwright.config';

/**
 * Comportamento, não renderização.
 *
 * Cada teste aqui cobre um caminho que build verde e teste unitário NÃO pegam.
 * O do toast é o mais importante: ele é o canário da migração para `OnPush`.
 *
 * Esta suíte mirava o showcase, que foi substituído pelo Storybook (D19). A
 * tradução não foi mecânica: duas stories tiveram de nascer para não perder
 * cobertura — o modal **com gatilho** (sem botão não há para onde o foco
 * voltar) e o alto contraste **pelo serviço** (a barra do Storybook põe a
 * classe direto e não exercita a persistência).
 */

/** Abre uma story isolada, sem a casca do Storybook em volta. */
async function abrirStory(page: Page, id: string): Promise<void> {
  await page.goto(`${BASE_STORYBOOK}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
}

test.describe('Toast — o canário do OnPush', () => {
  /**
   * O toast muda estado por `setTimeout`, FORA de evento de template. É
   * exatamente o padrão que `ChangeDetectionStrategy.OnPush` quebra em
   * silêncio: compila, passa no unitário e some da tela. Enquanto este teste
   * estiver verde, a migração do OnPush tem rede.
   */
  test('aparece ao clicar e some sozinho depois', async ({ page }) => {
    await abrirStory(page, 'feedback-toast--padrao');

    const container = page.locator('br-toast-container');
    await expect(container).toHaveCount(1, { timeout: 5000 });

    await page.getByTestId('toast-success').click();

    // O container renderiza um <div role="alert"> por toast — não um <br-toast>.
    const toast = container.locator('[role="alert"]').first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/sucesso/i);

    // Auto-dismiss: o padrão do service é 5s. Se o OnPush quebrar o timer, o
    // toast fica preso na tela e este expect falha por timeout.
    await expect(toast).toBeHidden({ timeout: 15_000 });
  });

  test('empilha os quatro tipos', async ({ page }) => {
    await abrirStory(page, 'feedback-toast--padrao');

    for (const tipo of ['success', 'danger', 'warning', 'info']) {
      await page.getByTestId(`toast-${tipo}`).click();
    }

    const container = page.locator('br-toast-container');
    await expect(container.locator('[role="alert"]')).toHaveCount(4, { timeout: 5000 });
  });
});

test.describe('Modal — gestão de foco (WCAG 2.4.3)', () => {
  test('prende o foco e devolve ao gatilho ao fechar', async ({ page }) => {
    await abrirStory(page, 'feedback-modal--com-gatilho');

    const gatilho = page.getByRole('button', { name: 'Abrir Modal' }).first();
    await gatilho.click();

    const dialogo = page.getByRole('dialog');
    await expect(dialogo).toBeVisible();

    // Foco inicial precisa estar DENTRO do diálogo — sem isso, o leitor de
    // tela continua lendo a página de trás, que `aria-modal` declarou inerte.
    await expect
      .poll(() => dialogo.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);

    // Tab várias vezes não pode escapar do diálogo.
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    expect(
      await dialogo.evaluate((el) => el.contains(document.activeElement)),
      'o foco escapou do diálogo — focus trap não está prendendo'
    ).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialogo).toBeHidden();

    // E volta para quem abriu.
    await expect(gatilho).toBeFocused();
  });

  test('o backdrop não entra na ordem de tabulação', async ({ page }) => {
    await abrirStory(page, 'feedback-modal--padrao');

    const backdrop = page.getByRole('dialog').locator('[aria-hidden="true"]').first();
    await expect(backdrop).toHaveCount(1);
    expect(await backdrop.getAttribute('tabindex')).toBeNull();
    expect(await backdrop.getAttribute('role')).toBeNull();
  });
});

test.describe('Alto contraste', () => {
  /**
   * O estado vivia num booleano de componente e o F5 desligava o tema. Para
   * quem depende de alto contraste, isso é a funcionalidade não existir.
   *
   * ⚠️ A story usada aqui chama o `BrContrastService`, não a barra do
   * Storybook: só o serviço persiste, e é ele que o consumidor usa.
   */
  test('liga, sobrevive ao reload e desliga', async ({ page }) => {
    await abrirStory(page, 'serviços-alto-contraste--padrao');

    const botao = page.getByTestId('alternar-contraste');
    await expect(botao).toBeVisible();

    await botao.click();
    await expect(page.locator('html')).toHaveClass(/govbr-contrast/);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(
      page.locator('html'),
      'o contraste não sobreviveu ao reload — a preferência não está sendo persistida'
    ).toHaveClass(/govbr-contrast/);

    await page.getByTestId('alternar-contraste').click();
    await expect(page.locator('html')).not.toHaveClass(/govbr-contrast/);
  });
});

test.describe('Skiplink', () => {
  test('é o primeiro foco da página e aparece ao ser focado', async ({ page }) => {
    await abrirStory(page, 'navegação-skiplink--padrao');

    await page.keyboard.press('Tab');

    const atalho = page.locator('br-skiplink a').first();
    await expect(atalho).toBeFocused();
    // Visualmente oculto só até receber foco: aí tem de ser visível de fato.
    await expect(atalho).toBeVisible();
  });
});

test.describe('Accordion e Tabs', () => {
  test('o accordion abre e fecha o painel', async ({ page }) => {
    await abrirStory(page, 'dados-accordion--padrao');

    const item = page.locator('br-accordion-item').nth(1);
    const cabecalho = item.locator('button').first();

    // Mede o estado pelo ARIA, não pelo texto: innerText pode não mudar se o
    // painel só troca de altura, e aí o teste passa sem provar nada.
    const antes = await cabecalho.getAttribute('aria-expanded');
    await cabecalho.click();
    await expect.poll(() => cabecalho.getAttribute('aria-expanded')).not.toBe(antes);
  });

  test('as abas trocam o painel ativo', async ({ page }) => {
    await abrirStory(page, 'navegação-tabs--padrao');

    const abas = page.locator('br-tab [role="tab"]');
    await expect(abas.nth(1)).toBeVisible();

    await abas.nth(1).click();
    await expect(abas.nth(1)).toHaveAttribute('aria-selected', 'true');
  });
});
