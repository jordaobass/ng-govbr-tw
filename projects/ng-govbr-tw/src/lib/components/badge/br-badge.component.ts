import { Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'br-badge',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
})
export class BrBadgeComponent {
  @Input() variant: 'primary' | 'success' | 'danger' | 'warning' | 'neutral' = 'primary';

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
