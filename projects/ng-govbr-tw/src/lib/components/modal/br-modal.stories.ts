import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrModalComponent } from './br-modal.component';

const meta: Meta<BrModalComponent> = {
  title: 'Feedback/Modal',
  component: BrModalComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrModalComponent] })],
  render: (args) => ({ props: args, template: `<br-modal [isOpen]="isOpen" [title]="title" [size]="size" [variant]="variant" [primaryText]="primaryText"><p class="text-govbr-sm text-govbr-gray-60">{{ corpo }}</p></br-modal>` }),
  args: { isOpen: true, corpo: 'Esta ação não pode ser desfeita.' } as never,
};
export default meta;
type Story = StoryObj<BrModalComponent>;

export const Padrao: Story = { args: { title: 'Confirmar envio' } as never };
export const Perigo: Story = { args: { title: 'Excluir registro', variant: 'danger', primaryText: 'Excluir' } as never };
export const Aviso: Story = { args: { title: 'Atenção', variant: 'warning' } as never };
export const Pequeno: Story = { args: { title: 'Confirmar', size: 'small' } as never };
