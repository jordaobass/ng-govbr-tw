import {
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';


@Component({
  selector: 'br-tooltip',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="relative inline-flex"
      (mouseenter)="show()"
      (mouseleave)="hide()"
      (focusin)="show()"
      (focusout)="hide()"
      >
      <!-- Trigger content -->
      <ng-content></ng-content>
    
      <!-- Tooltip -->
      @if (visible) {
        <div
          role="tooltip"
          [class]="tooltipClasses"
          >
          <span class="text-govbr-xs leading-tight">{{ text }}</span>
          <!-- Arrow -->
          <span [class]="arrowClasses"></span>
        </div>
      }
    </div>
    `,
  styles: [
    `
    @keyframes br-tooltip-fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .br-tooltip-animate {
      animation: br-tooltip-fade-in 0.2s ease-in-out;
    }
    `,
  ],
})
export class BrTooltipComponent {
  @Input() text = '';
  @Input() place: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() variant: 'info' | 'success' | 'danger' | 'warning' = 'info';
  @Input() timer?: number;

  visible = false;
  private hideTimeout?: ReturnType<typeof setTimeout>;

  get tooltipClasses(): string {
    const bgMap = {
      info: 'bg-govbr-info text-white',
      success: 'bg-govbr-success text-white',
      danger: 'bg-govbr-danger text-white',
      warning: 'bg-govbr-warning text-govbr-gray-80',
    } as const;

    const positionMap = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    } as const;

    const base = [
      'absolute z-50 px-3 py-2 rounded max-w-[240px] min-w-[180px] font-rawline br-tooltip-animate',
      'pointer-events-none whitespace-normal break-words',
    ].join(' ');

    return [base, bgMap[this.variant], positionMap[this.place]].join(' ');
  }

  get arrowClasses(): string {
    const bgColorMap = {
      info: 'border-govbr-info',
      success: 'border-govbr-success',
      danger: 'border-govbr-danger',
      warning: 'border-govbr-warning',
    } as const;

    const color = bgColorMap[this.variant];

    const arrowMap = {
      top: `absolute left-1/2 -translate-x-1/2 top-full border-8 border-transparent border-t-current ${color.replace('border-', 'text-')}`,
      bottom: `absolute left-1/2 -translate-x-1/2 bottom-full border-8 border-transparent border-b-current ${color.replace('border-', 'text-')}`,
      left: `absolute top-1/2 -translate-y-1/2 left-full border-8 border-transparent border-l-current ${color.replace('border-', 'text-')}`,
      right: `absolute top-1/2 -translate-y-1/2 right-full border-8 border-transparent border-r-current ${color.replace('border-', 'text-')}`,
    } as const;

    return arrowMap[this.place];
  }

  show(): void {
    this.visible = true;
    if (this.timer) {
      this.hideTimeout = setTimeout(() => this.hide(), this.timer);
    }
  }

  hide(): void {
    this.visible = false;
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }
}
