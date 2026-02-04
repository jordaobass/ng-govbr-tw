import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'br-menu-item',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Link item (no children) -->
    @if (route && !hasChildren) {
      <a
        [routerLink]="route"
        routerLinkActive
        #rla="routerLinkActive"
        [routerLinkActiveOptions]="{ exact: exact }"
        [class]="rla.isActive ? activeClasses : itemClasses"
        role="menuitem"
        >
        @if (icon) {
          <i [class]="rla.isActive ? activeIconClasses : iconClasses" aria-hidden="true"></i>
        }
        <span class="flex-1 truncate">{{ label }}</span>
        @if (badge) {
          <span [class]="badgeClasses" [attr.aria-label]="badge + ' notificações'">{{ badge }}</span>
        }
      </a>
    } @else {
      <button
        type="button"
        [class]="itemClasses"
        [attr.aria-expanded]="hasChildren ? expanded : null"
        [attr.aria-haspopup]="hasChildren ? 'true' : null"
        [attr.role]="hasChildren ? 'treeitem' : 'menuitem'"
        (click)="onClick()"
        >
        @if (icon) {
          <i [class]="iconClasses" aria-hidden="true"></i>
        }
        <span class="flex-1 truncate text-left">{{ label }}</span>
        @if (badge && !hasChildren) {
          <span [class]="badgeClasses" [attr.aria-label]="badge + ' notificações'">{{ badge }}</span>
        }
        @if (hasChildren) {
          <i
            class="fa-solid fa-chevron-down text-xs transition-transform duration-200 text-govbr-primary/60"
            [class.rotate-180]="expanded"
            aria-hidden="true"
          ></i>
        }
      </button>
      @if (hasChildren && expanded) {
        <div
          class="bg-govbr-gray-2 border-l-2 border-govbr-primary ml-4"
          role="group"
          [attr.aria-label]="label"
          >
          <ng-content></ng-content>
        </div>
      }
    }
    
    `,
})
export class BrMenuItemComponent {
  @Input() route?: string | unknown[];
  @Input() label = '';
  @Input() icon?: string;
  @Input() badge?: string | number;
  @Input() exact = false;
  @Input() hasChildren = false;
  @Input() expanded = false;
  @Output() action = new EventEmitter<void>();
  @Output() expandedChange = new EventEmitter<boolean>();

  onClick(): void {
    if (this.hasChildren) {
      this.expanded = !this.expanded;
      this.expandedChange.emit(this.expanded);
    } else {
      this.action.emit();
    }
  }

  get itemClasses(): string {
    return [
      'flex items-center gap-3 px-4 py-3 text-sm w-full',
      'text-govbr-primary font-medium',
      'hover:bg-govbr-primary-lightest hover:text-govbr-primary-dark',
      'govbr-focus-ring',
      'transition-colors cursor-pointer',
    ].join(' ');
  }

  get activeClasses(): string {
    return [
      'flex items-center gap-3 px-4 py-3 text-sm w-full',
      'bg-govbr-primary text-white font-semibold',
      'govbr-focus-ring',
      'cursor-pointer',
    ].join(' ');
  }

  get iconClasses(): string {
    return `fa-solid fa-${this.icon} w-5 text-center flex-shrink-0 leading-none text-govbr-primary`;
  }

  get activeIconClasses(): string {
    return `fa-solid fa-${this.icon} w-5 text-center flex-shrink-0 leading-none text-white`;
  }

  get badgeClasses(): string {
    return 'ml-auto px-1.5 py-0.5 text-xs font-semibold leading-none rounded-govbr-pill bg-govbr-danger text-white self-center';
  }
}
