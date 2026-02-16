import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrInputComponent } from './br-input.component';


const meta: Meta<BrInputComponent> = {
  title: 'Formulários/Input',
  component: BrInputComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrInputComponent] })],
  render: (args) => ({ props: args, template: `<br-input [label]="label" [type]="type" [placeholder]="placeholder" [required]="required" [error]="error" [helperText]="helperText" [successMessage]="successMessage" [icon]="icon"></br-input>` }),
};
export default meta;
type Story = StoryObj<BrInputComponent>;

export const Padrao: Story = { args: { label: 'Nome completo', placeholder: 'Digite seu nome' } as never };
export const ComApoio: Story = { args: { label: 'CPF', placeholder: '000.000.000-00', helperText: 'Apenas números' } as never };
export const ComErro: Story = { args: { label: 'E-mail', placeholder: 'voce@exemplo.com', error: 'Informe um e-mail válido' } as never };
export const ComSucesso: Story = { args: { label: 'Usuário', successMessage: 'Disponível' } as never };
export const Senha: Story = { args: { label: 'Senha', type: 'password', placeholder: 'Digite sua senha' } as never };
