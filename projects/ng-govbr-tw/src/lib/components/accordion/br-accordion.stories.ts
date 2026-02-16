import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrAccordionComponent, BrAccordionItemComponent } from './br-accordion.component';

const meta: Meta<BrAccordionComponent> = {
  title: 'Dados/Accordion',
  component: BrAccordionComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrAccordionComponent, BrAccordionItemComponent] })],
  render: (a) => ({ props: a, template: `<div class="max-w-lg"><br-accordion [mode]="mode">
      <br-accordion-item title="O que é o Gov.br?" icon="circle-question" [open]="true"><div class="p-4 text-govbr-sm">Plataforma única de acesso aos serviços públicos digitais.</div></br-accordion-item>
      <br-accordion-item title="Como acessar?" icon="right-to-bracket"><div class="p-4 text-govbr-sm">Use sua conta gov.br com CPF e senha.</div></br-accordion-item>
      <br-accordion-item title="Esqueci a senha" icon="key"><div class="p-4 text-govbr-sm">Recupere pelo aplicativo ou pelo site.</div></br-accordion-item>
    </br-accordion></div>` }),
  args: { mode: 'single' } as never,
};
export default meta;
type Story = StoryObj<BrAccordionComponent>;

export const Padrao: Story = { args: {} as never };
export const MultiplosAbertos: Story = { args: { mode: 'multiple' } as never };
