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
    @if (totalPages > 1) {
      <nav
        class="font-rawline"
        role="navigation"
        aria-label="Paginação"
        >
        <ul class="flex flex-wrap items-center justify-center gap-1">
          <!-- First -->
          @if (showFirstLast) {
            <li>
              <button
                type="button"
                [disabled]="page === 1"
                [class]="navButtonClasses(page === 1)"
                aria-label="Primeira página"
                (click)="goTo(1)"
                >
                <i class="fa-solid fa-angles-left text-xs"></i>
              </button>
            </li>
          }
          <!-- Previous -->
          <li>
            <button
              type="button"
              [disabled]="page === 1"
              [class]="navButtonClasses(page === 1)"
              aria-label="Página anterior"
              (click)="goTo(page - 1)"
              >
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>
          </li>
          <!-- Ellipsis start -->
          @if (visiblePages[0] > 1) {
            <li>
              <span [class]="ellipsisClasses">...</span>
            </li>
          }
          <!-- Pages -->
          @for (p of visiblePages; track p) {
            <li>
              <button
                type="button"
                [class]="pageButtonClasses(p === page)"
                [attr.aria-current]="p === page ? 'page' : null"
                (click)="goTo(p)"
                >
                {{ p }}
              </button>
            </li>
          }
          <!-- Ellipsis end -->
          @if (visiblePages[visiblePages.length - 1] < totalPages) {
            <li>
              <span [class]="ellipsisClasses">...</span>
            </li>
          }
          <!-- Next -->
          <li>
            <button
              type="button"
              [disabled]="page === totalPages"
              [class]="navButtonClasses(page === totalPages)"
              aria-label="Próxima página"
              (click)="goTo(page + 1)"
              >
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </li>
          <!-- Last -->
          @if (showFirstLast) {
            <li>
              <button
                type="button"
                [disabled]="page === totalPages"
                [class]="navButtonClasses(page === totalPages)"
                aria-label="Última página"
                (click)="goTo(totalPages)"
                >
                <i class="fa-solid fa-angles-right text-xs"></i>
              </button>
            </li>
          }
        </ul>
      </nav>
    }
    `,
})
export class BrPaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() density: 'small' | 'medium' | 'large' = 'medium';
  @Input() showFirstLast = false;
  @Input() maxVisible = 5;

  @Output() pageChange = new EventEmitter<number>();

  get sizeClasses(): string {
    const sizes: Record<string, string> = {
      small: 'min-w-[24px] min-h-[24px] text-govbr-xs',
      medium: 'min-w-[32px] min-h-[32px] text-govbr-sm',
      large: 'min-w-[40px] min-h-[40px] text-govbr-base',
    };
    return sizes[this.density];
  }

  get ellipsisClasses(): string {
    return `inline-flex items-center justify-center ${this.sizeClasses} text-govbr-gray-40 font-rawline`;
  }

  get visiblePages(): number[] {
    const half = Math.floor(this.maxVisible / 2);
    let start = Math.max(1, this.page - half);
    const end = Math.min(this.totalPages, start + this.maxVisible - 1);

    if (end - start + 1 < this.maxVisible) {
      start = Math.max(1, end - this.maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  pageButtonClasses(isActive: boolean): string {
    const base = `inline-flex items-center justify-center rounded-full font-rawline font-semibold transition-colors ${this.sizeClasses}`;

    if (isActive) {
      return `${base} bg-govbr-primary text-white`;
    }
    return `${base} text-govbr-primary hover:bg-govbr-primary-lightest`;
  }

  navButtonClasses(isDisabled: boolean): string {
    const base = `inline-flex items-center justify-center rounded-full font-rawline transition-colors ${this.sizeClasses}`;

    if (isDisabled) {
      return `${base} text-govbr-gray-20 cursor-not-allowed`;
    }
    return `${base} text-govbr-primary hover:bg-govbr-primary-lightest cursor-pointer`;
  }

  goTo(p: number): void {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.page = p;
      this.pageChange.emit(p);
    }
  }
}
