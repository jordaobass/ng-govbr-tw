import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'br-signin',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      class="inline-flex items-center justify-center gap-3 font-rawline font-semibold rounded-full transition-all duration-200 govbr-focus-ring"
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
      (click)="handleClick()"
    >
      @if (loading) {
        <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
        <span>Carregando...</span>
      } @else {
        <span>{{ text }}</span>
        <img
          [src]="logoSrc"
          [alt]="'Logo Gov.br'"
          [class]="logoClasses"
          aria-hidden="true"
        />
      }
    </button>
  `,
  styles: [`
    br-signin {
      display: inline-block;
    }
  `],
})
export class BrSigninComponent {
  /** Variante do botão */
  @Input() variant: 'primary' | 'secondary' | 'dark' = 'primary';

  /** Tamanho do botão */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /** Texto do botão */
  @Input() text = 'Entrar com';

  /** URL do logo Gov.br */
  @Input() logoSrc = 'https://www.gov.br/++theme++flavor/static/images/govbr-logo-small.png';

  /** Desabilitado */
  @Input() disabled = false;

  /** Loading state */
  @Input() loading = false;

  /** Largura total */
  @Input() fullWidth = false;

  /** Aria label customizado */
  @Input() ariaLabel = 'Entrar com conta Gov.br';

  /** Evento de clique */
  @Output() signinClick = new EventEmitter<void>();

  get buttonClasses(): string {
    const variantStyles = {
      primary: 'bg-[#1351b4] hover:bg-[#0c326f] text-white border-2 border-[#1351b4] hover:border-[#0c326f]',
      secondary: 'bg-white border-2 border-[#1351b4] text-[#1351b4] hover:bg-[#dbe8fb]',
      dark: 'bg-[#071d41] hover:bg-[#0c326f] text-white border-2 border-[#071d41] hover:border-[#0c326f]',
    } as const;

    const sizeStyles = {
      small: 'h-10 px-5 text-sm',
      medium: 'h-12 px-6 text-base',
      large: 'h-14 px-8 text-lg',
    } as const;

    const disabledClass = (this.disabled || this.loading)
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

    const widthClass = this.fullWidth ? 'w-full' : '';

    return [
      variantStyles[this.variant],
      sizeStyles[this.size],
      disabledClass,
      widthClass,
    ].filter(Boolean).join(' ');
  }

  get logoClasses(): string {
    const sizeStyles = {
      small: 'h-5',
      medium: 'h-6',
      large: 'h-7',
    } as const;

    return sizeStyles[this.size];
  }

  handleClick(): void {
    if (this.disabled || this.loading) return;
    this.signinClick.emit();
  }
}
