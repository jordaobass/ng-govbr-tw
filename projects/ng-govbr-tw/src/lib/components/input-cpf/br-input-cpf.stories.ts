import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrInputCpfComponent } from './br-input-cpf.component';


const meta: Meta<BrInputCpfComponent> = {
  title: 'Formulários/Máscaras/CPF',
  component: BrInputCpfComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrInputCpfComponent] })],
  render: (args) => ({ props: args, template: `<br-input-cpf [label]="label" [placeholder]="placeholder" [required]="required" [helperText]="helperText" [error]="error"></br-input-cpf>` }),
};
export default meta;
type Story = StoryObj<BrInputCpfComponent>;

export const Padrao: Story = { args: { label: 'CPF', placeholder: '000.000.000-00' } as never };
export const Obrigatorio: Story = { args: { label: 'CPF', placeholder: '000.000.000-00', required: true, helperText: 'Somente números' } as never };
export const ComErro: Story = { args: { label: 'CPF', placeholder: '000.000.000-00', error: 'CPF inválido' } as never };
