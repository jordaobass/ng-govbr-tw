import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrBadgeComponent } from './br-badge.component';

const meta: Meta<BrBadgeComponent> = {
  title: 'Exibição/Badge',
  component: BrBadgeComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrBadgeComponent] })],
  render: (a) => ({ props: a, template: `<br-badge [variant]="variant" [ariaLabel]="ariaLabel">{{ texto }}</br-badge>` }),
  args: { texto: 'Concluído', variant: 'primary' } as never,
};
export default meta;
type Story = StoryObj<BrBadgeComponent>;

export const Primario: Story = { args: { variant: 'primary' } as never };
export const Sucesso: Story = { args: { texto: 'Aprovado', variant: 'success' } as never };
export const Perigo: Story = { args: { texto: 'Recusado', variant: 'danger' } as never };
export const Aviso: Story = { args: { texto: 'Pendente', variant: 'warning' } as never };
export const SoNumero: Story = { args: { texto: '3', variant: 'danger', ariaLabel: '3 pendências' } as never };
