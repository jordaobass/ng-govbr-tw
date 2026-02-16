import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrNotificationComponent } from './br-notification.component';

const meta: Meta<BrNotificationComponent> = {
  title: 'Feedback/Notification',
  component: BrNotificationComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrNotificationComponent] })],
  render: (args) => ({ props: args, template: `<br-notification [count]="count" [max]="max" [showDot]="showDot" [variant]="variant"><i class="fa-solid fa-bell text-2xl text-govbr-gray-60"></i></br-notification>` }),
};
export default meta;
type Story = StoryObj<BrNotificationComponent>;

export const ComContagem: Story = { args: { count: 3 } as never };
export const Limitada: Story = { args: { count: 120, max: 99 } as never };
export const SoPonto: Story = { args: { showDot: true } as never };
