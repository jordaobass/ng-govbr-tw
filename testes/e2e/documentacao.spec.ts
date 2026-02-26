import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * A documentação tem de acompanhar o código.
 *
 * "Está tudo documentado?" não devia ser uma promessa que alguém repete, e sim
 * algo que o CI responde. Medido em 26/02/2026, antes deste teste existir:
 * quatro componentes exportados não apareciam no README, e dois deles
 * (`br-checkbox-group` e `br-icon`) tinham acabado de ser criados — ninguém
 * esquece de propósito, só não há nada que cobre.
 *
 * O que NÃO se verifica aqui: se a descrição está boa. Isso é trabalho de
 * gente. O que se verifica é o que dá para verificar sem adivinhar — que o
 * componente existe no texto, e que a versão do pacote tem entrada no
 * CHANGELOG.
 */

const RAIZ = resolve(__dirname, '../..');
const ler = (arq: string) => readFileSync(join(RAIZ, arq), 'utf-8');

/**
 * ⚠️ São DOIS READMEs, e o npm mostra o que você provavelmente não está
 * editando.
 *
 * - `README.md` da raiz → é o que o GitHub exibe
 * - `projects/ng-govbr-tw/README.md` → o ng-packagr o copia para `dist/`, e é
 *   esse que aparece em npmjs.com
 *
 * Os dois já derivaram: em 27/02/2026 o do npm ainda anunciava "Tailwind CSS
 * 3" e "compatível com Angular 17, 18 e 19", sem os campos com máscara, que
 * são o diferencial da lib. Quem instala lê aquele.
 */
const READMES = [
  { arquivo: 'README.md', onde: 'GitHub' },
  { arquivo: 'projects/ng-govbr-tw/README.md', onde: 'npm' },
];

for (const { arquivo, onde } of READMES) {
  test(`todo componente exportado aparece no README do ${onde}`, () => {
    const api = ler('projects/ng-govbr-tw/src/public-api.ts');
    const classes = [...api.matchAll(/export \{ (Br\w+Component) \}/g)].map((m) => m[1]);
    expect(classes.length, 'nenhum componente exportado — o caminho mudou?').toBeGreaterThan(40);

    const readme = ler(arquivo);
    // O README do npm cita por SELETOR (`br-input`), o da raiz por CLASSE.
    // Vale qualquer um dos dois: o que não vale é o componente não existir no
    // texto.
    const ausentes = classes
      .filter((c) => {
        if (readme.includes(c)) return false;
        const seletor = 'br-' + c.replace(/^Br|Component$/g, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return !readme.includes(seletor);
      })
      .sort();

    expect(
      ausentes,
      `componentes exportados sem uma linha no README do ${onde} (${arquivo}):\n  ${ausentes.join('\n  ')}`
    ).toEqual([]);
  });
}

test('o README do npm não documenta caminho de import que quebra o build', () => {
  /*
   * Medido em 27/02/2026 num app Angular 17 de verdade, com a lib instalada
   * por `npm pack`:
   *
   *   @import '…/styles/govbr-tw.css'          → token no bundle ✅
   *   @import '…/src/lib/styles/govbr-tw.css'  → ✘ Could not resolve
   *
   * O `package.json` declara `exports`, e o esbuild do Angular bloqueia
   * caminho profundo. O README do npm documentava o profundo: quem seguisse a
   * configuração manual não compilava. (O CLI avulso do Tailwind resolve o
   * profundo e rejeita o do export — por isso só o build de verdade decide.)
   */
  const pkg = JSON.parse(ler('projects/ng-govbr-tw/package.json')) as {
    exports: Record<string, unknown>;
  };
  const publicos = Object.keys(pkg.exports).map((k) => k.replace(/^\.\//, ''));

  const problemas: string[] = [];
  for (const { arquivo, onde } of READMES) {
    const texto = ler(arquivo);
    for (const m of texto.matchAll(/@schenkerjon\/ng-govbr-tw\/([\w./-]+)/g)) {
      const caminho = m[1];
      if (caminho.startsWith('src/') || caminho.startsWith('dist/')) {
        problemas.push(`${onde}: @schenkerjon/ng-govbr-tw/${caminho} — caminho interno, não está em "exports"`);
      }
    }
    void publicos;
  }

  expect(problemas, `caminhos que não resolvem:\n  ${problemas.join('\n  ')}`).toEqual([]);
});

test('a versão do pacote tem entrada no CHANGELOG', () => {
  const pkg = JSON.parse(ler('projects/ng-govbr-tw/package.json')) as { version: string };
  const changelog = ler('CHANGELOG.md');

  // O CHANGELOG já ficou cinco dias e seis commits atrás da realidade — entre
  // eles dois componentes novos e uma mudança que quebra o site.
  expect(
    changelog,
    `a versão ${pkg.version} do package.json não tem entrada no CHANGELOG`
  ).toContain(`## [${pkg.version}]`);
});

test('os artefatos de tema declarados são os que existem', () => {
  const pkg = JSON.parse(ler('projects/ng-govbr-tw/package.json')) as {
    exports: Record<string, { default: string }>;
  };

  // Export apontando para arquivo inexistente só falha na casa de quem
  // instala, e com uma mensagem do bundler que não diz a causa.
  const quebrados: string[] = [];
  for (const [nome, alvo] of Object.entries(pkg.exports)) {
    const caminho = alvo.default.replace(/^\.\//, 'projects/ng-govbr-tw/');
    try {
      ler(caminho);
    } catch {
      quebrados.push(`${nome} → ${alvo.default}`);
    }
  }

  expect(quebrados, `exports apontando para arquivo inexistente:\n  ${quebrados.join('\n  ')}`).toEqual(
    []
  );
});

/**
 * Coerência entre os documentos.
 *
 * O `USAGE.md` viveu meses com o escopo `@aspect-br` — nome que o pacote não
 * tem desde que foi renomeado. Oito ocorrências, mais caminhos `C:\03_dev\…`
 * de outra máquina e `<br-button variant=>` quando o input é `emphasis`.
 * Ninguém o lia porque nada apontava para ele; nada o corrigia porque nada o
 * verificava. Documento sem dono e sem portão apodrece em silêncio.
 */
const DOCS = [
  'README.md',
  'projects/ng-govbr-tw/README.md',
  'USAGE.md',
  '.storybook/Introducao.mdx',
];

test('nenhum documento cita um escopo de pacote que não é o nosso', () => {
  const nome = (JSON.parse(ler('projects/ng-govbr-tw/package.json')) as { name: string }).name;
  const escopo = nome.split('/')[0];

  /*
   * Só o que o leitor COPIA: `npm install`, `@import`, `import … from` e
   * `require(`. Citar o nome antigo numa nota de histórico é legítimo — e foi
   * o que a primeira versão desta checagem reprovou, no próprio texto que
   * explica por que o nome mudou.
   */
  const INSTRUCAO = /(npm (install|i)\s|@import\s|from\s|require\()/;

  const errados: string[] = [];
  for (const doc of DOCS) {
    for (const linha of ler(doc).split('\n')) {
      if (!INSTRUCAO.test(linha)) continue;
      for (const m of linha.matchAll(/@[\w-]+\/ng-govbr-tw/g)) {
        if (!m[0].startsWith(escopo + '/')) errados.push(`${doc}: ${linha.trim().slice(0, 70)}`);
      }
    }
  }

  expect(
    [...new Set(errados)],
    `escopo errado (o pacote é ${nome}):\n  ${[...new Set(errados)].join('\n  ')}`
  ).toEqual([]);
});

test('a faixa de Angular anunciada bate com as peerDependencies', () => {
  const pkg = JSON.parse(ler('projects/ng-govbr-tw/package.json')) as {
    peerDependencies: Record<string, string>;
  };
  const majors = [...pkg.peerDependencies['@angular/core'].matchAll(/\^(\d+)\./g)].map((m) =>
    Number(m[1])
  );
  const menor = Math.min(...majors);
  const maior = Math.max(...majors);

  // Anunciar menos do que se suporta afasta consumidor; anunciar mais quebra
  // a instalação dele. O README do npm já anunciou "17, 18 e 19" por três
  // versões depois de a faixa ir até 22.
  const divergentes: string[] = [];
  for (const doc of ['README.md', 'projects/ng-govbr-tw/README.md']) {
    const texto = ler(doc);
    const anunciado = texto.match(/Angular \*{0,2}(\d+) a (\d+)/);
    if (!anunciado) {
      divergentes.push(`${doc}: não anuncia faixa de Angular`);
      continue;
    }
    if (Number(anunciado[1]) !== menor || Number(anunciado[2]) !== maior) {
      divergentes.push(`${doc}: anuncia ${anunciado[1]} a ${anunciado[2]}, peerDeps diz ${menor} a ${maior}`);
    }
  }

  expect(divergentes, divergentes.join('\n  ')).toEqual([]);
});
