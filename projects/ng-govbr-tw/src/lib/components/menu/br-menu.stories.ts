import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { BrMenuComponent } from './br-menu.component';
import { BrMenuItemComponent } from './br-menu-item.component';

const meta: Meta<BrMenuComponent> = {
  title: 'Navegação/Menu',
  component: BrMenuComponent,
  tags: ['autodocs'],
  // Cromo de página: ocupa a largura inteira num site real. Sem isto o palco
  // o encaixota no limite de leitura e ele parece quebrado, não contido.
  parameters: { palco: 'cheio' },
  decorators: [
    // `br-menu-item` usa RouterLink: sem um Router provido, a story quebra.
    // A rota curinga cobre /iframe.html, onde o Storybook renderiza.
    // provideRouter é mais leve do que arrastar o RouterTestingModule,
    // que é módulo de teste e não tem por que aparecer na documentação.
    applicationConfig({ providers: [provideRouter([{ path: '**', children: [] }])] }),
    moduleMetadata({ imports: [BrMenuComponent, BrMenuItemComponent] }),
  ],
  render: (a) => ({
    props: a,
    template: `<div class="relative h-96 border border-govbr-gray-10 rounded overflow-hidden">
      <br-menu [open]="open" [variant]="variant" [width]="width" [ariaLabel]="ariaLabel">
        <br-menu-item icon="home" label="Início"></br-menu-item>
        <br-menu-item icon="file-lines" label="Meus documentos" badge="3"></br-menu-item>
        <br-menu-item icon="folder" label="Processos" [hasChildren]="true"></br-menu-item>
        <br-menu-item icon="gear" label="Configurações"></br-menu-item>
      </br-menu>
    </div>`,
  }),
  args: { open: true, variant: 'white', width: 'default', ariaLabel: 'Menu principal' } as never,
};
export default meta;
type Story = StoryObj<BrMenuComponent>;

export const Padrao: Story = {};
export const Estreito: Story = { args: { width: 'narrow' } as never };
