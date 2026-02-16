import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrInputTelefoneComponent } from './br-input-telefone.component';


const meta: Meta<BrInputTelefoneComponent> = {
  title: 'Formulários/Máscaras/Telefone',
  component: BrInputTelefoneComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrInputTelefoneComponent] })],
  render: (args) => ({ props: args, template: `<br-input-telefone [label]="label" [placeholder]="placeholder" [required]="required" [hint]="hint"></br-input-telefone>` }),
};
export default meta;
type Story = StoryObj<BrInputTelefoneComponent>;

export const Padrao: Story = { args: { label: 'Telefone', placeholder: '(00) 00000-0000' } as never };
export const ComApoio: Story = { args: { label: 'Telefone', placeholder: '(00) 00000-0000', hint: 'Campo opcional' } as never };
