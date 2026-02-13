import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'br-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="flex items-center font-rawline"
      [class]="containerClasses"
      [attr.role]="text ? 'separator' : 'presentation'"
      [attr.aria-orientation]="orientation"
    >
      @if (text) {
        <div [class]="lineClasses"></div>
        <span [class]="textClasses">{{ text }}</span>
        <div [class]="lineClasses"></div>
      } @else {
        <div [class]="fullLineClasses"></div>
      }
    </div>
  `,
})
export class BrDividerComponent {
  @Input() text = '';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() variant: 'solid' | 'dashed' | 'dotted' = 'solid';
  @Input() spacing: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'light' | 'medium' | 'dark' = 'light';

  get containerClasses(): string {
    const spacingStyles = {
      small: this.orientation === 'horizontal' ? 'my-2' : 'mx-2',
      medium: this.orientation === 'horizontal' ? 'my-4' : 'mx-4',
      large: this.orientation === 'horizontal' ? 'my-6' : 'mx-6',
    } as const;

    const orientationClass = this.orientation === 'vertical'
      ? 'flex-col h-full'
      : 'w-full';

    return `${spacingStyles[this.spacing]} ${orientationClass}`;
  }

  get lineClasses(): string {
    const base = 'flex-1';
    const colorStyles = {
      light: 'bg-govbr-gray-10',
      medium: 'bg-govbr-gray-20',
      dark: 'bg-govbr-gray-40',
    } as const;

    const variantStyles = {
      solid: '',
      dashed: 'bg-transparent border-t border-dashed',
      dotted: 'bg-transparent border-t border-dotted',
    } as const;

    const sizeClass = this.orientation === 'horizontal' ? 'h-px' : 'w-px';

    const borderColor = {
      light: 'border-govbr-gray-10',
      medium: 'border-govbr-gray-20',
      dark: 'border-govbr-gray-40',
    } as const;

    if (this.variant !== 'solid') {
      return `${base} ${sizeClass} ${variantStyles[this.variant]} ${borderColor[this.color]}`;
    }

    return `${base} ${sizeClass} ${colorStyles[this.color]}`;
  }

  get fullLineClasses(): string {
    return this.lineClasses;
  }

  get textClasses(): string {
    return 'px-4 text-sm text-govbr-gray-40 whitespace-nowrap';
  }
}
