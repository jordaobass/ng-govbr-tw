import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrPaginationComponent } from './br-pagination.component';

const meta: Meta<BrPaginationComponent> = {
  title: 'Navegação/Pagination',
  component: BrPaginationComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrPaginationComponent] })],
  render: (a) => ({ props: a, template: `<br-pagination [page]="page" [totalPages]="totalPages" [totalItems]="totalItems" [itemsPerPage]="itemsPerPage" [showItemsPerPage]="showItemsPerPage" [density]="density"></br-pagination>` }),
  args: { page: 3, totalPages: 12, totalItems: 240, itemsPerPage: 20, density: 'small' } as never,
};
export default meta;
type Story = StoryObj<BrPaginationComponent>;

export const Padrao: Story = { args: {} as never };
export const ComItensPorPagina: Story = { args: { showItemsPerPage: true } as never };
export const PoucasPaginas: Story = { args: { page: 1, totalPages: 3, totalItems: 42 } as never };
