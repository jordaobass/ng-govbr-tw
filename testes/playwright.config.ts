import { defineConfig, devices } from '@playwright/test';

/**
 * O alvo é o BUILD do Storybook, servido estaticamente — não o dev server.
 *
 * Motivo: o dev server serve o código-fonte com sourcemaps e sem as
 * otimizações do build; o que vai ao ar no GitHub Pages é o bundle. Testar o
 * dev server é testar algo que ninguém usa, e já custou caro antes —
 * "corrigir o fonte não é corrigir o site".
 *
 * Havia um segundo servidor aqui, para o app de showcase. O Storybook passou
 * a ser a documentação oficial (D19) e o showcase foi removido; as suítes que
 * miravam nele agora miram as stories.
 */
export const PORTA_STORYBOOK = Number(process.env.PORTA_STORYBOOK ?? 14741);
export const BASE_STORYBOOK = process.env.BASE_URL ?? `http://localhost:${PORTA_STORYBOOK}`;

export default defineConfig({
  testDir: './e2e',
  // Um teste que depende de ordem é um teste que mente quando roda sozinho.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE_STORYBOOK,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          // Ubuntu 24.04 desabilita user namespaces sem privilégio e o Chrome
          // aborta com "No usable sandbox!". Em container/CI isso é esperado.
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
  ],

  /**
   * Sobe o servidor estático sozinho quando não há um já de pé.
   *
   * O Storybook serve `/iframe.html` em caminho real, então não precisa do
   * fallback de SPA que o showcase exigia.
   *
   * `reuseExistingServer` evita o EADDRINUSE silencioso, em que a porta
   * responde com o build ANTIGO e a suíte mede a coisa errada.
   */
  webServer: process.env.BASE_URL
    ? undefined
    : [
        {
          command: `npx --yes http-server ../dist/storybook -p ${PORTA_STORYBOOK} -s --silent`,
          url: `${BASE_STORYBOOK}/index.json`,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      ],
});
