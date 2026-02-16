import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrChipComponent } from './br-chip.component';

const meta: Meta<BrChipComponent> = {
  title: 'Exibição/Chip',
  component: BrChipComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrChipComponent] })],
  render: (a) => ({ props: a, template: `<br-chip [label]="label" [icon]="icon" [variant]="variant" [selectable]="selectable" [selected]="selected" [removable]="removable"></br-chip>` }),
  args: { label: 'Filtro ativo' } as never,
};
export default meta;
type Story = StoryObj<BrChipComponent>;

export const Padrao: Story = { args: {} as never };
export const Selecionavel: Story = { args: { selectable: true, selected: true } as never };
export const Removivel: Story = { args: { removable: true } as never };
export const ComIcone: Story = { args: { icon: 'tag' } as never };
