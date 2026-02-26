import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTabComponent, BrTabPanelComponent } from './br-tab.component';

const meta: Meta<BrTabComponent> = {
  title: 'Navegação/Tabs',
  component: BrTabComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTabComponent, BrTabPanelComponent] })],
  /*
   * ⚠️ As abas vêm de `[tabs]`, NÃO dos `<br-tab-panel>` projetados.
   *
   * O `br-tab` lê rótulo, ícone e contador do `@Input() tabs`; o painel
   * projetado entra só como CONTEÚDO do painel ativo. Sem `[tabs]` a barra
   * nasce vazia — era o que esta story fazia: renderizava `<br-tab>` com zero
   * abas e zero painéis, e o teste que exige "um componente da lib na tela"
   * passava, porque a casca estava lá.
   *
   * Os `label`/`icon`/`counter` declarados no `<br-tab-panel>` são ignorados
   * pelo pai. É uma aresta da API: a mesma informação em dois lugares, só um
   * deles lido. Mudar isso quebra quem já usa.
   */
  render: (a) => ({ props: a, template: `<br-tab [tabs]="tabs" [activeIndex]="activeIndex" [density]="density">
      <br-tab-panel><div class="p-4 text-govbr-sm">Conteúdo do painel ativo.</div></br-tab-panel>
    </br-tab>` }),
  args: {
    activeIndex: 0,
    tabs: [
      { label: 'Dados pessoais', icon: 'user' },
      { label: 'Documentos', icon: 'file', counter: 3 },
      { label: 'Histórico', icon: 'clock' },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrTabComponent>;

export const Padrao: Story = { args: {} as never };
export const SegundaAba: Story = { args: { activeIndex: 1 } as never };
