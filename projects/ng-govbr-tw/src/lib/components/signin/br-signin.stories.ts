import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrSigninComponent } from './br-signin.component';

const meta: Meta<BrSigninComponent> = {
  title: 'Exibição/Sign-in Gov.br',
  component: BrSigninComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrSigninComponent] })],
  render: (a) => ({ props: a, template: `<br-signin [variant]="variant" [size]="size" [text]="text" [loading]="loading"></br-signin>` }),
  args: { variant: 'primary' } as never,
};
export default meta;
type Story = StoryObj<BrSigninComponent>;

export const Primario: Story = { args: { variant: 'primary' } as never };
export const Secundario: Story = { args: { variant: 'secondary' } as never };
export const Escuro: Story = { args: { variant: 'dark' } as never };
export const Carregando: Story = { args: { loading: true } as never };
