import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { BrAnimationService } from '../../animations/animation.service';

@Component({
  selector: 'br-notification',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="relative inline-flex">
      <ng-content></ng-content>
      @if (count > 0 || showDot) {
        <span
          class="absolute flex items-center justify-center font-rawline font-bold"
          [class]="badgeClasses"
          [style.animation]="bounceAnimation"
          [attr.aria-label]="ariaLabel"
          role="status"
        >
          @if (!showDot) {
            {{ displayCount }}
          }
        </span>
      }
    </span>
  `,
  styles: [`
    br-notification {
      display: inline-flex;
    }
    @keyframes br-notification-bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
  `],
})
export class BrNotificationComponent {
  private readonly animationService = inject(BrAnimationService);

  /** Número de notificações */
  @Input() count = 0;

  /** Valor máximo a exibir (ex: 99+) */
  @Input() max = 99;

  /** Mostra apenas um ponto ao invés do número */
  @Input() showDot = false;

  /** Variante de cor */
  @Input() variant: 'danger' | 'warning' | 'success' | 'info' | 'primary' = 'danger';

  /** Tamanho do badge */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /** Posição do badge */
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';

  /** Deslocamento horizontal customizado */
  @Input() offsetX = 0;

  /** Deslocamento vertical customizado */
  @Input() offsetY = 0;

  /** Pulsar animação */
  @Input() pulse = false;

  /** Animação de bounce ao aparecer */
  @Input() animate = true;

  get bounceAnimation(): string {
    if (!this.animate || !this.animationService.isEnabled()) return 'none';
    return 'br-notification-bounce 400ms ease-out';
  }

  get displayCount(): string {
    if (this.count > this.max) {
      return `${this.max}+`;
    }
    return this.count.toString();
  }

  get ariaLabel(): string {
    if (this.showDot) {
      return 'Nova notificação';
    }
    return `${this.count} ${this.count === 1 ? 'notificação' : 'notificações'}`;
  }

  get badgeClasses(): string {
    const variantStyles = {
      danger: 'bg-govbr-danger text-white',
      warning: 'bg-govbr-warning text-govbr-gray-80',
      success: 'bg-govbr-success text-white',
      info: 'bg-govbr-info text-white',
      primary: 'bg-govbr-primary text-white',
    } as const;

    const sizeStyles: Record<'small' | 'medium' | 'large', string> = this.showDot
      ? {
          small: 'w-2 h-2',
          medium: 'w-2.5 h-2.5',
          large: 'w-3 h-3',
        }
      : {
          small: 'min-w-[16px] h-4 text-[10px] px-1',
          medium: 'min-w-[20px] h-5 text-xs px-1',
          large: 'min-w-[24px] h-6 text-sm px-1.5',
        };

    const positionStyles = {
      'top-right': '-top-1 -right-1',
      'top-left': '-top-1 -left-1',
      'bottom-right': '-bottom-1 -right-1',
      'bottom-left': '-bottom-1 -left-1',
    } as const;

    const pulseClass = this.pulse ? 'animate-pulse' : '';

    const transform = (this.offsetX || this.offsetY)
      ? `transform translate-x-[${this.offsetX}px] translate-y-[${this.offsetY}px]`
      : '';

    return [
      'rounded-full',
      variantStyles[this.variant],
      sizeStyles[this.size],
      positionStyles[this.position],
      pulseClass,
      transform,
    ].filter(Boolean).join(' ');
  }
}
