import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
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

export interface BrCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

@Component({
  selector: 'br-input-cep',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrInputCepComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BrInputCepComponent),
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
            <span class="text-govbr-danger ml-0.5" aria-hidden="true">*</span>
          }
        </label>
      }
      <div class="relative">
        <input
          #inputEl
          [id]="inputId"
          type="text"
          inputmode="numeric"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-invalid]="hasError"
          [attr.aria-describedby]="hasError ? inputId + '-error' : null"
          class="w-full px-4 py-2.5 rounded border text-govbr-base text-govbr-gray-80 placeholder-govbr-gray-40 transition-colors govbr-focus-ring"
          [class]="inputClasses"
          [value]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />
        @if (loading) {
          <div class="absolute right-3 top-1/2 -translate-y-1/2">
            <i class="fas fa-spinner fa-spin text-govbr-primary" aria-hidden="true"></i>
          </div>
        }
      </div>
      @if (hasError && errorMessage) {
        <p
          [id]="inputId + '-error'"
          class="mt-1 text-govbr-xs text-govbr-danger flex items-center gap-1"
          role="alert"
        >
          <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
          {{ errorMessage }}
        </p>
      }
      @if (hint && !hasError) {
        <p class="mt-1 text-govbr-xs text-govbr-gray-40">{{ hint }}</p>
      }
    </div>
  `,
})
export class BrInputCepComponent implements ControlValueAccessor, Validator {
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  @Input() label = '';
  @Input() placeholder = '00000-000';
  @Input() hint = '';
  @Input() ariaLabel = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() autoFetch = true; // Auto-fetch address from ViaCEP

  @Output() addressFound = new EventEmitter<BrCepAddress>();
  @Output() addressError = new EventEmitter<string>();

  private static idCounter = 0;
  inputId = `br-input-cep-${++BrInputCepComponent.idCounter}`;

  value = ''; // Raw value (only digits)
  displayValue = '';
  touched = false;
  errorMessage = '';
  loading = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  private lastFetchedCep = '';

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

    // Limit to 8 digits
    this.value = rawValue.slice(0, 8);
    this.displayValue = this.formatCep(this.value);

    // Update input with formatted value
    input.value = this.displayValue;

    this.onChange(this.value);
    this.updateValidation();

    // Auto-fetch when complete
    if (this.autoFetch && this.value.length === 8 && this.value !== this.lastFetchedCep) {
      this.fetchAddress();
    }
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
    this.updateValidation();
  }

  private formatCep(value: string): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    if (digits.length <= 5) {
      return digits;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  private async fetchAddress(): Promise<void> {
    if (this.loading) return;

    this.loading = true;
    this.lastFetchedCep = this.value;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${this.value}/json/`);
      const data = await response.json();

      if (data.erro) {
        this.errorMessage = 'CEP não encontrado';
        this.addressError.emit('CEP não encontrado');
      } else {
        this.errorMessage = '';
        this.addressFound.emit(data as BrCepAddress);
      }
    } catch {
      this.errorMessage = 'Erro ao buscar CEP';
      this.addressError.emit('Erro ao buscar CEP');
    } finally {
      this.loading = false;
    }
  }

  private updateValidation(): void {
    const errors = this.validate();

    if (errors?.['required']) {
      this.errorMessage = 'Campo obrigatório';
    } else if (errors?.['cepIncomplete']) {
      this.errorMessage = 'CEP incompleto';
    } else if (!this.errorMessage) {
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

    if (this.value.length < 8) {
      return { cepIncomplete: true };
    }

    return null;
  }

  writeValue(value: string): void {
    // Mesma normalização do onInput: CEP tem 8 dígitos, valor vindo do
    // formulário não pode escapar do limite que a digitação respeita.
    this.value = (value?.replace(/\D/g, '') || '').slice(0, 8);
    this.displayValue = this.formatCep(this.value);
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

  /** Método público para buscar endereço manualmente */
  searchAddress(): void {
    if (this.value.length === 8) {
      this.fetchAddress();
    }
  }
}
