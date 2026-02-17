import { defineConfig, devices } from '@playwright/test';

/**
 * O alvo é o BUILD do demo, servido estaticamente — não o `ng serve`.
 *
 * Motivo: `ng serve` serve o código-fonte com sourcemaps e sem as otimizações
 * do build; o que vai ao ar no GitHub Pages é o bundle. Testar o dev server é
 * testar algo que ninguém usa, e já custou caro antes — "corrigir o fonte não
 * é corrigir o site".
 */
const PORTA = Number(process.env.PORTA_DEMO ?? 14731);
const BASE = process.env.BASE_URL ?? `http://localhost:${PORTA}`;

/** Storybook é a documentação da lib e tem suíte própria (decisão D19). */
export const PORTA_STORYBOOK = Number(process.env.PORTA_STORYBOOK ?? 14741);
export const BASE_STORYBOOK = `http://localhost:${PORTA_STORYBOOK}`;

export default defineConfig({
  testDir: './e2e',
  // Um teste que depende de ordem é um teste que mente quando roda sozinho.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE,
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
   * `--proxy` dá o fallback de SPA: o app redireciona `/` para `/showcase`, e
   * um servidor estático comum devolve 404 nesse caminho ao recarregar. Sem
   * isso, qualquer teste que faça `reload()` mede uma página de erro e acusa
   * defeito que não existe — foi exatamente o que aconteceu ao escrever esta
   * suíte. Em produção quem resolve é o `cp index.html 404.html` do
   * `.github/workflows/deploy-demo.yml`.
   *
   * `reuseExistingServer` evita o EADDRINUSE silencioso, em que a porta
   * responde com o build ANTIGO e a suíte mede a coisa errada.
   */
  webServer: process.env.BASE_URL
    ? undefined
    : [
        {
          command: `npx --yes http-server ../dist/demo/browser -p ${PORTA} -s --silent --proxy http://localhost:${PORTA}?`,
          url: BASE,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
        {
          // O Storybook já serve /iframe.html em caminho real: não precisa de
          // fallback de SPA.
          command: `npx --yes http-server ../dist/storybook -p ${PORTA_STORYBOOK} -s --silent`,
          url: `${BASE_STORYBOOK}/index.json`,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      ],
});
