import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrSwitchComponent } from './br-switch.component';


const meta: Meta<BrSwitchComponent> = {
  title: 'Formulários/Switch',
  component: BrSwitchComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrSwitchComponent] })],
  render: (args) => ({ props: args, template: `<br-switch [label]="label" [disabled]="disabled" [size]="size"></br-switch>` }),
};
export default meta;
type Story = StoryObj<BrSwitchComponent>;

export const Padrao: Story = { args: { label: 'Receber notificações' } as never };
export const Desabilitado: Story = { args: { label: 'Indisponível', disabled: true } as never };
