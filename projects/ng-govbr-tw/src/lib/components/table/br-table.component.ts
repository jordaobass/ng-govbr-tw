import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { BrPaginationComponent } from '../pagination/br-pagination.component';

@Component({
  selector: 'br-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrPaginationComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!--
      O overflow-x-auto cria uma região rolável. Região rolável precisa ser
      alcançável por teclado (WCAG 2.1.1) e anunciada — daí role=region,
      tabindex=0 e um nome acessível.
    -->
    <div
      class="overflow-x-auto font-rawline govbr-focus-ring"
      role="region"
      tabindex="0"
      [attr.aria-label]="rotuloRegiao"
      [attr.data-header-style]="headerStyle"
      [attr.data-responsive]="responsive"
    >
      @if (selectable && selectedRows.size > 0) {
        <div class="flex items-center gap-3 px-4 py-2 bg-govbr-primary-lightest border-b border-govbr-gray-10 text-govbr-sm text-govbr-primary font-medium">
          <span>{{ selectedRows.size }} {{ selectedRows.size === 1 ? 'item selecionado' : 'itens selecionados' }}</span>
          <button
            type="button"
            class="ml-auto text-govbr-primary hover:underline govbr-focus-ring rounded px-2 py-0.5 text-govbr-xs font-semibold"
            (click)="clearSelection()"
          >
            Limpar selecao
          </button>
        </div>
      }

      <table class="w-full text-sm text-left text-govbr-gray-80" [attr.aria-label]="ariaLabel || null">
        @if (caption) {
          <caption class="sr-only">{{ caption }}</caption>
        }
        <ng-content></ng-content>
      </table>

      @if (showPagination && (totalPages > 1 || showItemsPerPage)) {
        <br-pagination
          class="br-table-pagination"
          [class.contextual]="paginationVariant === 'contextual'"
          [page]="page"
          [totalPages]="totalPages"
          [totalItems]="totalItems"
          [itemsPerPage]="itemsPerPage"
          [itemsPerPageOptions]="itemsPerPageOptions"
          [showItemsPerPage]="showItemsPerPage"
          [showSummary]="showSummary"
          [showGoToPage]="showGoToPage"
          [showFirstLast]="showFirstLast"
          [variant]="paginationVariant"
          [density]="paginationDensity"
          (pageChange)="onPageChange($event)"
          (itemsPerPageChange)="onItemsPerPageChange($event)"
        ></br-pagination>
      }
    </div>
    `,
  styles: [`
    br-table table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    /* Base styles for header */
    br-table table thead th {
      font-weight: var(--govbr-font-weight-semi-bold);
      font-size: var(--govbr-font-size-sm);
      line-height: var(--govbr-line-height-medium);
      padding: var(--govbr-spacing-4);
      text-align: left;
    }

    /* Primary style (default): blue-warm-vivid-70 var(--govbr-primary) */
    br-table [data-header-style="primary"] table thead th {
      background-color: var(--govbr-primary);
      color: var(--govbr-on-primary);
      border-bottom: 1px solid var(--govbr-primary-dark);
    }
    br-table [data-header-style="primary"] table thead th:first-child {
      border-radius: 4px 0 0 0;
    }
    br-table [data-header-style="primary"] table thead th:last-child {
      border-radius: 0 4px 0 0;
    }

    /* Secondary style: blue-warm-vivid-80 var(--govbr-primary-dark) (darker) */
    br-table [data-header-style="secondary"] table thead th {
      background-color: var(--govbr-primary-dark);
      color: var(--govbr-on-primary);
      border-bottom: 1px solid var(--govbr-primary-darkest);
    }
    br-table [data-header-style="secondary"] table thead th:first-child {
      border-radius: 4px 0 0 0;
    }
    br-table [data-header-style="secondary"] table thead th:last-child {
      border-radius: 0 4px 0 0;
    }

    /* Light style: white background with blue text */
    br-table [data-header-style="light"] table thead th {
      background-color: var(--govbr-on-primary);
      color: var(--govbr-primary);
      border-bottom: 2px solid var(--govbr-gray-5);
      border-radius: 0;
    }

    /* Body styles */
    br-table table tbody td {
      padding: var(--govbr-spacing-4);
      font-size: var(--govbr-font-size-sm);
      line-height: var(--govbr-line-height-medium);
      color: var(--govbr-table-cell-color);
      border-bottom: var(--govbr-table-cell-border);
      background-color: var(--govbr-table-row-bg);
    }
    br-table table tbody tr:nth-child(even) td {
      background-color: var(--govbr-table-row-alt-bg);
    }
    br-table table tbody tr:hover td {
      background-color: var(--govbr-table-row-hover-bg);
    }
    br-table table tbody tr.br-table-row-selected td {
      background-color: var(--govbr-primary-lightest) !important;
    }

    /* ═══ Responsive Cards Mode ═══ */
    @media (max-width: 768px) {
      br-table [data-responsive="cards"] table {
        border: none;
      }

      br-table [data-responsive="cards"] table thead {
        display: none;
      }

      br-table [data-responsive="cards"] table tbody tr {
        display: block;
        margin-bottom: 16px;
        background: var(--govbr-bg);
        border: 1px solid var(--govbr-gray-10);
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        overflow: hidden;
      }

      br-table [data-responsive="cards"] table tbody tr:nth-child(even) {
        background: var(--govbr-bg);
      }

      br-table [data-responsive="cards"] table tbody td {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 12px 16px;
        border-bottom: 1px solid var(--govbr-gray-5);
        background: transparent !important;
        text-align: right;
      }

      br-table [data-responsive="cards"] table tbody td:last-child {
        border-bottom: none;
      }

      br-table [data-responsive="cards"] table tbody td::before {
        content: attr(data-label);
        font-weight: 600;
        color: var(--govbr-gray-60);
        text-align: left;
        margin-right: 16px;
        flex-shrink: 0;
      }

      br-table [data-responsive="cards"] table tbody tr:hover td {
        background: transparent !important;
      }

      br-table [data-responsive="cards"] table tbody tr:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      }
    }

    /* ═══ Pagination inside table ═══ */
    br-table .br-table-pagination {
      display: block;
      border-top: 1px solid var(--govbr-gray-10, var(--govbr-gray-5));
    }

    br-table .br-table-pagination.contextual .br-pagination {
      margin: 0;
      padding: 12px 16px;
      border-radius: 0 0 4px 4px;
    }

    br-table .br-table-pagination:not(.contextual) {
      padding: 12px 16px;
    }
  `],
})
export class BrTableComponent {
  /**
   * Estilo do header da tabela:
   * - 'primary': Azul Gov.br (var(--govbr-primary)) - blue-warm-vivid-70
   * - 'secondary': Azul escuro (var(--govbr-primary-dark)) - blue-warm-vivid-80
   * - 'light': Fundo branco com texto azul
   */
  /**
   * Nome acessível da tabela.
   *
   * ⚠️ A lib **não consegue** colocar `scope` nos `<th>`: o `<table>` inteiro
   * é projetado por `<ng-content>`, ou seja, escrito por quem usa. Garantir
   * `<th scope="col">` é responsabilidade do consumidor — ver a seção Table
   * no README. O que a lib oferece é o rótulo e a região rolável.
   */
  @Input() ariaLabel?: string;

  /** Legenda da tabela. Renderizada só para leitores de tela. */
  @Input() caption?: string;

  @Input() headerStyle: 'primary' | 'secondary' | 'light' = 'primary';

  /**
   * Modo responsivo:
   * - 'scroll': scroll horizontal (padrão)
   * - 'cards': transforma linhas em cards no mobile (requer data-label nos td)
   */
  @Input() responsive: 'scroll' | 'cards' = 'scroll';

  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  @Input() itemsPerPageOptions = [10, 25, 50, 100];
  /** Exibir paginação (true por padrão) */
  @Input() showPagination = true;
  @Input() showItemsPerPage = false;
  @Input() showSummary = false;
  @Input() showGoToPage = true;
  /** Mostrar botões primeira/última página (apenas variant default) */
  @Input() showFirstLast = true;
  @Input() selectable = false;

  /** Variante da paginação: 'default' (input) ou 'contextual' (dropdowns Gov.br) */
  @Input() paginationVariant: 'default' | 'contextual' = 'default';

  /** Densidade da paginação */
  @Input() paginationDensity: 'small' | 'medium' | 'large' = 'small';

  /** Rótulo da região rolável; cai para um texto genérico se nada foi dado. */
  get rotuloRegiao(): string {
    return this.ariaLabel || this.caption || 'Tabela de dados, rolável';
  }

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() selectionChange = new EventEmitter<Set<string | number>>();

  selectedRows = new Set<string | number>();

  onPageChange(p: number): void {
    this.page = p;
    this.pageChange.emit(p);
  }

  onItemsPerPageChange(size: number): void {
    this.itemsPerPage = size;
    this.itemsPerPageChange.emit(size);
  }

  toggleRow(id: string | number): void {
    if (this.selectedRows.has(id)) {
      this.selectedRows.delete(id);
    } else {
      this.selectedRows.add(id);
    }
    this.selectedRows = new Set(this.selectedRows);
    this.selectionChange.emit(this.selectedRows);
  }

  toggleAll(ids: (string | number)[]): void {
    const allSelected = ids.every(id => this.selectedRows.has(id));
    if (allSelected) {
      ids.forEach(id => this.selectedRows.delete(id));
    } else {
      ids.forEach(id => this.selectedRows.add(id));
    }
    this.selectedRows = new Set(this.selectedRows);
    this.selectionChange.emit(this.selectedRows);
  }

  isSelected(id: string | number): boolean {
    return this.selectedRows.has(id);
  }

  isAllSelected(ids: (string | number)[]): boolean {
    return ids.length > 0 && ids.every(id => this.selectedRows.has(id));
  }

  clearSelection(): void {
    this.selectedRows = new Set();
    this.selectionChange.emit(this.selectedRows);
  }
}
