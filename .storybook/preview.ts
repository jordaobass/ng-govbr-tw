import type { Preview } from '@storybook/angular';

/**
 * Os estilos globais entram por `styles` no alvo do `angular.json`
 * (`.storybook/styles.css`), que importa os CSS da própria lib — o mesmo
 * caminho que o `ng-add` configura num projeto consumidor. Testar com um CSS
 * diferente do que o consumidor recebe seria testar outra coisa.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
    },

    // Fundos que correspondem aos tokens reais, não a cinzas inventados.
    backgrounds: {
      default: 'página',
      values: [
        { name: 'página', value: '#f8f8f8' },
        { name: 'superfície', value: '#ffffff' },
        { name: 'alto contraste', value: '#000000' },
      ],
    },

    // Larguras onde a lib precisa caber. A de 360px é a que mais pega
    // componente que estoura: menu, tabela e wizard.
    viewport: {
      viewports: {
        celular: { name: 'Celular 360px', styles: { width: '360px', height: '740px' } },
        tablet: { name: 'Tablet 768px', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop 1280px', styles: { width: '1280px', height: '800px' } },
      },
    },

    a11y: {
      // Reportar, não bloquear: o painel mostra as violações por story.
      config: {},
    },
  },

  globalTypes: {
    contraste: {
      description: 'Tema de alto contraste do Gov.br',
      defaultValue: false,
      toolbar: {
        title: 'Contraste',
        icon: 'contrast',
        items: [
          { value: false, title: 'Tema claro' },
          { value: true, title: 'Alto contraste' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (story, contexto) => {
      // O tema vive numa classe no <html>, então o decorator mexe no documento
      // do iframe da story — é assim que a lib funciona de verdade.
      const ligado = contexto.globals['contraste'] === true || contexto.globals['contraste'] === 'true';
      document.documentElement.classList.toggle('govbr-contrast', ligado);
      return story();
    },
  ],
};

export default preview;
