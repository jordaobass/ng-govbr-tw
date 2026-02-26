import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrFooterComponent } from './br-footer.component';

const meta: Meta<BrFooterComponent> = {
  title: 'Navegação/Footer',
  component: BrFooterComponent,
  tags: ['autodocs'],
  // Cromo de página: ocupa a largura inteira num site real. Sem isto o palco
  // o encaixota no limite de leitura e ele parece quebrado, não contido.
  parameters: { palco: 'cheio' },
  decorators: [moduleMetadata({ imports: [BrFooterComponent] })],
  render: (a) => ({ props: a, template: `<br-footer [logoSrc]="logoSrc"><div class="text-center text-sm">Conteúdo projetado no rodapé</div></br-footer>` }),
};
export default meta;
type Story = StoryObj<BrFooterComponent>;

export const Padrao: Story = { args: {} as never };
