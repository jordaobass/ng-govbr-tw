import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

/**
 * BrDatepickerComponent — Date picker following GovBR DS pattern.
 *
 * Usage:
 * ```html
 * <br-datepicker label="Data de nascimento" [(ngModel)]="date"></br-datepicker>
 * ```
 */
@Component({
  selector: 'br-datepicker',
  standalone: true,
  imports: [FormsModule],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrDatepickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="font-rawline relative" [class.w-full]="block">
      @if (label) {
        <label [for]="inputId" class="block text-sm font-semibold text-govbr-gray-80 mb-1">
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger ml-0.5">*</span>
          }
        </label>
      }
    
      <!-- Input with calendar icon -->
      <div class="relative">
        <input
          [id]="inputId"
          type="text"
          [placeholder]="placeholder"
          [value]="displayValue"
          [disabled]="isDisabled"
          (input)="onInputChange($event)"
          (focus)="openCalendar()"
          [class]="inputClasses"
          [attr.aria-expanded]="calendarOpen"
          aria-haspopup="dialog"
          autocomplete="off"
          inputmode="numeric"
          [attr.aria-invalid]="error ? 'true' : null"
          />
        <button
          type="button"
          class="absolute right-0 top-0 h-full px-3 text-govbr-primary hover:text-govbr-primary-dark"
          (click)="toggleCalendar()"
          [disabled]="isDisabled"
          aria-label="Abrir calendário"
          tabindex="-1"
          >
          <i class="fa-solid fa-calendar-days"></i>
        </button>
      </div>
    
      @if (hint && !error) {
        <p class="mt-1 text-xs text-govbr-gray-60">{{ hint }}</p>
      }
      @if (error) {
        <p class="mt-1 text-xs text-govbr-danger" role="alert">{{ error }}</p>
      }
    
      <!-- Calendar dropdown -->
      @if (calendarOpen) {
        <div
          class="absolute z-50 mt-1 bg-white border border-govbr-gray-10 rounded shadow-lg p-3 w-72"
          role="dialog"
          aria-label="Selecionar data"
          >
          <!-- Month/Year navigation -->
          <div class="flex items-center justify-between mb-3">
            <button
              type="button"
              (click)="prevMonth()"
              class="p-1 hover:bg-govbr-gray-2 rounded text-govbr-primary"
              aria-label="Mês anterior"
              >
              <i class="fa-solid fa-chevron-left text-sm"></i>
            </button>
            <span class="text-sm font-semibold text-govbr-gray-80">
              {{ monthNames[viewMonth] }} {{ viewYear }}
            </span>
            <button
              type="button"
              (click)="nextMonth()"
              class="p-1 hover:bg-govbr-gray-2 rounded text-govbr-primary"
              aria-label="Próximo mês"
              >
              <i class="fa-solid fa-chevron-right text-sm"></i>
            </button>
          </div>
          <!-- Day headers -->
          <div class="grid grid-cols-7 gap-0 mb-1">
            @for (d of dayNames; track d) {
              <span
                class="text-center text-xs font-medium text-govbr-gray-60 py-1"
                >
                {{ d }}
              </span>
            }
          </div>
          <!-- Days grid -->
          <div class="grid grid-cols-7 gap-0">
            @for (day of calendarDays; track day) {
              <button
                type="button"
                [disabled]="!day.current"
                (click)="selectDay(day)"
                [class]="getDayClasses(day)"
                >
                {{ day.day }}
              </button>
            }
          </div>
          <!-- Today button -->
          <div class="mt-2 pt-2 border-t border-govbr-gray-5 text-center">
            <button
              type="button"
              class="text-xs text-govbr-primary font-semibold hover:underline"
              (click)="selectToday()"
              >
              Hoje
            </button>
          </div>
        </div>
      }
    </div>
    `,
})
export class BrDatepickerComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = 'dd/mm/aaaa';
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required = false;
  @Input() block = true;
  @Input() inputId = `br-datepicker-${Math.random().toString(36).slice(2, 8)}`;

  @Output() dateChange = new EventEmitter<string>();

  calendarOpen = false;
  viewMonth = new Date().getMonth();
  viewYear = new Date().getFullYear();
  selectedDate: Date | null = null;
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  private elRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.calendarOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.calendarOpen = false;
  }

  get displayValue(): string {
    if (!this.selectedDate) return '';
    const d = this.selectedDate;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  get inputClasses(): string {
    const base = 'w-full px-4 pr-10 h-[var(--govbr-input-medium)] text-govbr-base font-rawline govbr-input';
    const statusCls = this.error ? 'govbr-input--danger' : '';
    return `${base} ${statusCls}`;
  }

  get calendarDays(): { day: number; current: boolean; selected: boolean; today: boolean }[] {
    const days: { day: number; current: boolean; selected: boolean; today: boolean }[] = [];
    const firstDay = new Date(this.viewYear, this.viewMonth, 1).getDay();
    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(this.viewYear, this.viewMonth, 0).getDate();
    const today = new Date();

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, current: false, selected: false, today: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected =
        this.selectedDate?.getDate() === d &&
        this.selectedDate?.getMonth() === this.viewMonth &&
        this.selectedDate?.getFullYear() === this.viewYear;
      const isToday =
        today.getDate() === d &&
        today.getMonth() === this.viewMonth &&
        today.getFullYear() === this.viewYear;
      days.push({ day: d, current: true, selected: isSelected, today: isToday });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, current: false, selected: false, today: false });
    }

    return days;
  }

  getDayClasses(day: { day: number; current: boolean; selected: boolean; today: boolean }): string {
    const base = 'w-9 h-9 text-xs rounded-full flex items-center justify-center transition-colors';
    if (!day.current) return `${base} text-govbr-gray-20 cursor-default`;
    if (day.selected) return `${base} bg-govbr-primary text-white font-semibold`;
    if (day.today) return `${base} border border-govbr-primary text-govbr-primary font-semibold hover:bg-govbr-primary-lightest cursor-pointer`;
    return `${base} text-govbr-gray-80 hover:bg-govbr-gray-2 cursor-pointer`;
  }

  openCalendar(): void {
    if (!this.isDisabled) this.calendarOpen = true;
  }

  toggleCalendar(): void {
    if (!this.isDisabled) this.calendarOpen = !this.calendarOpen;
  }

  prevMonth(): void {
    if (this.viewMonth === 0) {
      this.viewMonth = 11;
      this.viewYear--;
    } else {
      this.viewMonth--;
    }
  }

  nextMonth(): void {
    if (this.viewMonth === 11) {
      this.viewMonth = 0;
      this.viewYear++;
    } else {
      this.viewMonth++;
    }
  }

  selectDay(day: { day: number; current: boolean }): void {
    if (!day.current) return;
    this.selectedDate = new Date(this.viewYear, this.viewMonth, day.day);
    this.calendarOpen = false;
    this.emitValue();
  }

  selectToday(): void {
    const today = new Date();
    this.selectedDate = today;
    this.viewMonth = today.getMonth();
    this.viewYear = today.getFullYear();
    this.calendarOpen = false;
    this.emitValue();
  }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const d = new Date(+match[3], +match[2] - 1, +match[1]);
      if (!isNaN(d.getTime())) {
        this.selectedDate = d;
        this.viewMonth = d.getMonth();
        this.viewYear = d.getFullYear();
        this.emitValue();
      }
    }
  }

  private emitValue(): void {
    const val = this.displayValue;
    this.onChange(val);
    this.onTouched();
    this.dateChange.emit(val);
  }

  // ControlValueAccessor
  writeValue(val: string): void {
    if (!val) {
      this.selectedDate = null;
      return;
    }
    const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      this.selectedDate = new Date(+match[3], +match[2] - 1, +match[1]);
      this.viewMonth = this.selectedDate.getMonth();
      this.viewYear = this.selectedDate.getFullYear();
    }
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
