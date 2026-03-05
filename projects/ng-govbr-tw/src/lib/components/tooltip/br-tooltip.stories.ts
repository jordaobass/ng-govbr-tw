import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTooltipComponent } from './br-tooltip.component';

const meta: Meta<BrTooltipComponent> = {
  title: 'Feedback/Tooltip',
  component: BrTooltipComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTooltipComponent] })],
  args: { variant: 'info' } as never,
  render: (args) => ({ props: args, template: `<div class="p-16 flex justify-center"><br-tooltip [text]="text" [place]="place" [variant]="variant"><button class="px-4 py-2 rounded-govbr-pill bg-govbr-primary text-govbr-on-primary">Passe o cursor</button></br-tooltip></div>` }),
};
export default meta;
type Story = StoryObj<BrTooltipComponent>;

export const Acima: Story = { args: { text: 'Informação adicional', place: 'top' } as never };
export const Abaixo: Story = { args: { text: 'Informação adicional', place: 'bottom' } as never };
