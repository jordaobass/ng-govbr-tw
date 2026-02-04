import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { RouterModule } from '@angular/router';

// ─── BrMenuBar (horizontal navigation bar) ─────────────────────────────────

@Component({
  selector: 'br-menu-bar',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav
      [class]="barClasses"
      class="hidden md:block"
      role="navigation"
      aria-label="Menu principal"
    >
      <div class="max-w-[1280px] mx-auto px-4">
        <ul class="flex items-center gap-0 overflow-x-auto" role="menubar">
          <ng-content></ng-content>
        </ul>
      </div>
    </nav>
  `,
})
export class BrMenuBarComponent {
  @Input() variant: 'primary' | 'dark' | 'white' = 'primary';

  get barClasses(): string {
    const variants: Record<string, string> = {
      primary: 'bg-govbr-primary text-white font-rawline',
      dark: 'bg-govbr-primary-darkest text-white font-rawline',
      white: 'bg-white text-govbr-gray-80 border-b border-govbr-gray-10 font-rawline',
    };
    return variants[this.variant];
  }
}

// ─── BrMenuBarItem ──────────────────────────────────────────────────────────

@Component({
  selector: 'br-menu-bar-item',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <li
      class="relative"
      role="none"
      (mouseenter)="openSub()"
      (mouseleave)="closeSub()"
      >
      @if (route && !hasSubmenu) {
        <a
          [routerLink]="route"
          routerLinkActive="br-menu-bar-active"
          [routerLinkActiveOptions]="{ exact: exact }"
          [class]="itemClasses"
          role="menuitem"
          >
          @if (icon) {
            <i [class]="'fa-solid fa-' + icon + ' mr-2 text-sm'"></i>
          }
          {{ label }}
        </a>
      } @else {
        <button
          type="button"
          [class]="itemClasses"
          role="menuitem"
          [attr.aria-haspopup]="hasSubmenu || null"
          [attr.aria-expanded]="hasSubmenu ? showSub : null"
          (click)="hasSubmenu ? toggleSub() : action.emit()"
          (keydown.escape)="closeSub()"
          (keydown.arrowDown)="hasSubmenu ? openSub() : null"
          >
          @if (icon) {
            <i [class]="'fa-solid fa-' + icon + ' mr-2 text-sm'"></i>
          }
          {{ label }}
          @if (hasSubmenu) {
            <i class="fa-solid fa-chevron-down ml-1.5 text-xs transition-transform duration-200" [class.rotate-180]="showSub"></i>
          }
        </button>
      }
    
      <!-- Submenu dropdown -->
      @if (hasSubmenu && showSub) {
        <ul
          class="absolute left-0 top-full z-50 min-w-[220px] bg-white border border-govbr-gray-10 shadow-lg rounded-b py-1 font-rawline"
          role="menu"
          >
          <ng-content></ng-content>
        </ul>
      }
    </li>
    `,
  styles: [`
    .br-menu-bar-active {
      background-color: rgba(255,255,255,0.15);
    }
  `],
})
export class BrMenuBarItemComponent {
  @Input() route?: string | unknown[];
  @Input() label = '';
  @Input() icon?: string;
  @Input() exact = false;
  @Input() hasSubmenu = false;
  @Input() variant: 'primary' | 'dark' | 'white' = 'primary';
  @Output() action = new EventEmitter<void>();

  showSub = false;

  openSub(): void {
    if (this.hasSubmenu) this.showSub = true;
  }

  closeSub(): void {
    this.showSub = false;
  }

  toggleSub(): void {
    this.showSub = !this.showSub;
  }

  get itemClasses(): string {
    const variantMap: Record<string, string> = {
      primary: 'text-white hover:bg-white/15',
      dark: 'text-white hover:bg-white/15',
      white: 'text-govbr-gray-80 hover:bg-govbr-primary-lightest hover:text-govbr-primary',
    };
    return [
      'flex items-center px-4 py-3 text-govbr-sm font-semibold font-rawline transition-colors whitespace-nowrap cursor-pointer',
      'govbr-focus-ring',
      variantMap[this.variant],
    ].join(' ');
  }
}

// ─── BrMenuBarSubItem (dropdown items) ──────────────────────────────────────

@Component({
  selector: 'br-menu-bar-sub-item',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <li role="none">
      @if (route) {
        <a
          [routerLink]="route"
          routerLinkActive="bg-govbr-primary-lightest text-govbr-primary"
          class="flex items-center gap-3 px-4 py-2.5 text-govbr-sm text-govbr-gray-80 hover:bg-govbr-gray-2 transition-colors govbr-focus-ring focus:bg-govbr-gray-2"
          role="menuitem"
          >
          @if (icon) {
            <i [class]="'fa-solid fa-' + icon + ' w-4 text-center text-govbr-gray-40'"></i>
          }
          <span>{{ label }}</span>
        </a>
      } @else {
        <button
          type="button"
          class="flex items-center gap-3 w-full px-4 py-2.5 text-govbr-sm text-govbr-gray-80 hover:bg-govbr-gray-2 transition-colors text-left govbr-focus-ring focus:bg-govbr-gray-2"
          role="menuitem"
          (click)="action.emit()"
          >
          @if (icon) {
            <i [class]="'fa-solid fa-' + icon + ' w-4 text-center text-govbr-gray-40'"></i>
          }
          <span>{{ label }}</span>
        </button>
      }
    </li>
    `,
})
export class BrMenuBarSubItemComponent {
  @Input() route?: string | unknown[];
  @Input() label = '';
  @Input() icon?: string;
  @Output() action = new EventEmitter<void>();
}
