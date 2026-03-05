import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrInputMoneyComponent } from './br-input-money.component';


const meta: Meta<BrInputMoneyComponent> = {
  title: 'Formulários/Máscaras/Moeda',
  component: BrInputMoneyComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrInputMoneyComponent] })],
  args: { required: false } as never,
  render: (args) => ({ props: args, template: `<br-input-money [label]="label" [placeholder]="placeholder" [required]="required" [hint]="hint"></br-input-money>` }),
};
export default meta;
type Story = StoryObj<BrInputMoneyComponent>;

export const Padrao: Story = { args: { label: 'Valor', placeholder: '0,00' } as never };
export const ComApoio: Story = { args: { label: 'Valor', placeholder: '0,00', hint: 'Campo opcional' } as never };
