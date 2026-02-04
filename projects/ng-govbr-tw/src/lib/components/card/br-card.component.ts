import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'br-card',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="cardClasses">
      <!-- Image (top or left depending on layout) -->
      @if (imageSrc) {
        <div [class]="imageWrapperClasses">
          <img
            [src]="imageSrc"
            [alt]="imageAlt || ''"
            [class]="imageClasses"
            />
        </div>
      }
    
      <!-- Content area -->
      <div [class]="contentClasses">
        <!-- Header with icon -->
        @if (icon || tag) {
          <div class="mb-3 flex items-center gap-2">
            @if (icon) {
              <i [class]="'fa-solid fa-' + icon + ' text-govbr-primary text-2xl'"></i>
            }
            @if (tag) {
              <span
                class="px-2 py-0.5 text-govbr-xs font-semibold rounded-govbr-pill bg-govbr-primary-lightest text-govbr-primary"
                >
                {{ tag }}
              </span>
            }
          </div>
        }
    
        <!-- Title -->
        @if (cardTitle) {
          <h3 class="text-govbr-base font-semibold text-govbr-gray-80 mb-1 leading-tight">{{ cardTitle }}</h3>
        }
    
        <!-- Subtitle -->
        @if (subtitle) {
          <p class="text-govbr-sm text-govbr-gray-60 mb-2">{{ subtitle }}</p>
        }
    
        <!-- Custom content -->
        <ng-content></ng-content>
    
        <!-- Footer with link -->
        @if (linkText) {
          <div class="mt-3 pt-3 border-t border-govbr-gray-5">
            @if (linkRoute) {
              <a
                [routerLink]="linkRoute"
                class="text-govbr-primary text-sm font-semibold hover:underline inline-flex items-center"
                >
                {{ linkText }}
                <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
              </a>
            } @else {
              @if (linkText) {
                <button
                  type="button"
                  class="text-govbr-primary text-sm font-semibold hover:underline inline-flex items-center"
                  (click)="linkClick.emit()"
                  >
                  {{ linkText }}
                  <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
                </button>
              }
            }
          </div>
        }
    
        <!-- Custom footer -->
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
    `,
})
export class BrCardComponent {
  @Input() icon?: string;
  @Input() cardTitle?: string;
  @Input() subtitle?: string;
  @Input() tag?: string;
  @Input() linkText?: string;
  @Input() linkRoute?: string | unknown[];
  /** Card layout: 'vertical' (default), 'horizontal' */
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  /** Image URL */
  @Input() imageSrc?: string;
  @Input() imageAlt?: string;
  /** Image aspect ratio for vertical layout */
  @Input() imageRatio: '16:9' | '4:3' | '1:1' = '16:9';
  /** Whether card is clickable (adds hover effect) */
  @Input() clickable = false;
  @Output() linkClick = new EventEmitter<void>();

  get cardClasses(): string {
    const base = 'bg-white rounded border border-govbr-gray-5 shadow-sm font-rawline overflow-hidden';
    const hover = this.clickable ? 'hover:shadow-md transition-shadow cursor-pointer' : 'hover:shadow-md transition-shadow';
    const direction = this.layout === 'horizontal' ? 'flex flex-row' : 'flex flex-col';
    return `${base} ${hover} ${direction}`;
  }

  get imageWrapperClasses(): string {
    if (this.layout === 'horizontal') {
      return 'w-40 sm:w-48 flex-shrink-0';
    }
    const ratioMap = {
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '1:1': 'aspect-square',
    } as const;
    return `w-full ${ratioMap[this.imageRatio]}`;
  }

  get imageClasses(): string {
    return 'w-full h-full object-cover';
  }

  get contentClasses(): string {
    return this.layout === 'horizontal' ? 'flex-1 p-4 min-w-0' : 'p-6';
  }
}
