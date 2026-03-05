import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, inject, OnInit } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          [class.br-success-check-path--animar]="isAnimationEnabled"
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
    /*
     * ⚠️ O estado de REPOUSO tem de ser visível.
     *
     * Isto era stroke-dashoffset: 24 — o traço completamente escondido —, e
     * só a animação br-check-draw o revelava. Quando a animação não roda, o
     * ✓ sumia PARA SEMPRE e sobrava um círculo colorido vazio. Acontecia com
     * animate="false" e, pior, para quem tem **movimento reduzido** ligado
     * no sistema: a preferência de acessibilidade apagava o conteúdo.
     *
     * Note também que o CSS vence o atributo stroke-dashoffset="0" do SVG —
     * atributo de apresentação perde para regra de folha de estilo, e foi o
     * que escondeu o que o template dizia estar visível.
     */
    .br-success-check-path {
      stroke-dasharray: 24;
      stroke-dashoffset: 0;
    }

    /* Só quem vai animar começa escondido; a animação termina em 0 com
       forwards, então o repouso final também é visível. */
    .br-success-check-path--animar {
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

    /*
     * ⚠️ Valor desconhecido não pode virar a string "undefined" na classe.
     *
     * `variantStyles[undefined]` é `undefined`, e o template literal o
     * interpola como texto: `class="… rounded-full h-10 undefined w-10"`. O
     * componente perdia fundo E cor do traço, e sumia na tela branca — foi o
     * que aconteceu na story `Padrao`, que não declarava `variant`.
     */
    const tamanho = sizeStyles[this.size] ?? sizeStyles.medium;
    const variante = variantStyles[this.variant] ?? variantStyles.success;
    return `${tamanho} ${variante}`;
  }

  get svgClasses(): string {
    const sizeStyles = {
      small: 'w-4 h-4',
      medium: 'w-6 h-6',
      large: 'w-8 h-8',
    } as const;

    return sizeStyles[this.size] ?? sizeStyles.medium;
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
