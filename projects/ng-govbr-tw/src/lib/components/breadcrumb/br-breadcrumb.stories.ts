import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { BrBreadcrumbComponent } from './br-breadcrumb.component';

const meta: Meta<BrBreadcrumbComponent> = {
  title: 'Navegação/Breadcrumb',
  component: BrBreadcrumbComponent,
  tags: ['autodocs'],
  decorators: [
    // RouterLink nos itens exige um Router provido. A rota curinga é
    // necessária: o Storybook roda em /iframe.html, e um router sem rotas
    // falha com NG04002 ao tentar casar essa URL.
    applicationConfig({ providers: [provideRouter([{ path: '**', children: [] }])] }),
    moduleMetadata({ imports: [BrBreadcrumbComponent] })],
  render: (a) => ({ props: a, template: `<br-breadcrumb [items]="items" [showHome]="showHome"></br-breadcrumb>` }),
  args: {
    items: [
      { label: 'Serviços', route: '/servicos' },
      { label: 'Agendamento', route: '/servicos/agendamento' },
      { label: 'Confirmação' },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrBreadcrumbComponent>;

export const Padrao: Story = { args: {} as never };
export const SemInicio: Story = { args: { showHome: false } as never };
