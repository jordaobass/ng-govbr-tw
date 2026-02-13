import {
  ChangeDetectionStrategy,
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
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BrAnimationService } from '../../animations/animation.service';

/**
 * BrTimepickerComponent — Time picker following GovBR DS pattern.
 *
 * Usage:
 * ```html
 * <br-timepicker label="Horário" [(ngModel)]="time"></br-timepicker>
 * ```
 */
@Component({
  selector: 'br-timepicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    @keyframes br-timepicker-dropdown {
      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrTimepickerComponent),
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
    
      <div class="relative">
        <input
          [id]="inputId"
          type="text"
          [placeholder]="placeholder"
          [value]="displayValue"
          [disabled]="isDisabled"
          (input)="onInputChange($event)"
          (focus)="panelOpen = true"
          [class]="inputClasses"
          [attr.aria-expanded]="panelOpen"
          autocomplete="off"
          inputmode="numeric"
          maxlength="5"
          />
        <button
          type="button"
          class="absolute right-0 top-0 h-full px-3 text-govbr-primary hover:text-govbr-primary-dark"
          (click)="panelOpen = !panelOpen"
          [disabled]="isDisabled"
          aria-label="Abrir seletor de hora"
          tabindex="-1"
          >
          <i class="fa-solid fa-clock"></i>
        </button>
      </div>
    
      @if (hint && !error) {
        <p class="mt-1 text-xs text-govbr-gray-60">{{ hint }}</p>
      }
      @if (error) {
        <p class="mt-1 text-xs text-govbr-danger" role="alert">{{ error }}</p>
      }
    
      <!-- Time panel -->
      @if (panelOpen) {
        <div
          class="absolute z-50 mt-1 bg-govbr-bg border border-govbr-gray-10 rounded shadow-lg p-3 w-48"
          role="listbox"
          aria-label="Selecionar horário"
          [style.animation]="panelAnimation"
          >
          <div class="flex gap-2">
            <!-- Hours -->
            <div class="flex-1">
              <span class="block text-xs font-semibold text-govbr-gray-60 mb-1 text-center">Hora</span>
              <div class="max-h-40 overflow-y-auto">
                @for (h of hours; track h) {
                  <button
                    type="button"
                    [class]="getTimeOptionClasses(h === selectedHour)"
                    (click)="selectHour(h)"
                    role="option"
                    [attr.aria-selected]="h === selectedHour"
                    >
                    {{ h | number:'2.0-0' }}
                  </button>
                }
              </div>
            </div>
            <!-- Minutes -->
            <div class="flex-1">
              <span class="block text-xs font-semibold text-govbr-gray-60 mb-1 text-center">Min</span>
              <div class="max-h-40 overflow-y-auto">
                @for (m of minutes; track m) {
                  <button
                    type="button"
                    [class]="getTimeOptionClasses(m === selectedMinute)"
                    (click)="selectMinute(m)"
                    role="option"
                    [attr.aria-selected]="m === selectedMinute"
                    >
                    {{ m | number:'2.0-0' }}
                  </button>
                }
              </div>
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-govbr-gray-5 text-center">
            <button
              type="button"
              class="text-xs text-govbr-primary font-semibold hover:underline"
              (click)="selectNow()"
              >
              Agora
            </button>
          </div>
        </div>
      }
    </div>
    `,
})
export class BrTimepickerComponent implements ControlValueAccessor {
  private readonly animationService = inject(BrAnimationService);

  @Input() label?: string;
  @Input() placeholder = 'HH:MM';
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required = false;
  @Input() block = true;
  @Input() step = 5;
  @Input() inputId = `br-timepicker-${Math.random().toString(36).slice(2, 8)}`;

  @Output() timeChange = new EventEmitter<string>();

  panelOpen = false;
  selectedHour: number | null = null;
  selectedMinute: number | null = null;
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private elRef = inject(ElementRef);

  get panelAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-timepicker-dropdown 200ms ease-out forwards';
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.panelOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.panelOpen = false;
  }

  get hours(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  get minutes(): number[] {
    const result: number[] = [];
    for (let m = 0; m < 60; m += this.step) {
      result.push(m);
    }
    return result;
  }

  get displayValue(): string {
    if (this.selectedHour === null || this.selectedMinute === null) return '';
    return `${String(this.selectedHour).padStart(2, '0')}:${String(this.selectedMinute).padStart(2, '0')}`;
  }

  get inputClasses(): string {
    const base = 'w-full px-4 pr-10 h-[var(--govbr-input-medium)] text-govbr-base font-rawline govbr-input';
    const statusCls = this.error ? 'govbr-input--danger' : '';
    return `${base} ${statusCls}`;
  }

  getTimeOptionClasses(selected: boolean): string {
    const base = 'block w-full text-center py-1 text-sm rounded transition-colors';
    if (selected) return `${base} bg-govbr-primary text-govbr-on-primary font-semibold`;
    return `${base} text-govbr-gray-80 hover:bg-govbr-gray-2 cursor-pointer`;
  }

  selectHour(h: number): void {
    this.selectedHour = h;
    if (this.selectedMinute === null) this.selectedMinute = 0;
    this.emitValue();
  }

  selectMinute(m: number): void {
    this.selectedMinute = m;
    if (this.selectedHour === null) this.selectedHour = 0;
    this.emitValue();
    this.panelOpen = false;
  }

  selectNow(): void {
    const now = new Date();
    this.selectedHour = now.getHours();
    this.selectedMinute = now.getMinutes();
    this.emitValue();
    this.panelOpen = false;
  }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const match = val.match(/^(\d{2}):(\d{2})$/);
    if (match) {
      const h = +match[1];
      const m = +match[2];
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        this.selectedHour = h;
        this.selectedMinute = m;
        this.emitValue();
      }
    }
  }

  private emitValue(): void {
    const val = this.displayValue;
    this.onChange(val);
    this.onTouched();
    this.timeChange.emit(val);
  }

  // ControlValueAccessor
  writeValue(val: string): void {
    if (!val) {
      this.selectedHour = null;
      this.selectedMinute = null;
      return;
    }
    const match = val.match(/^(\d{2}):(\d{2})$/);
    if (match) {
      this.selectedHour = +match[1];
      this.selectedMinute = +match[2];
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
