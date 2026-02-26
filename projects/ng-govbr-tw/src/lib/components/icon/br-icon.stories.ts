import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrIconComponent } from './br-icon.component';

const meta: Meta<BrIconComponent> = {
  title: 'Exibição/Icon',
  component: BrIconComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrIconComponent] })],
  render: (args) => ({
    props: args,
    template: `<br-icon [name]="name" [variant]="variant" [size]="size" [label]="label" [extraClass]="extraClass"></br-icon>`,
  }),
  args: { name: 'house', variant: 'solid', size: 'medium' } as never,
};
export default meta;
type Story = StoryObj<BrIconComponent>;

export const Decorativo: Story = { args: { name: 'house' } as never };
export const ComSignificado: Story = { args: { name: 'triangle-exclamation', label: 'Atenção', extraClass: 'text-govbr-warning-dark' } as never };
export const Tamanhos: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-end gap-4">
        <br-icon name="star" size="small"></br-icon>
        <br-icon name="star" size="medium"></br-icon>
        <br-icon name="star" size="large"></br-icon>
        <br-icon name="star" size="xlarge"></br-icon>
      </div>`,
  }),
};
