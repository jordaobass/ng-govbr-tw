import { test, expect, type Page } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Nenhum componente da biblioteca pode ser invisível.
 *
 * Este é o teste que impede a volta do defeito que motivou a suíte: 11 dos 64
 * seletores nunca eram renderizados em lugar nenhum do demo — entre eles o
 * sistema de toast inteiro, que tinha 13 testes unitários e nunca foi montado.
 * Peça testada isoladamente que nunca roda junto não está provada.
 *
 * A lista de casos é DERIVADA do código-fonte, não digitada aqui. Componente
 * novo entra no teste sozinho; esquecer de demonstrá-lo falha a suíte.
 */

const RAIZ_LIB = join(__dirname, '../../projects/ng-govbr-tw/src/lib');

function arquivosTs(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return arquivosTs(caminho);
    return caminho.endsWith('.ts') && !caminho.endsWith('.spec.ts') ? [caminho] : [];
  });
}

function seletoresDeclarados(): string[] {
  const encontrados = new Set<string>();
  for (const arquivo of arquivosTs(RAIZ_LIB)) {
    for (const m of readFileSync(arquivo, 'utf-8').matchAll(/selector:\s*'(br-[a-z-]+)'/g)) {
      encontrados.add(m[1]);
    }
  }
  return [...encontrados].sort();
}

/** Coleta quais dos seletores existem no DOM NESTE momento. */
async function presentesAgora(page: Page, seletores: string[]): Promise<string[]> {
  return page.evaluate(
    (lista) => lista.filter((s) => document.querySelector(s) !== null),
    seletores
  );
}

/**
 * Alguns componentes só entram no DOM quando algo é aberto — painel de
 * mega-menu, submenu da barra. Contar sem abrir acusaria ausência falsa.
 *
 * A amostragem é feita LOGO APÓS cada clique, não no fim: abrir o segundo
 * submenu fecha o primeiro, então uma única contagem ao final perderia o que
 * já tinha sido revelado.
 */
async function revelarEAcumular(page: Page, seletores: string[], vistos: Set<string>) {
  const gatilhos = [
    'br-mega-menu-trigger button, br-mega-menu-trigger [role="button"]',
    'br-menu-bar-item button[aria-haspopup]',
    'br-menu-bar-item button',
  ];
  for (const seletor of gatilhos) {
    const grupo = page.locator(seletor);
    const total = await grupo.count();
    for (let i = 0; i < total; i++) {
      const alvo = grupo.nth(i);
      // Hover ANTES do clique: o submenu da barra abre no `mouseenter`, e
      // alguns painéis só existem enquanto o ponteiro está sobre o item.
      await alvo.hover({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(150);
      for (const s of await presentesAgora(page, seletores)) vistos.add(s);

      await alvo.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(150);
      for (const s of await presentesAgora(page, seletores)) vistos.add(s);
    }
  }
}

test('todo seletor da biblioteca é renderizado em algum lugar do demo', async ({ page }) => {
  const declarados = seletoresDeclarados();
  expect(declarados.length, 'nenhum seletor encontrado — o caminho da lib mudou?')
    .toBeGreaterThan(50);

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // O showcase tem duas abas e cada uma renderiza componentes diferentes.
  // A união das duas é o que conta — contar só a aba ativa reprovaria
  // componentes que estão demonstrados do outro lado.
  const vistos = new Set<string>();
  for (const aba of ['Componentes', 'Blocos']) {
    const botao = page.getByRole('button', { name: aba }).first();
    if (await botao.count()) {
      await botao.click();
      await page.waitForTimeout(250);
    }
    for (const s of await presentesAgora(page, declarados)) vistos.add(s);
    await revelarEAcumular(page, declarados, vistos);
  }

  const ausentes = declarados.filter((s) => !vistos.has(s));
  expect(
    ausentes,
    `componentes declarados que o demo nunca renderiza:\n  ${ausentes.join('\n  ')}`
  ).toEqual([]);
});
