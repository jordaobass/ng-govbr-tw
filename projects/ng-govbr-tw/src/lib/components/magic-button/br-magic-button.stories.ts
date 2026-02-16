import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrMagicButtonComponent } from './br-magic-button.component';

const meta: Meta<BrMagicButtonComponent> = {
  title: 'Feedback/Magic Button',
  component: BrMagicButtonComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrMagicButtonComponent] })],
  render: (args) => ({ props: args, template: `<div class="relative h-64"><br-magic-button [icon]="icon" [actions]="actions" [position]="position" [showLabels]="showLabels"></br-magic-button></div>` }),
  args: {
    icon: 'plus',
    actions: [
      { icon: 'file', label: 'Novo documento' },
      { icon: 'upload', label: 'Enviar arquivo' },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrMagicButtonComponent>;

export const Padrao: Story = { args: {} as never };
export const ComRotulos: Story = { args: { showLabels: true } as never };
