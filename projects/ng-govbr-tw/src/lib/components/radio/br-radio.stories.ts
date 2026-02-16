import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrRadioGroupComponent } from './br-radio.component';


const meta: Meta<BrRadioGroupComponent> = {
  title: 'Formulários/Radio Group',
  component: BrRadioGroupComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrRadioGroupComponent] })],
  render: (args) => ({ props: args, template: `<br-radio-group [legend]="legend" [name]="name" [options]="options" [inline]="inline" [required]="required"></br-radio-group>` }),
  args: {
    legend: 'Forma de atendimento',
    name: 'atendimento',
    options: [
      { value: 'presencial', label: 'Presencial' },
      { value: 'online', label: 'Online' },
      { value: 'telefone', label: 'Por telefone' },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrRadioGroupComponent>;

export const Padrao: Story = { args: {} as never };
export const EmLinha: Story = { args: { inline: true } as never };
export const Obrigatorio: Story = { args: { required: true } as never };
