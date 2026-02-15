import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

const PACOTE = '@schenkerjon/ng-govbr-tw';

/**
 * ⚠️ O host `cdn.dsgovserp.estaleiro.serpro.gov.br`, usado aqui antes, **não
 * existe** — nem resolve DNS. Todo projeto que rodou `ng add` recebeu um
 * `<link>` morto e ficou sem a Rawline, sem erro nenhum na tela: a página
 * carrega, só a tipografia deixa de ser a do Gov.br. Verificado em
 * 11/10/2026: este host responde 200, aquele responde 000.
 */
const RAWLINE_LINK =
  '<link rel="stylesheet" href="https://cdngovbr-ds.estaleiro.serpro.gov.br/design-system/fonts/rawline/css/rawline.css" />';
const FA_LINK =
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />';

const IMPORTS_CSS = [
  `@import "${PACOTE}/styles/govbr-tw.css";`,
  `@import "${PACOTE}/styles/govbr-contrast.css";`,
];

export function ngAdd(options: { project?: string; skipFonts?: boolean }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info(`🇧🇷 Configurando ${PACOTE}...`);

    conferirTailwindInstalado(tree, context);
    atualizarTailwindConfig(tree, context);

    if (!options.skipFonts) {
      adicionarFontes(tree, context, options.project);
    }

    adicionarEstilosGlobais(tree, context, options.project);

    context.logger.info('');
    context.logger.info(`✅ ${PACOTE} configurado.`);
    context.logger.info('');
    context.logger.info('📖 Uso:');
    context.logger.info(`   import { BrButtonComponent } from '${PACOTE}';`);
    context.logger.info('');

    return tree;
  };
}

/**
 * A biblioteca não funciona sem Tailwind — as classes `govbr-*` saem do
 * preset. Instalar por conta própria seria decidir pelo dono do projeto;
 * avisar alto é o suficiente.
 */
function conferirTailwindInstalado(tree: Tree, context: SchematicContext): void {
  const bruto = tree.read('package.json')?.toString('utf-8');
  if (!bruto) return;

  try {
    const pkg = JSON.parse(bruto) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const temTailwind =
      !!pkg.dependencies?.['tailwindcss'] || !!pkg.devDependencies?.['tailwindcss'];

    if (!temTailwind) {
      context.logger.warn('  ⚠ tailwindcss não está nas dependências do projeto.');
      context.logger.warn('    A biblioteca depende dele para gerar as classes govbr-*:');
      context.logger.warn('      npm i -D tailwindcss@3 postcss autoprefixer');
    }
  } catch {
    // package.json ilegível não é motivo para abortar a configuração.
  }
}

// ─── tailwind.config ────────────────────────────────────────────────────────

const CONFIG_NOVO = `/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('${PACOTE}/tailwind.preset')],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/${PACOTE}/**/*.{mjs,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

function atualizarTailwindConfig(tree: Tree, context: SchematicContext): void {
  const candidatos = [
    'tailwind.config.js',
    'tailwind.config.cjs',
    'tailwind.config.mjs',
    'tailwind.config.ts',
  ];
  const caminho = candidatos.find((p) => tree.exists(p));

  if (!caminho) {
    tree.create('tailwind.config.js', CONFIG_NOVO);
    context.logger.info('  ✔ Criado tailwind.config.js com o preset govbr-tw');
    return;
  }

  const conteudo = tree.read(caminho)?.toString('utf-8');
  if (!conteudo) return;

  if (conteudo.includes(PACOTE)) {
    context.logger.info(`  ✔ ${caminho} já contém o preset govbr-tw`);
    return;
  }

  const comPreset = inserirPreset(conteudo, caminho);
  if (!comPreset) {
    // Falhar em silêncio aqui é o pior desfecho: o arquivo fica sem o preset,
    // o log diz "configurado" e nenhuma classe govbr-* funciona.
    context.logger.warn(`  ⚠ Não reconheci o formato de ${caminho}.`);
    context.logger.warn('    Acrescente o preset à mão:');
    context.logger.warn(`      presets: [require('${PACOTE}/tailwind.preset')]`);
    context.logger.warn(`    e ao content: "./node_modules/${PACOTE}/**/*.{mjs,js}"`);
    return;
  }

  tree.overwrite(caminho, garantirContentPath(comPreset));
  context.logger.info(`  ✔ ${caminho} atualizado com preset e content path`);
}

/**
 * Casa os três formatos que existem na prática. O patch anterior só conhecia
 * `module.exports = {`: em `tailwind.config.ts` com `export default {} satisfies
 * Config` ou em projeto ESM, o `String.replace` não encontrava nada, devolvia o
 * texto intacto e o schematic gravava o arquivo **sem o preset**, imprimindo
 * sucesso.
 */
function inserirPreset(conteudo: string, caminho: string): string | null {
  const ehTs = caminho.endsWith('.ts');
  const chamadaPreset = ehTs ? 'presetGovbr' : `require('${PACOTE}/tailwind.preset')`;

  // Já existe um array de presets: entra como primeiro item.
  if (/presets\s*:\s*\[/.test(conteudo)) {
    const saida = conteudo.replace(/presets\s*:\s*\[/, `presets: [${chamadaPreset}, `);
    return ehTs ? comImportDoPreset(saida) : saida;
  }

  // CommonJS
  if (/module\.exports\s*=\s*\{/.test(conteudo)) {
    return conteudo.replace(
      /module\.exports\s*=\s*\{/,
      `module.exports = {\n  presets: [${chamadaPreset}],`
    );
  }

  // ESM / TypeScript — cobre `export default {`, com ou sem `satisfies Config`
  if (/export\s+default\s*\{/.test(conteudo)) {
    const saida = conteudo.replace(
      /export\s+default\s*\{/,
      `export default {\n  presets: [${chamadaPreset}],`
    );
    return comImportDoPreset(saida);
  }

  // `const config = {...}; export default config;`
  if (/(?:const|let|var)\s+\w+\s*(?::\s*\w+)?\s*=\s*\{/.test(conteudo)) {
    const saida = conteudo.replace(
      /((?:const|let|var)\s+\w+\s*(?::\s*\w+)?\s*=\s*\{)/,
      `$1\n  presets: [${chamadaPreset}],`
    );
    return comImportDoPreset(saida);
  }

  return null;
}

/** Em ESM/TS não há `require`: o preset precisa de um import no topo. */
function comImportDoPreset(conteudo: string): string {
  if (conteudo.includes("from '" + PACOTE + "/tailwind.preset'")) return conteudo;
  return `import presetGovbr from '${PACOTE}/tailwind.preset';\n${conteudo}`;
}

/** O Tailwind precisa varrer os arquivos da lib para gerar as classes usadas. */
function garantirContentPath(conteudo: string): string {
  if (conteudo.includes(`node_modules/${PACOTE}`)) return conteudo;
  return conteudo.replace(
    /content\s*:\s*\[/,
    `content: ["./node_modules/${PACOTE}/**/*.{mjs,js}", `
  );
}

// ─── index.html ─────────────────────────────────────────────────────────────

function adicionarFontes(tree: Tree, context: SchematicContext, projeto?: string): void {
  const caminho = acharIndexHtml(tree, projeto);
  if (!caminho) {
    context.logger.warn('  ⚠ index.html não encontrado. Adicione as fontes à mão:');
    context.logger.warn(`    ${RAWLINE_LINK}`);
    context.logger.warn(`    ${FA_LINK}`);
    return;
  }

  let html = tree.read(caminho)?.toString('utf-8') || '';
  let mudou = false;

  if (!html.includes('rawline')) {
    html = html.replace('</head>', `  ${RAWLINE_LINK}\n  </head>`);
    mudou = true;
  }
  if (!html.includes('font-awesome') && !html.includes('fontawesome')) {
    html = html.replace('</head>', `  ${FA_LINK}\n  </head>`);
    mudou = true;
  }

  if (mudou) {
    tree.overwrite(caminho, html);
    context.logger.info(`  ✔ Rawline e Font Awesome adicionadas ao ${caminho}`);
    context.logger.info('    (ambiente sem internet: auto-hospede as fontes — ver README)');
  } else {
    context.logger.info('  ✔ Fontes já configuradas no index.html');
  }
}

// ─── styles global ──────────────────────────────────────────────────────────

function adicionarEstilosGlobais(
  tree: Tree,
  context: SchematicContext,
  projeto?: string
): void {
  const caminho = acharStylesGlobal(tree, projeto);
  if (!caminho) {
    context.logger.warn('  ⚠ Arquivo de estilos globais não encontrado. Adicione à mão:');
    IMPORTS_CSS.forEach((l) => context.logger.warn(`    ${l}`));
    return;
  }

  const conteudo = tree.read(caminho)?.toString('utf-8') || '';
  const faltando = IMPORTS_CSS.filter((imp) => !conteudo.includes(imp.split('"')[1]));
  if (!faltando.length) {
    context.logger.info('  ✔ Estilos govbr-tw já importados');
    return;
  }

  tree.overwrite(caminho, inserirImports(conteudo, faltando));
  context.logger.info(`  ✔ Estilos importados em ${caminho}`);
}

/**
 * `@import` tem de vir ANTES de qualquer regra — é o que a especificação CSS
 * exige. A versão anterior inseria depois de `@tailwind utilities`, e o
 * `postcss-import` em modo estrito descarta a regra nessa posição: os estilos
 * da lib simplesmente não entram, sem erro.
 */
function inserirImports(conteudo: string, imports: string[]): string {
  const bloco = `/* Gov.br Design System */\n${imports.join('\n')}\n`;

  const linhas = conteudo.split('\n');
  let ultimoImport = -1;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i].trim();
    if (l.startsWith('@charset')) { ultimoImport = i; continue; }
    if (l.startsWith('@import')) { ultimoImport = i; continue; }
    if (l && !l.startsWith('/*') && !l.startsWith('*') && !l.startsWith('//')) break;
  }

  if (ultimoImport >= 0) {
    linhas.splice(ultimoImport + 1, 0, '', bloco.trimEnd());
    return linhas.join('\n');
  }
  return `${bloco}\n${conteudo}`;
}

// ─── descoberta de caminhos ─────────────────────────────────────────────────

function acharIndexHtml(tree: Tree, projeto?: string): string | undefined {
  return primeiroQueExiste(tree, [
    ...caminhosDoAngularJson(tree, projeto, 'index'),
    'src/index.html',
    projeto ? `projects/${projeto}/src/index.html` : '',
  ]);
}

/**
 * O `angular.json` é a fonte de verdade de onde fica o styles global.
 * Antes isto só olhava `src/styles.*` e desistia em workspace multi-projeto —
 * justamente a forma deste repositório —, enquanto a busca pelo index.html
 * já tratava o caso. Duas funções vizinhas, uma certa e outra não.
 */
function acharStylesGlobal(tree: Tree, projeto?: string): string | undefined {
  return primeiroQueExiste(tree, [
    ...caminhosDoAngularJson(tree, projeto, 'styles'),
    'src/styles.css',
    'src/styles.scss',
    'src/styles.sass',
    'src/styles.less',
    ...(projeto
      ? ['css', 'scss', 'sass', 'less'].map((e) => `projects/${projeto}/src/styles.${e}`)
      : []),
  ]);
}

function caminhosDoAngularJson(
  tree: Tree,
  projeto: string | undefined,
  alvo: 'styles' | 'index'
): string[] {
  const bruto = tree.read('angular.json')?.toString('utf-8');
  if (!bruto) return [];

  try {
    const ws = JSON.parse(bruto) as {
      defaultProject?: string;
      projects?: Record<string, {
        projectType?: string;
        architect?: Record<string, { options?: { styles?: unknown[]; index?: string } }>;
      }>;
    };
    const projetos = ws.projects ?? {};
    const nome =
      projeto ??
      ws.defaultProject ??
      Object.keys(projetos).find((k) => projetos[k]?.projectType === 'application');
    if (!nome) return [];

    const opcoes = projetos[nome]?.architect?.['build']?.options;
    if (!opcoes) return [];

    if (alvo === 'index') return opcoes.index ? [opcoes.index] : [];
    return (opcoes.styles ?? []).filter((s): s is string => typeof s === 'string');
  } catch {
    return [];
  }
}

function primeiroQueExiste(tree: Tree, caminhos: string[]): string | undefined {
  return caminhos.find((p) => p && tree.exists(p));
}
