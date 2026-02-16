import type { StorybookConfig } from '@storybook/angular';

/**
 * Storybook da biblioteca — substitui o showcase (decisão D19).
 *
 * Mira o CÓDIGO-FONTE da lib, não o pacote compilado: assim a story reflete o
 * que está em `projects/ng-govbr-tw/src` no instante em que você olha, sem
 * depender de um `ng build` anterior ter rodado.
 */
const config: StorybookConfig = {
  stories: ['../projects/ng-govbr-tw/src/**/*.stories.ts'],

  addons: [
    '@storybook/addon-essentials',
    // Roda axe-core em cada story. Para uma lib que mira órgão público, onde
    // a11y é obrigação legal, isto não é adorno.
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/angular',
    options: {},
  },

  docs: { autodocs: 'tag' },

  staticDirs: [],
};

export default config;
