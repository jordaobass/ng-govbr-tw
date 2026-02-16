import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrMessageComponent } from './br-message.component';

const meta: Meta<BrMessageComponent> = {
  title: 'Feedback/Message',
  component: BrMessageComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrMessageComponent] })],
  render: (args) => ({ props: args, template: `<br-message [type]="type" [title]="title" [dismissible]="dismissible">{{ corpo }}</br-message>` }),
  args: { corpo: 'Seu protocolo foi registrado com o número 2026-00482.' } as never,
};
export default meta;
type Story = StoryObj<BrMessageComponent>;

export const Sucesso: Story = { args: { type: 'success', title: 'Pedido enviado' } as never };
export const Erro: Story = { args: { type: 'danger', title: 'Não foi possível enviar' } as never };
export const Aviso: Story = { args: { type: 'warning', title: 'Confira os dados' } as never };
export const Informacao: Story = { args: { type: 'info', title: 'Prazo de análise' } as never };
export const Dispensavel: Story = { args: { type: 'info', title: 'Aviso', dismissible: true } as never };
