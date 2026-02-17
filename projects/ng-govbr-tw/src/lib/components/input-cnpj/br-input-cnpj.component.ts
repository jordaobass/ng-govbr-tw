import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  Component,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { ControlValueAccessor, NgControl, ValidationErrors, Validator, AbstractControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'br-input-cnpj',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="mb-4 font-rawline">
      @if (label) {
        <label
          [for]="inputId"
          class="block text-govbr-sm font-semibold text-govbr-gray-80 mb-1"
        >
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger-dark ml-0.5">*</span>
          }
        </label>
      }

      @if (helperText && !displayError) {
        <span
          [id]="inputId + '-helper'"
          class="block text-govbr-xs text-govbr-gray-60 mb-1"
        >
          {{ helperText }}
        </span>
      }

      <div class="relative">
        <input
          [id]="inputId"
          type="text"
          inputmode="numeric"
          [placeholder]="placeholder"
          [disabled]="isDisabled"
          [attr.aria-invalid]="!!displayError"
          [attr.aria-describedby]="descricaoAcessivel"
          [class]="inputClasses"
          [value]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
          maxlength="18"
        />
        <i
          class="fa-solid fa-building absolute right-3 top-1/2 -translate-y-1/2 text-govbr-gray-60 pointer-events-none"
          aria-hidden="true"
        ></i>
      </div>

      @if (displayError) {
        <span
          [id]="inputId + '-error'"
          class="flex items-center mt-1 text-govbr-sm text-govbr-danger-dark"
          role="alert"
        >
          <i class="fa-solid fa-times-circle mr-1" aria-hidden="true"></i>{{ displayError }}
        </span>
      }
    </div>
  `,
})
export class BrInputCnpjComponent implements ControlValueAccessor, Validator, OnDestroy, OnInit {
  @Input() label?: string;
  @Input() placeholder = '00.000.000/0000-00';
  @Input() required = false;
  @Input() helperText?: string;
  @Input() error?: string;
  @Input() density: 'small' | 'medium' | 'large' = 'medium';

  /** Mensagens customizadas para erros */
  @Input() errorMessages: Record<string, string> = {};

  displayValue = '';
  isDisabled = false;
  private rawValue = '';

  private static nextId = 0;
  inputId = `br-input-cnpj-${BrInputCnpjComponent.nextId++}`;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  onValidatorChange: () => void = () => {};

  private static readonly defaultErrorMessages: Record<string, string> = {
    required: 'Campo obrigatório',
    cnpjInvalid: 'CNPJ inválido',
    cnpjIncomplete: 'CNPJ incompleto',
  };

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private inscricaoEstado?: Subscription;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    
  }
  }

  get displayError(): string | undefined {
    if (this.error) return this.error;

    if (!this.ngControl?.control) return undefined;

    const control = this.ngControl.control;
    if (!control.errors || (!control.touched && !control.dirty)) return undefined;

    return this.getFirstErrorMessage(control.errors);
  }

  /**
   * Ids que descrevem o campo para o leitor de tela. O erro só entra quando
   * existe — `aria-describedby` apontando para elemento ausente faz o leitor
   * anunciar nada e mascara o problema.
   */
  get descricaoAcessivel(): string | null {
    const ids: string[] = [];
    if (this.displayError) ids.push(`${this.inputId}-error`);
    else if (this.helperText) ids.push(`${this.inputId}-helper`);
    return ids.length ? ids.join(' ') : null;
  }

  private getFirstErrorMessage(errors: ValidationErrors): string {
    for (const key of Object.keys(errors)) {
      if (this.errorMessages[key]) return this.errorMessages[key];
      const defaultMsg = BrInputCnpjComponent.defaultErrorMessages[key];
      if (defaultMsg) return defaultMsg;
    }
    return 'Campo inválido';
  }

  get inputClasses(): string {
    const densityHeights = {
      small: 'h-[var(--govbr-input-small)] text-govbr-sm',
      medium: 'h-[var(--govbr-input-medium)] text-govbr-base',
      large: 'h-[var(--govbr-input-large)] text-govbr-lg',
    } as const;

    const base = `w-full px-4 pr-10 font-rawline govbr-input ${densityHeights[this.density]}`;
    const statusCls = this.displayError ? 'govbr-input--danger' : '';
    const disabledCls = this.isDisabled
      ? 'bg-govbr-gray-2 text-govbr-gray-60 cursor-not-allowed'
      : 'bg-govbr-bg text-govbr-gray-80';

    return [base, statusCls, disabledCls].filter(Boolean).join(' ');
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 14);
    this.rawValue = digits;
    this.displayValue = this.formatCnpj(digits);
    this.onChange(digits);

    setTimeout(() => {
      input.value = this.displayValue;
    });
  }

  onBlur(): void {
    this.onTouched();
  }

  private formatCnpj(digits: string): string {
    if (!digits) return '';
    let formatted = digits;
    // 00.000.000/0000-00
    if (digits.length > 2) {
      formatted = digits.slice(0, 2) + '.' + digits.slice(2);
    }
    if (digits.length > 5) {
      formatted = formatted.slice(0, 6) + '.' + formatted.slice(6);
    }
    if (digits.length > 8) {
      formatted = formatted.slice(0, 10) + '/' + formatted.slice(10);
    }
    if (digits.length > 12) {
      formatted = formatted.slice(0, 15) + '-' + formatted.slice(15);
    }
    return formatted;
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    const digits = (value || '').replace(/\D/g, '').slice(0, 14);
    this.rawValue = digits;
    this.displayValue = this.formatCnpj(digits);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Validator
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return this.required ? { required: true } : null;
    }

    const digits = value.replace(/\D/g, '');
    if (digits.length < 14) {
      return { cnpjIncomplete: true };
    }

    if (!this.isValidCnpj(digits)) {
      return { cnpjInvalid: true };
    }

    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private isValidCnpj(cnpj: string): boolean {
    const digits = cnpj.replace(/\D/g, '');

    if (digits.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(digits)) return false;

    // Calcula primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i], 10) * weights1[i];
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(digits[12], 10)) return false;

    // Calcula segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(digits[i], 10) * weights2[i];
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(digits[13], 10)) return false;

    return true;
  }

  /**
   * Com `OnPush`, o estado de validação precisa avisar a view.
   *
   * O erro exibido vem de `ngControl.control.errors`, lido num getter. Nada
   * nesse caminho passa por `@Input` nem por evento do template, então quando
   * o formulário fica inválido (um `markAllAsTouched()` no submit, por
   * exemplo) a mensagem simplesmente não aparecia: compilava, passava no
   * unitário e falhava na tela.
   */
  ngOnInit(): void {
    // No construtor, `ngControl.control` ainda é null: a diretiva só o
    // publica depois. Assinar ali deixava a inscrição sem efeito.
    this.observarEstadoDoControle();
  }

  private observarEstadoDoControle(): void {
    const control = this.ngControl?.control;
    if (!control) return;

    this.inscricaoEstado = merge(
      control.statusChanges,
      control.valueChanges
    ).subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.inscricaoEstado?.unsubscribe();
  }
}
