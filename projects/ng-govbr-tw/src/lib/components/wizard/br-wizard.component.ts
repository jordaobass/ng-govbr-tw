import {
  Component,
  AfterContentInit,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';


/**
 * BrWizardStepComponent — Individual step inside a wizard.
 */
@Component({
  selector: 'br-wizard-step',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (active) {
      <div class="py-4 font-rawline" role="tabpanel">
        <ng-content></ng-content>
      </div>
    }
    `,
})
export class BrWizardStepComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() disabled = false;
  active = false;
}

/**
 * BrWizardComponent — Multi-step stepper following GovBR DS pattern.
 *
 * Usage:
 * ```html
 * <br-wizard [currentStep]="step" (stepChange)="step = $event">
 *   <br-wizard-step label="Dados Pessoais" icon="user">...</br-wizard-step>
 *   <br-wizard-step label="Endereço" icon="location-dot">...</br-wizard-step>
 *   <br-wizard-step label="Confirmação" icon="check">...</br-wizard-step>
 * </br-wizard>
 * ```
 */
@Component({
  selector: 'br-wizard',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="font-rawline">
      <!-- Step indicators -->
      <nav [class]="navClasses" [attr.aria-label]="ariaLabel">
        <ol class="flex items-center w-full">
          @for (step of steps; track step; let i = $index; let last = $last) {
            <li
              class="flex items-center"
              [class.flex-1]="!last"
              >
              <!-- Step button -->
              <button
                type="button"
                [disabled]="step.disabled || (!allowJump && i > currentStep)"
                (click)="goToStep(i)"
                class="flex items-center gap-2 group whitespace-nowrap"
                [attr.aria-current]="i === currentStep ? 'step' : null"
                [attr.aria-label]="step.label + (i < currentStep ? ' (concluído)' : i === currentStep ? ' (atual)' : '')"
                >
                <!-- Circle indicator -->
                <span [class]="getStepCircleClasses(i)">
                  @if (i < currentStep) {
                    <i class="fa-solid fa-check text-xs"></i>
                  }
                  @if (i >= currentStep && step.icon) {
                    <i [class]="'fa-solid fa-' + step.icon + ' text-xs'"></i>
                  }
                  @if (i >= currentStep && !step.icon) {
                    <span>{{ i + 1 }}</span>
                  }
                </span>
                <!-- Label (hidden on mobile for non-active) -->
                <span
                  [class]="getStepLabelClasses(i)"
                  [class.hidden]="i !== currentStep"
                  [class.sm:inline]="i !== currentStep"
                  >
                  {{ step.label }}
                </span>
              </button>
              <!-- Connector line -->
              @if (!last) {
                <div
                  class="flex-1 mx-2 sm:mx-3"
                  >
                  <div
                    class="h-px w-full"
                    [class.bg-govbr-primary]="i < currentStep"
                    [class.bg-govbr-gray-20]="i >= currentStep"
                  ></div>
                </div>
              }
            </li>
          }
        </ol>
      </nav>
    
      <!-- Step content -->
      <div class="mt-4">
        <ng-content></ng-content>
      </div>
    
      <!-- Navigation buttons -->
      @if (showNavigation) {
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-govbr-gray-10">
          <button
            type="button"
            [disabled]="currentStep === 0"
            (click)="previous()"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-govbr-primary border border-govbr-primary rounded-govbr-pill hover:bg-govbr-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
            <i class="fa-solid fa-chevron-left text-xs"></i>
            Voltar
          </button>
          <span class="text-sm text-govbr-gray-60">
            {{ currentStep + 1 }} de {{ steps?.length }}
          </span>
          @if (currentStep < (steps?.length || 0) - 1) {
            <button
              type="button"
              (click)="next()"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-govbr-primary rounded-govbr-pill hover:bg-govbr-primary-dark transition-colors"
              >
              Avançar
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          }
          @if (currentStep === (steps?.length || 0) - 1) {
            <button
              type="button"
              (click)="complete.emit()"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-govbr-success rounded-govbr-pill hover:bg-green-700 transition-colors"
              >
              Concluir
              <i class="fa-solid fa-check text-xs"></i>
            </button>
          }
        </div>
      }
    </div>
    `,
})
export class BrWizardComponent implements AfterContentInit, OnChanges {
  @ContentChildren(BrWizardStepComponent) steps!: QueryList<BrWizardStepComponent>;

  @Input() currentStep = 0;
  @Input() variant: 'simple' | 'numbered' = 'numbered';
  @Input() showNavigation = true;
  @Input() allowJump = false;
  @Input() ariaLabel = 'Progresso do formulário';

  @Output() stepChange = new EventEmitter<number>();
  @Output() complete = new EventEmitter<void>();

  ngAfterContentInit(): void {
    this.activateStep();
    this.steps.changes.subscribe(() => this.activateStep());
  }

  ngOnChanges(): void {
    if (this.steps) {
      this.activateStep();
    }
  }

  goToStep(index: number): void {
    const stepsArr = this.steps?.toArray();
    if (!stepsArr || stepsArr[index]?.disabled) return;
    if (!this.allowJump && index > this.currentStep) return;
    this.currentStep = index;
    this.stepChange.emit(index);
    this.activateStep();
  }

  next(): void {
    if (this.currentStep < (this.steps?.length || 0) - 1) {
      this.goToStep(this.currentStep + 1);
    }
  }

  previous(): void {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

  private activateStep(): void {
    this.steps?.forEach((step, i) => {
      step.active = i === this.currentStep;
    });
  }

  get navClasses(): string {
    return 'py-4 px-2';
  }

  getStepCircleClasses(index: number): string {
    const base = 'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold flex-shrink-0 transition-colors';
    if (index < this.currentStep) {
      return `${base} bg-govbr-primary text-white`;
    }
    if (index === this.currentStep) {
      return `${base} bg-govbr-primary text-white ring-2 ring-govbr-primary ring-offset-2`;
    }
    return `${base} bg-govbr-gray-10 text-govbr-gray-60`;
  }

  getStepLabelClasses(index: number): string {
    const base = 'text-sm font-medium';
    if (index < this.currentStep) {
      return `${base} text-govbr-primary`;
    }
    if (index === this.currentStep) {
      return `${base} text-govbr-primary font-semibold`;
    }
    return `${base} text-govbr-gray-60`;
  }
}
