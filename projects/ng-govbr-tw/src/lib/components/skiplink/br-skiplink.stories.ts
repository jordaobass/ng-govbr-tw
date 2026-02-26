import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrSkiplinkComponent } from './br-skiplink.component';

const meta: Meta<BrSkiplinkComponent> = {
  title: 'Navegação/Skiplink',
  component: BrSkiplinkComponent,
  tags: ['autodocs'],
  // Cromo de página: ocupa a largura inteira num site real. Sem isto o palco
  // o encaixota no limite de leitura e ele parece quebrado, não contido.
  parameters: { palco: 'cheio' },
  decorators: [moduleMetadata({ imports: [BrSkiplinkComponent] })],
  render: (a) => ({ props: a, template: `<div>
      <p class="mb-3 text-govbr-sm text-govbr-gray-60">Pressione <kbd class="px-1.5 py-0.5 border border-govbr-gray-20 rounded text-govbr-xs">Tab</kbd> — o atalho aparece ao receber foco.</p>
      <br-skiplink [itens]="itens" [ariaLabel]="ariaLabel"></br-skiplink>
      <main id="conteudo" class="mt-4 p-4 border border-dashed border-govbr-gray-20 rounded text-govbr-sm">Conteúdo principal</main>
    </div>` }),
  args: { itens: [{ href: '#conteudo', label: 'Ir para o conteúdo' }] } as never,
};
export default meta;
type Story = StoryObj<BrSkiplinkComponent>;

export const Padrao: Story = { args: {} as never };
