import { test, expect } from '@playwright/test';

/**
 * Comportamento, não renderização.
 *
 * Cada teste aqui cobre um caminho que build verde e teste unitário NÃO pegam.
 * O do toast é o mais importante: ele é o canário da migração para `OnPush`.
 */

test.describe('Toast — o canário do OnPush', () => {
  /**
   * O toast muda estado por `setTimeout`, FORA de evento de template. É
   * exatamente o padrão que `ChangeDetectionStrategy.OnPush` quebra em
   * silêncio: compila, passa no unitário e some da tela. Enquanto este teste
   * estiver verde, a migração do OnPush tem rede.
   */
  test('aparece ao clicar e some sozinho depois', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Toast' }).first().click();

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
    await page.goto('/');
    await page.getByRole('link', { name: 'Toast' }).first().click();

    for (const tipo of ['success', 'danger', 'warning', 'info']) {
      await page.getByTestId(`toast-${tipo}`).click();
    }

    const container = page.locator('br-toast-container');
    await expect(container.locator('[role="alert"]')).toHaveCount(4, { timeout: 5000 });
  });
});

test.describe('Modal — gestão de foco (WCAG 2.4.3)', () => {
  test('prende o foco e devolve ao gatilho ao fechar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Modal' }).first().click();

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
    await page.goto('/');
    await page.getByRole('link', { name: 'Modal' }).first().click();
    await page.getByRole('button', { name: 'Abrir Modal' }).first().click();

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
   */
  test('liga, sobrevive ao reload e desliga', async ({ page }) => {
    await page.goto('/');
    const botao = page.locator('.showcase-topbar-contrast');
    await expect(botao).toBeVisible();

    await botao.click();
    await expect(page.locator('html')).toHaveClass(/govbr-contrast/);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(
      page.locator('html'),
      'o contraste não sobreviveu ao reload — a preferência não está sendo persistida'
    ).toHaveClass(/govbr-contrast/);

    await page.locator('.showcase-topbar-contrast').click();
    await expect(page.locator('html')).not.toHaveClass(/govbr-contrast/);
  });
});

test.describe('Skiplink', () => {
  test('é o primeiro foco da página e aparece ao ser focado', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');

    const atalho = page.locator('br-skiplink a').first();
    await expect(atalho).toBeFocused();
    // Visualmente oculto só até receber foco: aí tem de ser visível de fato.
    await expect(atalho).toBeVisible();
  });
});

test.describe('Accordion e Tabs', () => {
  test('o accordion abre e fecha o painel', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Accordion' }).first().click();

    const item = page.locator('br-accordion-item').nth(1);
    const cabecalho = item.locator('button').first();

    // Mede o estado pelo ARIA, não pelo texto: innerText pode não mudar se o
    // painel só troca de altura, e aí o teste passa sem provar nada.
    const antes = await cabecalho.getAttribute('aria-expanded');
    await cabecalho.click();
    await expect
      .poll(() => cabecalho.getAttribute('aria-expanded'))
      .not.toBe(antes);
  });

  test('as abas trocam o painel ativo', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Tabs' }).first().click();

    const abas = page.locator('br-tab [role="tab"]');
    const total = await abas.count();
    test.skip(total < 2, 'showcase sem abas suficientes');

    await abas.nth(1).click();
    await expect(abas.nth(1)).toHaveAttribute('aria-selected', 'true');
  });
});
