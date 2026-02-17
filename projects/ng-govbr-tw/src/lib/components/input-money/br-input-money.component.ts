import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  isDevMode,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'br-input-money',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrInputMoneyComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BrInputMoneyComponent),
      multi: true,
    },
  ],
  template: `
    <div class="font-rawline">
      @if (label) {
        <label
          [for]="inputId"
          class="block text-govbr-sm font-medium text-govbr-gray-80 mb-1"
        >
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger-dark ml-0.5" aria-hidden="true">*</span>
          }
        </label>
      }
      <div class="relative">
        @if (showPrefix) {
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-govbr-gray-60">
            {{ prefix }}
          </span>
        }
        <input
          #inputEl
          [id]="inputId"
          type="text"
          inputmode="decimal"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-invalid]="hasError"
          [attr.aria-describedby]="hasError ? inputId + '-error' : null"
          class="w-full py-2.5 rounded border text-govbr-base text-govbr-gray-80 placeholder-govbr-gray-40 transition-colors govbr-focus-ring text-right"
          [class]="inputClasses"
          [style.padding-left]="showPrefix ? '3rem' : '1rem'"
          [style.padding-right]="'1rem'"
          [value]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
      </div>
      @if (hasError && errorMessage) {
        <p
          [id]="inputId + '-error'"
          class="mt-1 text-govbr-xs text-govbr-danger-dark flex items-center gap-1"
          role="alert"
        >
          <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
          {{ errorMessage }}
        </p>
      }
      @if (hint && !hasError) {
        <p class="mt-1 text-govbr-xs text-govbr-gray-60">{{ hint }}</p>
      }
    </div>
  `,
})
export class BrInputMoneyComponent implements ControlValueAccessor, Validator {
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  @Input() label = '';
  @Input() placeholder = '0,00';
  @Input() hint = '';
  @Input() ariaLabel = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() prefix = 'R$';
  @Input() showPrefix = true;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() allowNegative = false;

  /**
   * Unidade do valor que o formulário entrega e recebe neste controle.
   * `cents` (padrão) é a unidade interna do componente — `value` guarda
   * centavos e `valueInReais` divide por 100. Use `reais` quando o
   * formulário trabalha com o valor fracionário (ex.: 1.5 para R$ 1,50).
   */
  @Input() valueUnit: 'cents' | 'reais' = 'cents';

  private static idCounter = 0;
  inputId = `br-input-money-${++BrInputMoneyComponent.idCounter}`;

  value: number | null = null; // Value in cents/minor unit
  displayValue = '';
  touched = false;
  errorMessage = '';
  focused = false;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  get hasError(): boolean {
    return this.touched && !!this.errorMessage;
  }

  get inputClasses(): string {
    if (this.hasError) {
      return 'border-govbr-danger bg-govbr-danger-bg';
    }
    if (this.disabled) {
      return 'border-govbr-gray-10 bg-govbr-gray-2 cursor-not-allowed';
    }
    return 'border-govbr-gray-20 bg-govbr-bg hover:border-govbr-gray-40';
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value;

    // Remove everything except digits, comma, dot, and minus
    if (this.allowNegative) {
      rawValue = rawValue.replace(/[^\d,.-]/g, '');
    } else {
      rawValue = rawValue.replace(/[^\d,.]/g, '');
    }

    // Handle Brazilian format: replace dots (thousands) and commas (decimal)
    // Remove thousand separators (dots)
    rawValue = rawValue.replace(/\./g, '');
    // Replace comma with dot for parsing
    rawValue = rawValue.replace(',', '.');

    // Parse as float
    const numValue = parseFloat(rawValue);

    if (isNaN(numValue)) {
      this.value = null;
      this.displayValue = '';
    } else {
      this.value = Math.round(numValue * 100); // Store as cents
      this.displayValue = this.formatMoney(this.value);
    }

    input.value = this.displayValue;

    this.onChange(this.value);
    this.updateValidation();
  }

  onFocus(): void {
    this.focused = true;
  }

  onBlur(): void {
    this.focused = false;
    this.touched = true;
    this.onTouched();
    this.updateValidation();

    // Format on blur if value exists
    if (this.value !== null) {
      this.displayValue = this.formatMoney(this.value);
    }
  }

  private formatMoney(valueInCents: number | null): string {
    if (valueInCents === null) return '';

    const value = valueInCents / 100;

    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private updateValidation(): void {
    const errors = this.validate();

    if (errors?.['required']) {
      this.errorMessage = 'Campo obrigatório';
    } else if (errors?.['min']) {
      const minFormatted = this.formatMoney(this.min! * 100);
      this.errorMessage = `Valor mínimo: ${this.prefix} ${minFormatted}`;
    } else if (errors?.['max']) {
      const maxFormatted = this.formatMoney(this.max! * 100);
      this.errorMessage = `Valor máximo: ${this.prefix} ${maxFormatted}`;
    } else {
      this.errorMessage = '';
    }
  }

  validate(): ValidationErrors | null {
    if (this.required && this.value === null) {
      return { required: true };
    }

    if (this.value === null) {
      return null;
    }

    const valueInReais = this.value / 100;

    if (this.min !== null && valueInReais < this.min) {
      return { min: { min: this.min, actual: valueInReais } };
    }

    if (this.max !== null && valueInReais > this.max) {
      return { max: { max: this.max, actual: valueInReais } };
    }

    return null;
  }

  writeValue(value: number | null): void {
    if (value === null || value === undefined) {
      this.value = null;
      this.displayValue = '';
      return;
    }

    // A unidade é declarada por quem usa, nunca adivinhada pela grandeza do
    // número: 100 centavos e 100 reais são o mesmo 100. A heurística anterior
    // multiplicava por 100 todo valor <= 100, então R$ 1,00 virava R$ 100,00.
    if (this.valueUnit === 'reais') {
      this.value = Math.round(value * 100);
    } else {
      if (!Number.isInteger(value) && isDevMode()) {
        // Não existe meio centavo em BRL — valor fracionário aqui é quase
        // sempre reais entregue com a unidade errada. Avisar alto é melhor
        // que converter calado e errar por 100x.
        console.warn(
          `[br-input-money] Recebeu ${value} com valueUnit="cents". ` +
            'Centavos são inteiros; se o formulário trabalha com reais, ' +
            'declare valueUnit="reais".'
        );
      }
      this.value = Math.round(value);
    }
    this.displayValue = this.formatMoney(this.value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  /** Retorna o valor em reais (não em centavos) */
  get valueInReais(): number | null {
    return this.value !== null ? this.value / 100 : null;
  }
}
