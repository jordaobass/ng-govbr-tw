import {
  Component,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'br-textarea',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="mb-4 font-rawline">
      @if (label) {
        <label
          [for]="textareaId"
          class="inline-block text-govbr-sm font-semibold text-govbr-gray-80 mb-1"
          >
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger ml-0.5">*</span>
          }
        </label>
      }
    
      @if (helperText && !error && !successMessage) {
        <span
          [id]="textareaId + '-helper'"
          class="block text-govbr-xs text-govbr-gray-60 mb-1"
        >
          {{ helperText }}
        </span>
      }

      <textarea
        [id]="textareaId"
        [placeholder]="placeholder"
        [disabled]="isDisabled"
        [rows]="rows"
        [attr.maxlength]="maxLength || null"
        [attr.aria-invalid]="!!displayError"
        [attr.aria-describedby]="descricaoAcessivel"
        [class]="textareaClasses"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      ></textarea>
    
      <!-- Character counter -->
      @if (maxLength) {
        <div class="flex justify-end mt-0.5">
          <span
            class="text-govbr-xs"
            [class.text-govbr-danger]="isOverLimit"
            [class.text-govbr-gray-40]="!isOverLimit"
            >
            {{ value?.length || 0 }}/{{ maxLength }}
          </span>
        </div>
      }
    
      <!-- Feedback -->
      @if (displayError) {
        <span
          [id]="textareaId + '-error'"
          class="flex items-center mt-1 text-govbr-sm text-govbr-danger"
          role="alert"
        >
          <i class="fa-solid fa-times-circle mr-1" aria-hidden="true"></i>{{ displayError }}
        </span>
      }

      @if (successMessage && !displayError) {
        <span
          [id]="textareaId + '-feedback'"
          class="flex items-center mt-1 text-govbr-sm text-govbr-success-dark"
          role="status"
        >
          <i class="fa-solid fa-check-circle mr-1" aria-hidden="true"></i>{{ successMessage }}
        </span>
      }

      @if (warningMessage && !displayError && !successMessage) {
        <span
          [id]="textareaId + '-feedback'"
          class="flex items-center mt-1 text-govbr-sm text-govbr-warning-dark"
          role="status"
        >
          <i class="fa-solid fa-exclamation-triangle mr-1" aria-hidden="true"></i>{{ warningMessage }}
        </span>
      }

      @if (infoMessage && !displayError && !successMessage && !warningMessage) {
        <span
          [id]="textareaId + '-feedback'"
          class="flex items-center mt-1 text-govbr-sm text-govbr-info"
        >
          <i class="fa-solid fa-info-circle mr-1" aria-hidden="true"></i>{{ infoMessage }}
        </span>
      }
    </div>
    `,
})
export class BrTextareaComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() rows = 4;
  @Input() maxLength?: number;
  @Input() helperText?: string;
  /** Mensagem de erro manual (sobrescreve erros automáticos do validator) */
  @Input() error?: string;
  @Input() successMessage?: string;
  @Input() warningMessage?: string;
  @Input() infoMessage?: string;
  @Input() density: 'small' | 'medium' | 'large' = 'medium';
  @Input() resizable: 'none' | 'vertical' | 'both' = 'vertical';

  /** Mensagens customizadas para erros de validação */
  @Input() errorMessages: Record<string, string> = {};

  value = '';
  isDisabled = false;

  private static nextId = 0;
  textareaId = `br-textarea-${BrTextareaComponent.nextId++}`;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  private static readonly defaultErrorMessages: Record<string, string | ((err: unknown) => string)> = {
    required: 'Campo obrigatório',
    minlength: (err: unknown) => {
      const e = err as { requiredLength: number };
      return `Mínimo de ${e.requiredLength} caracteres`;
    },
    maxlength: (err: unknown) => {
      const e = err as { requiredLength: number };
      return `Máximo de ${e.requiredLength} caracteres`;
    },
  };

  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get isOverLimit(): boolean {
    return !!this.maxLength && (this.value?.length || 0) >= this.maxLength;
  }

  /**
   * Retorna a mensagem de erro a ser exibida.
   */
  /**
   * Ids que descrevem o campo para o leitor de tela, na mesma precedência que
   * o template usa para escolher a mensagem. `null` quando não há nada a
   * descrever — apontar para elemento ausente faz o leitor anunciar vazio.
   */
  get descricaoAcessivel(): string | null {
    if (this.displayError) return `${this.textareaId}-error`;
    if (this.successMessage || this.warningMessage || this.infoMessage) {
      return `${this.textareaId}-feedback`;
    }
    if (this.helperText) return `${this.textareaId}-helper`;
    return null;
  }

  get displayError(): string | undefined {
    if (this.error) {
      return this.error;
    }

    if (!this.ngControl?.control) {
      return undefined;
    }

    const control = this.ngControl.control;

    if (!control.errors || (!control.touched && !control.dirty)) {
      return undefined;
    }

    return this.getFirstErrorMessage(control.errors);
  }

  private getFirstErrorMessage(errors: ValidationErrors): string {
    for (const key of Object.keys(errors)) {
      if (this.errorMessages[key]) {
        return this.errorMessages[key];
      }
      const defaultMsg = BrTextareaComponent.defaultErrorMessages[key];
      if (defaultMsg) {
        return typeof defaultMsg === 'function' ? defaultMsg(errors[key]) : defaultMsg;
      }
    }
    return 'Campo inválido';
  }

  get textareaClasses(): string {
    const densityPadding = {
      small: 'px-3 py-1.5',
      medium: 'px-4 py-2',
      large: 'px-5 py-3',
    } as const;

    const resizeMap = {
      none: 'resize-none',
      vertical: 'resize-y',
      both: 'resize',
    } as const;

    const base = [
      'w-full font-rawline text-govbr-base govbr-input',
      densityPadding[this.density],
      resizeMap[this.resizable],
    ].join(' ');

    const statusCls = this.displayError
      ? 'govbr-input--danger'
      : this.successMessage
        ? 'govbr-input--success'
        : this.warningMessage
          ? 'govbr-input--warning'
          : '';

    const disabledCls = this.isDisabled
      ? 'bg-govbr-gray-2 text-govbr-gray-40 cursor-not-allowed'
      : 'bg-govbr-bg text-govbr-gray-80';

    return [base, statusCls, disabledCls].filter(Boolean).join(' ');
  }

  writeValue(value: string): void {
    this.value = value ?? '';
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

  onInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value = val;
    this.onChange(val);
  }
}
