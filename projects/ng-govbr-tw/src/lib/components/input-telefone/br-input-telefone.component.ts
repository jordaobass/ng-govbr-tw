import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
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
  selector: 'br-input-telefone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrInputTelefoneComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BrInputTelefoneComponent),
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
        <input
          #inputEl
          [id]="inputId"
          type="tel"
          inputmode="numeric"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-invalid]="hasError"
          [attr.aria-describedby]="descricaoAcessivel"
          class="w-full px-4 py-2.5 rounded border text-govbr-base text-govbr-gray-80 placeholder-govbr-gray-40 transition-colors govbr-focus-ring"
          [class]="inputClasses"
          [value]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
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
        <p [id]="inputId + '-hint'" class="mt-1 text-govbr-xs text-govbr-gray-60">{{ hint }}</p>
      }
    </div>
  `,
})
export class BrInputTelefoneComponent implements ControlValueAccessor, Validator {
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  @Input() label = '';
  @Input() placeholder = '(00) 00000-0000';

  /**
   * Ids que descrevem o campo para o leitor de tela.
   *
   * Antes isto apontava só para o erro, e o texto de apoio — visível logo
   * abaixo do campo — nunca era anunciado: claro para quem enxerga, ausente
   * para quem não. O axe não pega, porque nenhuma ferramenta adivinha que um
   * parágrafo vizinho é a descrição do campo.
   */
  get descricaoAcessivel(): string | null {
    if (this.hasError) return `${this.inputId}-error`;
    if (this.hint) return `${this.inputId}-hint`;
    return null;
  }

  @Input() hint = '';
  @Input() ariaLabel = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() allowLandline = true; // Permite telefone fixo (8 dígitos)

  private static idCounter = 0;
  inputId = `br-input-telefone-${++BrInputTelefoneComponent.idCounter}`;

  value = ''; // Raw value (only digits)
  displayValue = '';
  touched = false;
  errorMessage = '';

  private onChange: (value: string) => void = () => {};
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
    const rawValue = input.value.replace(/\D/g, '');

    // Limit to 11 digits (DDD + 9 digits)
    this.value = rawValue.slice(0, 11);
    this.displayValue = this.formatPhone(this.value);

    // Update input with formatted value
    input.value = this.displayValue;

    this.onChange(this.value);
    this.updateValidation();
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
    this.updateValidation();
  }

  private formatPhone(value: string): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    if (digits.length <= 2) {
      return `(${digits}`;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    // Celular: (XX) XXXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  private updateValidation(): void {
    const errors = this.validate();

    if (errors?.['required']) {
      this.errorMessage = 'Campo obrigatório';
    } else if (errors?.['phoneIncomplete']) {
      this.errorMessage = 'Telefone incompleto';
    } else if (errors?.['phoneInvalid']) {
      this.errorMessage = 'Telefone inválido';
    } else {
      this.errorMessage = '';
    }
  }

  validate(): ValidationErrors | null {
    if (this.required && !this.value) {
      return { required: true };
    }

    if (!this.value) {
      return null;
    }

    const minLength = this.allowLandline ? 10 : 11;

    if (this.value.length < minLength) {
      return { phoneIncomplete: true };
    }

    // Validate DDD (11-99)
    const ddd = parseInt(this.value.slice(0, 2), 10);
    if (ddd < 11 || ddd > 99) {
      return { phoneInvalid: true };
    }

    // For mobile, first digit after DDD must be 9
    if (this.value.length === 11 && this.value[2] !== '9') {
      return { phoneInvalid: true };
    }

    return null;
  }

  writeValue(value: string): void {
    this.value = value?.replace(/\D/g, '') || '';
    this.displayValue = this.formatPhone(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
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
}
