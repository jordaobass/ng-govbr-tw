import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTabComponent, BrTabPanelComponent } from './br-tab.component';

const meta: Meta<BrTabComponent> = {
  title: 'Navegação/Tabs',
  component: BrTabComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTabComponent, BrTabPanelComponent] })],
  render: (a) => ({ props: a, template: `<br-tab [activeIndex]="activeIndex" [density]="density">
      <br-tab-panel label="Dados pessoais" icon="user"><div class="p-4 text-govbr-sm">Conteúdo do primeiro painel.</div></br-tab-panel>
      <br-tab-panel label="Documentos" icon="file" [counter]="3"><div class="p-4 text-govbr-sm">Conteúdo do segundo painel.</div></br-tab-panel>
      <br-tab-panel label="Histórico" icon="clock"><div class="p-4 text-govbr-sm">Conteúdo do terceiro painel.</div></br-tab-panel>
    </br-tab>` }),
  args: { activeIndex: 0 } as never,
};
export default meta;
type Story = StoryObj<BrTabComponent>;

export const Padrao: Story = { args: {} as never };
export const SegundaAba: Story = { args: { activeIndex: 1 } as never };
