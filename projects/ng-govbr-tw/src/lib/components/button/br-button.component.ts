import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { BrAnimationService } from '../../animations/animation.service';


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
 * - **hoverEffect**: lift, grow, none (requires animations enabled)
 *
 * Usage:
 * ```html
 * <br-button emphasis="primary" (clicked)="save()">Salvar</br-button>
 * <br-button emphasis="secondary" icon="download">Download</br-button>
 * <br-button emphasis="tertiary" icon="trash">Excluir</br-button>
 * <br-button emphasis="primary" [circle]="true" icon="plus"></br-button>
 * <br-button emphasis="primary" [dark]="true">Modo escuro</br-button>
 * <br-button emphasis="primary" hoverEffect="lift">Com hover lift</br-button>
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
        <i class="fa-solid fa-spinner fa-spin flex-shrink-0" [class.mr-2]="!circle" aria-hidden="true"></i>
      }
      @if (icon && !loading) {
        <i [class]="iconClasses" aria-hidden="true"></i>
      }
      @if (!circle) {
        <span><ng-content></ng-content></span>
      }
    </button>
    `,
  styles: [`
    /* Ensure icon vertical alignment */
    br-button button {
      line-height: 1;
    }
    br-button button i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    /* Hover lift effect */
    .br-button-hover-lift {
      transition: transform 200ms ease-out, box-shadow 200ms ease-out, background-color 200ms, color 200ms !important;
    }
    .br-button-hover-lift:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .br-button-hover-lift:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Hover grow effect */
    .br-button-hover-grow {
      transition: transform 200ms ease-out, background-color 200ms, color 200ms !important;
    }
    .br-button-hover-grow:hover:not(:disabled) {
      transform: scale(1.02);
    }
    .br-button-hover-grow:active:not(:disabled) {
      transform: scale(0.98);
    }
  `],
})
export class BrButtonComponent {
  private readonly animationService = inject(BrAnimationService);

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

  /** Hover effect animation (requires animations enabled) */
  @Input() hoverEffect: 'none' | 'lift' | 'grow' = 'none';

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-rawline font-semibold transition-colors duration-200 govbr-focus-ring';

    const emphasisClasses = this.getEmphasisClasses();

    const densityMap = {
      small: this.circle ? 'w-8 h-8 text-sm' : 'px-3 py-1.5 text-sm',
      medium: this.circle ? 'w-10 h-10 text-base' : 'px-5 py-2 text-base',
      large: this.circle ? 'w-12 h-12 text-lg' : 'px-7 py-3 text-lg',
    } as const;

    const shape = this.circle ? 'rounded-full' : 'rounded-govbr-pill';
    const width = this.block ? 'w-full' : '';
    const disabledCls = this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const activeCls = this.active && !this.disabled ? 'ring-2 ring-offset-1' : '';
    const direction = this.iconPosition === 'right' ? 'flex-row-reverse' : '';
    const hoverCls = this.getHoverEffectClass();

    return [base, emphasisClasses, densityMap[this.density], shape, width, disabledCls, activeCls, direction, hoverCls]
      .filter(Boolean)
      .join(' ');
  }

  get iconClasses(): string {
    const spacing = this.circle ? '' : (this.iconPosition === 'right' ? 'ml-2' : 'mr-2');
    return `fa-solid fa-${this.icon} flex-shrink-0 ${spacing}`;
  }

  private getHoverEffectClass(): string {
    if (!this.animationService.isEnabled()) return '';
    if (this.hoverEffect === 'none') return '';

    const effectMap = {
      lift: 'br-button-hover-lift',
      grow: 'br-button-hover-grow',
    } as const;

    return effectMap[this.hoverEffect] || '';
  }

  private getEmphasisClasses(): string {
    if (this.dark) {
      return this.getDarkEmphasisClasses();
    }

    const map = {
      primary: 'bg-govbr-primary text-white hover:bg-govbr-primary-dark',
      secondary: 'bg-transparent text-govbr-primary border border-govbr-primary hover:bg-govbr-primary hover:text-white',
      tertiary: 'bg-transparent text-govbr-primary hover:bg-govbr-primary-lightest',
      danger: 'bg-govbr-danger text-white hover:bg-red-700',
    } as const;
    return map[this.emphasis] || map['primary'];
  }

  private getDarkEmphasisClasses(): string {
    const map = {
      primary: 'bg-white text-govbr-primary-dark hover:bg-govbr-gray-5',
      secondary: 'bg-transparent text-white border border-white hover:bg-white/10',
      tertiary: 'bg-transparent text-white hover:bg-white/10',
      danger: 'bg-govbr-danger text-white hover:bg-red-700',
    } as const;
    return map[this.emphasis] || map['primary'];
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
