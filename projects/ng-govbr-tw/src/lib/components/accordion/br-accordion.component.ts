import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';


// ─── BrAccordionItem ────────────────────────────────────────────────────────

@Component({
  selector: 'br-accordion-item',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="containerClasses">
      <!-- Header / trigger -->
      <button
        type="button"
        [class]="headerClasses"
        [disabled]="disabled"
        [attr.aria-expanded]="open"
        [attr.aria-controls]="'br-accordion-panel-' + itemId"
        [id]="'br-accordion-header-' + itemId"
        (click)="toggle()"
        >
        <!-- Icon (left) -->
        @if (icon) {
          <i
            [class]="'fa-solid fa-' + icon + ' mr-3 text-govbr-primary flex-shrink-0'"
          ></i>
        }
    
        <!-- Title -->
        <span class="flex-1 text-left font-semibold truncate">{{ title }}</span>
    
        <!-- Badge -->
        @if (badge) {
          <span
            class="mx-2 px-1.5 py-0.5 text-govbr-xs font-semibold rounded-govbr-pill bg-govbr-primary text-white flex-shrink-0"
            >
            {{ badge }}
          </span>
        }
    
        <!-- Chevron -->
        <i
          class="fa-solid fa-chevron-down text-xs text-govbr-primary transition-transform duration-300 flex-shrink-0"
          [class.rotate-180]="open"
        ></i>
      </button>
    
      <!-- Content panel -->
      @if (open) {
        <div
          [id]="'br-accordion-panel-' + itemId"
          [attr.aria-labelledby]="'br-accordion-header-' + itemId"
          role="region"
          [class]="panelClasses"
          >
          <ng-content></ng-content>
        </div>
      }
    </div>
    `,
})
export class BrAccordionItemComponent {
  @Input() title = '';
  @Input() icon?: string;
  @Input() badge?: string | number;
  @Input() open = false;
  @Input() disabled = false;
  @Input() variant: 'default' | 'negative' = 'default';
  @Input() density: 'small' | 'medium' | 'large' = 'medium';

  @Output() openChange = new EventEmitter<boolean>();

  private static nextId = 0;
  itemId = BrAccordionItemComponent.nextId++;

  toggle(): void {
    if (!this.disabled) {
      this.open = !this.open;
      this.openChange.emit(this.open);
    }
  }

  get containerClasses(): string {
    const base = 'border-b font-rawline';
    return this.variant === 'negative'
      ? `${base} border-white/20`
      : `${base} border-govbr-gray-10`;
  }

  get headerClasses(): string {
    const densityMap: Record<string, string> = {
      small: 'px-4 py-2.5 text-govbr-sm',
      medium: 'px-4 py-3.5 text-govbr-base',
      large: 'px-6 py-4 text-govbr-lg',
    };

    const base = [
      'flex items-center w-full transition-colors font-rawline',
      'govbr-focus-ring',
      densityMap[this.density],
    ].join(' ');

    const variantCls = this.variant === 'negative'
      ? 'text-white hover:bg-white/10'
      : 'text-govbr-gray-80 hover:bg-govbr-gray-2';

    const disabledCls = this.disabled
      ? 'opacity-40 cursor-not-allowed'
      : 'cursor-pointer';

    return [base, variantCls, disabledCls].filter(Boolean).join(' ');
  }

  get panelClasses(): string {
    const densityMap: Record<string, string> = {
      small: 'px-4 py-3 text-govbr-sm',
      medium: 'px-4 py-4 text-govbr-base',
      large: 'px-6 py-5 text-govbr-base',
    };

    const base = densityMap[this.density];

    return this.variant === 'negative'
      ? `${base} text-white/80`
      : `${base} text-govbr-gray-60`;
  }
}

// ─── BrAccordion (group) ────────────────────────────────────────────────────

@Component({
  selector: 'br-accordion',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="accordionClasses" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
})
export class BrAccordionComponent {
  /** 'single' closes other items when one opens (needs manual control).
   *  'multiple' allows several items open at once. */
  @Input() mode: 'single' | 'multiple' = 'multiple';
  @Input() variant: 'default' | 'negative' = 'default';
  @Input() bordered = true;

  get accordionClasses(): string {
    const base = 'font-rawline';

    const borderCls = this.bordered
      ? this.variant === 'negative'
        ? 'border border-white/20 rounded'
        : 'border border-govbr-gray-10 rounded'
      : '';

    const bgCls = this.variant === 'negative'
      ? 'bg-govbr-primary-darkest'
      : 'bg-white';

    return [base, borderCls, bgCls].filter(Boolean).join(' ');
  }
}
