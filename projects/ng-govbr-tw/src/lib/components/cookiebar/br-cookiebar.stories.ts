import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrCookiebarComponent } from './br-cookiebar.component';

const meta: Meta<BrCookiebarComponent> = {
  title: 'Feedback/Cookie Bar',
  component: BrCookiebarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrCookiebarComponent] })],
  render: (args) => ({ props: args, template: `<br-cookiebar [visible]="visible" [cookieGroups]="cookieGroups"></br-cookiebar>` }),
  args: {
    visible: true,
    cookieGroups: [
      { id: 'essenciais', name: 'Essenciais', description: 'Necessários para o funcionamento.', required: true },
      { id: 'analise', name: 'Análise', description: 'Ajudam a entender o uso do site.' },
    ],
  } as never,
};
export default meta;
type Story = StoryObj<BrCookiebarComponent>;

export const Padrao: Story = { args: {} as never };
