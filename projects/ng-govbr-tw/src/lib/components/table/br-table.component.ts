import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { BrPaginationComponent } from '../pagination/br-pagination.component';

@Component({
  selector: 'br-table',
  standalone: true,
  imports: [BrPaginationComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="overflow-x-auto font-rawline" [attr.data-header]="headerVariant">
      <table class="w-full text-sm text-left text-govbr-gray-80">
        <ng-content></ng-content>
      </table>
    
      @if (totalPages > 1) {
        <div
          class="flex items-center justify-between px-4 py-3 border-t border-govbr-gray-5"
          >
          <span class="text-sm text-govbr-gray-40">
            Página {{ page }} de {{ totalPages }}
          </span>
          <br-pagination
            [page]="page"
            [totalPages]="totalPages"
            density="small"
            (pageChange)="onPageChange($event)"
          ></br-pagination>
        </div>
      }
    </div>
    `,
  styles: [`
    br-table table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    br-table table thead th {
      background-color: var(--govbr-table-header-bg);
      color: var(--govbr-table-header-color);
      font-weight: var(--govbr-font-weight-semi-bold);
      font-size: var(--govbr-font-size-sm);
      line-height: var(--govbr-line-height-medium);
      padding: var(--govbr-spacing-4);
      text-align: left;
      border-bottom: var(--govbr-table-header-border);
    }
    br-table table thead th:first-child {
      border-radius: var(--govbr-table-header-radius) 0 0 0;
    }
    br-table table thead th:last-child {
      border-radius: 0 var(--govbr-table-header-radius) 0 0;
    }
    br-table [data-header="light"] table thead th {
      --govbr-table-header-bg: var(--govbr-bg);
      --govbr-table-header-color: var(--govbr-primary);
      --govbr-table-header-border: 2px solid var(--govbr-border-color);
      --govbr-table-header-radius: 0;
    }
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
  `],
})
export class BrTableComponent {
  @Input() headerVariant: 'blue' | 'light' = 'blue';
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(p: number): void {
    this.page = p;
    this.pageChange.emit(p);
  }
}
