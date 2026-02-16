import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrCheckboxComponent } from './br-checkbox.component';


const meta: Meta<BrCheckboxComponent> = {
  title: 'Formulários/Checkbox',
  component: BrCheckboxComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrCheckboxComponent] })],
  render: (args) => ({ props: args, template: `<br-checkbox [label]="label" [indeterminate]="indeterminate" [errorMessage]="errorMessage"></br-checkbox>` }),
};
export default meta;
type Story = StoryObj<BrCheckboxComponent>;

export const Padrao: Story = { args: { label: 'Li e aceito os termos' } as never };
export const Indeterminado: Story = { args: { label: 'Selecionar todos', indeterminate: true } as never };
export const ComErro: Story = { args: { label: 'Aceite obrigatório', errorMessage: 'É preciso aceitar para continuar' } as never };
