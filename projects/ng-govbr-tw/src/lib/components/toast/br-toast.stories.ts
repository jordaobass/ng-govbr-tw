import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BrToastContainerComponent } from './br-toast.component';
import { BrToastService } from './br-toast.service';

/**
 * Gatilho dos toasts.
 *
 * O toast não tem `@Input` nenhum: quem o cria é o `BrToastService`, de
 * qualquer lugar da aplicação. Uma story só com `<br-toast-container>` seria
 * uma tela vazia — é preciso um componente que injete o service e dispare.
 *
 * Esta story é o **canário do OnPush**: o toast muda de estado por
 * `setTimeout`, FORA de evento de template, que é exatamente o padrão que
 * `ChangeDetectionStrategy.OnPush` quebra em silêncio — compila, passa no
 * unitário e some da tela. Os `data-testid` existem para o E2E; não são
 * decoração.
 */
@Component({
  selector: 'br-sb-toast-demo',
  standalone: true,
  imports: [BrToastContainerComponent],
  template: `
    <div class="flex flex-wrap gap-3 font-rawline">
      <button
        data-testid="toast-success"
        class="px-4 py-2 rounded-govbr-pill bg-govbr-success text-govbr-on-primary text-govbr-sm font-semibold govbr-focus-ring"
        (click)="toast.success('Operação concluída com sucesso')"
      >
        Sucesso
      </button>
      <button
        data-testid="toast-danger"
        class="px-4 py-2 rounded-govbr-pill bg-govbr-danger text-govbr-on-primary text-govbr-sm font-semibold govbr-focus-ring"
        (click)="toast.danger('Não foi possível concluir a operação')"
      >
        Erro
      </button>
      <button
        data-testid="toast-warning"
        class="px-4 py-2 rounded-govbr-pill bg-govbr-warning text-govbr-on-warning text-govbr-sm font-semibold govbr-focus-ring"
        (click)="toast.warning('Confira os dados antes de enviar')"
      >
        Aviso
      </button>
      <button
        data-testid="toast-info"
        class="px-4 py-2 rounded-govbr-pill bg-govbr-info text-govbr-on-primary text-govbr-sm font-semibold govbr-focus-ring"
        (click)="toast.info('Seu protocolo foi registrado')"
      >
        Informação
      </button>
    </div>

    <br-toast-container></br-toast-container>
  `,
})
class SbToastDemoComponent {
  readonly toast = inject(BrToastService);
}

const meta: Meta<SbToastDemoComponent> = {
  title: 'Feedback/Toast',
  component: SbToastDemoComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SbToastDemoComponent] })],
  render: () => ({ template: `<br-sb-toast-demo></br-sb-toast-demo>` }),
};
export default meta;
type Story = StoryObj<SbToastDemoComponent>;

export const Padrao: Story = {};
