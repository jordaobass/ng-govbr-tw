import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrSkeletonComponent } from './br-skeleton.component';

const meta: Meta<BrSkeletonComponent> = {
  title: 'Feedback/Skeleton',
  component: BrSkeletonComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrSkeletonComponent] })],
  render: (args) => ({ props: args, template: `<br-skeleton [variant]="variant" [width]="width" [height]="height" [rows]="rows"></br-skeleton>` }),
};
export default meta;
type Story = StoryObj<BrSkeletonComponent>;

export const Texto: Story = { args: { variant: 'text', rows: 3 } as never };
export const Bloco: Story = { args: { variant: 'rect', width: '320px', height: '120px' } as never };
