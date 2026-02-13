import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'br-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="containerClasses" [attr.aria-label]="name || 'Avatar'" role="img">
      @if (src) {
        <img
          [src]="src"
          [alt]="name || 'Avatar'"
          class="w-full h-full object-cover"
          (error)="onImageError()"
        />
      } @else {
        <span [class]="initialsClasses">{{ initials }}</span>
      }

      @if (status) {
        <span
          [class]="statusClasses"
          [attr.aria-label]="'Status: ' + status"
          role="status"
        ></span>
      }
    </div>
  `,
})
export class BrAvatarComponent {
  @Input() src?: string;
  @Input() name?: string;
  @Input() size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input() variant: 'primary' | 'neutral' | 'success' | 'danger' | 'warning' = 'primary';
  @Input() status?: 'online' | 'offline' | 'busy' | 'away';

  imageFailed = false;

  onImageError(): void {
    this.imageFailed = true;
    this.src = undefined;
  }

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  get containerClasses(): string {
    const sizeMap = {
      xsmall: 'w-6 h-6',
      small: 'w-8 h-8',
      medium: 'w-10 h-10',
      large: 'w-14 h-14',
      xlarge: 'w-20 h-20',
    } as const;

    const variantMap = {
      primary: 'bg-govbr-primary text-govbr-on-primary',
      neutral: 'bg-govbr-gray-20 text-govbr-gray-80',
      success: 'bg-govbr-success text-govbr-on-primary',
      danger: 'bg-govbr-danger text-govbr-on-primary',
      warning: 'bg-govbr-warning text-govbr-gray-80',
    } as const;

    return [
      'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 font-rawline font-semibold',
      sizeMap[this.size],
      this.src ? '' : variantMap[this.variant],
    ].filter(Boolean).join(' ');
  }

  get initialsClasses(): string {
    const fontMap = {
      xsmall: 'text-[10px]',
      small: 'text-govbr-xs',
      medium: 'text-govbr-sm',
      large: 'text-govbr-lg',
      xlarge: 'text-govbr-2xl',
    } as const;

    return fontMap[this.size];
  }

  get statusClasses(): string {
    const colorMap = {
      online: 'bg-govbr-success',
      offline: 'bg-govbr-gray-40',
      busy: 'bg-govbr-danger',
      away: 'bg-govbr-warning',
    } as const;

    const dotSize = {
      xsmall: 'w-1.5 h-1.5 border',
      small: 'w-2 h-2 border',
      medium: 'w-2.5 h-2.5 border-2',
      large: 'w-3 h-3 border-2',
      xlarge: 'w-4 h-4 border-2',
    } as const;

    return [
      'absolute bottom-0 right-0 rounded-full border-govbr-on-primary',
      dotSize[this.size],
      colorMap[this.status!],
    ].join(' ');
  }
}
