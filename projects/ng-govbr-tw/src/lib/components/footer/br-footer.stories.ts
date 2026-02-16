import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrFooterComponent } from './br-footer.component';

const meta: Meta<BrFooterComponent> = {
  title: 'Navegação/Footer',
  component: BrFooterComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrFooterComponent] })],
  render: (a) => ({ props: a, template: `<br-footer [logoSrc]="logoSrc"><div class="text-center text-sm">Conteúdo projetado no rodapé</div></br-footer>` }),
};
export default meta;
type Story = StoryObj<BrFooterComponent>;

export const Padrao: Story = { args: {} as never };
