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

/**
 * No Tailwind 4 não há `tailwind.config.js`: o tema é CSS-first, declarado
 * com `@theme`. A lib publica os dois artefatos — `tailwind.preset.js` para o
 * v3 e `styles/govbr-tw-v4.css` para o v4 —, e o segundo é GERADO do
 * primeiro, para não haver duas listas dos mesmos tokens.
 */
const IMPORT_TEMA_V4 = `@import "${PACOTE}/styles/govbr-tw-v4.css";`;

export function ngAdd(options: { project?: string; skipFonts?: boolean }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info(`🇧🇷 Configurando ${PACOTE}...`);

    const versao = detectarVersaoTailwind(tree);
    conferirTailwindInstalado(tree, context, versao);

    // O v4 não tem arquivo de config para atualizar: tudo acontece no CSS.
    if (versao !== 4) {
      atualizarTailwindConfig(tree, context);
    }

    if (!options.skipFonts) {
      adicionarFontes(tree, context, options.project);
    }

    adicionarEstilosGlobais(tree, context, options.project, versao);

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
 * Qual major do Tailwind o projeto usa — 3 e 4 pedem configurações
 * incompatíveis entre si (preset JS x `@theme` no CSS), e aplicar a errada
 * deixa a aplicação sem nenhuma classe `govbr-*`, sem erro nenhum.
 *
 * `null` quando não há Tailwind ou a faixa é ilegível; aí vale o caminho do
 * v3, que é o que a lib sempre suportou.
 */
function detectarVersaoTailwind(tree: Tree): 3 | 4 | null {
  const bruto = tree.read('package.json')?.toString('utf-8');
  if (!bruto) return null;

  try {
    const pkg = JSON.parse(bruto) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const faixa = pkg.dependencies?.['tailwindcss'] ?? pkg.devDependencies?.['tailwindcss'];
    if (!faixa) return null;

    // Pega o primeiro número da faixa: cobre `^4.0.0`, `~3.4`, `4`, `>=4.0.0`.
    const major = Number(faixa.match(/\d+/)?.[0]);
    return major === 4 ? 4 : major === 3 ? 3 : null;
  } catch {
    return null;
  }
}

/**
 * A biblioteca não funciona sem Tailwind — as classes `govbr-*` saem do
 * preset (v3) ou do tema `@theme` (v4). Instalar por conta própria seria
 * decidir pelo dono do projeto; avisar alto é o suficiente.
 */
function conferirTailwindInstalado(
  tree: Tree,
  context: SchematicContext,
  versao: 3 | 4 | null
): void {
  if (versao) {
    context.logger.info(`  ✔ Tailwind ${versao} detectado`);
    return;
  }
  if (!tree.exists('package.json')) return;

  context.logger.warn('  ⚠ tailwindcss não está nas dependências do projeto.');
  context.logger.warn('    A biblioteca depende dele para gerar as classes govbr-*:');
  context.logger.warn('      npm i -D tailwindcss@3 postcss autoprefixer   (ou tailwindcss@4)');
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
  projeto: string | undefined,
  versao: 3 | 4 | null
): void {
  const caminho = acharStylesGlobal(tree, projeto);

  if (!caminho) {
    context.logger.warn('  ⚠ Arquivo de estilos globais não encontrado. Adicione à mão:');
    if (versao === 4) context.logger.warn('    @import "tailwindcss";');
    IMPORTS_CSS.forEach((l) => context.logger.warn(`    ${l}`));
    if (versao === 4) {
      context.logger.warn(`    ${IMPORT_TEMA_V4}`);
      context.logger.warn(`    @source "<caminho>/node_modules/${PACOTE}";`);
    } else {
      context.logger.warn('    @tailwind base;');
      context.logger.warn('    @tailwind components;');
      context.logger.warn('    @tailwind utilities;');
    }
    return;
  }

  const necessarios = [...IMPORTS_CSS];
  if (versao === 4) {
    necessarios.push(IMPORT_TEMA_V4, linhaSource(caminho));
  }

  const conteudo = tree.read(caminho)?.toString('utf-8') || '';
  const faltando = necessarios.filter((l) => !conteudo.includes(chaveDaLinha(l)));
  if (!faltando.length) {
    context.logger.info('  ✔ Estilos govbr-tw já importados');
    return;
  }

  let novoConteudo = inserirImports(conteudo, faltando);

  const comDiretivas = garantirDiretivas(novoConteudo, versao);
  if (comDiretivas !== novoConteudo) {
    novoConteudo = comDiretivas;
    context.logger.info('  ✔ Diretivas do Tailwind adicionadas (não havia nenhuma)');
  }

  tree.overwrite(caminho, novoConteudo);
  context.logger.info(`  ✔ Estilos importados em ${caminho}`);
  if (versao === 4) {
    context.logger.info('  ✔ Tema @theme do Tailwind 4 e @source da lib adicionados');
  }
}

/**
 * Sem as diretivas do Tailwind, NADA funciona — e falha em silêncio.
 *
 * ⚠️ Medido num app `ng new` limpo: o `styles.css` que o Angular cria não tem
 * `@tailwind` nenhum. O schematic configurava preset, `content` e imports,
 * imprimia "✅ configurado", e o build gerava **zero** utilitários: nem
 * `.flex`, nem `.w-10`. Os componentes saíam com as classes certas no DOM e
 * sem uma regra de CSS por trás — um `br-success-check` virava texto solto
 * numa caixa sem forma.
 *
 * O consumidor que já montou o Tailwind tem as diretivas e nada muda aqui.
 * Quem não tem recebia uma aplicação sem estilo e uma mensagem de sucesso.
 */
function garantirDiretivas(conteudo: string, versao: 3 | 4 | null): string {
  if (versao === 4) {
    // No v4 a entrada é um import único; o `@import "tailwindcss"` precisa
    // vir ANTES do tema, senão o `@theme` não encontra o que estender.
    if (/@import\s+["']tailwindcss["']/.test(conteudo)) return conteudo;
    return `@import "tailwindcss";\n${conteudo}`;
  }

  // v3: as três diretivas, depois dos `@import` (que a spec CSS exige no topo)
  if (/@tailwind\s+utilities/.test(conteudo)) return conteudo;
  return `${conteudo.replace(/\s*$/, '')}\n\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;
}

/** O trecho que identifica a linha, para não duplicá-la a cada `ng add`. */
function chaveDaLinha(linha: string): string {
  return linha.split('"')[1];
}

/**
 * `@source` apontando para o pacote dentro de `node_modules`.
 *
 * ⚠️ Sem esta linha o Tailwind 4 gera 7 das 52 classes `govbr-*` e a
 * aplicação sobe quase sem estilo, SEM erro nenhum — medido num consumidor
 * real. O motivo: o v4 varre automaticamente o projeto mas **ignora
 * `node_modules` de propósito**, e as classes da lib vivem lá, dentro dos
 * `.mjs` compilados. No v3 o equivalente é o `content` do config, que o
 * schematic já escreve.
 *
 * O caminho é relativo ao ARQUIVO de estilos, não à raiz: em
 * `projects/app/src/styles.css` são três níveis para subir, e errar isso faz
 * o `@source` apontar para o vazio — de novo sem erro.
 */
function linhaSource(caminhoDoStyles: string): string {
  const niveis = caminhoDoStyles.split('/').length - 1;
  const subir = niveis > 0 ? '../'.repeat(niveis) : './';
  return `@source "${subir}node_modules/${PACOTE}";`;
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
