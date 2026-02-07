import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'br-signin',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      class="inline-flex items-center justify-center gap-3 font-rawline font-semibold rounded transition-all duration-200 govbr-focus-ring"
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
      (click)="handleClick()"
    >
      @if (loading) {
        <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
      } @else {
        <!-- Gov.br Logo SVG -->
        <svg
          [class]="logoClasses"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="24" [attr.fill]="logoBgColor"/>
          <path
            d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 4c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12 5.373-12 12-12z"
            [attr.fill]="logoCircleColor"
          />
          <path
            d="M24 14c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 3a7 7 0 110 14 7 7 0 010-14z"
            [attr.fill]="logoInnerColor"
          />
          <circle cx="24" cy="24" r="4" [attr.fill]="logoCenterColor"/>
        </svg>
      }
      <span>{{ buttonText }}</span>
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

  /** Sufixo do texto (gov.br) */
  @Input() suffix = 'gov.br';

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

  get buttonText(): string {
    return `${this.text} ${this.suffix}`;
  }

  get buttonClasses(): string {
    const variantStyles = {
      primary: 'bg-[#1351b4] hover:bg-[#0c326f] text-white',
      secondary: 'bg-white border-2 border-[#1351b4] text-[#1351b4] hover:bg-[#f0f5ff]',
      dark: 'bg-[#071d41] hover:bg-[#0c326f] text-white',
    } as const;

    const sizeStyles = {
      small: 'px-4 py-2 text-sm',
      medium: 'px-6 py-3 text-base',
      large: 'px-8 py-4 text-lg',
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
      small: 'w-5 h-5',
      medium: 'w-6 h-6',
      large: 'w-8 h-8',
    } as const;

    return sizeStyles[this.size];
  }

  get logoBgColor(): string {
    return this.variant === 'secondary' ? '#1351b4' : '#ffffff';
  }

  get logoCircleColor(): string {
    return this.variant === 'secondary' ? '#ffffff' : '#1351b4';
  }

  get logoInnerColor(): string {
    return this.variant === 'secondary' ? '#1351b4' : '#f8d94e';
  }

  get logoCenterColor(): string {
    return this.variant === 'secondary' ? '#ffffff' : '#1351b4';
  }

  handleClick(): void {
    if (this.disabled || this.loading) return;
    this.signinClick.emit();
  }
}
