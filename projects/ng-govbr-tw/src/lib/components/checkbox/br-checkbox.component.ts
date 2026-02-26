import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'br-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrCheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <div [class]="containerClasses">
      <input
        type="checkbox"
        [id]="checkboxId"
        [name]="name || checkboxId"
        [checked]="checked"
        [disabled]="isDisabled"
        [indeterminate]="indeterminate"
        (change)="onCheckChange($event)"
        (blur)="onTouched()"
        [attr.aria-invalid]="errorMessage ? 'true' : null"
        [attr.aria-describedby]="errorMessage ? checkboxId + '-error' : null"
      />
      <label [for]="checkboxId">{{ label }}</label>
    </div>
    @if (errorMessage) {
      <span
        [id]="checkboxId + '-error'"
        class="br-checkbox-feedback danger"
        role="alert"
      >
        <i class="fas fa-times-circle" aria-hidden="true"></i>
        {{ errorMessage }}
      </span>
    }
  `,
  styles: [`
    /* ═══════════════════════════════════════════════════════════════
       BR-CHECKBOX — Padrão Gov.br Design System
       ═══════════════════════════════════════════════════════════════ */

    .br-checkbox {
      --checkbox-size: 24px;
      --checkbox-padding: 8px;
      display: flex;
      position: relative;
    }

    .br-checkbox + .br-checkbox {
      margin-top: 8px;
    }

    /* Hidden input (still focusable) */
    .br-checkbox input {
      margin: 0;
      opacity: 0;
      position: absolute;
    }

    /* Label styling */
    .br-checkbox input + label {
      cursor: pointer;
      display: inline-block;
      font-family: var(--govbr-font-family, 'Rawline', sans-serif);
      font-weight: 500;
      font-size: 14px;
      color: var(--govbr-gray-80, var(--govbr-gray-80));
      margin-bottom: 0;
      min-height: var(--checkbox-size);
      min-width: var(--checkbox-size);
      padding-left: calc(var(--checkbox-padding) + var(--checkbox-size));
      position: relative;
      line-height: var(--checkbox-size);
    }

    /* Checkbox box (::before) */
    .br-checkbox input + label::before {
      background: var(--govbr-bg, #fff);
      border: 1px solid var(--govbr-gray-40, var(--govbr-gray-40));
      border-radius: 4px;
      content: "";
      height: var(--checkbox-size);
      left: 0;
      position: absolute;
      top: 0;
      width: var(--checkbox-size);
      transition: background-color 0.15s, border-color 0.15s;
    }

    /* Checkmark (::after) - Traço azul no fundo branco */
    .br-checkbox input:checked + label::after {
      border: solid var(--govbr-primary, var(--govbr-primary));
      border-width: 0 3px 3px 0;
      content: "";
      height: 12px;
      left: 8px;
      position: absolute;
      top: 4px;
      transform: rotate(45deg);
      width: 8px;
    }

    /* Checked - mantém fundo branco com borda azul */
    .br-checkbox input:checked + label::before {
      border-color: var(--govbr-primary, var(--govbr-primary));
    }

    /* Indeterminate state - fundo azul com traço branco */
    .br-checkbox input:indeterminate + label::before {
      background: var(--govbr-primary, var(--govbr-primary));
      border-color: var(--govbr-primary, var(--govbr-primary));
    }

    .br-checkbox input:indeterminate + label::after {
      border-color: var(--govbr-on-primary);
      border-width: 0 0 3px;
      height: 0;
      left: 6px;
      top: 10px;
      transform: none;
      width: 12px;
      content: "";
      position: absolute;
    }

    /* Hover state */
    .br-checkbox input:hover:not(:disabled) + label::before {
      background-image: linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04));
    }

    /* Focus state */
    .br-checkbox input:focus-visible + label::before,
    .br-checkbox input:focus + label::before {
      border-color: var(--govbr-focus-color, var(--govbr-focus-color)) !important;
      box-shadow: 0 0 0 3px rgb(var(--govbr-focus-color-rgb) / 0.45);
      outline: none;
    }

    /* Disabled state */
    .br-checkbox.disabled input + label,
    .br-checkbox input:disabled + label {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .br-checkbox.disabled input:disabled + label * {
      pointer-events: none;
    }

    /* Invalid state */
    .br-checkbox.invalid input + label::before,
    .br-checkbox.is-invalid input + label::before {
      border-color: var(--govbr-danger-dark);
    }

    .br-checkbox.invalid input:checked + label::after,
    .br-checkbox.is-invalid input:checked + label::after {
      border-color: var(--govbr-danger-dark);
    }

    /* Valid state */
    .br-checkbox.valid input + label::before,
    .br-checkbox.is-valid input + label::before {
      border-color: var(--govbr-success-dark);
    }

    .br-checkbox.valid input:checked + label::after,
    .br-checkbox.is-valid input:checked + label::after {
      border-color: var(--govbr-success-dark);
    }

    /* Small size */
    .br-checkbox.small {
      --checkbox-size: 20px;
    }

    .br-checkbox.small input + label {
      font-size: 12px;
      line-height: 20px;
    }

    .br-checkbox.small input:checked + label::after {
      border-width: 0 2px 2px 0;
      height: 10px;
      left: 7px;
      top: 3px;
      width: 6px;
    }

    .br-checkbox.small input:indeterminate + label::after {
      border-width: 0 0 2px;
      left: 5px;
      top: 8px;
      width: 10px;
    }

    /* Hidden label (icon only) */
    .br-checkbox.hidden-label input + label {
      padding-left: var(--checkbox-size);
      text-indent: -10000px;
      white-space: nowrap;
      width: 0;
      overflow: hidden;
    }

    /* Dark mode / inverted */
    .br-checkbox.inverted,
    .br-checkbox.inverted label,
    .br-checkbox.dark-mode,
    .br-checkbox.dark-mode label {
      color: var(--govbr-on-primary);
    }

    /* Feedback message */
    .br-checkbox-feedback {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      margin-left: 32px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 4px;
    }

    .br-checkbox-feedback i {
      flex-shrink: 0;
    }

    .br-checkbox-feedback.danger {
      color: var(--govbr-danger-dark);
      background-color: var(--govbr-danger-bg);
    }

    .br-checkbox-feedback.success {
      color: var(--govbr-success-dark);
      background-color: var(--govbr-success-bg);
    }

    .br-checkbox-feedback.warning {
      color: var(--govbr-warning-alt, var(--govbr-warning-dark));
      background-color: var(--govbr-warning-bg);
    }

    .br-checkbox-feedback.info {
      color: var(--govbr-info, var(--govbr-info));
      background-color: var(--govbr-info-bg);
    }
  `],
})
export class BrCheckboxComponent implements ControlValueAccessor, OnChanges {
  /** Label do checkbox */
  @Input() label = '';

  /** Nome do input */
  @Input() name?: string;

  /** Estado indeterminado */
  @Input() indeterminate = false;

  /** Mensagem de erro */
  @Input() errorMessage?: string;

  /** @deprecated Use errorMessage */
  @Input() set error(value: string | undefined) {
    this.errorMessage = value;
  }

  /** Tamanho: default ou small */
  @Input() size: 'default' | 'small' = 'default';

  /** Estado de validação */
  @Input() state: 'default' | 'valid' | 'invalid' = 'default';

  /** Ocultar label (apenas checkbox visual) */
  @Input() hiddenLabel = false;

  /** Modo escuro/invertido */
  @Input() inverted = false;

  /** Desabilitado */
  @Input() disabled = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;
  isDisabled = false;

  ngOnChanges(): void {
    this.isDisabled = this.disabled;
  }

  private static nextId = 0;
  checkboxId = `br-checkbox-${BrCheckboxComponent.nextId++}`;

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  get containerClasses(): string {
    const classes = ['br-checkbox'];

    if (this.size === 'small') {
      classes.push('small');
    }

    if (this.isDisabled) {
      classes.push('disabled');
    }

    if (this.state === 'invalid' || this.errorMessage) {
      classes.push('invalid');
    } else if (this.state === 'valid') {
      classes.push('valid');
    }

    if (this.hiddenLabel) {
      classes.push('hidden-label');
    }

    if (this.inverted) {
      classes.push('inverted');
    }

    return classes.join(' ');
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onCheckChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = false;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
  }
}
