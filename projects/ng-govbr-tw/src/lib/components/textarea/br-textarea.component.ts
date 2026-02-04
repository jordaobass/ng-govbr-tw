import {
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'br-textarea',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrTextareaComponent),
      multi: true,
    },
  ],
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
        <span class="block text-govbr-xs text-govbr-gray-60 mb-1">
          {{ helperText }}
        </span>
      }
    
      <textarea
        [id]="textareaId"
        [placeholder]="placeholder"
        [disabled]="isDisabled"
        [rows]="rows"
        [attr.maxlength]="maxLength || null"
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
      @if (error) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-danger">
          <i class="fa-solid fa-times-circle mr-1"></i>{{ error }}
        </span>
      }
    
      @if (successMessage && !error) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-success">
          <i class="fa-solid fa-check-circle mr-1"></i>{{ successMessage }}
        </span>
      }
    
      @if (warningMessage && !error && !successMessage) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-warning">
          <i class="fa-solid fa-exclamation-triangle mr-1"></i>{{ warningMessage }}
        </span>
      }
    
      @if (infoMessage && !error && !successMessage && !warningMessage) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-info">
          <i class="fa-solid fa-info-circle mr-1"></i>{{ infoMessage }}
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
  @Input() error?: string;
  @Input() successMessage?: string;
  @Input() warningMessage?: string;
  @Input() infoMessage?: string;
  @Input() density: 'small' | 'medium' | 'large' = 'medium';
  @Input() resizable: 'none' | 'vertical' | 'both' = 'vertical';

  value = '';
  isDisabled = false;

  private static nextId = 0;
  textareaId = `br-textarea-${BrTextareaComponent.nextId++}`;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get isOverLimit(): boolean {
    return !!this.maxLength && (this.value?.length || 0) >= this.maxLength;
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

    const statusCls = this.error
      ? 'govbr-input--danger'
      : this.successMessage
        ? 'govbr-input--success'
        : this.warningMessage
          ? 'govbr-input--warning'
          : '';

    const disabledCls = this.isDisabled
      ? 'bg-govbr-gray-2 text-govbr-gray-40 cursor-not-allowed'
      : 'bg-white text-govbr-gray-80';

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
