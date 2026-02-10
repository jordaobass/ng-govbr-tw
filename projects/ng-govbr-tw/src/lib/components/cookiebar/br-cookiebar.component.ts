import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { BrAnimationService } from '../../animations/animation.service';


export interface BrCookieGroup {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  enabled?: boolean;
}

/**
 * BrCookiebarComponent — Cookie consent bar for LGPD compliance.
 *
 * Usage:
 * ```html
 * <br-cookiebar
 *   [visible]="showCookies"
 *   [cookieGroups]="groups"
 *   (acceptAll)="onAcceptAll()"
 *   (acceptSelected)="onAcceptSelected($event)"
 *   (reject)="onReject()"
 * >
 *   <p>Este site utiliza cookies para melhorar sua experiência.</p>
 * </br-cookiebar>
 * ```
 */
@Component({
  selector: 'br-cookiebar',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    @keyframes br-cookiebar-slide-up {
      from { opacity: 0; transform: translateY(100%); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes br-cookiebar-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
  template: `
    @if (visible) {
      <div
        class="fixed inset-x-0 bottom-0 z-50 font-rawline"
        role="dialog"
        aria-label="Configurações de cookies"
        [attr.aria-modal]="expanded ? 'true' : null"
        >
        <!-- Scrim when expanded -->
        @if (expanded) {
          <div
            class="fixed inset-0 bg-black/40 z-40"
            [style.animation]="scrimAnimation"
            (click)="expanded = false"
            (keydown.enter)="expanded = false"
            role="button"
            tabindex="0"
            aria-label="Fechar definições de cookies"
          ></div>
        }
        <div [class]="barClasses" [style.animation]="barAnimation">
          <!-- Main bar -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex-1 text-sm text-govbr-gray-80">
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-cookie-bite text-govbr-primary text-xl flex-shrink-0 mt-0.5"></i>
                <div>
                  <ng-content></ng-content>
                  @if (cookieGroups.length > 0) {
                    <button
                      type="button"
                      class="text-govbr-primary font-semibold hover:underline text-sm mt-1 block"
                      (click)="expanded = !expanded"
                      [attr.aria-expanded]="expanded"
                      aria-controls="cookiebar-details"
                      >
                      {{ expanded ? 'Ocultar definições de cookies' : 'Definições de cookies' }}
                      <i
                        class="fa-solid fa-chevron-down text-xs ml-1 transition-transform"
                        [class.rotate-180]="expanded"
                      ></i>
                    </button>
                  }
                </div>
              </div>
            </div>
            <!-- Action buttons -->
            <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                type="button"
                class="px-4 py-2 text-sm font-semibold text-govbr-on-primary bg-govbr-primary rounded-govbr-pill hover:bg-govbr-primary-dark transition-colors"
                (click)="onAcceptAll()"
                >
                Aceitar todos
              </button>
              @if (cookieGroups.length > 0) {
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-semibold text-govbr-primary border border-govbr-primary rounded-govbr-pill hover:bg-govbr-primary hover:text-govbr-on-primary transition-colors"
                  (click)="onAcceptSelected()"
                  >
                  Aceitar selecionados
                </button>
              }
              <button
                type="button"
                class="px-4 py-2 text-sm font-semibold text-govbr-gray-60 hover:text-govbr-gray-80 transition-colors"
                (click)="onReject()"
                >
                Recusar
              </button>
            </div>
          </div>
          <!-- Expanded: cookie groups -->
          @if (expanded && cookieGroups.length > 0) {
            <div
              id="cookiebar-details"
              class="mt-4 pt-4 border-t border-govbr-gray-10"
              >
              @for (group of cookieGroups; track trackGroup($index, group)) {
                <div
                  class="flex items-start gap-3 py-3 border-b border-govbr-gray-5 last:border-b-0"
                  >
                  <!-- Toggle -->
                  <button
                    type="button"
                    [class]="toggleClasses(group)"
                    [attr.aria-checked]="group.enabled || group.required"
                    [attr.aria-label]="group.label"
                    role="switch"
                    [disabled]="group.required"
                    (click)="toggleGroup(group)"
                    >
                    <span
                      class="inline-block w-4 h-4 bg-govbr-bg rounded-full shadow transition-transform"
                      [class.translate-x-5]="group.enabled || group.required"
                      [class.translate-x-0.5]="!(group.enabled || group.required)"
                    ></span>
                  </button>
                  <div class="flex-1 min-w-0">
                    <span class="text-sm font-semibold text-govbr-gray-80">{{ group.label }}</span>
                    @if (group.required) {
                      <span class="text-xs text-govbr-gray-60 ml-1">(obrigatório)</span>
                    }
                    <p class="text-xs text-govbr-gray-60 mt-0.5">{{ group.description }}</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
    `,
})
export class BrCookiebarComponent {
  private readonly animationService = inject(BrAnimationService);

  @Input() visible = false;
  @Input() cookieGroups: BrCookieGroup[] = [];

  @Output() acceptAll = new EventEmitter<void>();
  @Output() acceptSelected = new EventEmitter<BrCookieGroup[]>();
  @Output() reject = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  expanded = false;

  get barAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-cookiebar-slide-up 300ms ease-out forwards';
  }

  get scrimAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-cookiebar-fade-in 200ms ease-out forwards';
  }

  trackGroup(_: number, group: BrCookieGroup): string {
    return group.id;
  }

  toggleGroup(group: BrCookieGroup): void {
    if (group.required) return;
    group.enabled = !group.enabled;
  }

  toggleClasses(group: BrCookieGroup): string {
    const enabled = group.enabled || group.required;
    const base = 'relative inline-flex h-5 w-10 items-center rounded-full transition-colors flex-shrink-0 mt-0.5';
    const color = enabled ? 'bg-govbr-primary' : 'bg-govbr-gray-20';
    const disabled = group.required ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer';
    return `${base} ${color} ${disabled}`;
  }

  onAcceptAll(): void {
    this.cookieGroups.forEach((g) => (g.enabled = true));
    this.acceptAll.emit();
    this.hide();
  }

  onAcceptSelected(): void {
    this.acceptSelected.emit(
      this.cookieGroups.filter((g) => g.enabled || g.required)
    );
    this.hide();
  }

  onReject(): void {
    this.cookieGroups.forEach((g) => {
      if (!g.required) g.enabled = false;
    });
    this.reject.emit();
    this.hide();
  }

  private hide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.expanded = false;
  }

  get barClasses(): string {
    return 'relative z-50 bg-govbr-bg border-t border-govbr-gray-10 shadow-lg px-4 sm:px-6 py-4 sm:py-5 max-h-[80vh] overflow-y-auto';
  }
}
