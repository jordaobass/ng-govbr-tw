import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrCheckboxGroupComponent } from './br-checkbox-group.component';

const meta: Meta<BrCheckboxGroupComponent> = {
  title: 'Formulários/Checkbox Group',
  component: BrCheckboxGroupComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrCheckboxGroupComponent] })],
  render: (args) => ({
    props: args,
    template: `<br-checkbox-group [legend]="legend" [name]="name" [options]="options" [inline]="inline" [required]="required" [hint]="hint" [error]="error"></br-checkbox-group>`,
  }),
  args: { required: false,
    legend: 'Documentos que você possui',
    name: 'documentos',
    options: [
      { label: 'RG', value: 'rg' },
      { label: 'CPF', value: 'cpf' },
      { label: 'CNH', value: 'cnh' },
      { label: 'Passaporte', value: 'passaporte', disabled: true },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrCheckboxGroupComponent>;

export const Padrao: Story = { args: {} as never };
export const EmLinha: Story = { args: { inline: true } as never };
export const ComApoio: Story = { args: { hint: 'Marque todos os que estiverem válidos' } as never };
export const ComErro: Story = { args: { error: 'Selecione ao menos um documento' } as never };
