import { Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'br-skeleton',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    @switch (variant) {
      @case ('circle') {
        <div [class]="circleClasses" role="status" aria-label="Carregando">
          <span class="sr-only">Carregando...</span>
        </div>
      }
      @case ('card') {
        <div class="rounded-md overflow-hidden border border-govbr-gray-10" role="status" aria-label="Carregando">
          <div class="br-skeleton-pulse bg-govbr-gray-10 h-36"></div>
          <div class="p-4 space-y-3">
            <div class="br-skeleton-pulse bg-govbr-gray-10 h-4 rounded w-3/4"></div>
            <div class="br-skeleton-pulse bg-govbr-gray-10 h-3 rounded w-full"></div>
            <div class="br-skeleton-pulse bg-govbr-gray-10 h-3 rounded w-5/6"></div>
          </div>
          <span class="sr-only">Carregando...</span>
        </div>
      }
      @case ('table') {
        <div class="border border-govbr-gray-10 rounded-md overflow-hidden" role="status" aria-label="Carregando">
          <div class="bg-govbr-gray-5 px-4 py-3 flex gap-4">
            @for (c of tableCols; track c) {
              <div class="br-skeleton-pulse bg-govbr-gray-10 h-3 rounded flex-1"></div>
            }
          </div>
          @for (r of tableRows; track r) {
            <div class="px-4 py-3 border-t border-govbr-gray-5 flex gap-4">
              @for (c of tableCols; track c) {
                <div class="br-skeleton-pulse bg-govbr-gray-10 h-3 rounded flex-1"></div>
              }
            </div>
          }
          <span class="sr-only">Carregando...</span>
        </div>
      }
      @case ('list') {
        <div class="space-y-3" role="status" aria-label="Carregando">
          @for (r of listRows; track r) {
            <div class="flex items-center gap-3">
              <div class="br-skeleton-pulse bg-govbr-gray-10 w-10 h-10 rounded-full flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="br-skeleton-pulse bg-govbr-gray-10 h-3.5 rounded w-2/3"></div>
                <div class="br-skeleton-pulse bg-govbr-gray-10 h-2.5 rounded w-1/2"></div>
              </div>
            </div>
          }
          <span class="sr-only">Carregando...</span>
        </div>
      }
      @default {
        <!-- line variant -->
        <div [class]="lineClasses" role="status" aria-label="Carregando">
          <span class="sr-only">Carregando...</span>
        </div>
      }
    }
  `,
  styles: [`
    @keyframes br-skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .br-skeleton-pulse {
      animation: br-skeleton-pulse 1.5s ease-in-out infinite;
    }
  `],
})
export class BrSkeletonComponent {
  @Input() variant: 'line' | 'circle' | 'card' | 'table' | 'list' = 'line';
  @Input() width?: string;
  @Input() height?: string;
  @Input() rows = 3;
  @Input() cols = 4;

  get lineClasses(): string {
    const w = this.width || 'w-full';
    const h = this.height || 'h-4';
    return `br-skeleton-pulse bg-govbr-gray-10 rounded ${w} ${h}`;
  }

  get circleClasses(): string {
    const size = this.width || 'w-10 h-10';
    return `br-skeleton-pulse bg-govbr-gray-10 rounded-full ${size}`;
  }

  get tableRows(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }

  get tableCols(): number[] {
    return Array.from({ length: this.cols }, (_, i) => i);
  }

  get listRows(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}
