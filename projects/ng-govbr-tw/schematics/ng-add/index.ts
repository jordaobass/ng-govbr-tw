import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

const RAWLINE_LINK = '<link rel="stylesheet" href="https://cdn.dsgovserp.estaleiro.serpro.gov.br/design-system/fonts/rawline/css/rawline.css" />';
const FA_LINK = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />';

export function ngAdd(options: { project?: string; skipFonts?: boolean }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info('🇧🇷 Configurando @schenkerjon/ng-govbr-tw...');

    // 1. Update tailwind config
    updateTailwindConfig(tree, context);

    // 2. Add font links to index.html
    if (!options.skipFonts) {
      addFontLinks(tree, context, options.project);
    }

    // 3. Add CSS import to global styles
    addGlobalStyles(tree, context, options.project);

    context.logger.info('');
    context.logger.info('✅ @schenkerjon/ng-govbr-tw configurado com sucesso!');
    context.logger.info('');
    context.logger.info('📖 Uso:');
    context.logger.info('   import { BrButtonComponent } from \'@schenkerjon/ng-govbr-tw\';');
    context.logger.info('');

    return tree;
  };
}

function updateTailwindConfig(tree: Tree, context: SchematicContext): void {
  // Try common tailwind config paths
  const configPaths = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
  ];

  let configPath: string | undefined;
  for (const p of configPaths) {
    if (tree.exists(p)) {
      configPath = p;
      break;
    }
  }

  if (!configPath) {
    // Create a basic tailwind.config.js with the preset
    const newConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@schenkerjon/ng-govbr-tw/tailwind.preset')],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@schenkerjon/ng-govbr-tw/**/*.{mjs,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
    tree.create('tailwind.config.js', newConfig);
    context.logger.info('  ✔ Criado tailwind.config.js com preset govbr-tw');
    return;
  }

  const content = tree.read(configPath)?.toString('utf-8');
  if (!content) return;

  // Check if preset is already configured
  if (content.includes('@schenkerjon/ng-govbr-tw')) {
    context.logger.info('  ✔ tailwind.config já contém o preset govbr-tw');
    return;
  }

  // Try to add preset to existing config
  if (content.includes('presets')) {
    // presets array exists, try to add to it
    const updated = content.replace(
      /presets\s*:\s*\[/,
      `presets: [require('@schenkerjon/ng-govbr-tw/tailwind.preset'), `
    );
    tree.overwrite(configPath, updated);
  } else {
    // No presets, add it
    const updated = content.replace(
      /module\.exports\s*=\s*\{/,
      `module.exports = {\n  presets: [require('@schenkerjon/ng-govbr-tw/tailwind.preset')],`
    );
    tree.overwrite(configPath, updated);
  }

  // Ensure content includes the library
  if (!content.includes('ng-govbr-tw')) {
    const updatedContent = tree.read(configPath)?.toString('utf-8') || '';
    const patched = updatedContent.replace(
      /content\s*:\s*\[/,
      `content: [\n    "./node_modules/@schenkerjon/ng-govbr-tw/**/*.{mjs,js}",`
    );
    tree.overwrite(configPath, patched);
  }

  context.logger.info(`  ✔ Atualizado ${configPath} com preset e content path`);
}

function addFontLinks(tree: Tree, context: SchematicContext, project?: string): void {
  const indexPath = findIndexHtml(tree, project);
  if (!indexPath) {
    context.logger.warn('  ⚠ index.html não encontrado. Adicione manualmente as fontes:');
    context.logger.warn(`    ${RAWLINE_LINK}`);
    context.logger.warn(`    ${FA_LINK}`);
    return;
  }

  let indexHtml = tree.read(indexPath)?.toString('utf-8') || '';
  let modified = false;

  if (!indexHtml.includes('rawline')) {
    indexHtml = indexHtml.replace('</head>', `  ${RAWLINE_LINK}\n  </head>`);
    modified = true;
  }

  if (!indexHtml.includes('font-awesome') && !indexHtml.includes('fontawesome')) {
    indexHtml = indexHtml.replace('</head>', `  ${FA_LINK}\n  </head>`);
    modified = true;
  }

  if (modified) {
    tree.overwrite(indexPath, indexHtml);
    context.logger.info(`  ✔ Fontes Rawline e Font Awesome adicionadas ao ${indexPath}`);
  } else {
    context.logger.info('  ✔ Fontes já configuradas no index.html');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addGlobalStyles(tree: Tree, context: SchematicContext, _project?: string): void {
  const stylePaths = ['src/styles.css', 'src/styles.scss', 'src/styles.sass', 'src/styles.less'];
  let stylePath: string | undefined;

  for (const p of stylePaths) {
    if (tree.exists(p)) {
      stylePath = p;
      break;
    }
  }

  if (!stylePath) {
    context.logger.warn('  ⚠ Arquivo de estilos globais não encontrado');
    return;
  }

  const content = tree.read(stylePath)?.toString('utf-8') || '';
  const importLine = '@import "@schenkerjon/ng-govbr-tw/styles/govbr-tw.css";';

  if (content.includes('govbr-tw')) {
    context.logger.info('  ✔ Estilos govbr-tw já importados');
    return;
  }

  // Add import after tailwind directives if they exist, otherwise at the top
  if (content.includes('@tailwind')) {
    const updated = content.replace(
      /(@tailwind\s+utilities\s*;)/,
      `$1\n\n/* Gov.br Design System */\n${importLine}`
    );
    tree.overwrite(stylePath, updated);
  } else {
    tree.overwrite(stylePath, `/* Gov.br Design System */\n${importLine}\n\n${content}`);
  }

  context.logger.info(`  ✔ Import govbr-tw.css adicionado ao ${stylePath}`);
}

function findIndexHtml(tree: Tree, project?: string): string | undefined {
  const paths = [
    'src/index.html',
    `projects/${project}/src/index.html`,
  ];

  for (const p of paths) {
    if (tree.exists(p)) return p;
  }

  return undefined;
}
