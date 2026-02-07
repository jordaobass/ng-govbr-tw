import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'br-chip',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="inline-flex items-center gap-1.5 font-rawline rounded-full transition-all duration-200"
      [class]="chipClasses"
      [attr.role]="selectable ? 'button' : null"
      [attr.aria-pressed]="selectable ? selected : null"
      [attr.tabindex]="selectable ? 0 : null"
      (click)="handleClick()"
      (keydown.space)="handleClick(); $event.preventDefault()"
      (keydown.enter)="handleClick()"
    >
      @if (icon) {
        <i [class]="icon" class="text-xs" aria-hidden="true"></i>
      }
      <span>{{ label }}</span>
      @if (removable) {
        <button
          type="button"
          class="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors govbr-focus-ring"
          [attr.aria-label]="'Remover ' + label"
          (click)="handleRemove($event)"
        >
          <i class="fas fa-xmark text-xs" aria-hidden="true"></i>
        </button>
      }
    </span>
  `,
})
export class BrChipComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'default';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() selectable = false;
  @Input() selected = false;
  @Input() removable = false;
  @Input() disabled = false;

  @Output() selectedChange = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter<void>();

  get chipClasses(): string {
    const sizeStyles = {
      small: 'px-2 py-0.5 text-xs',
      medium: 'px-3 py-1 text-sm',
      large: 'px-4 py-1.5 text-base',
    } as const;

    const variantStyles = {
      default: this.selected
        ? 'bg-govbr-primary text-white'
        : 'bg-govbr-gray-5 text-govbr-gray-80 hover:bg-govbr-gray-10',
      primary: this.selected
        ? 'bg-govbr-primary text-white'
        : 'bg-govbr-primary-lightest text-govbr-primary hover:bg-govbr-primary-light hover:text-white',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    } as const;

    let cursorClass = '';
    if (this.disabled) {
      cursorClass = 'cursor-not-allowed opacity-50';
    } else if (this.selectable) {
      cursorClass = 'cursor-pointer';
    }

    const focusClass = this.selectable ? 'govbr-focus-ring' : '';

    return `${sizeStyles[this.size]} ${variantStyles[this.variant]} ${cursorClass} ${focusClass}`;
  }

  handleClick(): void {
    if (!this.selectable || this.disabled) return;

    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
  }

  handleRemove(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.remove.emit();
  }
}
