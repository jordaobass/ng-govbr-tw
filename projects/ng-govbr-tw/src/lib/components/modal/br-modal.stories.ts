import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrModalComponent } from './br-modal.component';

/**
 * Modal com gatilho de verdade.
 *
 * As demais stories abrem o modal já aberto, que é o que serve para olhar o
 * visual. Mas metade do comportamento acessível só existe quando há um
 * GATILHO: o foco tem de entrar no diálogo ao abrir e **voltar para quem
 * abriu** ao fechar (WCAG 2.4.3). Sem botão, não há para onde voltar e o
 * defeito passa despercebido.
 */
@Component({
  selector: 'br-sb-modal-com-gatilho',
  standalone: true,
  imports: [BrModalComponent],
  template: `
    <button
      type="button"
      class="px-4 py-2 rounded-govbr-pill bg-govbr-primary text-govbr-on-primary text-govbr-sm font-semibold govbr-focus-ring"
      (click)="aberto = true"
    >
      Abrir Modal
    </button>

    <br-modal
      [isOpen]="aberto"
      title="Confirmar envio"
      (closed)="aberto = false"
    >
      <p class="text-govbr-sm text-govbr-gray-60">Esta ação não pode ser desfeita.</p>
    </br-modal>
  `,
})
class SbModalComGatilhoComponent {
  aberto = false;
}

const meta: Meta<BrModalComponent> = {
  title: 'Feedback/Modal',
  component: BrModalComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrModalComponent] })],
  render: (args) => ({ props: args, template: `<br-modal [isOpen]="isOpen" [title]="title" [size]="size" [variant]="variant" [primaryText]="primaryText"><p class="text-govbr-sm text-govbr-gray-60">{{ corpo }}</p></br-modal>` }),
  args: { isOpen: true, corpo: 'Esta ação não pode ser desfeita.', variant: 'default', size: 'medium', primaryText: 'Confirmar' } as never,
};
export default meta;
type Story = StoryObj<BrModalComponent>;

export const Padrao: Story = { args: { title: 'Confirmar envio' } as never };
export const Perigo: Story = { args: { title: 'Excluir registro', variant: 'danger', primaryText: 'Excluir' } as never };
export const Aviso: Story = { args: { title: 'Atenção', variant: 'warning' } as never };
export const Pequeno: Story = { args: { title: 'Confirmar', size: 'small' } as never };

export const ComGatilho: Story = {
  decorators: [moduleMetadata({ imports: [SbModalComGatilhoComponent] })],
  render: () => ({ template: `<br-sb-modal-com-gatilho></br-sb-modal-com-gatilho>` }),
};
