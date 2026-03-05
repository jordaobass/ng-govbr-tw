import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrSuccessCheckComponent } from './success-check.component';

const meta: Meta<BrSuccessCheckComponent> = {
  title: 'Feedback/Success Check',
  component: BrSuccessCheckComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrSuccessCheckComponent] })],
  args: { animate: true, size: 'medium', variant: 'success' } as never,
  render: (args) => ({ props: args, template: `<br-success-check [size]="size" [variant]="variant" [animate]="animate"></br-success-check>` }),
};
export default meta;
type Story = StoryObj<BrSuccessCheckComponent>;

export const Padrao: Story = { args: { size: 'medium' } as never };
export const Grande: Story = { args: { size: 'large', variant: 'primary' } as never };
