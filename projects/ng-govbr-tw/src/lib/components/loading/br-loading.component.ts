import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'br-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Indeterminate (spinner) -->
    @if (!progress && progress !== 0) {
      <div
        [class]="spinnerClasses"
        role="status"
        [attr.aria-label]="label || 'Carregando'"
        >
        <span class="sr-only">{{ label || 'Carregando...' }}</span>
      </div>
    }
    
    <!-- Determinate (progress circle) -->
    @if (progress !== undefined && progress !== null) {
      <div
        [class]="progressContainerClasses"
        role="progressbar"
        [attr.aria-valuenow]="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-label]="label || 'Progresso'"
        >
        <svg [attr.width]="progressDiameter" [attr.height]="progressDiameter" class="transform -rotate-90">
          <!-- Background circle -->
          <circle
            [attr.cx]="progressDiameter / 2"
            [attr.cy]="progressDiameter / 2"
            [attr.r]="progressRadius"
            fill="none"
            class="stroke-govbr-gray-10"
            [attr.stroke-width]="strokeWidth"
            />
          <!-- Progress circle -->
          <circle
            [attr.cx]="progressDiameter / 2"
            [attr.cy]="progressDiameter / 2"
            [attr.r]="progressRadius"
            fill="none"
            class="stroke-govbr-primary transition-all duration-300"
            [attr.stroke-width]="strokeWidth"
            [attr.stroke-dasharray]="circumference"
            [attr.stroke-dashoffset]="dashOffset"
            stroke-linecap="round"
            />
        </svg>
        @if (showPercentage) {
          <span
            class="absolute inset-0 flex items-center justify-center font-rawline font-semibold text-govbr-gray-80"
            [class.text-govbr-xs]="size === 'small'"
            [class.text-govbr-sm]="size === 'medium'"
            [class.text-govbr-base]="size === 'large'"
            >
            {{ progress }}%
          </span>
        }
      </div>
    }
    `,
  styles: [
    `
    @keyframes br-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(359deg); }
    }
    .br-loading-spin {
      animation: br-spin 1.3s linear infinite;
    }
    `,
  ],
})
export class BrLoadingComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() progress?: number;
  @Input() showPercentage = true;
  @Input() label?: string;

  get spinnerClasses(): string {
    const sizes = {
      small: 'w-6 h-6 border-2',
      medium: 'w-11 h-11 border-[3px]',
      large: 'w-[84px] h-[84px] border-4',
    } as const;

    return [
      'br-loading-spin rounded-full',
      'border-govbr-primary border-r-transparent',
      sizes[this.size],
    ].join(' ');
  }

  get progressContainerClasses(): string {
    return 'relative inline-flex items-center justify-center';
  }

  get progressDiameter(): number {
    const diameters = { small: 44, medium: 64, large: 84 } as const;
    return diameters[this.size];
  }

  get strokeWidth(): number {
    const widths = { small: 3, medium: 4, large: 5 } as const;
    return widths[this.size];
  }

  get progressRadius(): number {
    return (this.progressDiameter - this.strokeWidth) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.progressRadius;
  }

  get dashOffset(): number {
    const clamped = Math.max(0, Math.min(100, this.progress ?? 0));
    return this.circumference - (clamped / 100) * this.circumference;
  }
}
