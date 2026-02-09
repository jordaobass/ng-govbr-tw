import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'br-pagination',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav
      class="br-pagination font-rawline"
      [class.density-small]="density === 'small'"
      [class.density-large]="density === 'large'"
      [class.variant-default]="variant === 'default'"
      [class.variant-contextual]="variant === 'contextual'"
      [attr.data-variant]="variant"
      [attr.data-total]="totalItems"
      [attr.data-current]="page"
      [attr.data-per-page]="itemsPerPage"
      role="navigation"
      aria-label="Paginação"
    >
      <!-- ═══ DEFAULT VARIANT: Input de página ═══ -->
      @if (variant === 'default') {
        <!-- Items per page -->
        @if (showItemsPerPage) {
          <div class="br-pagination-per-page">
            <span class="br-pagination-label">Exibir</span>
            <div class="br-pagination-select">
              <select
                [id]="selectId"
                [value]="itemsPerPage"
                (change)="onItemsPerPageChange($event)"
              >
                @for (option of itemsPerPageOptions; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
              <i class="fas fa-chevron-down" aria-hidden="true"></i>
            </div>
          </div>
        }

        <!-- Navigation -->
        <div class="br-pagination-navigation">
          <!-- First -->
          @if (showFirstLast) {
            <button
              type="button"
              class="br-pagination-button"
              [class.disabled]="page === 1"
              [disabled]="page === 1"
              aria-label="Ir para primeira página"
              (click)="goTo(1)"
            >
              <i class="fas fa-angle-double-left" aria-hidden="true"></i>
            </button>
          }

          <!-- Previous -->
          <button
            type="button"
            class="br-pagination-button"
            [class.disabled]="page === 1"
            [disabled]="page === 1"
            aria-label="Ir para página anterior"
            (click)="goTo(page - 1)"
          >
            <i class="fas fa-angle-left" aria-hidden="true"></i>
          </button>

          <!-- Page input -->
          <div class="br-pagination-info">
            <input
              type="number"
              class="br-pagination-input"
              [value]="page"
              [min]="1"
              [max]="totalPages"
              aria-label="Página atual"
              (change)="onPageInputChange($event)"
              (keydown.enter)="onPageInputChange($event)"
            />
            <span class="br-pagination-text">de</span>
            <span class="br-pagination-total">{{ totalPages }}</span>
          </div>

          <!-- Next -->
          <button
            type="button"
            class="br-pagination-button"
            [class.disabled]="page === totalPages"
            [disabled]="page === totalPages"
            aria-label="Ir para próxima página"
            (click)="goTo(page + 1)"
          >
            <i class="fas fa-angle-right" aria-hidden="true"></i>
          </button>

          <!-- Last -->
          @if (showFirstLast) {
            <button
              type="button"
              class="br-pagination-button"
              [class.disabled]="page === totalPages"
              [disabled]="page === totalPages"
              aria-label="Ir para última página"
              (click)="goTo(totalPages)"
            >
              <i class="fas fa-angle-double-right" aria-hidden="true"></i>
            </button>
          }
        </div>

        <!-- Summary -->
        @if (showSummary && totalItems > 0) {
          <div class="br-pagination-summary">
            <span class="br-pagination-label">{{ startItem }}-{{ endItem }} de {{ totalItems }} itens</span>
          </div>
        }
      }

      <!-- ═══ CONTEXTUAL VARIANT: Padrão Gov.br oficial ═══ -->
      @if (variant === 'contextual') {
        <!-- Items per page -->
        @if (showItemsPerPage) {
          <div class="pagination-per-page">
            <div class="br-pagination-dropdown">
              <div class="br-pagination-dropdown-input">
                <label [for]="perPageSelectId">Exibir</label>
                <input
                  [id]="perPageSelectId"
                  type="text"
                  [value]="itemsPerPage"
                  readonly
                  (click)="togglePerPageDropdown()"
                  (keydown.enter)="togglePerPageDropdown()"
                  (keydown.space)="togglePerPageDropdown(); $event.preventDefault()"
                />
                <button
                  type="button"
                  class="br-pagination-dropdown-trigger"
                  aria-label="Exibir lista"
                  tabindex="-1"
                  (click)="togglePerPageDropdown()"
                >
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </button>
              </div>
              @if (perPageDropdownOpen) {
                <div class="br-pagination-dropdown-list" tabindex="0">
                  @for (option of itemsPerPageOptions; track option) {
                    <div
                      class="br-pagination-dropdown-item"
                      [class.selected]="option === itemsPerPage"
                      tabindex="-1"
                      (click)="selectItemsPerPage(option)"
                      (keydown.enter)="selectItemsPerPage(option)"
                    >
                      <input
                        type="radio"
                        [id]="'per-page-' + option + '-' + uniqueId"
                        [name]="'per-page-' + uniqueId"
                        [value]="option"
                        [checked]="option === itemsPerPage"
                      />
                      <label [for]="'per-page-' + option + '-' + uniqueId">{{ option }}</label>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- Divider after per-page -->
        @if (showItemsPerPage && showSummary) {
          <span class="br-divider"></span>
        }

        <!-- Information -->
        @if (showSummary && totalItems > 0) {
          <div class="pagination-information">
            {{ startItem }}–{{ endItem }} de {{ totalItems }} itens
          </div>
        }

        <!-- Go to page (pushed right with margin-left: auto) -->
        @if (showGoToPage) {
          <div class="pagination-go-to-page">
            <div class="br-pagination-dropdown">
              <div class="br-pagination-dropdown-input">
                <label [for]="goToPageSelectId">Página</label>
                <input
                  [id]="goToPageSelectId"
                  type="text"
                  [value]="page"
                  readonly
                  (click)="toggleGoToPageDropdown()"
                  (keydown.enter)="toggleGoToPageDropdown()"
                  (keydown.space)="toggleGoToPageDropdown(); $event.preventDefault()"
                />
                <button
                  type="button"
                  class="br-pagination-dropdown-trigger"
                  aria-label="Exibir lista"
                  tabindex="-1"
                  (click)="toggleGoToPageDropdown()"
                >
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </button>
              </div>
              @if (goToPageDropdownOpen) {
                <div class="br-pagination-dropdown-list" tabindex="0">
                  @for (p of allPages; track p) {
                    <div
                      class="br-pagination-dropdown-item"
                      [class.selected]="p === page"
                      tabindex="-1"
                      (click)="selectPage(p)"
                      (keydown.enter)="selectPage(p)"
                    >
                      <input
                        type="radio"
                        [id]="'go-to-' + p + '-' + uniqueId"
                        [name]="'go-to-' + uniqueId"
                        [value]="p"
                        [checked]="p === page"
                      />
                      <label [for]="'go-to-' + p + '-' + uniqueId">{{ p }}</label>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Divider before arrows -->
          <span class="br-divider"></span>
        }

        <!-- Arrow buttons -->
        <div class="pagination-arrows">
          <button
            type="button"
            class="br-button-circle"
            [disabled]="page === 1"
            aria-label="Voltar página"
            (click)="goTo(page - 1)"
          >
            <i class="fas fa-angle-left" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            class="br-button-circle"
            [disabled]="page === totalPages"
            aria-label="Página seguinte"
            (click)="goTo(page + 1)"
          >
            <i class="fas fa-angle-right" aria-hidden="true"></i>
          </button>
        </div>
      }
    </nav>
  `,
  styles: [`
    .br-pagination {
      --pagination-size: 32px;
      --gold-vivid-40: #c2850c;
      --focus-color: var(--gold-vivid-40);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0;
      padding: 16px 0;
      font-weight: var(--govbr-font-weight-medium, 500);
      color: var(--govbr-gray-80, #333);
    }

    /* ═══ DEFAULT VARIANT STYLES ═══ */
    .br-pagination-per-page {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .br-pagination-label {
      font-size: 14px;
      color: var(--govbr-gray-60, #555);
    }

    .br-pagination-select {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .br-pagination-select select {
      appearance: none;
      background: #fff;
      border: 1px solid var(--govbr-gray-20, #ccc);
      border-radius: 4px;
      height: var(--pagination-size);
      padding: 0 32px 0 12px;
      font-size: 14px;
      color: var(--govbr-gray-80, #333);
      cursor: pointer;
      min-width: 64px;
      transition: border-color 0.2s;
    }

    .br-pagination-select select:hover {
      border-color: var(--govbr-gray-40, #888);
    }

    .br-pagination-select select:focus {
      outline: none;
      border-color: var(--focus-color, #c2850c);
      box-shadow: 0 0 0 3px rgba(194, 133, 12, 0.45);
    }

    .br-pagination-select i {
      position: absolute;
      right: 10px;
      font-size: 12px;
      color: var(--govbr-primary, #1351b4);
      pointer-events: none;
    }

    .br-pagination-navigation {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 24px;
    }

    .br-pagination-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--pagination-size);
      height: var(--pagination-size);
      background: transparent;
      border: none;
      border-radius: 50%;
      color: var(--govbr-primary, #1351b4);
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }

    .br-pagination-button:hover:not(.disabled):not(:disabled) {
      background-color: var(--govbr-primary-lightest, #dbe8fb);
    }

    .br-pagination-button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(194, 133, 12, 0.45);
    }

    .br-pagination-button.disabled,
    .br-pagination-button:disabled {
      color: var(--govbr-gray-20, #ccc);
      cursor: not-allowed;
    }

    .br-pagination-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 8px;
    }

    .br-pagination-input {
      width: 56px;
      height: var(--pagination-size);
      text-align: center;
      border: 1px solid var(--govbr-gray-20, #ccc);
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      color: var(--govbr-gray-80, #333);
      -moz-appearance: textfield;
    }

    .br-pagination-input::-webkit-outer-spin-button,
    .br-pagination-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .br-pagination-input:focus {
      outline: none;
      border-color: var(--focus-color, #c2850c);
      box-shadow: 0 0 0 3px rgba(194, 133, 12, 0.45);
    }

    .br-pagination-text {
      font-size: 14px;
      color: var(--govbr-gray-60, #555);
    }

    .br-pagination-total {
      font-size: 14px;
      font-weight: 600;
      color: var(--govbr-gray-80, #333);
    }

    .br-pagination-summary {
      margin-left: auto;
    }

    /* ═══ CONTEXTUAL VARIANT STYLES (Padrão Gov.br) ═══ */

    .br-pagination.variant-contextual {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      width: 100%;
      background: #fff;
      border-radius: 4px;
    }

    /* Cada grupo não pode esticar */
    .br-pagination.variant-contextual > .pagination-per-page,
    .br-pagination.variant-contextual > .pagination-information,
    .br-pagination.variant-contextual > .pagination-go-to-page,
    .br-pagination.variant-contextual > .pagination-arrows {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
    }

    /* Empurra o bloco "Página" + select para a direita (antes das setas) */
    .br-pagination.variant-contextual > .pagination-go-to-page {
      margin-left: auto;
    }

    /* Setas ficam coladas no lado direito e não esticam */
    .br-pagination.variant-contextual > .pagination-arrows {
      gap: 8px;
    }

    /* Texto "1–20 de 50 itens" não quebra */
    .br-pagination.variant-contextual .pagination-information {
      white-space: nowrap;
      font-size: 14px;
      color: var(--govbr-gray-80, #333);
    }

    /* Divisor vertical igual ao Gov.br */
    .br-pagination.variant-contextual .br-divider {
      display: block;
      width: 1px;
      height: 24px;
      background: #d1d5db;
      flex: 0 0 auto;
    }

    /* Dropdown styles */
    .br-pagination-dropdown {
      position: relative;
    }

    .br-pagination-dropdown-input {
      display: flex;
      align-items: center;
      position: relative;
    }

    .br-pagination-dropdown-input label {
      font-size: 14px;
      font-weight: 400;
      color: var(--govbr-gray-80, #333);
      margin-right: 8px;
      margin-bottom: 0;
      white-space: nowrap;
    }

    .br-pagination-dropdown-input input {
      width: 88px;
      height: var(--pagination-size);
      padding: 0 36px 0 8px;
      border: 1px solid transparent;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--govbr-gray-80, #333);
      background: #fff;
      text-align: right;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .br-pagination-dropdown-input input:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04));
    }

    .br-pagination-dropdown-input input:focus {
      outline: none;
      border-color: var(--focus-color, #c2850c);
      box-shadow: 0 0 0 3px rgba(194, 133, 12, 0.45);
    }

    .br-pagination-dropdown-trigger {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--govbr-primary, #1351b4);
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .br-pagination-dropdown-trigger:hover {
      background-color: var(--govbr-primary-lightest, #dbe8fb);
    }

    .br-pagination-dropdown-list {
      position: absolute;
      top: 100%;
      right: 0;
      min-width: 80px;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid var(--govbr-gray-20, #ccc);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 100;
      margin-top: 4px;
    }

    .br-pagination-dropdown-list::-webkit-scrollbar {
      width: 8px;
    }

    .br-pagination-dropdown-list::-webkit-scrollbar-track {
      background: var(--govbr-gray-5, #f0f0f0);
    }

    .br-pagination-dropdown-list::-webkit-scrollbar-thumb {
      background: var(--govbr-gray-20, #ccc);
      border-radius: 4px;
    }

    .br-pagination-dropdown-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .br-pagination-dropdown-item:hover {
      background-color: var(--govbr-gray-5, #f0f0f0);
    }

    .br-pagination-dropdown-item.selected {
      background-color: var(--govbr-primary-lightest, #dbe8fb);
    }

    .br-pagination-dropdown-item input[type="radio"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .br-pagination-dropdown-item label {
      font-size: 14px;
      color: var(--govbr-gray-80, #333);
      cursor: pointer;
      margin: 0;
    }

    /* Circle button */
    .br-button-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--pagination-size);
      height: var(--pagination-size);
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--govbr-primary, #1351b4);
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .br-button-circle:hover:not(:disabled) {
      background-color: var(--govbr-primary-lightest, #dbe8fb);
    }

    .br-button-circle:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(194, 133, 12, 0.45);
    }

    .br-button-circle:disabled {
      color: var(--govbr-gray-20, #ccc);
      cursor: not-allowed;
    }

    /* ═══ DENSITY VARIANTS ═══ */
    .br-pagination.density-small {
      --pagination-size: 24px;
    }

    .br-pagination.density-small .br-pagination-button {
      width: 32px;
      height: 32px;
      font-size: 12px;
    }

    .br-pagination.density-small .br-pagination-input {
      width: 48px;
      height: 32px;
      font-size: 12px;
    }

    .br-pagination.density-small .br-pagination-label,
    .br-pagination.density-small .br-pagination-text,
    .br-pagination.density-small .br-pagination-total,
    .br-pagination.density-small .pagination-information,
    .br-pagination.density-small .br-pagination-dropdown-input label,
    .br-pagination.density-small .br-pagination-dropdown-input input {
      font-size: 12px;
    }

    .br-pagination.density-large {
      --pagination-size: 40px;
    }

    .br-pagination.density-large .br-pagination-button {
      width: 48px;
      height: 48px;
      font-size: 16px;
    }

    .br-pagination.density-large .br-pagination-input {
      width: 64px;
      height: 48px;
      font-size: 16px;
    }

    .br-pagination.density-large .br-pagination-label,
    .br-pagination.density-large .br-pagination-text,
    .br-pagination.density-large .br-pagination-total,
    .br-pagination.density-large .pagination-information,
    .br-pagination.density-large .br-pagination-dropdown-input label,
    .br-pagination.density-large .br-pagination-dropdown-input input {
      font-size: 16px;
    }

    /* ═══ RESPONSIVE - Default Variant ═══ */

    /* Mobile (< 576px) - Apenas setas centralizadas */
    @media (max-width: 575.98px) {
      .br-pagination.variant-default {
        justify-content: center;
        gap: 8px;
      }

      .br-pagination.variant-default .br-pagination-summary {
        width: 100%;
        text-align: center;
        margin-left: 0;
      }

      .br-pagination.variant-default .br-pagination-navigation {
        margin-left: 0;
      }
    }

    /* ═══ RESPONSIVE - Contextual Variant ═══ */

    /* Mobile (< 576px) */
    @media (max-width: 575.98px) {
      .br-pagination.variant-contextual {
        flex-wrap: wrap;
        row-gap: 10px;
      }

      /* No mobile, "Página" não precisa empurrar */
      .br-pagination.variant-contextual > .pagination-go-to-page {
        margin-left: 0;
      }

      /* Esconde per-page e go-to-page no mobile */
      .br-pagination.variant-contextual > .pagination-per-page,
      .br-pagination.variant-contextual > .pagination-go-to-page {
        display: none;
      }

      /* Divisor pode sumir no mobile */
      .br-pagination.variant-contextual .br-divider {
        display: none;
      }

      /* Centraliza as setas */
      .br-pagination.variant-contextual > .pagination-arrows {
        margin-left: auto;
        margin-right: auto;
      }

      /* Information centralizado */
      .br-pagination.variant-contextual > .pagination-information {
        width: 100%;
        justify-content: center;
        order: 1;
      }
    }

    /* Tablet (576px - 991px) */
    @media (min-width: 576px) and (max-width: 991.98px) {
      .br-pagination.variant-contextual > .pagination-per-page {
        display: none;
      }

      .br-pagination.variant-contextual > .pagination-go-to-page {
        display: none;
      }

      /* Esconde dividers no tablet */
      .br-pagination.variant-contextual > .br-divider {
        display: none;
      }

      /* Information visível, setas à direita */
      .br-pagination.variant-contextual > .pagination-information {
        display: flex;
      }

      .br-pagination.variant-contextual > .pagination-arrows {
        margin-left: auto;
      }
    }
  `],
})
export class BrPaginationComponent {
  /** Página atual */
  @Input() page = 1;

  /** Total de páginas */
  @Input() totalPages = 1;

  /** Total de itens */
  @Input() totalItems = 0;

  /** Itens por página */
  @Input() itemsPerPage = 10;

  /** Opções de itens por página */
  @Input() itemsPerPageOptions = [10, 20, 30];

  /** Densidade visual */
  @Input() density: 'small' | 'medium' | 'large' = 'medium';

  /** Variante: default (input) ou contextual (dropdowns Gov.br) */
  @Input() variant: 'default' | 'contextual' = 'default';

  /** Mostrar botões primeira/última (apenas default) */
  @Input() showFirstLast = true;

  /** Mostrar seletor de itens por página */
  @Input() showItemsPerPage = true;

  /** Mostrar resumo de itens */
  @Input() showSummary = true;

  /** Mostrar dropdown de ir para página (contextual) */
  @Input() showGoToPage = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  private static idCounter = 0;
  uniqueId = ++BrPaginationComponent.idCounter;
  selectId = `br-pagination-select-${this.uniqueId}`;
  perPageSelectId = `per-page-selection-${this.uniqueId}`;
  goToPageSelectId = `go-to-selection-${this.uniqueId}`;

  perPageDropdownOpen = false;
  goToPageDropdownOpen = false;

  get startItem(): number {
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.page * this.itemsPerPage, this.totalItems);
  }

  get allPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goTo(p: number): void {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.page = p;
      this.pageChange.emit(p);
    }
  }

  onPageInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newPage = parseInt(input.value, 10);

    if (!isNaN(newPage) && newPage >= 1 && newPage <= this.totalPages) {
      this.goTo(newPage);
    } else {
      input.value = this.page.toString();
    }
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newValue = parseInt(select.value, 10);

    if (newValue !== this.itemsPerPage) {
      this.itemsPerPage = newValue;
      this.page = 1;
      this.itemsPerPageChange.emit(newValue);
      this.pageChange.emit(1);
    }
  }

  togglePerPageDropdown(): void {
    this.perPageDropdownOpen = !this.perPageDropdownOpen;
    this.goToPageDropdownOpen = false;
  }

  toggleGoToPageDropdown(): void {
    this.goToPageDropdownOpen = !this.goToPageDropdownOpen;
    this.perPageDropdownOpen = false;
  }

  selectItemsPerPage(option: number): void {
    if (option !== this.itemsPerPage) {
      this.itemsPerPage = option;
      this.page = 1;
      this.itemsPerPageChange.emit(option);
      this.pageChange.emit(1);
    }
    this.perPageDropdownOpen = false;
  }

  selectPage(p: number): void {
    this.goTo(p);
    this.goToPageDropdownOpen = false;
  }
}
