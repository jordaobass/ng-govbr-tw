import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { ControlValueAccessor, FormsModule, NgControl, ValidationErrors } from '@angular/forms';
import { BrAnimationService } from '../../animations/animation.service';

@Component({
  selector: 'br-select',
  standalone: true,
  imports: [FormsModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    @keyframes br-select-dropdown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  template: `
    <div class="relative font-rawline mb-4" #selectContainer>
      @if (label) {
        <label
          [for]="selectId"
          class="block text-govbr-sm font-semibold text-govbr-gray-80 mb-1"
          >
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger ml-0.5">*</span>
          }
        </label>
      }
    
      @if (helperText && !error) {
        <span class="block text-govbr-xs text-govbr-gray-60 mb-1">
          {{ helperText }}
        </span>
      }
    
      <!-- Trigger -->
      <button
        type="button"
        [id]="selectId"
        [disabled]="isDisabled"
        [class]="triggerClasses"
        (click)="toggle()"
        (blur)="onBlur()"
        >
        <span
          class="truncate min-w-0 flex-1 text-left"
          [class.text-govbr-gray-80]="displayValue"
          [class.text-govbr-gray-40]="!displayValue"
        >
          {{ displayValue || placeholder }}
        </span>
        <i
          class="fa-solid fa-chevron-down text-govbr-primary transition-transform duration-200 flex-shrink-0 ml-2"
          [class.rotate-180]="expanded"
        ></i>
      </button>
    
      <!-- Dropdown -->
      @if (expanded) {
        <div
          class="absolute left-0 right-0 z-10 mt-1 bg-white border border-govbr-gray-10 shadow-lg max-h-[404px] overflow-y-auto rounded"
          [style.animation]="dropdownAnimation"
          >
          <!-- Search filter -->
          @if (searchable) {
            <div class="p-2 border-b border-govbr-gray-10">
              <input
                type="text"
                class="w-full px-3 py-2 text-govbr-sm border border-govbr-gray-20 rounded govbr-focus-ring"
                [placeholder]="searchPlaceholder"
                [(ngModel)]="searchTerm"
                (click)="$event.stopPropagation()"
                />
            </div>
          }
          <!-- Options -->
          <ul role="listbox" class="py-1">
            @for (option of filteredOptions; track option) {
              <li
                role="option"
                tabindex="0"
                [attr.aria-selected]="isSelected(option.value)"
                [class]="getOptionClasses(option)"
                (click)="selectOption(option); $event.stopPropagation()"
                (keydown.enter)="selectOption(option); $event.stopPropagation()"
                >
                <!-- Multiple: checkbox -->
                @if (multiple) {
                  <span
                    class="flex items-center justify-center flex-shrink-0 w-5 h-5 mr-3 border-2 rounded-sm transition-colors"
                    [class.bg-govbr-primary]="isSelected(option.value)"
                    [class.border-govbr-primary]="isSelected(option.value)"
                    [class.border-govbr-gray-40]="!isSelected(option.value)"
                    >
                    @if (isSelected(option.value)) {
                      <svg
                        class="w-3 h-3 text-white" viewBox="0 0 12 10"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"
                        >
                        <polyline points="1.5 5 4.5 8 10.5 2" />
                      </svg>
                    }
                  </span>
                }
                <span class="truncate">{{ option.label }}</span>
              </li>
            }
            @if (filteredOptions.length === 0) {
              <li class="px-4 py-3 text-govbr-sm text-govbr-gray-40 text-center">
                Nenhum resultado encontrado
              </li>
            }
          </ul>
        </div>
      }
    
      <!-- Error -->
      @if (displayError) {
        <span class="flex items-center mt-1 text-govbr-sm text-govbr-danger">
          <i class="fa-solid fa-times-circle mr-1"></i>{{ displayError }}
        </span>
      }
    </div>
    `,
})
export class BrSelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = 'Selecione';
  @Input() helperText?: string;
  @Input() options: BrSelectOption[] = [];
  @Input() required = false;
  /** Mensagem de erro manual (sobrescreve erros automáticos do validator) */
  @Input() error?: string;
  @Input() multiple = false;
  @Input() searchable = false;
  @Input() searchPlaceholder = 'Buscar...';
  @Input() density: 'small' | 'medium' | 'large' = 'medium';

  /** Mensagens customizadas para erros de validação */
  @Input() errorMessages: Record<string, string> = {};

  @Output() selectionChange = new EventEmitter<string | string[]>();

  expanded = false;
  searchTerm = '';
  isDisabled = false;

  // Single value or array for multiple
  private singleValue = '';
  private multipleValues: string[] = [];

  private static nextId = 0;
  selectId = `br-select-${BrSelectComponent.nextId++}`;

  onChange: (value: string | string[]) => void = () => {};
  onTouched: () => void = () => {};

  private elementRef = inject(ElementRef);
  private readonly animationService = inject(BrAnimationService);

  get dropdownAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-select-dropdown 200ms ease-out forwards';
  }

  private static readonly defaultErrorMessages: Record<string, string> = {
    required: 'Campo obrigatório',
  };

  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Retorna a mensagem de erro a ser exibida.
   */
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
      const defaultMsg = BrSelectComponent.defaultErrorMessages[key];
      if (defaultMsg) {
        return defaultMsg;
      }
    }
    return 'Campo inválido';
  }

  get displayValue(): string {
    if (this.multiple) {
      if (this.multipleValues.length === 0) return '';
      const labels = this.multipleValues
        .map(v => this.options.find(o => o.value === v)?.label)
        .filter(Boolean);
      return labels.join(', ');
    }
    return this.options.find(o => o.value === this.singleValue)?.label || '';
  }

  get filteredOptions(): BrSelectOption[] {
    if (!this.searchTerm) return this.options;
    const term = this.searchTerm.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(term));
  }

  get triggerClasses(): string {
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
      'w-full flex items-center justify-between px-4 font-rawline govbr-input overflow-hidden',
      densityStyles[this.density],
      densityHeights[this.density],
    ].join(' ');

    const statusCls = this.displayError
      ? 'govbr-input--danger'
      : '';

    const disabledCls = this.isDisabled
      ? 'bg-govbr-gray-2 text-govbr-gray-40 cursor-not-allowed'
      : 'bg-white cursor-pointer hover:bg-[rgba(0,0,0,0.08)]';

    return [base, statusCls, disabledCls].filter(Boolean).join(' ');
  }

  getOptionClasses(option: BrSelectOption): string {
    const base = 'flex items-center px-4 py-2.5 text-govbr-sm text-govbr-gray-80 cursor-pointer transition-colors hover:bg-govbr-gray-2';
    const selected = this.isSelected(option.value) && !this.multiple
      ? 'bg-govbr-primary-lightest font-semibold'
      : '';
    const disabled = option.disabled ? 'opacity-50 cursor-not-allowed' : '';
    return [base, selected, disabled].filter(Boolean).join(' ');
  }

  isSelected(value: string): boolean {
    if (this.multiple) {
      return this.multipleValues.includes(value);
    }
    return this.singleValue === value;
  }

  toggle(): void {
    if (!this.isDisabled) {
      this.expanded = !this.expanded;
      if (!this.expanded) {
        this.searchTerm = '';
      }
    }
  }

  selectOption(option: BrSelectOption): void {
    if (option.disabled) return;

    if (this.multiple) {
      const idx = this.multipleValues.indexOf(option.value);
      if (idx >= 0) {
        this.multipleValues = this.multipleValues.filter(v => v !== option.value);
      } else {
        this.multipleValues = [...this.multipleValues, option.value];
      }
      this.onChange(this.multipleValues);
      this.selectionChange.emit(this.multipleValues);
    } else {
      this.singleValue = option.value;
      this.expanded = false;
      this.searchTerm = '';
      this.onChange(this.singleValue);
      this.selectionChange.emit(this.singleValue);
    }
  }

  onBlur(): void {
    // Delay to allow click on option
    setTimeout(() => {
      if (!this.elementRef.nativeElement.contains(document.activeElement)) {
        this.expanded = false;
        this.searchTerm = '';
        this.onTouched();
      }
    }, 200);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.expanded = false;
      this.searchTerm = '';
    }
  }

  writeValue(value: string | string[]): void {
    if (this.multiple) {
      this.multipleValues = Array.isArray(value) ? value : [];
    } else {
      this.singleValue = (value as string) ?? '';
    }
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}

export interface BrSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}
