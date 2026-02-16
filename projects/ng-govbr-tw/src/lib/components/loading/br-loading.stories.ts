import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrLoadingComponent } from './br-loading.component';

const meta: Meta<BrLoadingComponent> = {
  title: 'Feedback/Loading',
  component: BrLoadingComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrLoadingComponent] })],
  render: (args) => ({ props: args, template: `<br-loading [size]="size" [progress]="progress" [showPercentage]="showPercentage" [label]="label"></br-loading>` }),
};
export default meta;
type Story = StoryObj<BrLoadingComponent>;

export const Indeterminado: Story = { args: { size: 'medium', label: 'Carregando...' } as never };
export const ComProgresso: Story = { args: { size: 'medium', progress: 65, showPercentage: true, label: 'Enviando arquivo' } as never };
