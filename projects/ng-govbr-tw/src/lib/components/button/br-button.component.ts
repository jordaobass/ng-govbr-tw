import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';


/**
 * BrButtonComponent — Button following GovBR DS pattern.
 *
 * Supports all GovBR DS button variants:
 * - **emphasis**: primary (filled), secondary (outlined), tertiary (text only), danger
 * - **density**: small, medium, large
 * - **circle**: circular icon button
 * - **block**: full width
 * - **dark**: inverted colors for dark backgrounds
 * - **loading**: spinner state
 * - **active**: pressed/active state
 *
 * Usage:
 * ```html
 * <br-button emphasis="primary" (clicked)="save()">Salvar</br-button>
 * <br-button emphasis="secondary" icon="download">Download</br-button>
 * <br-button emphasis="tertiary" icon="trash">Excluir</br-button>
 * <br-button emphasis="primary" [circle]="true" icon="plus"></br-button>
 * <br-button emphasis="primary" [dark]="true">Modo escuro</br-button>
 * ```
 */
@Component({
  selector: 'br-button',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [attr.aria-busy]="loading ? 'true' : null"
      [attr.aria-disabled]="disabled ? 'true' : null"
      (click)="handleClick($event)"
      >
      @if (loading) {
        <i class="fa-solid fa-spinner fa-spin flex-shrink-0 leading-none" [class.mr-2]="!circle" aria-hidden="true"></i>
      }
      @if (icon && !loading) {
        <i [class]="iconClasses" aria-hidden="true"></i>
      }
      @if (!circle) {
        <span class="leading-none"><ng-content></ng-content></span>
      }
    </button>
    `,
})
export class BrButtonComponent {
  /** Emphasis level: primary (filled), secondary (outlined), tertiary (text-only), danger */
  @Input() emphasis: 'primary' | 'secondary' | 'tertiary' | 'danger' = 'primary';

  /** @deprecated Use `emphasis` instead. Maps to emphasis for backward compatibility. */
  @Input() set variant(val: 'primary' | 'secondary' | 'danger') {
    this.emphasis = val;
  }

  /** Density/size */
  @Input() density: 'small' | 'medium' | 'large' = 'medium';

  /** @deprecated Use `density` instead. */
  @Input() set size(val: 'small' | 'medium' | 'large') {
    this.density = val;
  }

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /** Circular icon-only button */
  @Input() circle = false;

  /** Full-width block button */
  @Input() block = false;

  /** Font Awesome icon name (without fa- prefix) */
  @Input() icon?: string;

  /** Loading state with spinner */
  @Input() loading = false;

  /** Disabled state */
  @Input() disabled = false;

  /** Active/pressed state */
  @Input() active = false;

  /** Dark mode / inverted — for use on dark backgrounds */
  @Input() dark = false;

  /** Icon position: left (default) or right */
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-rawline font-semibold transition-colors duration-200 govbr-focus-ring';

    const emphasisClasses = this.getEmphasisClasses();

    const densityMap: Record<string, string> = {
      small: this.circle ? 'w-8 h-8 text-sm' : 'px-3 py-1.5 text-sm',
      medium: this.circle ? 'w-10 h-10 text-base' : 'px-5 py-2 text-base',
      large: this.circle ? 'w-12 h-12 text-lg' : 'px-7 py-3 text-lg',
    };

    const shape = this.circle ? 'rounded-full' : 'rounded-govbr-pill';
    const width = this.block ? 'w-full' : '';
    const disabledCls = this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const activeCls = this.active && !this.disabled ? 'ring-2 ring-offset-1' : '';
    const direction = this.iconPosition === 'right' ? 'flex-row-reverse' : '';

    return [base, emphasisClasses, densityMap[this.density], shape, width, disabledCls, activeCls, direction]
      .filter(Boolean)
      .join(' ');
  }

  get iconClasses(): string {
    const spacing = this.circle ? '' : (this.iconPosition === 'right' ? 'ml-2' : 'mr-2');
    return `fa-solid fa-${this.icon} flex-shrink-0 leading-none ${spacing}`;
  }

  private getEmphasisClasses(): string {
    if (this.dark) {
      return this.getDarkEmphasisClasses();
    }

    const map: Record<string, string> = {
      primary: 'bg-govbr-primary text-white hover:bg-govbr-primary-dark',
      secondary: 'bg-transparent text-govbr-primary border border-govbr-primary hover:bg-govbr-primary hover:text-white',
      tertiary: 'bg-transparent text-govbr-primary hover:bg-govbr-primary-lightest',
      danger: 'bg-govbr-danger text-white hover:bg-red-700',
    };
    return map[this.emphasis] || map['primary'];
  }

  private getDarkEmphasisClasses(): string {
    const map: Record<string, string> = {
      primary: 'bg-white text-govbr-primary-dark hover:bg-govbr-gray-5',
      secondary: 'bg-transparent text-white border border-white hover:bg-white/10',
      tertiary: 'bg-transparent text-white hover:bg-white/10',
      danger: 'bg-govbr-danger text-white hover:bg-red-700',
    };
    return map[this.emphasis] || map['primary'];
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
