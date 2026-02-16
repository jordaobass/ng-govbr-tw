import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTimepickerComponent } from './br-timepicker.component';


const meta: Meta<BrTimepickerComponent> = {
  title: 'Formulários/Time Picker',
  component: BrTimepickerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTimepickerComponent] })],
  render: (args) => ({ props: args, template: `<br-timepicker [label]="label" [placeholder]="placeholder" [hint]="hint"></br-timepicker>` }),
};
export default meta;
type Story = StoryObj<BrTimepickerComponent>;

export const Padrao: Story = { args: { label: 'Horário', placeholder: 'hh:mm' } as never };
