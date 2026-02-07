import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { BrAnimationService } from '../../animations/animation.service';


@Component({
  selector: 'br-modal',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Scrim / Overlay -->
    @if (isOpen) {
      <div
        class="fixed inset-0 z-[1000] flex items-center justify-center"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId"
        >
        <!-- Backdrop -->
        <div
          [class]="backdropClasses"
          [style.animation]="backdropAnimation"
          (click)="onScrimClick()"
          (keydown.enter)="onScrimClick()"
          role="button"
          tabindex="0"
          aria-label="Fechar modal"
        ></div>
        <!-- Modal container -->
        <div
          [class]="modalClasses"
          [style.animation]="modalAnimation"
          role="document"
          >
          <!-- Header -->
          <div [class]="headerClasses">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              @if (variantIcon) {
                <i [class]="variantIcon + ' text-xl flex-shrink-0 ' + variantIconColor" aria-hidden="true"></i>
              }
              <h4
                [id]="titleId"
                class="text-govbr-lg font-semibold text-govbr-gray-80 font-rawline truncate"
                >
                {{ title }}
              </h4>
            </div>
            @if (showCloseButton) {
              <button
                type="button"
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-govbr-primary hover:bg-govbr-primary-lightest govbr-focus-ring transition-colors"
                aria-label="Fechar"
                (click)="close()"
                >
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            }
          </div>
          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-4 font-rawline text-govbr-base text-govbr-gray-80">
            <!-- Loading state -->
            @if (loading) {
              <div class="flex items-center justify-center py-10">
                <i class="fa-solid fa-spinner fa-spin text-govbr-primary text-2xl" aria-hidden="true"></i>
              </div>
            }
            @if (!loading) {
              <ng-content></ng-content>
            }
          </div>
          <!-- Footer -->
          @if (!loading && showFooter) {
            <div
              class="flex flex-wrap items-center justify-end gap-3 px-6 py-4 border-t border-govbr-gray-10"
              >
              <ng-content select="[modal-footer]"></ng-content>
              @if (!hasCustomFooter) {
                @if (showCancelButton) {
                  <button
                    type="button"
                    class="px-5 py-2 text-govbr-base font-semibold font-rawline text-govbr-primary bg-transparent border border-govbr-primary rounded-govbr-pill hover:bg-govbr-primary hover:text-white transition-colors govbr-focus-ring"
                    (click)="cancel()"
                    >
                    {{ cancelText }}
                  </button>
                }
                @if (showPrimaryButton) {
                  <button
                    type="button"
                    [disabled]="primaryDisabled"
                    [class]="primaryButtonClasses"
                    (click)="confirm()"
                    >
                    {{ primaryText }}
                  </button>
                }
              }
            </div>
          }
        </div>
      </div>
    }
    `,
  styles: [`
    @keyframes br-modal-backdrop-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes br-modal-enter {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `],
})
export class BrModalComponent {
  private readonly animationService = inject(BrAnimationService);

  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'xsmall' | 'small' | 'medium' | 'large' | 'auto' = 'medium';
  @Input() variant: 'default' | 'danger' | 'warning' | 'success' = 'default';
  @Input() showCloseButton = true;
  @Input() showFooter = true;
  @Input() showCancelButton = true;
  @Input() showPrimaryButton = true;
  @Input() primaryText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() primaryDisabled = false;
  @Input() loading = false;
  @Input() closeOnScrim = true;
  @Input() closeOnEscape = true;
  @Input() hasCustomFooter = false;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  private static nextId = 0;
  titleId = `br-modal-title-${BrModalComponent.nextId++}`;

  get backdropAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    const duration = this.animationService.resolveDuration('fast');
    return `br-modal-backdrop-in ${duration}ms ease-out forwards`;
  }

  get modalAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    const duration = this.animationService.resolveDuration('normal');
    return `br-modal-enter ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
  }

  get backdropClasses(): string {
    return 'absolute inset-0 bg-govbr-primary-darkest/60';
  }

  get variantIcon(): string | null {
    const icons = {
      default: null,
      danger: 'fa-solid fa-triangle-exclamation',
      warning: 'fa-solid fa-circle-exclamation',
      success: 'fa-solid fa-circle-check',
    } as const;
    return icons[this.variant];
  }

  get variantIconColor(): string {
    const colors = {
      default: '',
      danger: 'text-govbr-danger',
      warning: 'text-govbr-warning',
      success: 'text-govbr-success',
    } as const;
    return colors[this.variant];
  }

  get headerClasses(): string {
    const base = 'flex items-center justify-between px-6 py-4 border-b';
    const borderColors = {
      default: 'border-govbr-gray-10',
      danger: 'border-govbr-danger/20',
      warning: 'border-govbr-warning/30',
      success: 'border-govbr-success/20',
    } as const;
    return `${base} ${borderColors[this.variant]}`;
  }

  get primaryButtonClasses(): string {
    const base = 'px-5 py-2 text-govbr-base font-semibold font-rawline rounded-govbr-pill transition-colors govbr-focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
    const variantStyles = {
      default: 'text-white bg-govbr-primary hover:bg-govbr-primary-dark',
      danger: 'text-white bg-govbr-danger hover:bg-red-700',
      warning: 'text-govbr-gray-80 bg-govbr-warning hover:bg-yellow-500',
      success: 'text-white bg-govbr-success hover:bg-green-700',
    } as const;
    return `${base} ${variantStyles[this.variant]}`;
  }

  get modalClasses(): string {
    const sizes = {
      xsmall: 'max-w-[220px]',
      small: 'max-w-[300px]',
      medium: 'max-w-[500px]',
      large: 'max-w-[640px]',
      auto: 'max-w-fit',
    } as const;

    const base = [
      'relative flex flex-col bg-white shadow-lg z-10 w-full mx-4 rounded',
      'max-h-[90vh]',
    ].join(' ');

    return [base, sizes[this.size]].filter(Boolean).join(' ');
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.closeOnEscape) {
      this.close();
    }
  }

  onScrimClick(): void {
    if (this.closeOnScrim) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.canceled.emit();
  }
}
