import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrDividerComponent } from './br-divider.component';

const meta: Meta<BrDividerComponent> = {
  title: 'Exibição/Divider',
  component: BrDividerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrDividerComponent] })],
  render: (a) => ({ props: a, template: `<div class="max-w-md"><p class="text-govbr-sm text-govbr-gray-60">Conteúdo acima</p><br-divider [text]="text" [spacing]="spacing"></br-divider><p class="text-govbr-sm text-govbr-gray-60">Conteúdo abaixo</p></div>` }),
};
export default meta;
type Story = StoryObj<BrDividerComponent>;

export const Simples: Story = { args: {} as never };
export const ComTexto: Story = { args: { text: 'ou' } as never };
