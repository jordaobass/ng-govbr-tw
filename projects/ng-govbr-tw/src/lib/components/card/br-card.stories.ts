import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrCardComponent } from './br-card.component';

const meta: Meta<BrCardComponent> = {
  title: 'Dados/Card',
  component: BrCardComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrCardComponent] })],
  render: (a) => ({ props: a, template: `<div class="max-w-sm"><br-card [icon]="icon" [cardTitle]="cardTitle" [subtitle]="subtitle" [tag]="tag" [linkText]="linkText"><p class="text-govbr-sm text-govbr-gray-60">{{ corpo }}</p></br-card></div>` }),
  args: { cardTitle: 'Agendamento', subtitle: 'Atendimento presencial', corpo: 'Agende um horário na unidade mais próxima.' } as never,
};
export default meta;
type Story = StoryObj<BrCardComponent>;

export const Padrao: Story = { args: {} as never };
export const ComIcone: Story = { args: { icon: 'calendar' } as never };
export const ComEtiqueta: Story = { args: { tag: 'Novo', linkText: 'Saiba mais' } as never };
