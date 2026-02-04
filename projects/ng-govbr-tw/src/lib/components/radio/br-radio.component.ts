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
  selector: 'br-radio-group',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrRadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <fieldset class="border-none p-0 m-0 font-rawline">
      @if (legend) {
        <legend
          class="block text-govbr-sm font-semibold text-govbr-gray-80 mb-2"
          >
          {{ legend }}
          @if (required) {
            <span class="text-govbr-danger ml-0.5">*</span>
          }
        </legend>
      }
    
      <div [class]="groupClasses">
        @for (option of options; track option) {
          <label
            [class]="getOptionClasses(option)"
            [for]="name + '-' + option.value"
            >
            <input
              type="radio"
              [id]="name + '-' + option.value"
              [name]="name"
              [value]="option.value"
              [checked]="value === option.value"
              [disabled]="isDisabled || option.disabled"
              class="sr-only peer govbr-focus-checkbox"
              (change)="select(option.value)"
              (blur)="onTouched()"
              />
            <span [class]="getRadioClasses(option)">
              @if (value === option.value) {
                <span
                  [class]="bulletClasses"
                ></span>
              }
            </span>
            <span [class]="labelClasses">{{ option.label }}</span>
          </label>
        }
      </div>
    
      @if (error) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-danger">
          <i class="fa-solid fa-times-circle mr-1"></i>{{ error }}
        </span>
      }
    </fieldset>
    `,
})
export class BrRadioGroupComponent implements ControlValueAccessor {
  @Input() legend?: string;
  @Input() name = `br-radio-${BrRadioGroupComponent.nextId++}`;
  @Input() options: BrRadioOption[] = [];
  @Input() required = false;
  @Input() error?: string;
  @Input() inline = false;
  @Input() size: 'default' | 'small' = 'default';
  @Input() state: 'default' | 'valid' | 'invalid' = 'default';

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  isDisabled = false;

  private static nextId = 0;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get groupClasses(): string {
    return this.inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-3';
  }

  getOptionClasses(option: BrRadioOption): string {
    const base = 'inline-flex items-center font-rawline cursor-pointer select-none group';
    const disabled = this.isDisabled || option.disabled ? 'opacity-50 cursor-not-allowed' : '';
    return [base, disabled].filter(Boolean).join(' ');
  }

  getRadioClasses(option: BrRadioOption): string {
    const sizeMap: Record<string, string> = {
      default: 'w-6 h-6',
      small: 'w-5 h-5',
    };

    const borderColorMap: Record<string, string> = {
      default: 'border-govbr-gray-40',
      valid: 'border-govbr-success',
      invalid: 'border-govbr-danger',
    };

    const activeBorder = this.error ? 'border-govbr-danger' : borderColorMap[this.state];
    const isSelected = this.value === option.value;

    const base = [
      'flex items-center justify-center flex-shrink-0 rounded-full border-2 transition-colors',
      sizeMap[this.size],
    ].join(' ');

    const checkedCls = isSelected
      ? 'border-govbr-primary'
      : `${activeBorder} group-hover:border-govbr-primary`;

    return [base, checkedCls].join(' ');
  }

  get bulletClasses(): string {
    const sizeMap: Record<string, string> = {
      default: 'w-4 h-4',
      small: 'w-2.5 h-2.5',
    };
    return `block rounded-full bg-govbr-primary ${sizeMap[this.size]}`;
  }

  get labelClasses(): string {
    const sizeMap: Record<string, string> = {
      default: 'ml-3 text-govbr-base',
      small: 'ml-2 text-govbr-sm',
    };
    return `font-medium text-govbr-gray-80 ${sizeMap[this.size]}`;
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

  select(val: string): void {
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }
}

export interface BrRadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}
