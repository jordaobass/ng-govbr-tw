import { Component, Input, ViewEncapsulation, inject, OnInit } from '@angular/core';
import { BrAnimationService } from './animation.service';

/**
 * Componente de checkmark animado para feedback de sucesso
 *
 * @example
 * <br-success-check></br-success-check>
 * <br-success-check size="large" [animate]="true"></br-success-check>
 */
@Component({
  selector: 'br-success-check',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="br-success-check inline-flex items-center justify-center rounded-full"
      [class]="containerClasses"
      [style.animation]="containerAnimation"
      role="img"
      [attr.aria-label]="ariaLabel"
    >
      <svg
        class="br-success-check-svg"
        [class]="svgClasses"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="br-success-check-path"
          [style.animation]="pathAnimation"
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="24"
          stroke-dashoffset="0"
        />
      </svg>
    </div>
  `,
  styles: [`
    .br-success-check-path {
      stroke-dasharray: 24;
      stroke-dashoffset: 24;
    }

    @keyframes br-check-container-pop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes br-check-draw {
      0% {
        stroke-dashoffset: 24;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
  `],
})
export class BrSuccessCheckComponent implements OnInit {
  private readonly animationService = inject(BrAnimationService);

  /** Tamanho do componente */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /** Variante de cor */
  @Input() variant: 'success' | 'primary' | 'white' = 'success';

  /** Se deve animar */
  @Input() animate = true;

  /** Aria label */
  @Input() ariaLabel = 'Sucesso';

  isAnimationEnabled = false;

  ngOnInit(): void {
    this.isAnimationEnabled = this.animate && this.animationService.isEnabled();
  }

  get containerClasses(): string {
    const sizeStyles = {
      small: 'w-6 h-6',
      medium: 'w-10 h-10',
      large: 'w-14 h-14',
    } as const;

    const variantStyles = {
      success: 'bg-govbr-success text-govbr-on-primary',
      primary: 'bg-govbr-primary text-govbr-on-primary',
      white: 'bg-govbr-bg text-govbr-success border-2 border-govbr-success',
    } as const;

    return `${sizeStyles[this.size]} ${variantStyles[this.variant]}`;
  }

  get svgClasses(): string {
    const sizeStyles = {
      small: 'w-4 h-4',
      medium: 'w-6 h-6',
      large: 'w-8 h-8',
    } as const;

    return sizeStyles[this.size];
  }

  get containerAnimation(): string {
    if (!this.isAnimationEnabled) return 'none';
    return 'br-check-container-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
  }

  get pathAnimation(): string {
    if (!this.isAnimationEnabled) return 'none';
    return 'br-check-draw 300ms ease-out 200ms forwards';
  }
}
