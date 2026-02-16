import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTimelineComponent } from './br-timeline.component';

const meta: Meta<BrTimelineComponent> = {
  title: 'Dados/Timeline',
  component: BrTimelineComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTimelineComponent] })],
  render: (a) => ({ props: a, template: `<div class="max-w-lg"><br-timeline [items]="items" [orientation]="orientation"></br-timeline></div>` }),
  args: {
    items: [
      { title: 'Protocolo recebido', description: '10/02/2026 às 09:12', icon: 'inbox' },
      { title: 'Em análise', description: '10/02/2026 às 14:30', icon: 'magnifying-glass' },
      { title: 'Concluído', description: '12/02/2026 às 08:00', icon: 'circle-check' },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrTimelineComponent>;

export const Vertical: Story = { args: { orientation: 'vertical' } as never };
