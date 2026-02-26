import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrHeaderComponent } from './br-header.component';

const meta: Meta<BrHeaderComponent> = {
  title: 'Navegação/Header',
  component: BrHeaderComponent,
  tags: ['autodocs'],
  // Cromo de página: ocupa a largura inteira num site real.
  parameters: { palco: 'cheio' },
  decorators: [moduleMetadata({ imports: [BrHeaderComponent] })],
  render: (args) => ({
    props: args,
    template: `<br-header
      [systemTitle]="systemTitle"
      [systemSubtitle]="systemSubtitle"
      [signature]="signature"
      [userName]="userName"
      [userRole]="userRole"
      [showLogin]="showLogin"
      [showSearch]="showSearch"
      [showContrast]="showContrast"
    ></br-header>`,
  }),
  args: {
    systemTitle: 'Sistema de Atendimento',
    signature: 'Ministério da Gestão',
    showLogin: true,
    showSearch: true,
  } as never,
};
export default meta;
type Story = StoryObj<BrHeaderComponent>;

export const Padrao: Story = { args: {} as never };
export const ComSubtitulo: Story = {
  args: { systemSubtitle: 'Protocolo eletrônico', showContrast: true } as never,
};
export const Autenticado: Story = {
  args: { userName: 'Maria Silva', userRole: 'Servidora', showLogin: false } as never,
};
