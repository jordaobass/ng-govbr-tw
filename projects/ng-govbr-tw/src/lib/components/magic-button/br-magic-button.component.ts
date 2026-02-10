import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';


export interface BrMagicAction {
  id: string;
  label: string;
  icon: string;
}

/**
 * BrMagicButtonComponent — Floating action button (FAB) for quick actions.
 *
 * Usage:
 * ```html
 * <br-magic-button
 *   icon="plus"
 *   [actions]="actions"
 *   (actionClick)="onAction($event)"
 * ></br-magic-button>
 * ```
 */
@Component({
  selector: 'br-magic-button',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="positionClasses">
      <!-- Speed dial actions -->
      @if (expanded && actions.length > 0) {
        <div
          class="flex flex-col-reverse gap-3 mb-3 items-end"
          role="menu"
          [attr.aria-label]="ariaLabel"
          >
          @for (action of actions; track trackAction($index, action)) {
            <div
              class="flex items-center gap-2 animate-fade-in"
              >
              @if (showLabels) {
                <span
                  class="bg-govbr-gray-80 text-govbr-on-primary text-xs font-medium px-2 py-1 rounded shadow whitespace-nowrap"
                  >
                  {{ action.label }}
                </span>
              }
              <button
                type="button"
                [class]="miniButtonClasses"
                (click)="onActionClick(action)"
                [attr.aria-label]="action.label"
                role="menuitem"
                >
                <i [class]="'fa-solid fa-' + action.icon"></i>
              </button>
            </div>
          }
        </div>
      }
    
      <!-- Main FAB -->
      <button
        type="button"
        [class]="fabClasses"
        (click)="toggle()"
        [attr.aria-expanded]="actions.length > 0 ? expanded : null"
        [attr.aria-haspopup]="actions.length > 0 ? 'menu' : null"
        [attr.aria-label]="expanded ? 'Fechar ações' : ariaLabel"
        >
        <i
          [class]="'fa-solid fa-' + (expanded && actions.length > 0 ? 'xmark' : icon) + ' text-lg transition-transform duration-200'"
          [class.rotate-45]="expanded && actions.length > 0 && icon === 'plus'"
        ></i>
      </button>
    </div>
    `,
})
export class BrMagicButtonComponent {
  @Input() icon = 'plus';
  @Input() actions: BrMagicAction[] = [];
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'medium' | 'large' = 'large';
  @Input() position: 'bottom-right' | 'bottom-left' | 'bottom-center' = 'bottom-right';
  @Input() showLabels = true;
  @Input() ariaLabel = 'Ações rápidas';

  @Output() actionClick = new EventEmitter<BrMagicAction>();
  @Output() fabClick = new EventEmitter<void>();

  expanded = false;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.expanded = false;
  }

  trackAction(_: number, action: BrMagicAction): string {
    return action.id;
  }

  toggle(): void {
    if (this.actions.length > 0) {
      this.expanded = !this.expanded;
    } else {
      this.fabClick.emit();
    }
  }

  onActionClick(action: BrMagicAction): void {
    this.actionClick.emit(action);
    this.expanded = false;
  }

  get positionClasses(): string {
    const base = 'fixed z-40 flex flex-col items-end';
    const posMap = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6 items-start',
      'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
    } as const;
    return `${base} ${posMap[this.position]}`;
  }

  get fabClasses(): string {
    const sizeMap = {
      medium: 'w-12 h-12',
      large: 'w-14 h-14',
    } as const;

    const variantMap = {
      primary: 'bg-govbr-primary text-govbr-on-primary hover:bg-govbr-primary-dark shadow-lg hover:shadow-xl',
      secondary: 'bg-govbr-bg text-govbr-primary border-2 border-govbr-primary hover:bg-govbr-primary-lightest shadow-lg',
      danger: 'bg-govbr-danger text-govbr-on-primary hover:bg-govbr-danger-hover shadow-lg hover:shadow-xl',
    } as const;

    return [
      'inline-flex items-center justify-center rounded-full transition-all duration-200',
      'govbr-focus-ring',
      sizeMap[this.size],
      variantMap[this.variant],
    ].join(' ');
  }

  get miniButtonClasses(): string {
    return [
      'inline-flex items-center justify-center w-10 h-10 rounded-full',
      'bg-govbr-bg text-govbr-primary border border-govbr-gray-10 shadow-md',
      'hover:bg-govbr-primary-lightest hover:shadow-lg transition-all',
      'govbr-focus-ring',
    ].join(' ');
  }
}
