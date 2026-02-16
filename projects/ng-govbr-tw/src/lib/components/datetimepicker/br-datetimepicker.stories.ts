import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrDatetimepickerComponent } from './br-datetimepicker.component';


const meta: Meta<BrDatetimepickerComponent> = {
  title: 'Formulários/Date & Time Picker',
  component: BrDatetimepickerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrDatetimepickerComponent] })],
  render: (args) => ({ props: args, template: `<br-datetimepicker [label]="label" [dateLabel]="dateLabel" [timeLabel]="timeLabel"></br-datetimepicker>` }),
};
export default meta;
type Story = StoryObj<BrDatetimepickerComponent>;

export const Padrao: Story = { args: { label: 'Agendamento', dateLabel: 'Data', timeLabel: 'Hora' } as never };
