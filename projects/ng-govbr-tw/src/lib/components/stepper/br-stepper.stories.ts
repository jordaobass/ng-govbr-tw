import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrStepperComponent } from './br-stepper.component';

const meta: Meta<BrStepperComponent> = {
  title: 'Dados/Stepper',
  component: BrStepperComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrStepperComponent] })],
  render: (a) => ({ props: a, template: `<br-stepper [steps]="steps" [currentStep]="currentStep" [orientation]="orientation" [clickable]="clickable"></br-stepper>` }),
  args: {
    steps: [
      { label: 'Identificação', description: 'Dados pessoais' },
      { label: 'Documentos', description: 'Envio de anexos' },
      { label: 'Revisão', description: 'Conferir informações', optional: true },
      { label: 'Conclusão' },
    ],
    currentStep: 1,
  } as never,
};
export default meta;
type Story = StoryObj<BrStepperComponent>;

export const Horizontal: Story = { args: { orientation: 'horizontal' } as never };
export const Vertical: Story = { args: { orientation: 'vertical' } as never };
export const Navegavel: Story = { args: { orientation: 'horizontal', clickable: true, currentStep: 2 } as never };
