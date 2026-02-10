import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { BrAnimationService } from '../../animations/animation.service';


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
            aria-hidden="true"
          ></i>
        }

        <!-- Title -->
        <span class="flex-1 text-left font-semibold truncate">{{ title }}</span>

        <!-- Badge -->
        @if (badge) {
          <span
            class="mx-2 px-1.5 py-0.5 text-govbr-xs font-semibold rounded-govbr-pill bg-govbr-primary text-govbr-on-primary flex-shrink-0"
            >
            {{ badge }}
          </span>
        }

        <!-- Chevron -->
        <i
          class="fa-solid fa-chevron-down text-xs text-govbr-primary flex-shrink-0"
          [class]="chevronClasses"
          aria-hidden="true"
        ></i>
      </button>

      <!-- Content panel -->
      <div
        #panelRef
        [id]="'br-accordion-panel-' + itemId"
        [attr.aria-labelledby]="'br-accordion-header-' + itemId"
        role="region"
        [class]="panelClasses"
        [style.maxHeight]="panelMaxHeight"
        [style.opacity]="panelOpacity"
        [style.overflow]="'hidden'"
        [attr.aria-hidden]="!open"
        >
        <div class="panel-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
    `,
  styles: [`
    br-accordion-item .panel-content {
      padding: inherit;
    }
  `],
})
export class BrAccordionItemComponent implements AfterViewInit {
  private readonly animationService = inject(BrAnimationService);

  @ViewChild('panelRef') panelRef!: ElementRef<HTMLDivElement>;

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
  private contentHeight = 0;

  ngAfterViewInit(): void {
    // Calcula altura inicial se aberto
    if (this.open) {
      this.measureContentHeight();
    }
  }

  toggle(): void {
    if (this.disabled) return;

    this.open = !this.open;
    this.openChange.emit(this.open);

    if (this.open) {
      // Mede a altura antes de animar
      requestAnimationFrame(() => this.measureContentHeight());
    }
  }

  private measureContentHeight(): void {
    if (this.panelRef?.nativeElement) {
      const content = this.panelRef.nativeElement.querySelector('.panel-content');
      if (content) {
        this.contentHeight = content.scrollHeight;
      }
    }
  }

  get panelMaxHeight(): string {
    if (!this.animationService.isEnabled()) {
      return this.open ? 'none' : '0';
    }
    return this.open ? `${this.contentHeight || 1000}px` : '0';
  }

  get panelOpacity(): string {
    return this.open ? '1' : '0';
  }

  get chevronClasses(): string {
    const base = 'transition-transform';
    const duration = this.animationService.isEnabled() ? 'duration-300' : 'duration-0';
    const rotation = this.open ? 'rotate-180' : '';
    return `${base} ${duration} ${rotation}`;
  }

  get containerClasses(): string {
    const base = 'border-b font-rawline';
    return this.variant === 'negative'
      ? `${base} border-govbr-on-primary/20`
      : `${base} border-govbr-gray-10`;
  }

  get headerClasses(): string {
    const densityMap = {
      small: 'px-4 py-2.5 text-govbr-sm',
      medium: 'px-4 py-3.5 text-govbr-base',
      large: 'px-6 py-4 text-govbr-lg',
    } as const;

    const base = [
      'flex items-center w-full transition-colors font-rawline',
      'govbr-focus-ring',
      densityMap[this.density],
    ].join(' ');

    const variantCls = this.variant === 'negative'
      ? 'text-govbr-on-primary hover:bg-govbr-bg/10'
      : 'text-govbr-gray-80 hover:bg-govbr-gray-2';

    const disabledCls = this.disabled
      ? 'opacity-40 cursor-not-allowed'
      : 'cursor-pointer';

    return [base, variantCls, disabledCls].filter(Boolean).join(' ');
  }

  get panelClasses(): string {
    const densityMap = {
      small: 'px-4 py-3 text-govbr-sm',
      medium: 'px-4 py-4 text-govbr-base',
      large: 'px-6 py-5 text-govbr-base',
    } as const;

    const base = densityMap[this.density];
    const transition = this.animationService.isEnabled()
      ? 'transition-all duration-300 ease-out'
      : '';

    const colorCls = this.variant === 'negative'
      ? 'text-govbr-on-primary/80'
      : 'text-govbr-gray-60';

    return `${base} ${transition} ${colorCls}`;
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
        ? 'border border-govbr-on-primary/20 rounded'
        : 'border border-govbr-gray-10 rounded'
      : '';

    const bgCls = this.variant === 'negative'
      ? 'bg-govbr-primary-darkest'
      : 'bg-govbr-bg';

    return [base, borderCls, bgCls].filter(Boolean).join(' ');
  }
}
