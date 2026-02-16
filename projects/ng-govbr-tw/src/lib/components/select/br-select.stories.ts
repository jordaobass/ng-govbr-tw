import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrSelectComponent } from './br-select.component';


const meta: Meta<BrSelectComponent> = {
  title: 'Formulários/Select',
  component: BrSelectComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrSelectComponent] })],
  render: (args) => ({ props: args, template: `<br-select [label]="label" [placeholder]="placeholder" [options]="options" [multiple]="multiple" [searchable]="searchable" [helperText]="helperText" [error]="error"></br-select>` }),
  args: {
    label: 'Estado',
    placeholder: 'Selecione',
    options: [
      { value: 'sp', label: 'São Paulo' },
      { value: 'rj', label: 'Rio de Janeiro' },
      { value: 'mg', label: 'Minas Gerais' },
      { value: 'ba', label: 'Bahia', disabled: true },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrSelectComponent>;

export const Padrao: Story = { args: {} as never };
export const ComBusca: Story = { args: { searchable: true, helperText: 'Digite para filtrar' } as never };
export const MultiplaEscolha: Story = { args: { multiple: true, label: 'Estados de atuação' } as never };
export const ComErro: Story = { args: { error: 'Selecione um estado' } as never };
