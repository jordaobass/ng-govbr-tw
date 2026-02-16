import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { BrSidebarComponent, BrSidebarItemComponent, BrSidebarSubComponent, BrSidebarGroupComponent, BrSidebarGroupLabelComponent } from './br-sidebar.component';

const meta: Meta<BrSidebarComponent> = {
  title: 'Navegação/Sidebar',
  component: BrSidebarComponent,
  tags: ['autodocs'],
  decorators: [
    // RouterLink nos itens exige um Router provido. A rota curinga é
    // necessária: o Storybook roda em /iframe.html, e um router sem rotas
    // falha com NG04002 ao tentar casar essa URL.
    applicationConfig({ providers: [provideRouter([{ path: '**', children: [] }])] }),
    moduleMetadata({ imports: [BrSidebarComponent, BrSidebarItemComponent, BrSidebarSubComponent, BrSidebarGroupComponent, BrSidebarGroupLabelComponent] })],
  render: (a) => ({ props: a, template: `<div class="relative h-96 border border-govbr-gray-10 rounded overflow-hidden">
      <br-sidebar>
        <br-sidebar-group>
          <br-sidebar-group-label>Principal</br-sidebar-group-label>
          <br-sidebar-item icon="home" label="Início"></br-sidebar-item>
          <br-sidebar-item icon="user" label="Meu perfil"></br-sidebar-item>
        </br-sidebar-group>
        <br-sidebar-sub icon="file-alt" label="Documentos" [open]="true">
          <br-sidebar-item label="Enviados"></br-sidebar-item>
          <br-sidebar-item label="Recebidos"></br-sidebar-item>
        </br-sidebar-sub>
        <br-sidebar-item icon="cog" label="Configurações"></br-sidebar-item>
      </br-sidebar>
    </div>` }),
};
export default meta;
type Story = StoryObj<BrSidebarComponent>;

export const Padrao: Story = { args: {} as never };
