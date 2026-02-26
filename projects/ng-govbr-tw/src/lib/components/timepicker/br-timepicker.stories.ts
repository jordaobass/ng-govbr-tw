import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTimepickerComponent } from './br-timepicker.component';


const meta: Meta<BrTimepickerComponent> = {
  title: 'Formulários/Time Picker',
  component: BrTimepickerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTimepickerComponent] })],
  args: { placeholder: 'HH:MM' } as never,
  render: (args) => ({ props: args, template: `<br-timepicker [label]="label" [placeholder]="placeholder" [hint]="hint" [error]="error"></br-timepicker>` }),
};
export default meta;
type Story = StoryObj<BrTimepickerComponent>;

export const Padrao: Story = { args: { label: 'Horário', placeholder: 'hh:mm' } as never };
export const ComApoio: Story = { args: { label: 'Horário de chegada', hint: 'Atendimento das 8h às 17h' } as never };
export const ComErro: Story = { args: { label: 'Horário', error: 'Horário fora do expediente' } as never };
