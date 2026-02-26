import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  BrMegaMenuColumnComponent,
  BrMegaMenuComponent,
  BrMegaMenuLinkComponent,
  BrMegaMenuPanelComponent,
  BrMegaMenuTriggerComponent,
} from './br-mega-menu.component';

/**
 * Mega menu — gatilhos, painéis, colunas e links.
 *
 * Cinco componentes exportados e NENHUMA story até aqui: eram os únicos do
 * `public-api.ts` que ninguém via. Isso tem preço — o anel de foco destes
 * botões apontava para `ring-govbr-focus-color`, token que não existe (o do
 * preset chama-se `govbr-focus`), e nada apontou o dedo porque não havia onde
 * olhar.
 *
 * O componente é de composição: o painel ativo é escolhido por `activePanel`,
 * e cada gatilho e painel declaram o mesmo `panelId`. Um host pequeno guarda
 * esse estado — é o que um consumidor faria.
 */
@Component({
  selector: 'br-sb-mega-menu-demo',
  standalone: true,
  imports: [
    BrMegaMenuComponent,
    BrMegaMenuTriggerComponent,
    BrMegaMenuPanelComponent,
    BrMegaMenuColumnComponent,
    BrMegaMenuLinkComponent,
  ],
  template: `
    <br-mega-menu [activePanel]="painelAtivo" (activePanelChange)="painelAtivo = $event">
      <br-mega-menu-trigger
        label="Serviços"
        panelId="servicos"
        [isActive]="painelAtivo === 'servicos'"
      ></br-mega-menu-trigger>
      <br-mega-menu-trigger
        label="Cidadão"
        panelId="cidadao"
        [isActive]="painelAtivo === 'cidadao'"
      ></br-mega-menu-trigger>

      <br-mega-menu-panel panelId="servicos" [isActive]="painelAtivo === 'servicos'">
        <br-mega-menu-column title="Consultas">
          <br-mega-menu-link label="Situação cadastral"></br-mega-menu-link>
          <br-mega-menu-link label="Processos"></br-mega-menu-link>
          <br-mega-menu-link label="Débitos"></br-mega-menu-link>
        </br-mega-menu-column>
        <br-mega-menu-column title="Agendamentos">
          <br-mega-menu-link label="Agendar atendimento"></br-mega-menu-link>
          <br-mega-menu-link label="Consultar agendamento"></br-mega-menu-link>
        </br-mega-menu-column>
      </br-mega-menu-panel>

      <br-mega-menu-panel panelId="cidadao" [isActive]="painelAtivo === 'cidadao'">
        <br-mega-menu-column title="Documentos">
          <br-mega-menu-link label="CPF"></br-mega-menu-link>
          <br-mega-menu-link label="RG"></br-mega-menu-link>
          <br-mega-menu-link label="CNH"></br-mega-menu-link>
        </br-mega-menu-column>
      </br-mega-menu-panel>
    </br-mega-menu>
  `,
})
class SbMegaMenuDemoComponent {
  painelAtivo: string | null = null;
}

/**
 * Painel já aberto.
 *
 * Coluna, link e painel só existem no DOM enquanto o painel está ativo — sem
 * esta variante, três dos cinco componentes exportados continuariam sem
 * nenhuma story que os renderize, e a verificação de cobertura teria de
 * depender de clique, que é mais frágil.
 */
@Component({
  selector: 'br-sb-mega-menu-aberto',
  standalone: true,
  imports: [
    BrMegaMenuComponent,
    BrMegaMenuTriggerComponent,
    BrMegaMenuPanelComponent,
    BrMegaMenuColumnComponent,
    BrMegaMenuLinkComponent,
  ],
  template: `
    <br-mega-menu activePanel="servicos">
      <br-mega-menu-trigger label="Serviços" panelId="servicos" [isActive]="true"></br-mega-menu-trigger>
      <br-mega-menu-trigger label="Cidadão" panelId="cidadao"></br-mega-menu-trigger>

      <br-mega-menu-panel panelId="servicos" [isActive]="true">
        <br-mega-menu-column title="Consultas">
          <br-mega-menu-link label="Situação cadastral"></br-mega-menu-link>
          <br-mega-menu-link label="Processos"></br-mega-menu-link>
        </br-mega-menu-column>
        <br-mega-menu-column title="Agendamentos">
          <br-mega-menu-link label="Agendar atendimento"></br-mega-menu-link>
        </br-mega-menu-column>
      </br-mega-menu-panel>
    </br-mega-menu>
  `,
})
class SbMegaMenuAbertoComponent {}

const meta: Meta<SbMegaMenuDemoComponent> = {
  title: 'Navegação/Mega Menu',
  component: SbMegaMenuDemoComponent,
  tags: ['autodocs'],
  // Cromo de página: ocupa a largura inteira num site real.
  parameters: { palco: 'cheio' },
  decorators: [
    moduleMetadata({ imports: [SbMegaMenuDemoComponent, SbMegaMenuAbertoComponent] }),
  ],
  render: () => ({ template: `<br-sb-mega-menu-demo></br-sb-mega-menu-demo>` }),
};
export default meta;
type Story = StoryObj<SbMegaMenuDemoComponent>;

export const Padrao: Story = {};

export const ComPainelAberto: Story = {
  render: () => ({ template: `<br-sb-mega-menu-aberto></br-sb-mega-menu-aberto>` }),
};
