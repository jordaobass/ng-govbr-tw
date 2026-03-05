import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrDatepickerComponent } from './br-datepicker.component';


const meta: Meta<BrDatepickerComponent> = {
  title: 'Formulários/Date Picker',
  component: BrDatepickerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrDatepickerComponent] })],
  args: { required: false, placeholder: 'dd/mm/aaaa' } as never,
  render: (args) => ({ props: args, template: `<br-datepicker [label]="label" [placeholder]="placeholder" [hint]="hint" [error]="error" [required]="required"></br-datepicker>` }),
};
export default meta;
type Story = StoryObj<BrDatepickerComponent>;

export const Padrao: Story = { args: { label: 'Data de nascimento', placeholder: 'dd/mm/aaaa' } as never };
export const ComApoio: Story = { args: { label: 'Data do agendamento', hint: 'Dias úteis apenas' } as never };
export const ComErro: Story = { args: { label: 'Data da solicitação', error: 'Informe uma data válida' } as never };
