import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrWizardComponent, BrWizardStepComponent } from './br-wizard.component';

const meta: Meta<BrWizardComponent> = {
  title: 'Dados/Wizard',
  component: BrWizardComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrWizardComponent, BrWizardStepComponent] })],
  render: (a) => ({ props: a, template: `<br-wizard [currentStep]="currentStep" [showNavigation]="showNavigation">
      <br-wizard-step label="Identificação"><div class="p-6 text-govbr-sm">Informe seus dados.</div></br-wizard-step>
      <br-wizard-step label="Documentos"><div class="p-6 text-govbr-sm">Anexe os comprovantes.</div></br-wizard-step>
      <br-wizard-step label="Conclusão"><div class="p-6 text-govbr-sm">Revise e envie.</div></br-wizard-step>
    </br-wizard>` }),
  args: { currentStep: 0, showNavigation: true } as never,
};
export default meta;
type Story = StoryObj<BrWizardComponent>;

export const Padrao: Story = { args: {} as never };
export const SegundoPasso: Story = { args: { currentStep: 1 } as never };
