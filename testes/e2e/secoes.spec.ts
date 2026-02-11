import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

/**
 * Percorre TODAS as seções do showcase e prova que cada uma renderiza sem
 * erro de runtime.
 *
 * A lista de casos sai da própria navegação renderizada, não de um array
 * copiado para cá: seção nova entra no teste sozinha, e seção removida não
 * deixa teste órfão passando à toa.
 */

/** Erros de console que não são da biblioteca e não devem reprovar a suíte. */
const RUIDO_CONHECIDO = [
  /favicon/i,
  /net::ERR_(INTERNET_DISCONNECTED|NAME_NOT_RESOLVED|CONNECTION_)/i,
  // Rawline e Font Awesome vêm de CDN; sem rede, a tipografia degrada e a
  // página continua correta. Não é defeito da lib.
  /cdnjs\.cloudflare\.com/i,
  /cdngovbr-ds\.estaleiro\.serpro\.gov\.br/i,
];

function coletarErros(page: Page): string[] {
  const erros: string[] = [];
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() !== 'error') return;
    const texto = msg.text();
    if (RUIDO_CONHECIDO.some((r) => r.test(texto))) return;
    erros.push(texto);
  });
  page.on('pageerror', (e) => erros.push(`[pageerror] ${e.message}`));
  return erros;
}

test.describe('Showcase — todas as seções', () => {
  test('a navegação lista seções e cada uma tem um alvo no documento', async ({ page }) => {
    const erros = coletarErros(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const secoes = await page.locator('section[id]').evaluateAll((els) =>
      els.map((e) => e.id).filter(Boolean)
    );
    expect(secoes.length, 'o showcase deveria ter dezenas de seções').toBeGreaterThan(30);

    // Toda entrada da navegação precisa apontar para uma seção que existe.
    const idsNav = await page
      .locator('nav a[href^="#"], [role="navigation"] a[href^="#"]')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).hash.slice(1)));

    // O alvo não precisa ser uma <section>: o skiplink aponta para
    // <main id="conteudo">. O que importa é o id EXISTIR na página.
    const quebrados: string[] = [];
    for (const id of idsNav) {
      if (!id) continue;
      if ((await page.locator(`[id="${id}"]`).count()) === 0) quebrados.push(id);
    }
    expect(quebrados, `âncoras apontando para id inexistente: ${quebrados}`).toEqual([]);

    expect(erros, `erros de console ao carregar:\n${erros.join('\n')}`).toEqual([]);
  });

  test('cada seção fica visível ao ser alcançada, sem erro de runtime', async ({ page }) => {
    const erros = coletarErros(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ids = await page.locator('section[id]').evaluateAll((els) =>
      els.map((e) => e.id).filter(Boolean)
    );

    const invisiveis: string[] = [];
    for (const id of ids) {
      const secao = page.locator(`section[id="${id}"]`);
      await secao.scrollIntoViewIfNeeded();
      // `toBeVisible` cobre display:none, visibility:hidden e tamanho zero —
      // exatamente os jeitos de um componente "existir" sem aparecer.
      if (!(await secao.isVisible())) invisiveis.push(id);
    }

    expect(invisiveis, `seções que não ficam visíveis: ${invisiveis.join(', ')}`).toEqual([]);
    expect(erros, `erros de console ao percorrer as seções:\n${erros.join('\n')}`).toEqual([]);
  });
});
