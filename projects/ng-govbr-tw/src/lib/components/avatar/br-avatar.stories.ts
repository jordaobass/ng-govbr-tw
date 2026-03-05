import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrAvatarComponent } from './br-avatar.component';

const meta: Meta<BrAvatarComponent> = {
  title: 'Exibição/Avatar',
  component: BrAvatarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrAvatarComponent] })],
  render: (a) => ({ props: a, template: `<br-avatar [name]="name" [src]="src" [size]="size" [variant]="variant"></br-avatar>` }),
  args: { variant: 'primary', name: 'Maria Souza', size: 'medium' } as never,
};
export default meta;
type Story = StoryObj<BrAvatarComponent>;

export const Iniciais: Story = { args: {} as never };
export const Pequeno: Story = { args: { size: 'small' } as never };
export const Grande: Story = { args: { size: 'large' } as never };
