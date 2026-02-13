import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'br-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <span [class]="badgeClasses" [attr.aria-label]="ariaLabel || null">
      <ng-content></ng-content>
    </span>
  `,
})
export class BrBadgeComponent {
  @Input() variant: 'primary' | 'success' | 'danger' | 'warning' | 'neutral' = 'primary';

  /**
   * Nome acessível, para quando o conteúdo sozinho não diz o que significa.
   *
   * Badge costuma carregar só um número ou um ícone: `3` lido em voz alta não
   * informa nada. Com texto autoexplicativo ("Concluído"), deixe vazio — um
   * `aria-label` redundante atrapalha mais do que ajuda.
   */
  @Input() ariaLabel?: string;

  get badgeClasses(): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-govbr-pill text-xs font-semibold font-rawline';

    const variants = {
      primary: 'bg-govbr-primary text-govbr-on-primary',
      success: 'bg-govbr-success text-govbr-on-primary',
      danger: 'bg-govbr-danger text-govbr-on-primary',
      warning: 'bg-govbr-warning-bg text-govbr-gray-80',
      neutral: 'bg-govbr-gray-5 text-govbr-gray-80',
    } as const;

    return `${base} ${variants[this.variant]}`;
  }
}
