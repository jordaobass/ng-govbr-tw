import { test, expect } from '@playwright/test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

/**
 * O schematic `ng add` — a primeira coisa que um consumidor executa.
 *
 * Não havia teste nenhum aqui, e o arquivo já acumulava seis defeitos
 * corrigidos à mão: `$id` em vez de `id` no schema (que fazia o schematic
 * virar no-op em Angular 20+), `@import` depois de `@tailwind` (descartado
 * pelo postcss-import), um host de CDN que não resolve DNS, e o reconhecimento
 * de só um dos formatos de `tailwind.config`. Todos falhavam em SILÊNCIO,
 * imprimindo "configurado".
 *
 * Agora há ainda um ramo v3/v4, e aplicar o errado deixa a aplicação sem
 * nenhuma classe `govbr-*` — também sem erro.
 */

const RAIZ = resolve(__dirname, '../..');
const COLECAO = join(RAIZ, 'dist/ng-govbr-tw/schematics/collection.json');
const PACOTE = '@schenkerjon/ng-govbr-tw';

interface Projeto {
  versaoTailwind?: string;
  caminhoStyles?: string;
  conteudoStyles?: string;
  configTailwind?: { nome: string; conteudo: string };
}

/** Monta um projeto Angular mínimo em disco e roda o `ng-add` de verdade. */
async function rodarNgAdd(p: Projeto): Promise<string> {
  const dir = mkdtempSync(join(tmpdir(), 'ngadd-'));
  const styles = p.caminhoStyles ?? 'src/styles.css';

  mkdirSync(join(dir, dirname(styles)), { recursive: true });
  writeFileSync(join(dir, styles), p.conteudoStyles ?? '@tailwind base;\n@tailwind utilities;\n');

  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(join(dir, 'src/index.html'), '<!doctype html><html><head></head><body></body></html>');

  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({
      name: 'alvo',
      private: true,
      devDependencies: p.versaoTailwind ? { tailwindcss: p.versaoTailwind } : {},
    })
  );
  writeFileSync(
    join(dir, 'angular.json'),
    JSON.stringify({
      version: 1,
      projects: {
        app: {
          projectType: 'application',
          architect: { build: { options: { index: 'src/index.html', styles: [styles] } } },
        },
      },
    })
  );
  if (p.configTailwind) {
    writeFileSync(join(dir, p.configTailwind.nome), p.configTailwind.conteudo);
  }

  // O devkit mora no node_modules da RAIZ, não no de /testes.
  const { NodeWorkflow } = require(join(RAIZ, 'node_modules/@angular-devkit/schematics/tools'));
  const wf = new NodeWorkflow(dir, {
    force: true,
    dryRun: false,
    resolvePaths: [RAIZ],
    schemaValidation: true,
  });
  wf.reporter.subscribe(() => {});
  await wf.execute({ collection: COLECAO, schematic: 'ng-add', options: {} }).toPromise();

  return dir;
}

const ler = (dir: string, arq: string) => readFileSync(join(dir, arq), 'utf-8');

test.describe('ng add', () => {
  test.beforeAll(() => {
    expect(
      existsSync(COLECAO),
      'rode `npm run build` antes: o schematic é testado COMPILADO, que é o que o consumidor recebe'
    ).toBe(true);
  });

  test('Tailwind 3: cria o config com o preset e importa antes das diretivas', async () => {
    const dir = await rodarNgAdd({ versaoTailwind: '^3.4.0' });

    const config = ler(dir, 'tailwind.config.js');
    expect(config).toContain(`${PACOTE}/tailwind.preset`);
    // Sem o content path o Tailwind 3 não varre a lib e não gera classe nenhuma.
    expect(config).toContain(`node_modules/${PACOTE}`);

    const css = ler(dir, 'src/styles.css');
    // `@import` DEPOIS de `@tailwind` é descartado pelo postcss-import em modo
    // estrito — os estilos da lib simplesmente não entram, sem erro.
    expect(css.indexOf('@import')).toBeLessThan(css.indexOf('@tailwind'));
    expect(css).not.toContain('@source');
  });

  test('Tailwind 4: sem arquivo de config, com tema @theme e @source da lib', async () => {
    const dir = await rodarNgAdd({ versaoTailwind: '^4.0.0' });

    // No v4 o tema é CSS-first: criar um `tailwind.config.js` seria lixo que o
    // compilador ignora, dando a impressão de estar configurado.
    expect(existsSync(join(dir, 'tailwind.config.js'))).toBe(false);

    const css = ler(dir, 'src/styles.css');
    expect(css).toContain(`${PACOTE}/styles/govbr-tw-v4.css`);
    // Medido num consumidor real: sem esta linha o v4 gera 7 das 52 classes
    // `govbr-*` e a aplicação sobe quase sem estilo, sem erro. O v4 ignora
    // `node_modules` na varredura automática, de propósito.
    expect(css).toContain(`@source "../node_modules/${PACOTE}";`);
  });

  test('Tailwind 4: o @source sobe os níveis certos num workspace', async () => {
    const dir = await rodarNgAdd({
      versaoTailwind: '^4.0.0',
      caminhoStyles: 'projects/app/src/styles.css',
    });

    // Caminho relativo ao ARQUIVO, não à raiz. Errar a contagem faz o `@source`
    // apontar para o vazio — de novo sem erro, de novo app sem estilo.
    expect(ler(dir, 'projects/app/src/styles.css')).toContain(
      `@source "../../../node_modules/${PACOTE}";`
    );
  });

  test('reconhece tailwind.config.ts com export default satisfies Config', async () => {
    const dir = await rodarNgAdd({
      versaoTailwind: '^3.4.0',
      configTailwind: {
        nome: 'tailwind.config.ts',
        conteudo:
          "import type { Config } from 'tailwindcss';\n" +
          "export default {\n  content: ['./src/**/*.html'],\n} satisfies Config;\n",
      },
    });

    const config = ler(dir, 'tailwind.config.ts');
    // A versão anterior só conhecia `module.exports = {`: aqui o replace não
    // achava nada, gravava o arquivo intacto e imprimia sucesso.
    expect(config).toContain('presets: [presetGovbr]');
    expect(config).toContain(`import presetGovbr from '${PACOTE}/tailwind.preset'`);
  });

  test('rodar duas vezes não duplica import nem preset', async () => {
    const dir = await rodarNgAdd({ versaoTailwind: '^4.0.0' });
    const primeira = ler(dir, 'src/styles.css');

    const { NodeWorkflow } = require(join(RAIZ, 'node_modules/@angular-devkit/schematics/tools'));
    const wf = new NodeWorkflow(dir, { force: true, dryRun: false, resolvePaths: [RAIZ], schemaValidation: true });
    wf.reporter.subscribe(() => {});
    await wf.execute({ collection: COLECAO, schematic: 'ng-add', options: {} }).toPromise();

    expect(ler(dir, 'src/styles.css')).toBe(primeira);
  });
});
