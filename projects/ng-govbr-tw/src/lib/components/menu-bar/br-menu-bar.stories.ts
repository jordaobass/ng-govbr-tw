import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { BrMenuBarComponent, BrMenuBarItemComponent, BrMenuBarSubItemComponent } from './br-menu-bar.component';

const meta: Meta<BrMenuBarComponent> = {
  title: 'Navegação/Menu Bar',
  component: BrMenuBarComponent,
  tags: ['autodocs'],
  // Cromo de página: ocupa a largura inteira num site real. Sem isto o palco
  // o encaixota no limite de leitura e ele parece quebrado, não contido.
  parameters: { palco: 'cheio' },
  decorators: [
    // RouterLink nos itens exige um Router provido. A rota curinga é
    // necessária: o Storybook roda em /iframe.html, e um router sem rotas
    // falha com NG04002 ao tentar casar essa URL.
    applicationConfig({ providers: [provideRouter([{ path: '**', children: [] }])] }),
    moduleMetadata({ imports: [BrMenuBarComponent, BrMenuBarItemComponent, BrMenuBarSubItemComponent] })],
  render: (a) => ({ props: a, template: `<br-menu-bar [variant]="variant">
      <br-menu-bar-item label="Início" icon="home"></br-menu-bar-item>
      <br-menu-bar-item label="Serviços" icon="list" [hasSubmenu]="true">
        <br-menu-bar-sub-item label="Agendamento"></br-menu-bar-sub-item>
        <br-menu-bar-sub-item label="Protocolo"></br-menu-bar-sub-item>
      </br-menu-bar-item>
      <br-menu-bar-item label="Contato" icon="envelope"></br-menu-bar-item>
    </br-menu-bar>` }),
  args: { variant: 'primary' } as never,
};
export default meta;
type Story = StoryObj<BrMenuBarComponent>;

export const Primario: Story = { args: { variant: 'primary' } as never };
export const Escuro: Story = { args: { variant: 'dark' } as never };
export const Claro: Story = { args: { variant: 'white' } as never };
