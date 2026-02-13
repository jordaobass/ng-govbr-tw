import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrAnimationService } from '../../animations/animation.service';

/**
 * Elementos que recebem foco por teclado. `[tabindex="-1"]` fica de fora de
 * propósito: é focável por script, não por Tab.
 */
const SELETOR_FOCAVEL = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');


@Component({
  selector: 'br-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <!--
          Backdrop. Sem role="button"/tabindex: elemento focável aqui poluía a
          ordem de tabulação e duplicava um fechamento que o Escape e o botão
          de fechar já oferecem. Clique em div sem papel interativo é aceitável
          porque NÃO é o único caminho — então não viola a WCAG 2.1.1.
        -->
        <div
          [class]="backdropClasses"
          [style.animation]="backdropAnimation"
          (click)="onScrimClick()"
          aria-hidden="true"
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
                    class="px-5 py-2 text-govbr-base font-semibold font-rawline text-govbr-primary bg-transparent border border-govbr-primary rounded-govbr-pill hover:bg-govbr-primary hover:text-govbr-on-primary transition-colors govbr-focus-ring"
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
export class BrModalComponent implements OnChanges {
  private readonly animationService = inject(BrAnimationService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  /** Elemento que tinha o foco quando o modal abriu, para devolver ao fechar. */
  private gatilhoAnterior: HTMLElement | null = null;

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
      // Amarelo puro (#ffcd07) sobre o fundo claro do modal dá 1,50:1 e
      // reprova até o mínimo de 3:1 da WCAG 1.4.11 para gráfico significativo
      // — o ícone de aviso ficava praticamente invisível. A variante escura
      // dá 7,40:1. Tom pendente de conferência contra o DS oficial (A1).
      warning: 'text-govbr-warning-dark',
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
      default: 'text-govbr-on-primary bg-govbr-primary hover:bg-govbr-primary-dark',
      danger: 'text-govbr-on-primary bg-govbr-danger hover:bg-govbr-danger-hover',
      warning: 'text-govbr-gray-80 bg-govbr-warning hover:bg-govbr-warning-hover',
      success: 'text-govbr-on-primary bg-govbr-success hover:bg-govbr-success-hover',
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
      'relative flex flex-col bg-govbr-bg shadow-lg z-10 w-full mx-4 rounded',
      'max-h-[90vh]',
    ].join(' ');

    return [base, sizes[this.size]].filter(Boolean).join(' ');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['isOpen'] || !this.ehNavegador) return;

    if (this.isOpen) {
      this.gatilhoAnterior = document.activeElement as HTMLElement | null;
      // O diálogo só existe no DOM depois que o @if renderiza.
      setTimeout(() => this.focarPrimeiroElemento());
    } else {
      this.devolverFoco();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.closeOnEscape) {
      this.close();
    }
  }

  /**
   * Focus trap (WCAG 2.4.3). Sem isto, `role="dialog"` + `aria-modal` anunciam
   * um contrato que o componente não cumpre: o Tab escapa para a página atrás,
   * que o leitor de tela considera inacessível.
   */
  @HostListener('document:keydown', ['$event'])
  onTabKey(event: KeyboardEvent): void {
    if (!this.isOpen || event.key !== 'Tab' || !this.ehNavegador) return;

    const focaveis = this.elementosFocaveis();
    if (!focaveis.length) {
      // Diálogo sem nada focável: prender o foco nele mesmo ainda é melhor
      // que deixar o Tab vazar para o conteúdo de trás.
      event.preventDefault();
      this.dialogo()?.focus();
      return;
    }

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    const ativo = document.activeElement;

    if (event.shiftKey && (ativo === primeiro || !this.dialogo()?.contains(ativo))) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && ativo === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
  }

  onScrimClick(): void {
    if (this.closeOnScrim) {
      this.close();
    }
  }

  private dialogo(): HTMLElement | null {
    return this.elementRef.nativeElement.querySelector('[role="dialog"]');
  }

  private elementosFocaveis(): HTMLElement[] {
    const alvo = this.dialogo();
    if (!alvo) return [];
    return Array.from(
      alvo.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL)
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
  }

  private focarPrimeiroElemento(): void {
    const focaveis = this.elementosFocaveis();
    if (focaveis.length) {
      focaveis[0].focus();
      return;
    }
    const alvo = this.dialogo();
    if (alvo) {
      alvo.setAttribute('tabindex', '-1');
      alvo.focus();
    }
  }

  private devolverFoco(): void {
    const gatilho = this.gatilhoAnterior;
    this.gatilhoAnterior = null;
    // `isConnected` evita tentar focar elemento que saiu do DOM junto com o
    // fluxo que abriu o modal.
    if (gatilho?.isConnected) gatilho.focus();
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
