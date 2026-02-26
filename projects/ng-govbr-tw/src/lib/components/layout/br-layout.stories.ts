import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BrLayoutComponent } from './br-layout.component';
import { BrHeaderComponent } from '../header/br-header.component';
import { BrFooterComponent } from '../footer/br-footer.component';

/**
 * O layout só existe para posicionar os outros: ele é feito de `ng-content`
 * com `select`. Uma story sem conteúdo projetado mostraria uma caixa vazia e
 * não provaria nada — por isso aqui entram header e rodapé de verdade.
 */
const meta: Meta<BrLayoutComponent> = {
  title: 'Navegação/Layout',
  component: BrLayoutComponent,
  tags: ['autodocs'],
  parameters: { palco: 'cheio' },
  decorators: [
    moduleMetadata({ imports: [BrLayoutComponent, BrHeaderComponent, BrFooterComponent] }),
  ],
  render: () => ({
    template: `
      <br-layout>
        <br-header systemTitle="Sistema de Atendimento" signature="Ministério da Gestão"></br-header>
        <div class="p-6 font-rawline">
          <h1 class="text-govbr-2xl font-bold text-govbr-gray-80 mb-2">Conteúdo da página</h1>
          <p class="text-govbr-base text-govbr-gray-60">
            O layout distribui cabeçalho, barras, menu lateral, conteúdo e rodapé.
          </p>
        </div>
        <br-footer></br-footer>
      </br-layout>`,
  }),
};
export default meta;
type Story = StoryObj<BrLayoutComponent>;

export const Padrao: Story = {};
