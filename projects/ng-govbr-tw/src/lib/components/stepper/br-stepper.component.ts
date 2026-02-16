import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BrStepperStep {
  label: string;
  description?: string;
  icon?: string;
  optional?: boolean;
}

@Component({
  selector: 'br-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!--
      No horizontal, a trilha pode ficar mais larga que a tela: medido em
      433px de conteúdo numa janela de 360px, com 4 passos. Conteúdo largo
      rola DENTRO do próprio container — a página nunca rola na horizontal.
      Região rolável precisa ser alcançável por teclado (WCAG 2.1.1), daí o
      tabindex só quando há rolagem possível.
    -->
    <nav
      class="br-stepper font-rawline"
      [class.br-stepper-vertical]="orientacaoValida === 'vertical'"
      [class.br-stepper-rolavel]="orientacaoValida === 'horizontal'"
      [attr.tabindex]="orientacaoValida === 'horizontal' ? 0 : null"
      role="navigation"
      [attr.aria-label]="ariaLabel"
    >
      <ol
        class="flex"
        [class.flex-col]="orientacaoValida === 'vertical'"
        [class.gap-0]="orientacaoValida === 'horizontal'"
        role="list"
      >
        @for (step of steps; track step.label; let i = $index; let isLast = $last) {
          <li
            class="flex"
            [class]="orientacaoValida === 'horizontal' ? 'flex-1 items-center' : 'items-start'"
            role="listitem"
          >
            <div
              class="flex items-center"
              [class.flex-col]="orientacaoValida === 'vertical'"
              [class.w-full]="orientacaoValida === 'horizontal'"
            >
              <!-- Step indicator -->
              <button
                type="button"
                class="flex items-center gap-3 group"
                [class.flex-col]="orientacaoValida === 'horizontal' && !compact"
                [class.cursor-pointer]="clickable && i <= currentStep"
                [class.cursor-default]="!clickable || i > currentStep"
                [disabled]="!clickable || i > currentStep"
                [attr.aria-current]="i === currentStep ? 'step' : null"
                (click)="onStepClick(i)"
              >
                <div
                  class="flex items-center justify-center rounded-full transition-all duration-200"
                  [class]="getStepIndicatorClasses(i)"
                >
                  @if (i < currentStep) {
                    <i class="fas fa-check text-sm" aria-hidden="true"></i>
                  } @else if (step.icon) {
                    <i [class]="step.icon + ' text-sm'" aria-hidden="true"></i>
                  } @else {
                    <span class="font-semibold">{{ i + 1 }}</span>
                  }
                </div>

                <div
                  class="text-left"
                  [class.text-center]="orientacaoValida === 'horizontal' && !compact"
                >
                  <span
                    class="block font-medium transition-colors"
                    [class]="getStepLabelClasses(i)"
                  >
                    {{ step.label }}
                    @if (step.optional) {
                      <span class="text-xs text-govbr-gray-40 font-normal ml-1">(opcional)</span>
                    }
                  </span>
                  @if (step.description && !compact) {
                    <span class="block text-xs text-govbr-gray-40 mt-0.5">
                      {{ step.description }}
                    </span>
                  }
                </div>
              </button>

              <!-- Connector line -->
              @if (!isLast) {
                <div
                  class="flex-1"
                  [class]="getConnectorClasses(i)"
                  aria-hidden="true"
                ></div>
              }
            </div>
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    .br-stepper-rolavel {
      overflow-x: auto;
      /* A barra some em telas largas, onde nao ha o que rolar. */
      scrollbar-width: thin;
    }

    .br-stepper-rolavel:focus-visible {
      outline: var(--govbr-focus-width, 3px) var(--govbr-focus-style, solid) var(--govbr-focus-color);
      outline-offset: var(--govbr-focus-offset, 2px);
    }

    /* Sem isto o flex esmaga o rotulo ate virar uma coluna de letras. */
    .br-stepper-rolavel > ol > li {
      min-width: max-content;
    }

    .br-stepper-vertical li {
      position: relative;
      padding-bottom: 24px;
    }

    .br-stepper-vertical li:last-child {
      padding-bottom: 0;
    }

    .br-stepper-vertical .br-stepper-connector {
      position: absolute;
      left: 15px;
      top: 40px;
      bottom: 0;
      width: 2px;
    }
  `],
})
export class BrStepperComponent {
  @Input() steps: BrStepperStep[] = [];
  @Input() currentStep = 0;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Orientação efetiva.
   *
   * Ligar `[orientation]="variavel"` com a variável indefinida sobrescreve o
   * default da classe. O template comparava `=== 'horizontal'` e `===
   * 'vertical'`, então um valor fora dos dois caía no ramo do `else` de cada
   * comparação e produzia um layout híbrido: estilo vertical, sem a classe de
   * rolagem, estourando a largura em 465px numa tela de 360px.
   */
  get orientacaoValida(): 'horizontal' | 'vertical' {
    return this.orientation === 'vertical' ? 'vertical' : 'horizontal';
  }
  @Input() compact = false;
  @Input() clickable = false;
  @Input() ariaLabel = 'Etapas do processo';

  @Output() stepChange = new EventEmitter<number>();

  getStepIndicatorClasses(index: number): string {
    const base = 'w-8 h-8 text-sm';

    if (index < this.currentStep) {
      // Completed
      return `${base} bg-govbr-success text-govbr-on-primary`;
    } else if (index === this.currentStep) {
      // Current
      return `${base} bg-govbr-primary text-govbr-on-primary ring-4 ring-govbr-primary-lightest`;
    } else {
      // Pending
      return `${base} bg-govbr-gray-10 text-govbr-gray-40 border-2 border-govbr-gray-20`;
    }
  }

  getStepLabelClasses(index: number): string {
    if (index < this.currentStep) {
      return 'text-govbr-success text-sm';
    } else if (index === this.currentStep) {
      return 'text-govbr-primary text-sm';
    } else {
      return 'text-govbr-gray-40 text-sm';
    }
  }

  getConnectorClasses(index: number): string {
    const base = this.orientacaoValida === 'horizontal'
      ? 'h-0.5 mx-3 min-w-[24px]'
      : 'br-stepper-connector';

    if (index < this.currentStep) {
      return `${base} bg-govbr-success`;
    } else {
      return `${base} bg-govbr-gray-10`;
    }
  }

  onStepClick(index: number): void {
    if (!this.clickable || index > this.currentStep) return;

    this.stepChange.emit(index);
  }
}
