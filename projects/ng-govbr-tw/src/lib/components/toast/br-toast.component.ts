import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { BrToastService } from './br-toast.service';

@Component({
  selector: 'br-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="containerClasses" role="region" aria-label="Notificações">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [class]="getToastClasses(toast.type)"
          role="alert"
          [attr.aria-live]="toast.type === 'danger' ? 'assertive' : 'polite'"
        >
          <!-- Icon - padrão Gov.br -->
          <div class="flex-shrink-0 mt-0.5">
            @switch (toast.type) {
              @case ('success') {
                <i class="fa-solid fa-circle-check text-lg"></i>
              }
              @case ('danger') {
                <i class="fa-solid fa-circle-xmark text-lg"></i>
              }
              @case ('warning') {
                <i class="fa-solid fa-triangle-exclamation text-lg"></i>
              }
              @case ('info') {
                <i class="fa-solid fa-circle-info text-lg"></i>
              }
            }
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            @if (toast.title) {
              <p class="font-semibold text-govbr-base">{{ toast.title }}</p>
            }
            <p class="text-govbr-sm" [class.mt-0.5]="toast.title">{{ toast.message }}</p>
          </div>

          <!-- Dismiss button -->
          @if (toast.dismissible) {
            <button
              type="button"
              class="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors govbr-focus-ring"
              (click)="toastService.dismiss(toast.id)"
              aria-label="Fechar notificação"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    br-toast-container > div {
      pointer-events: none;
    }
    br-toast-container > div > div {
      pointer-events: auto;
      animation: br-toast-slide-in 0.3s ease-out;
    }
    @keyframes br-toast-slide-in {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `],
})
export class BrToastContainerComponent {
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-right';
  @Input() maxToasts = 5;

  readonly toastService = inject(BrToastService);

  get containerClasses(): string {
    const positionMap = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    } as const;

    return `fixed z-50 flex flex-col gap-3 w-full max-w-sm font-rawline ${positionMap[this.position]}`;
  }

  getToastClasses(type: string): string {
    // Seguindo o padrão Gov.br: border-left de 4px, fundo suave
    const base = 'flex items-start gap-3 p-4 rounded border-l-4 shadow-lg';

    const typeStyles = {
      success: 'bg-govbr-success-bg border-govbr-success text-govbr-success-dark',
      danger: 'bg-govbr-danger-bg border-govbr-danger text-govbr-danger-dark',
      warning: 'bg-govbr-warning-bg border-govbr-warning text-govbr-gray-80',
      info: 'bg-govbr-info-bg border-govbr-info text-govbr-primary-dark',
    } as const;

    return `${base} ${typeStyles[type as keyof typeof typeStyles] || typeStyles.info}`;
  }
}
