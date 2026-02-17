import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BrDatepickerComponent } from '../datepicker/br-datepicker.component';
import { BrTimepickerComponent } from '../timepicker/br-timepicker.component';

/**
 * BrDatetimepickerComponent — Combined date + time picker.
 *
 * Usage:
 * ```html
 * <br-datetimepicker label="Data e hora" [(ngModel)]="datetime"></br-datetimepicker>
 * ```
 *
 * Value format: "dd/mm/aaaa HH:MM"
 */
@Component({
  selector: 'br-datetimepicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, BrDatepickerComponent, BrTimepickerComponent],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrDatetimepickerComponent),
      multi: true,
    },
  ],
  template: `
    <fieldset class="font-rawline" [class.w-full]="block">
      @if (label) {
        <legend class="block text-sm font-semibold text-govbr-gray-80 mb-2">
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger-dark ml-0.5">*</span>
          }
        </legend>
      }
    
      <div [class]="layoutClasses">
        <br-datepicker
          [label]="dateLabel"
          [placeholder]="datePlaceholder"
          [required]="required"
          [error]="dateError"
          [block]="true"
          [ngModel]="dateValue"
          (dateChange)="onDateChange($event)"
        ></br-datepicker>
    
        <br-timepicker
          [label]="timeLabel"
          [placeholder]="timePlaceholder"
          [required]="required"
          [error]="timeError"
          [step]="minuteStep"
          [block]="true"
          [ngModel]="timeValue"
          (timeChange)="onTimeChange($event)"
        ></br-timepicker>
      </div>
    
      @if (hint && !dateError && !timeError) {
        <p class="mt-1 text-xs text-govbr-gray-60">{{ hint }}</p>
      }
    </fieldset>
    `,
})
export class BrDatetimepickerComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() dateLabel = 'Data';
  @Input() timeLabel = 'Hora';
  @Input() datePlaceholder = 'dd/mm/aaaa';
  @Input() timePlaceholder = 'HH:MM';
  @Input() hint?: string;
  @Input() dateError?: string;
  @Input() timeError?: string;
  @Input() required = false;
  @Input() block = true;
  @Input() minuteStep = 5;
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';

  @Output() datetimeChange = new EventEmitter<string>();

  dateValue = '';
  timeValue = '';
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get layoutClasses(): string {
    return this.layout === 'horizontal'
      ? 'flex flex-col sm:flex-row gap-3'
      : 'flex flex-col gap-3';
  }

  get combinedValue(): string {
    if (!this.dateValue || !this.timeValue) return '';
    return `${this.dateValue} ${this.timeValue}`;
  }

  onDateChange(date: string): void {
    this.dateValue = date;
    this.emitValue();
  }

  onTimeChange(time: string): void {
    this.timeValue = time;
    this.emitValue();
  }

  private emitValue(): void {
    const val = this.combinedValue;
    if (val) {
      this.onChange(val);
      this.onTouched();
      this.datetimeChange.emit(val);
    }
  }

  // ControlValueAccessor
  writeValue(val: string): void {
    if (!val) {
      this.dateValue = '';
      this.timeValue = '';
      return;
    }
    const parts = val.split(' ');
    this.dateValue = parts[0] || '';
    this.timeValue = parts[1] || '';
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
}
