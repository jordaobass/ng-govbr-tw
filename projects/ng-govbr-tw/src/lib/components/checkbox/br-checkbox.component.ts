import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'br-checkbox',
  standalone: true,
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
    <label
      [class]="containerClasses"
      [for]="checkboxId"
      >
      <input
        type="checkbox"
        [id]="checkboxId"
        [checked]="checked"
        [disabled]="isDisabled"
        [indeterminate]="indeterminate"
        [class]="inputClasses"
        (change)="onCheckChange($event)"
        (blur)="onTouched()"
        />
      <span [class]="checkmarkClasses">
        <!-- Checkmark icon -->
        @if (checked && !indeterminate) {
          <svg
            class="w-3 h-3 text-white"
            viewBox="0 0 12 10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            >
            <polyline points="1.5 5 4.5 8 10.5 2" />
          </svg>
        }
        <!-- Indeterminate icon -->
        @if (indeterminate) {
          <svg
            class="w-3 h-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            >
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
        }
      </span>
      @if (label) {
        <span
          [class]="labelClasses"
          >
          {{ label }}
        </span>
      }
    </label>
    
    @if (error) {
      <span class="block mt-1 text-govbr-sm text-govbr-danger ml-8">
        <i class="fa-solid fa-times-circle mr-1"></i>{{ error }}
      </span>
    }
    `,
})
export class BrCheckboxComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() indeterminate = false;
  @Input() error?: string;
  @Input() size: 'default' | 'small' = 'default';
  @Input() state: 'default' | 'valid' | 'invalid' = 'default';

  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;
  isDisabled = false;

  private static nextId = 0;
  checkboxId = `br-checkbox-${BrCheckboxComponent.nextId++}`;

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  get containerClasses(): string {
    const base = 'inline-flex items-center font-rawline cursor-pointer select-none group';
    const disabledCls = this.isDisabled ? 'opacity-50 cursor-not-allowed' : '';
    return [base, disabledCls].filter(Boolean).join(' ');
  }

  get inputClasses(): string {
    return 'sr-only peer govbr-focus-checkbox';
  }

  get checkmarkClasses(): string {
    const sizeMap: Record<string, string> = {
      default: 'w-5 h-5',
      small: 'w-4 h-4',
    };

    const borderColorMap: Record<string, string> = {
      default: 'border-govbr-gray-40',
      valid: 'border-govbr-success',
      invalid: 'border-govbr-danger',
    };

    const activeBorder = this.error ? 'border-govbr-danger' : borderColorMap[this.state];

    const base = [
      'flex items-center justify-center flex-shrink-0 rounded-sm border-2 transition-colors',
      sizeMap[this.size],
    ].join(' ');

    const checkedCls =
      this.checked || this.indeterminate
        ? 'bg-govbr-primary border-govbr-primary'
        : `bg-white ${activeBorder} group-hover:border-govbr-primary`;

    return [base, checkedCls].filter(Boolean).join(' ');
  }

  get labelClasses(): string {
    const base = 'font-medium text-govbr-gray-80';
    const sizeMap: Record<string, string> = {
      default: 'ml-3 text-govbr-base',
      small: 'ml-2 text-govbr-sm',
    };
    return [base, sizeMap[this.size]].join(' ');
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
