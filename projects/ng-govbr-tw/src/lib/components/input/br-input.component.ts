import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
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
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'br-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="br-input" [class]="containerClasses">
      @if (label) {
        <label [for]="inputId" class="br-input-label">
          {{ label }}
          @if (required) {
            <span class="br-input-required">*</span>
          }
        </label>
      }

      @if (helperText && !displayError && !successMessage) {
        <span [id]="inputId + '-helper'" class="br-input-helper">{{ helperText }}</span>
      }

      <div class="br-input-group">
        @if (prefix) {
          <span class="br-input-addon br-input-prefix">{{ prefix }}</span>
        }

        @if (icon && !iconRight) {
          <div class="br-input-icon">
            <i [class]="'fas fa-' + icon" aria-hidden="true"></i>
          </div>
        }

        @if (type === 'textarea') {
          <textarea
            [id]="inputId"
            class="br-input-field"
            [placeholder]="placeholder"
            [disabled]="isDisabled"
            [rows]="rows"
            [attr.maxlength]="maxLength || null"
            [attr.aria-invalid]="!!displayError"
            [attr.aria-describedby]="descricaoAcessivel"
            [value]="value"
            (input)="onInputChange($event)"
            (blur)="onTouched()"
          ></textarea>
        } @else {
          <input
            [id]="inputId"
            [type]="actualType"
            class="br-input-field"
            [class.has-prefix]="prefix"
            [class.has-suffix]="suffix"
            [placeholder]="placeholder"
            [disabled]="isDisabled"
            [attr.maxlength]="maxLength || null"
            [attr.aria-invalid]="!!displayError"
            [attr.aria-describedby]="descricaoAcessivel"
            [value]="value"
            (input)="onInputChange($event)"
            (blur)="onTouched()"
          />
        }

        @if (type === 'password') {
          <button
            type="button"
            class="br-input-button"
            [attr.aria-label]="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            (click)="togglePassword()"
          >
            <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
          </button>
        }

        @if (type === 'search') {
          <button
            type="button"
            class="br-input-button"
            aria-label="Buscar"
            (click)="searchSubmit.emit(value)"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
          </button>
        }

        @if (icon && iconRight && type !== 'password' && type !== 'search') {
          <div class="br-input-icon right">
            <i [class]="'fas fa-' + icon" aria-hidden="true"></i>
          </div>
        }

        @if (suffix) {
          <span class="br-input-addon br-input-suffix">{{ suffix }}</span>
        }
      </div>

      @if (maxLength && (type === 'textarea' || isStandardInput)) {
        <span class="br-input-counter">{{ value?.length || 0 }}/{{ maxLength }}</span>
      }

      @if (displayError) {
        <span
          [id]="inputId + '-error'"
          class="br-input-feedback danger"
          role="alert"
        >
          <i class="fas fa-times-circle" aria-hidden="true"></i>
          <span>{{ displayError }}</span>
        </span>
      }

      @if (successMessage && !displayError) {
        <span
          [id]="inputId + '-feedback'"
          class="br-input-feedback success"
          role="status"
        >
          <i class="fas fa-check-circle" aria-hidden="true"></i>
          <span>{{ successMessage }}</span>
        </span>
      }

      @if (warningMessage && !displayError && !successMessage) {
        <span
          [id]="inputId + '-feedback'"
          class="br-input-feedback warning"
          role="status"
        >
          <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
          <span>{{ warningMessage }}</span>
        </span>
      }

      @if (infoMessage && !displayError && !successMessage && !warningMessage) {
        <span [id]="inputId + '-feedback'" class="br-input-feedback info">
          <i class="fas fa-info-circle" aria-hidden="true"></i>
          <span>{{ infoMessage }}</span>
        </span>
      }
    </div>
  `,
  styles: [`
    /* ═══════════════════════════════════════════════════════════════
       BR-INPUT — Padrão Gov.br Design System
       ═══════════════════════════════════════════════════════════════ */

    .br-input {
      display: flex;
      flex-direction: column;
      font-family: var(--govbr-font-family, 'Rawline', sans-serif);
      margin-bottom: 16px;
    }

    /* Label */
    .br-input-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--govbr-gray-80, var(--govbr-gray-80));
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .br-input-required {
      color: var(--govbr-danger, var(--govbr-danger));
      margin-left: 4px;
    }

    /* Helper text */
    .br-input-helper {
      display: block;
      font-size: 12px;
      color: var(--govbr-gray-60, var(--govbr-gray-60));
      margin-bottom: 8px;
    }

    /* Input group */
    .br-input-group {
      position: relative;
      display: flex;
      align-items: stretch;
    }

    /* Input field */
    .br-input-field {
      flex: 1;
      width: 100%;
      height: var(--govbr-input-medium, 40px);
      padding: 0 16px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      color: var(--govbr-gray-80, var(--govbr-gray-80));
      background-color: var(--govbr-on-primary);
      border: 1px solid var(--govbr-gray-40, var(--govbr-gray-40));
      border-radius: 4px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .br-input-field.has-prefix {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: none;
    }

    .br-input-field.has-suffix {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }

    .br-input-field::placeholder {
      color: var(--govbr-gray-40, var(--govbr-gray-40));
      font-weight: 400;
    }

    .br-input-field:not(:disabled):hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08));
    }

    .br-input-field:focus {
      outline: none;
      border-color: var(--govbr-focus-color, var(--govbr-focus-color));
      box-shadow: 0 0 0 3px rgb(var(--govbr-focus-color-rgb) / 0.45);
    }

    .br-input-field.has-prefix:focus {
      box-shadow: -3px 0 0 0 rgb(var(--govbr-focus-color-rgb) / 0.45), 0 0 0 3px rgb(var(--govbr-focus-color-rgb) / 0.45);
    }

    .br-input-field.has-suffix:focus {
      box-shadow: 3px 0 0 0 rgb(var(--govbr-focus-color-rgb) / 0.45), 0 0 0 3px rgb(var(--govbr-focus-color-rgb) / 0.45);
    }

    .br-input-field:disabled {
      background-color: var(--govbr-gray-5, var(--govbr-gray-2));
      color: var(--govbr-gray-40, var(--govbr-gray-40));
      cursor: not-allowed;
      opacity: 0.7;
    }

    /* Prefix/Suffix addon */
    .br-input-addon {
      display: flex;
      align-items: center;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--govbr-gray-80, var(--govbr-gray-80));
      background-color: var(--govbr-gray-10, var(--govbr-gray-5));
      border: 1px solid var(--govbr-gray-40, var(--govbr-gray-40));
      white-space: nowrap;
    }

    .br-input-prefix {
      border-right: none;
      border-radius: 4px 0 0 4px;
    }

    .br-input-suffix {
      border-left: none;
      border-radius: 0 4px 4px 0;
    }

    /* Textarea */
    textarea.br-input-field {
      height: auto;
      min-height: 80px;
      padding: 12px 16px;
      resize: vertical;
      line-height: 1.5;
    }

    /* Icon */
    .br-input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--govbr-gray-40, var(--govbr-gray-40));
      font-size: 14px;
      pointer-events: none;
      z-index: 1;
    }

    .br-input-icon.right {
      left: auto;
      right: 12px;
    }

    .br-input.has-icon-left .br-input-field {
      padding-left: 40px;
    }

    .br-input.has-icon-right .br-input-field {
      padding-right: 40px;
    }

    /* Button (password toggle, search) */
    .br-input-button {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: var(--govbr-primary, var(--govbr-primary));
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .br-input-button:hover {
      background-color: var(--govbr-primary-lightest, var(--govbr-primary-lightest));
    }

    .br-input-button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgb(var(--govbr-focus-color-rgb) / 0.45);
    }

    .br-input.has-button .br-input-field {
      padding-right: 44px;
    }

    /* Counter */
    .br-input-counter {
      display: block;
      text-align: right;
      font-size: 12px;
      color: var(--govbr-gray-40, var(--govbr-gray-40));
      margin-top: 4px;
    }

    /* Feedback messages */
    .br-input-feedback {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 4px;
    }

    .br-input-feedback i {
      flex-shrink: 0;
    }

    .br-input-feedback.danger {
      color: var(--govbr-danger, var(--govbr-danger));
      background-color: var(--govbr-danger-bg);
    }

    .br-input-feedback.success {
      color: var(--govbr-success, var(--govbr-success));
      background-color: var(--govbr-success-bg);
    }

    .br-input-feedback.warning {
      color: var(--govbr-warning-alt, var(--govbr-warning-dark));
      background-color: var(--govbr-warning-bg);
    }

    .br-input-feedback.info {
      color: var(--govbr-info, var(--govbr-info));
      background-color: var(--govbr-info-bg);
    }

    /* States */
    .br-input.invalid .br-input-field {
      border-color: var(--govbr-danger, var(--govbr-danger));
      border-width: 2px;
    }

    .br-input.invalid .br-input-addon {
      border-color: var(--govbr-danger, var(--govbr-danger));
      border-width: 2px;
    }

    .br-input.invalid .br-input-field:focus {
      border-color: var(--govbr-danger, var(--govbr-danger));
      box-shadow: 0 0 0 3px rgba(229, 34, 7, 0.25);
    }

    .br-input.valid .br-input-field {
      border-color: var(--govbr-success, var(--govbr-success));
      border-width: 2px;
    }

    .br-input.valid .br-input-addon {
      border-color: var(--govbr-success, var(--govbr-success));
      border-width: 2px;
    }

    .br-input.valid .br-input-field:focus {
      border-color: var(--govbr-success, var(--govbr-success));
      box-shadow: 0 0 0 3px rgba(22, 136, 33, 0.25);
    }

    /* Density: Small */
    .br-input.density-small .br-input-field {
      height: var(--govbr-input-small, 32px);
      font-size: 12px;
      padding: 0 12px;
    }

    .br-input.density-small .br-input-addon {
      font-size: 12px;
      padding: 0 10px;
    }

    .br-input.density-small .br-input-label {
      font-size: 12px;
    }

    .br-input.density-small.has-icon-left .br-input-field {
      padding-left: 32px;
    }

    .br-input.density-small .br-input-icon {
      left: 10px;
      font-size: 12px;
    }

    /* Density: Large */
    .br-input.density-large .br-input-field {
      height: var(--govbr-input-large, 48px);
      font-size: 16px;
      padding: 0 20px;
    }

    .br-input.density-large .br-input-addon {
      font-size: 16px;
      padding: 0 16px;
    }

    .br-input.density-large .br-input-label {
      font-size: 16px;
    }

    .br-input.density-large.has-icon-left .br-input-field {
      padding-left: 48px;
    }

    .br-input.density-large .br-input-icon {
      left: 16px;
      font-size: 16px;
    }

    /* Highlight */
    .br-input.highlight .br-input-field {
      height: 56px;
      font-size: 18px;
      font-weight: 600;
      background-color: var(--govbr-gray-2, var(--govbr-gray-2));
      border-color: transparent;
      padding: 0 24px;
    }

    .br-input.highlight .br-input-field:focus {
      background-color: var(--govbr-on-primary);
      border-color: var(--govbr-focus-color, var(--govbr-focus-color));
    }

    /* Inline */
    .br-input.inline {
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }

    .br-input.inline .br-input-label {
      margin-bottom: 0;
      white-space: nowrap;
    }

    .br-input.inline .br-input-group {
      flex: 1;
    }
  `],
})
export class BrInputComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() label?: string;
  @Input() type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'search'
    | 'tel'
    | 'url'
    | 'textarea' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
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
  @Input() errorMessages: Record<string, string> = {};
  @Input() prefix?: string;
  @Input() suffix?: string;

  @Output() searchSubmit = new EventEmitter<string>();

  value: string = '';
  isDisabled = false;
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
  private readonly cdr = inject(ChangeDetectorRef);
  private inscricaoEstado?: Subscription;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    
  }
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get isStandardInput(): boolean {
    return this.type !== 'textarea';
  }

  get actualType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    if (this.type === 'search') return 'text';
    return this.type;
  }

  get containerClasses(): string {
    const classes: string[] = [];

    // Density
    if (this.density !== 'medium') {
      classes.push(`density-${this.density}`);
    }

    // Icon
    if (this.icon && !this.iconRight) {
      classes.push('has-icon-left');
    }
    if (this.icon && this.iconRight) {
      classes.push('has-icon-right');
    }

    // Button (password, search)
    if (this.type === 'password' || this.type === 'search') {
      classes.push('has-button');
    }

    // States
    if (this.displayError) {
      classes.push('invalid');
    } else if (this.successMessage) {
      classes.push('valid');
    }

    // Modifiers
    if (this.highlight) {
      classes.push('highlight');
    }
    if (this.inline) {
      classes.push('inline');
    }

    return classes.join(' ');
  }

  /**
   * Ids que descrevem o campo para o leitor de tela, na mesma precedência que
   * o template usa para escolher qual mensagem exibir. Devolve `null` quando
   * não há nada a descrever — `aria-describedby` apontando para elemento
   * ausente faz o leitor anunciar vazio e esconde o defeito.
   */
  get descricaoAcessivel(): string | null {
    if (this.displayError) return `${this.inputId}-error`;
    if (this.successMessage || this.warningMessage || this.infoMessage) {
      return `${this.inputId}-feedback`;
    }
    if (this.helperText) return `${this.inputId}-helper`;
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

      const defaultMsg = BrInputComponent.defaultErrorMessages[key];
      if (defaultMsg) {
        return typeof defaultMsg === 'function' ? defaultMsg(errors[key]) : defaultMsg;
      }
    }

    return 'Campo inválido';
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
