import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrUploadComponent } from './br-upload.component';


const meta: Meta<BrUploadComponent> = {
  title: 'Formulários/Upload',
  component: BrUploadComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrUploadComponent] })],
  render: (args) => ({ props: args, template: `<br-upload [label]="label" [accept]="accept" [multiple]="multiple" [maxSizeMB]="maxSizeMB" [required]="required" [helperText]="helperText" [error]="error"></br-upload>` }),
};
export default meta;
type Story = StoryObj<BrUploadComponent>;

export const Padrao: Story = { args: { label: 'Anexar documento', accept: '.pdf,.jpg,.png', maxSizeMB: 5 } as never };
export const VariosArquivos: Story = { args: { label: 'Anexar comprovantes', multiple: true, maxSizeMB: 10 } as never };
export const ComApoio: Story = { args: { label: 'Anexar laudo', helperText: 'Aceita apenas PDF assinado digitalmente' } as never };
export const ComErro: Story = { args: { label: 'Anexar laudo', error: 'Arquivo acima do tamanho permitido' } as never };
