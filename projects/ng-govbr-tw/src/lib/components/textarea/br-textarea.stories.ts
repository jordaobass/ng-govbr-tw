import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTextareaComponent } from './br-textarea.component';


const meta: Meta<BrTextareaComponent> = {
  title: 'Formulários/Textarea',
  component: BrTextareaComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTextareaComponent] })],
  render: (args) => ({ props: args, template: `<br-textarea [label]="label" [placeholder]="placeholder" [rows]="rows" [maxLength]="maxLength" [helperText]="helperText" [error]="error"></br-textarea>` }),
};
export default meta;
type Story = StoryObj<BrTextareaComponent>;

export const Padrao: Story = { args: { label: 'Observação', placeholder: 'Escreva aqui', rows: 4 } as never };
export const ComContador: Story = { args: { label: 'Justificativa', rows: 4, maxLength: 200, helperText: 'Até 200 caracteres' } as never };
export const ComErro: Story = { args: { label: 'Descrição', rows: 3, error: 'Campo obrigatório' } as never };
