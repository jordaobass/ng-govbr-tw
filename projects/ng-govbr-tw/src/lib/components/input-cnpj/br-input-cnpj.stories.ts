import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrInputCnpjComponent } from './br-input-cnpj.component';


const meta: Meta<BrInputCnpjComponent> = {
  title: 'Formulários/Máscaras/CNPJ',
  component: BrInputCnpjComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrInputCnpjComponent] })],
  render: (args) => ({ props: args, template: `<br-input-cnpj [label]="label" [placeholder]="placeholder" [required]="required" [helperText]="helperText" [error]="error"></br-input-cnpj>` }),
};
export default meta;
type Story = StoryObj<BrInputCnpjComponent>;

export const Padrao: Story = { args: { label: 'CNPJ', placeholder: '00.000.000/0000-00' } as never };
export const Obrigatorio: Story = { args: { label: 'CNPJ', placeholder: '00.000.000/0000-00', required: true, helperText: 'Somente números' } as never };
export const ComErro: Story = { args: { label: 'CNPJ', placeholder: '00.000.000/0000-00', error: 'CNPJ inválido' } as never };
