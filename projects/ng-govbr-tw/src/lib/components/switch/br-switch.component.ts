import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrAnimationService } from '../../animations/animation.service';

@Component({
  selector: 'br-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrSwitchComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="inline-flex items-center gap-3 font-rawline cursor-pointer"
      [class.opacity-50]="disabled"
      [class.cursor-not-allowed]="disabled"
    >
      <button
        type="button"
        role="switch"
        [attr.aria-checked]="checked"
        [attr.aria-label]="ariaLabel || label"
        [disabled]="disabled"
        [class]="buttonClasses"
        (click)="toggle()"
        (keydown.space)="toggle(); $event.preventDefault()"
        (keydown.enter)="toggle()"
      >
        <span
          aria-hidden="true"
          [class]="thumbClasses"
        ></span>
      </button>
      @if (label) {
        <span class="text-govbr-sm text-govbr-gray-80 select-none">{{ label }}</span>
      }
    </div>
  `,
  styles: [`
    /* Animação de bounce no toggle */
    @keyframes br-switch-bounce {
      0% { transform: translateX(var(--switch-x)) scale(1); }
      50% { transform: translateX(var(--switch-x)) scale(1.1, 0.9); }
      100% { transform: translateX(var(--switch-x)) scale(1); }
    }

    .br-switch-animate-thumb {
      animation: br-switch-bounce 200ms ease-out;
    }
  `],
})
export class BrSwitchComponent implements ControlValueAccessor {
  private readonly animationService = inject(BrAnimationService);

  @Input() label = '';
  @Input() ariaLabel = '';
  @Input() disabled = false;
  @Input() size: 'small' | 'medium' = 'medium';

  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;
  private isAnimating = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  get buttonClasses(): string {
    const base = 'relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent govbr-focus-ring';

    const colorClass = this.checked
      ? 'bg-govbr-primary'
      : 'bg-govbr-gray-20';

    const sizeClass = this.size === 'small'
      ? 'h-5 w-9'
      : 'h-6 w-11';

    const transitionClass = this.animationService.isEnabled()
      ? 'transition-colors duration-200 ease-in-out'
      : '';

    return `${base} ${colorClass} ${sizeClass} ${transitionClass}`;
  }

  get thumbClasses(): string {
    const base = 'pointer-events-none inline-block rounded-full bg-govbr-bg shadow ring-0';

    const sizeClass = this.size === 'small'
      ? 'h-4 w-4'
      : 'h-5 w-5';

    const translateClass = this.checked
      ? (this.size === 'small' ? 'translate-x-4' : 'translate-x-5')
      : 'translate-x-0';

    const transitionClass = this.animationService.isEnabled()
      ? 'transition-transform duration-200 ease-in-out'
      : '';

    const animateClass = this.isAnimating && this.animationService.isEnabled()
      ? 'br-switch-animate-thumb'
      : '';

    // CSS variable para a animação de bounce
    const cssVar = this.checked
      ? (this.size === 'small' ? '[--switch-x:1rem]' : '[--switch-x:1.25rem]')
      : '[--switch-x:0]';

    return `${base} ${sizeClass} ${translateClass} ${transitionClass} ${animateClass} ${cssVar}`;
  }

  toggle(): void {
    if (this.disabled) return;

    // Trigger animação
    if (this.animationService.isEnabled()) {
      this.isAnimating = true;
      setTimeout(() => this.isAnimating = false, 200);
    }

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
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
    this.disabled = isDisabled;
  }
}
