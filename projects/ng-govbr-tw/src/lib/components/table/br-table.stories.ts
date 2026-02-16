import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrTableComponent } from './br-table.component';

const meta: Meta<BrTableComponent> = {
  title: 'Dados/Table',
  component: BrTableComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrTableComponent] })],
  render: (a) => ({ props: a, template: `<br-table [ariaLabel]="ariaLabel" [caption]="caption" [headerStyle]="headerStyle" [page]="page" [totalPages]="totalPages" [totalItems]="totalItems" [showPagination]="showPagination">
      <thead><tr><th scope="col" class="px-4 py-2">Protocolo</th><th scope="col" class="px-4 py-2">Solicitante</th><th scope="col" class="px-4 py-2">Situação</th></tr></thead>
      <tbody>
        <tr><td class="px-4 py-2">2026-00482</td><td class="px-4 py-2">Maria Souza</td><td class="px-4 py-2">Em análise</td></tr>
        <tr><td class="px-4 py-2">2026-00481</td><td class="px-4 py-2">João Lima</td><td class="px-4 py-2">Concluído</td></tr>
        <tr><td class="px-4 py-2">2026-00480</td><td class="px-4 py-2">Ana Dias</td><td class="px-4 py-2">Cancelado</td></tr>
      </tbody>
    </br-table>` }),
  args: { ariaLabel: 'Protocolos', headerStyle: 'primary', page: 1, totalPages: 5, totalItems: 98, showPagination: true } as never,
};
export default meta;
type Story = StoryObj<BrTableComponent>;

export const Padrao: Story = { args: {} as never };
export const CabecalhoEscuro: Story = { args: { headerStyle: 'secondary' } as never };
export const CabecalhoClaro: Story = { args: { headerStyle: 'light' } as never };
export const SemPaginacao: Story = { args: { showPagination: false } as never };
