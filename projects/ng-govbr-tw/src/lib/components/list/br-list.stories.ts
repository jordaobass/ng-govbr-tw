import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrListComponent, BrItemComponent } from './br-list.component';

const meta: Meta<BrListComponent> = {
  title: 'Dados/List',
  component: BrListComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrListComponent, BrItemComponent] })],
  render: (a) => ({ props: a, template: `<div class="max-w-lg"><br-list [title]="title" [subtitle]="subtitle">
      <br-item title="Protocolo 2026-00482" subtitle="Enviado em 10/02" icon="file"></br-item>
      <br-item title="Protocolo 2026-00481" subtitle="Enviado em 09/02" icon="file"></br-item>
      <br-item title="Protocolo 2026-00480" subtitle="Enviado em 08/02" icon="file"></br-item>
    </br-list></div>` }),
  args: { title: 'Meus protocolos', subtitle: '3 registros' } as never,
};
export default meta;
type Story = StoryObj<BrListComponent>;

export const Padrao: Story = { args: {} as never };
