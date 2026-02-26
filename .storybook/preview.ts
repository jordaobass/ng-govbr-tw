import type { Preview } from '@storybook/angular';

/**
 * Os estilos globais entram por `styles` no alvo do `angular.json`
 * (`.storybook/styles.css`), que importa os CSS da própria lib — o mesmo
 * caminho que o `ng-add` configura num projeto consumidor. Testar com um CSS
 * diferente do que o consumidor recebe seria testar outra coisa.
 */
const preview: Preview = {
  /*
   * O canvas do Storybook vinha com `padding: 0`, e os componentes nasciam
   * colados no topo e nas laterais — rótulo cortado na borda de cima, campo
   * de ponta a ponta, sem espaço para o painel de um dropdown abrir.
   *
   * O palco abaixo dá respiro e largura de leitura. Componente que é de
   * largura total por natureza (header, rodapé, barras, layout) declara
   * `parameters: { palco: 'cheio' }` e fica sem a moldura.
   */
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
    },

    /*
     * O addon de backgrounds fica DESLIGADO de propósito.
     *
     * Ele pinta o fundo com um valor fixo, e isso brigava com o tema: no alto
     * contraste o texto virava branco enquanto o fundo continuava `#f8f8f8`,
     * deixando 118 stories com texto a 1,06:1 — invisível. Quem manda no
     * fundo é o token `--govbr-bg`, aplicado pelo decorator abaixo, que é
     * como a biblioteca funciona num app de verdade.
     */
    backgrounds: { disable: true },

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
      /*
       * O respiro é dado por CSS na raiz do canvas, não embrulhando a story.
       *
       * A primeira versão envolvia o `template` num `<div>`. Isso quebra de um
       * jeito silencioso: story declarada só com `component` + `args`, sem
       * `template`, viraria `<div class="sb-palco"></div>` — uma moldura vazia,
       * sem erro nenhum. Mexer numa classe no `<html>` não tem como sumir com
       * o conteúdo.
       */
      document.documentElement.classList.toggle(
        'sb-palco-cheio',
        contexto.parameters['palco'] === 'cheio'
      );
      return story();
    },
    (story, contexto) => {
      // O tema vive numa classe no <html>, então o decorator mexe no documento
      // do iframe da story — é assim que a lib funciona de verdade.
      const ligado =
        contexto.globals['contraste'] === true || contexto.globals['contraste'] === 'true';
      document.documentElement.classList.toggle('govbr-contrast', ligado);

      // O fundo acompanha o tema, lido do próprio token: no claro a página é
      // cinza-2, no alto contraste é preta. Fixar um valor aqui recriaria o
      // conflito que deixava texto branco sobre fundo claro.
      const raiz = getComputedStyle(document.documentElement);
      document.body.style.backgroundColor =
        raiz.getPropertyValue(ligado ? '--govbr-bg' : '--govbr-gray-2').trim() || '';
      document.body.style.color = raiz.getPropertyValue('--govbr-gray-80').trim() || '';

      return story();
    },
  ],
};

export default preview;
