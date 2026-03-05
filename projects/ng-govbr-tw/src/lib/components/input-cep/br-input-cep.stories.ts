import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrInputCepComponent } from './br-input-cep.component';


const meta: Meta<BrInputCepComponent> = {
  title: 'Formulários/Máscaras/CEP',
  component: BrInputCepComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrInputCepComponent] })],
  args: { required: false } as never,
  render: (args) => ({ props: args, template: `<br-input-cep [label]="label" [placeholder]="placeholder" [required]="required" [hint]="hint"></br-input-cep>` }),
};
export default meta;
type Story = StoryObj<BrInputCepComponent>;

export const Padrao: Story = { args: { label: 'CEP', placeholder: '00000-000' } as never };
export const ComApoio: Story = { args: { label: 'CEP', placeholder: '00000-000', hint: 'Campo opcional' } as never };
