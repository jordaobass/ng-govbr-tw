import type { Meta, StoryObj } from '@storybook/angular';
import { BrButtonComponent } from './br-button.component';

const meta: Meta<BrButtonComponent> = {
  title: 'Formulários/Button',
  component: BrButtonComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    /*
     * ⚠️ `variant` e `size` sao aliases DEPRECIADOS: os setters deles
     * escrevem em `emphasis` e `density`. Ligar os dois pares ao mesmo tempo
     * com um dos lados indefinido APAGA o valor do outro — era o que
     * acontecia aqui, e o botao saia sem `px-5 py-2`, colado no texto, porque
     * `densityMap[undefined]` e undefined.
     *
     * Em Angular, `undefined` num @Input nao cai no default da classe: ele
     * sobrescreve. Por isso todo input ligado no template precisa ter valor
     * em `args`.
     */
    template: `<br-button
      [emphasis]="emphasis" [density]="density"
      [disabled]="disabled" [loading]="loading" [icon]="icon" [circle]="circle"
    >{{ rotulo }}</br-button>`,
  }),
  args: {
    rotulo: 'Enviar',
    emphasis: 'primary',
    density: 'medium',
    disabled: false,
    loading: false,
    circle: false,
  } as never,
};
export default meta;
type Story = StoryObj<BrButtonComponent>;

export const Primario: Story = { args: { emphasis: 'primary' } as never };
export const Secundario: Story = { args: { emphasis: 'secondary' } as never };
export const Perigo: Story = { args: { emphasis: 'danger' } as never };
export const Carregando: Story = { args: { emphasis: 'primary', loading: true } as never };
