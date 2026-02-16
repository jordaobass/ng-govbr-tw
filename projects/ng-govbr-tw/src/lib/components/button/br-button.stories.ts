import type { Meta, StoryObj } from '@storybook/angular';
import { BrButtonComponent } from './br-button.component';

const meta: Meta<BrButtonComponent> = {
  title: 'Formulários/Button',
  component: BrButtonComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<br-button
      [emphasis]="emphasis" [variant]="variant" [size]="size"
      [disabled]="disabled" [loading]="loading" [icon]="icon" [circle]="circle"
    >{{ rotulo }}</br-button>`,
  }),
  args: { rotulo: 'Enviar' } as never,
};
export default meta;
type Story = StoryObj<BrButtonComponent>;

export const Primario: Story = { args: { emphasis: 'primary' } as never };
export const Secundario: Story = { args: { emphasis: 'secondary' } as never };
export const Perigo: Story = { args: { emphasis: 'primary', variant: 'danger' } as never };
export const Carregando: Story = { args: { emphasis: 'primary', loading: true } as never };
