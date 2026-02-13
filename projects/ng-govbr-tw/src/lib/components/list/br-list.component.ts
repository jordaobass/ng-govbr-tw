import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { RouterModule } from '@angular/router';

/**
 * BrItemComponent — Structured list item following GovBR DS pattern.
 *
 * Usage:
 * ```html
 * <br-item title="Documento" subtitle="Atualizado em 01/01/2024" icon="file">
 *   <span item-meta>PDF • 2.4 MB</span>
 * </br-item>
 * ```
 */
@Component({
  selector: 'br-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="itemClasses" [attr.role]="clickable ? 'button' : null" [attr.tabindex]="clickable ? 0 : null" (click)="onItemClick()" (keydown.enter)="onItemClick()">
      <!-- Leading icon/avatar -->
      @if (icon || avatarSrc) {
        <div class="flex-shrink-0">
          @if (avatarSrc) {
            <img
              [src]="avatarSrc"
              [alt]="avatarAlt || ''"
              class="w-10 h-10 rounded-full object-cover"
              />
          } @else {
            <div [class]="iconWrapperClasses">
              <i [class]="'fa-solid fa-' + icon + ' text-sm'"></i>
            </div>
          }
        </div>
      }
    
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-govbr-gray-80 truncate">{{ title }}</span>
          @if (tag) {
            <span
              class="px-1.5 py-0.5 text-govbr-xs font-semibold rounded-govbr-pill bg-govbr-primary-lightest text-govbr-primary flex-shrink-0"
              >
              {{ tag }}
            </span>
          }
        </div>
        @if (subtitle) {
          <p class="text-xs text-govbr-gray-60 mt-0.5 truncate">{{ subtitle }}</p>
        }
        <div class="mt-1">
          <ng-content></ng-content>
        </div>
      </div>
    
      <!-- Trailing meta / actions -->
      <div class="flex-shrink-0 flex items-center gap-2">
        <ng-content select="[item-meta]"></ng-content>
        <ng-content select="[item-actions]"></ng-content>
        @if (showArrow) {
          <i class="fa-solid fa-chevron-right text-xs text-govbr-gray-40"></i>
        }
      </div>
    </div>
    `,
})
export class BrItemComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() avatarSrc?: string;
  @Input() avatarAlt?: string;
  @Input() tag?: string;
  @Input() clickable = false;
  @Input() showArrow = false;
  @Input() selected = false;
  @Input() disabled = false;
  @Input() variant: 'default' | 'compact' = 'default';

  @Output() itemClick = new EventEmitter<void>();

  onItemClick(): void {
    if (!this.disabled && this.clickable) {
      this.itemClick.emit();
    }
  }

  get itemClasses(): string {
    const base = 'flex items-center gap-3 font-rawline';
    const padding = this.variant === 'compact' ? 'px-4 py-2' : 'px-4 py-3';
    const border = 'border-b border-govbr-gray-5 last:border-b-0';
    const interactive = this.clickable && !this.disabled
      ? 'hover:bg-govbr-gray-2 cursor-pointer transition-colors govbr-focus-ring focus:bg-govbr-gray-2'
      : '';
    const selectedCls = this.selected ? 'bg-govbr-primary-lightest border-l-2 border-l-govbr-primary' : '';
    const disabledCls = this.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return [base, padding, border, interactive, selectedCls, disabledCls].filter(Boolean).join(' ');
  }

  get iconWrapperClasses(): string {
    return 'w-10 h-10 rounded-full bg-govbr-primary-lightest text-govbr-primary flex items-center justify-center flex-shrink-0';
  }
}

/**
 * BrListComponent — Structured list wrapper following GovBR DS.
 *
 * Usage:
 * ```html
 * <br-list title="Documentos recentes" [divider]="true">
 *   <br-item title="Relatório" icon="file"></br-item>
 *   <br-item title="Planilha" icon="table"></br-item>
 * </br-list>
 * ```
 */
@Component({
  selector: 'br-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="listClasses" [attr.role]="role">
      @if (title) {
        <div class="px-4 py-2 border-b border-govbr-gray-10">
          <h3 class="text-sm font-semibold text-govbr-gray-80">{{ title }}</h3>
          @if (subtitle) {
            <p class="text-xs text-govbr-gray-60 mt-0.5">{{ subtitle }}</p>
          }
        </div>
      }
      <ng-content></ng-content>
    </div>
    `,
})
export class BrListComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() variant: 'default' | 'bordered' | 'card' = 'default';
  @Input() role: 'list' | 'listbox' | 'menu' = 'list';

  get listClasses(): string {
    const base = 'font-rawline';
    const variantMap = {
      default: '',
      bordered: 'border border-govbr-gray-10 rounded',
      card: 'bg-govbr-bg border border-govbr-gray-5 rounded shadow-sm',
    } as const;
    return `${base} ${variantMap[this.variant]}`;
  }
}
