import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  ControlValueAccessor,
  FormsModule,
  NgControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'br-input',
  standalone: true,
  imports: [FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="mb-4 font-rawline" [class.inline-input]="inline">
      @if (label) {
        <label
          [for]="inputId"
          class="block text-govbr-sm font-semibold text-govbr-gray-80 mb-1"
          [class.sr-only]="inline"
          >
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger ml-0.5">*</span>
          }
        </label>
      }
    
      @if (helperText && !error && !successMessage) {
        <span class="block text-govbr-xs text-govbr-gray-60 mb-1">
          {{ helperText }}
        </span>
      }
    
      <div [class]="containerClasses">
        <!-- Icon (left) -->
        @if (icon && !iconRight) {
          <i
            [class]="'fa-solid fa-' + icon + ' absolute left-3 top-1/2 -translate-y-1/2 text-govbr-gray-40 pointer-events-none'"
          ></i>
        }
    
        <!-- Select -->
        @if (type === 'select') {
          <select
            [id]="inputId"
            [disabled]="isDisabled"
            [class]="inputClasses"
            [value]="value"
            (change)="onSelectChange($event)"
            (blur)="onTouched()"
            >
            <option value="" disabled [selected]="!value">{{ placeholder }}</option>
            <ng-content></ng-content>
          </select>
        }
    
        <!-- Textarea -->
        @if (type === 'textarea') {
          <textarea
            [id]="inputId"
            [placeholder]="placeholder"
            [disabled]="isDisabled"
            [class]="inputClasses"
            [rows]="rows"
            [attr.maxlength]="maxLength || null"
            [value]="value"
            (input)="onInputChange($event)"
            (blur)="onTouched()"
          ></textarea>
        }
    
        <!-- File -->
        @if (type === 'file') {
          <div class="flex items-center">
            <label
              [for]="inputId"
              class="inline-flex items-center px-4 py-2 bg-govbr-primary text-white rounded-govbr-pill cursor-pointer hover:bg-govbr-primary-dark transition-colors text-govbr-sm font-semibold"
              [class.opacity-50]="isDisabled"
              [class.cursor-not-allowed]="isDisabled"
              >
              <i class="fa-solid fa-upload mr-2"></i>
              {{ placeholder || 'Selecionar arquivo' }}
            </label>
            <input
              [id]="inputId"
              type="file"
              class="hidden"
              [disabled]="isDisabled"
              (change)="onFileChange($event)"
              />
            @if (fileName) {
              <span class="ml-2 text-govbr-sm text-govbr-gray-60">{{ fileName }}</span>
            }
          </div>
        }
    
        <!-- Text / Email / Password / Number / Search -->
        @if (isStandardInput) {
          <input
            [id]="inputId"
            [type]="actualType"
            [placeholder]="placeholder"
            [disabled]="isDisabled"
            [class]="inputClasses"
            [attr.maxlength]="maxLength || null"
            [value]="value"
            (input)="onInputChange($event)"
            (blur)="onTouched()"
            />
        }
    
        <!-- Password toggle button -->
        @if (type === 'password') {
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-govbr-primary hover:text-govbr-primary-dark govbr-focus-ring"
            [attr.aria-label]="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            (click)="togglePassword()"
            >
            <i [class]="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        }
    
        <!-- Icon (right) -->
        @if (icon && iconRight && type !== 'password') {
          <i
            [class]="'fa-solid fa-' + icon + ' absolute right-3 top-1/2 -translate-y-1/2 text-govbr-gray-40 pointer-events-none'"
          ></i>
        }
    
        <!-- Search button -->
        @if (type === 'search') {
          <button
            type="button"
            class="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-govbr-primary hover:bg-govbr-primary-lightest govbr-focus-ring transition-colors"
            aria-label="Buscar"
            (click)="searchSubmit.emit(value)"
            >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        }
      </div>
    
      <!-- Character counter -->
      @if (maxLength && (type === 'textarea' || isStandardInput)) {
        <div class="flex justify-end mt-0.5">
          <span class="text-govbr-xs text-govbr-gray-40">
            {{ value?.length || 0 }}/{{ maxLength }}
          </span>
        </div>
      }
    
      <!-- Feedback messages -->
      @if (displayError) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-danger">
          <i class="fa-solid fa-times-circle mr-1"></i>{{ displayError }}
        </span>
      }

      @if (successMessage && !displayError) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-success">
          <i class="fa-solid fa-check-circle mr-1"></i>{{ successMessage }}
        </span>
      }

      @if (warningMessage && !displayError && !successMessage) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-warning">
          <i class="fa-solid fa-exclamation-triangle mr-1"></i>{{ warningMessage }}
        </span>
      }

      @if (infoMessage && !displayError && !successMessage && !warningMessage) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-info">
          <i class="fa-solid fa-info-circle mr-1"></i>{{ infoMessage }}
        </span>
      }
    </div>
    `,
})
export class BrInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type:
    | 'text'
    | 'email'
    | 'password'
    | 'select'
    | 'file'
    | 'number'
    | 'search'
    | 'textarea' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  /** Mensagem de erro manual (sobrescreve erros automáticos do validator) */
  @Input() error?: string;
  @Input() successMessage?: string;
  @Input() warningMessage?: string;
  @Input() infoMessage?: string;
  @Input() helperText?: string;
  @Input() icon?: string;
  @Input() iconRight = false;
  @Input() density: 'small' | 'medium' | 'large' = 'medium';
  @Input() highlight = false;
  @Input() inline = false;
  @Input() maxLength?: number;
  @Input() rows = 3;

  /** Mensagens customizadas para erros de validação */
  @Input() errorMessages: Record<string, string> = {};

  @Output() fileSelected = new EventEmitter<File>();
  @Output() searchSubmit = new EventEmitter<string>();

  value: string = '';
  isDisabled = false;
  fileName = '';
  showPassword = false;

  private static nextId = 0;
  inputId = `br-input-${BrInputComponent.nextId++}`;

  private static readonly defaultErrorMessages: Record<string, string | ((err: unknown) => string)> = {
    required: 'Campo obrigatório',
    email: 'Email inválido',
    minlength: (err: unknown) => {
      const e = err as { requiredLength: number };
      return `Mínimo de ${e.requiredLength} caracteres`;
    },
    maxlength: (err: unknown) => {
      const e = err as { requiredLength: number };
      return `Máximo de ${e.requiredLength} caracteres`;
    },
    min: (err: unknown) => {
      const e = err as { min: number };
      return `Valor mínimo: ${e.min}`;
    },
    max: (err: unknown) => {
      const e = err as { max: number };
      return `Valor máximo: ${e.max}`;
    },
    pattern: 'Formato inválido',
  };

  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get isStandardInput(): boolean {
    return this.type !== 'select' && this.type !== 'file' && this.type !== 'textarea';
  }

  get actualType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    if (this.type === 'search') return 'text';
    return this.type;
  }

  get containerClasses(): string {
    return this.type !== 'file' ? 'relative' : '';
  }

  /**
   * Retorna a mensagem de erro a ser exibida.
   * Prioridade: error manual > erro do validator (se touched/dirty)
   */
  get displayError(): string | undefined {
    // Erro manual sempre tem prioridade
    if (this.error) {
      return this.error;
    }

    // Se não tem NgControl, não há erro automático
    if (!this.ngControl?.control) {
      return undefined;
    }

    const control = this.ngControl.control;

    // Só mostra erro se o controle foi tocado ou modificado E está inválido
    if (!control.errors || (!control.touched && !control.dirty)) {
      return undefined;
    }

    // Busca a primeira mensagem de erro
    return this.getFirstErrorMessage(control.errors);
  }

  private getFirstErrorMessage(errors: ValidationErrors): string {
    for (const key of Object.keys(errors)) {
      // Primeiro verifica mensagens customizadas do usuário
      if (this.errorMessages[key]) {
        return this.errorMessages[key];
      }

      // Depois verifica mensagens padrão
      const defaultMsg = BrInputComponent.defaultErrorMessages[key];
      if (defaultMsg) {
        return typeof defaultMsg === 'function' ? defaultMsg(errors[key]) : defaultMsg;
      }
    }

    // Fallback genérico
    return 'Campo inválido';
  }

  get inputClasses(): string {
    const densityStyles = {
      small: 'text-govbr-sm',
      medium: 'text-govbr-base',
      large: 'text-govbr-lg',
    } as const;

    const densityHeights = {
      small: 'h-[var(--govbr-input-small)]',
      medium: 'h-[var(--govbr-input-medium)]',
      large: 'h-[var(--govbr-input-large)]',
    } as const;

    const base = [
      'w-full px-4 font-rawline govbr-input',
      this.type === 'textarea' ? 'py-2' : '',
    ].join(' ');

    const density = densityStyles[this.density];
    const height = this.type !== 'textarea' ? densityHeights[this.density] : '';

    const highlightCls = this.highlight
      ? 'h-[var(--govbr-input-highlight)] bg-govbr-gray-2 border-transparent text-govbr-lg px-6'
      : '';

    const statusCls = this.displayError
      ? 'govbr-input--danger'
      : this.successMessage
        ? 'govbr-input--success'
        : this.warningMessage
          ? 'govbr-input--warning'
          : '';

    const disabledCls = this.isDisabled
      ? 'bg-govbr-gray-2 text-govbr-gray-40 cursor-not-allowed'
      : 'bg-white text-govbr-gray-80';

    const iconPaddingLeft = this.icon && !this.iconRight ? 'pl-10' : '';
    const iconPaddingRight =
      (this.icon && this.iconRight) || this.type === 'password' || this.type === 'search'
        ? 'pr-10'
        : '';

    return [base, density, height, highlightCls, statusCls, disabledCls, iconPaddingLeft, iconPaddingRight]
      .filter(Boolean)
      .join(' ');
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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(target.value);
  }

  onSelectChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.fileSelected.emit(file);
    }
  }
}
