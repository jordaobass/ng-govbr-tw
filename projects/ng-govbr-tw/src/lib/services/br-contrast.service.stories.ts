import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BrButtonComponent } from '../components/button/br-button.component';
import { BrMessageComponent } from '../components/message/br-message.component';
import { BrContrastService } from './br-contrast.service';

/**
 * Alto contraste pelo serviço — como um consumidor liga de verdade.
 *
 * A barra de ferramentas do Storybook também alterna o tema, mas por outro
 * caminho: ela põe a classe no `<html>` direto. Quem usa a biblioteca chama o
 * `BrContrastService`, que além da classe **persiste a preferência**.
 *
 * A diferença não é acadêmica: o estado já viveu num booleano de componente, e
 * o F5 desligava o tema. Para quem depende de alto contraste, isso é a
 * funcionalidade não existir. Esta story é o que permite provar a persistência
 * ponta a ponta, recarregando a página.
 */
@Component({
  selector: 'br-sb-contraste-demo',
  standalone: true,
  imports: [BrButtonComponent, BrMessageComponent],
  /*
   * Componentes de verdade, não um retângulo de demonstração: o que se quer
   * ver é o tema alcançando o botão e a mensagem — que foram os que já
   * ficaram presos no tema claro enquanto o resto mudava.
   */
  template: `
    <div class="font-rawline">
      <br-button
        emphasis="primary"
        data-testid="alternar-contraste"
        (click)="contraste.alternar()"
      >
        Alternar alto contraste
      </br-button>

      <div class="mt-6 space-y-3">
        <br-message type="info">Informação sobre o andamento do pedido.</br-message>
        <br-message type="success">Cadastro concluído.</br-message>
        <br-message type="danger">Não foi possível concluir.</br-message>
      </div>
    </div>
  `,
})
class SbContrasteDemoComponent {
  readonly contraste = inject(BrContrastService);
}

const meta: Meta<SbContrasteDemoComponent> = {
  title: 'Serviços/Alto Contraste',
  component: SbContrasteDemoComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SbContrasteDemoComponent] })],
  render: () => ({ template: `<br-sb-contraste-demo></br-sb-contraste-demo>` }),
};
export default meta;
type Story = StoryObj<SbContrasteDemoComponent>;

export const Padrao: Story = {};
