import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { RouterModule } from '@angular/router';

// ─── BrSidebarGroup ─────────────────────────────────────────────────────────

@Component({
  selector: 'br-sidebar-group',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="py-2">
      <ng-content></ng-content>
    </div>
  `,
})
export class BrSidebarGroupComponent {}

// ─── BrSidebarGroupLabel ────────────────────────────────────────────────────

@Component({
  selector: 'br-sidebar-group-label',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <h4 class="px-4 py-1.5 text-govbr-xs font-semibold uppercase tracking-wider text-govbr-gray-40 truncate">
      <ng-content></ng-content>
    </h4>
  `,
})
export class BrSidebarGroupLabelComponent {}

// ─── BrSidebarItem ──────────────────────────────────────────────────────────

@Component({
  selector: 'br-sidebar-item',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (route) {
      <a
        [routerLink]="route"
        routerLinkActive="br-sidebar-item-active"
        [routerLinkActiveOptions]="{ exact: exact }"
        [class]="itemClasses"
        [title]="label"
        >
        @if (icon) {
          <i [class]="iconClasses"></i>
        }
        <span [class]="collapsed ? 'sr-only' : 'truncate'">{{ label }}</span>
        @if (badge && !collapsed) {
          <span
            class="ml-auto px-1.5 py-0.5 text-govbr-xs font-semibold rounded-govbr-pill bg-govbr-danger text-white"
            >
            {{ badge }}
          </span>
        }
      </a>
    } @else {
      <button
        type="button"
        [class]="itemClasses"
        [title]="label"
        (click)="action.emit()"
        >
        @if (icon) {
          <i [class]="iconClasses"></i>
        }
        <span [class]="collapsed ? 'sr-only' : 'truncate'">{{ label }}</span>
        @if (badge && !collapsed) {
          <span
            class="ml-auto px-1.5 py-0.5 text-govbr-xs font-semibold rounded-govbr-pill bg-govbr-danger text-white"
            >
            {{ badge }}
          </span>
        }
      </button>
    }
    `,
  styles: [`
    .br-sidebar-item-active {
      background-color: #1351b4 !important;
      color: #ffffff !important;
    }
    .br-sidebar-item-active i {
      color: #ffffff !important;
    }
  `],
})
export class BrSidebarItemComponent {
  @Input() route?: string | unknown[];
  @Input() label = '';
  @Input() icon?: string;
  @Input() badge?: string | number;
  @Input() collapsed = false;
  @Input() exact = false;
  @Output() action = new EventEmitter<void>();

  get itemClasses(): string {
    const base = [
      'flex items-center gap-3 w-full font-rawline text-govbr-sm transition-colors rounded-md',
      'hover:bg-govbr-primary-lightest hover:text-govbr-primary',
      'govbr-focus-ring',
      'text-govbr-gray-60',
    ].join(' ');

    const padding = this.collapsed
      ? 'justify-center px-2 py-2.5 mx-2'
      : 'px-3 py-2.5 mx-2';

    return `${base} ${padding}`;
  }

  get iconClasses(): string {
    return `fa-solid fa-${this.icon} w-5 text-center text-govbr-gray-40 flex-shrink-0`;
  }
}

// ─── BrSidebarSub ───────────────────────────────────────────────────────────

@Component({
  selector: 'br-sidebar-sub',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class.hidden]="collapsed">
      <!-- Trigger -->
      <button
        type="button"
        [class]="triggerClasses"
        [attr.aria-expanded]="open"
        aria-haspopup="true"
        (click)="open = !open"
        >
        @if (icon) {
          <i [class]="'fa-solid fa-' + icon + ' w-5 text-center text-govbr-gray-40 flex-shrink-0'"></i>
        }
        <span class="truncate">{{ label }}</span>
        <i
          class="fa-solid fa-chevron-down ml-auto text-xs text-govbr-gray-40 transition-transform duration-200"
          [class.rotate-180]="open"
        ></i>
      </button>
    
      <!-- Children -->
      @if (open) {
        <div class="ml-6 border-l border-govbr-gray-10 pl-0">
          <ng-content></ng-content>
        </div>
      }
    </div>
    `,
})
export class BrSidebarSubComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() open = false;
  @Input() collapsed = false;

  get triggerClasses(): string {
    return [
      'flex items-center gap-3 w-full px-3 py-2.5 mx-2 font-rawline text-govbr-sm text-govbr-gray-60 rounded-md',
      'hover:bg-govbr-primary-lightest hover:text-govbr-primary transition-colors',
      'govbr-focus-ring',
    ].join(' ');
  }
}

// ─── BrSidebar (main) ──────────────────────────────────────────────────────

@Component({
  selector: 'br-sidebar',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Desktop sidebar -->
    <aside
      [class]="sidebarClasses"
      role="navigation"
      aria-label="Menu lateral"
      >
      <!-- Header slot -->
      @if (hasHeader) {
        <div [class]="headerClasses">
          <ng-content select="[sidebar-header]"></ng-content>
        </div>
      }
    
      <!-- Content (scrollable) -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <ng-content></ng-content>
      </div>
    
      <!-- Footer slot -->
      @if (hasFooter) {
        <div [class]="footerClasses">
          <ng-content select="[sidebar-footer]"></ng-content>
        </div>
      }
    
      <!-- Collapse toggle (rail) -->
      @if (collapsible) {
        <button
          type="button"
          class="hidden md:flex absolute -right-3 top-6 w-6 h-6 items-center justify-center rounded-full bg-white border border-govbr-gray-10 shadow-sm text-govbr-gray-40 hover:text-govbr-primary hover:border-govbr-primary transition-colors z-10"
          [attr.aria-label]="collapsed ? 'Expandir menu' : 'Recolher menu'"
          (click)="toggleCollapse()"
          >
          <i
            class="fa-solid text-xs"
            [class.fa-chevron-left]="!collapsed"
            [class.fa-chevron-right]="collapsed"
          ></i>
        </button>
      }
    </aside>
    
    <!-- Mobile overlay -->
    @if (mobileOpen) {
      <div
        class="md:hidden fixed inset-0 z-[998] bg-black/40"
        (click)="closeMobile()"
        (keydown.enter)="closeMobile()"
        role="button"
        tabindex="0"
        aria-label="Fechar menu lateral"
      ></div>
    }
    
    <!-- Mobile drawer -->
    @if (mobileOpen) {
      <aside
        class="md:hidden fixed top-0 left-0 z-[999] w-72 h-full bg-white border-r border-govbr-gray-10 shadow-xl overflow-y-auto font-rawline flex flex-col"
        role="navigation"
        aria-label="Menu lateral"
        >
        @if (hasHeader) {
          <div class="px-4 py-4 border-b border-govbr-gray-10">
            <ng-content select="[sidebar-header-mobile]"></ng-content>
          </div>
        }
        <div class="flex-1 overflow-y-auto py-2">
          <ng-content select="[sidebar-mobile]"></ng-content>
        </div>
        @if (hasFooter) {
          <div class="border-t border-govbr-gray-10 px-4 py-3">
            <ng-content select="[sidebar-footer-mobile]"></ng-content>
          </div>
        }
      </aside>
    }
    `,
})
export class BrSidebarComponent {
  @Input() collapsed = false;
  @Input() collapsible = true;
  @Input() variant: 'sidebar' | 'floating' | 'inset' = 'sidebar';
  @Input() hasHeader = false;
  @Input() hasFooter = false;
  @Input() mobileOpen = false;

  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  closeMobile(): void {
    this.mobileOpen = false;
    this.mobileOpenChange.emit(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
      event.preventDefault();
      this.toggleCollapse();
    }
  }

  get sidebarClasses(): string {
    const widthCls = this.collapsed ? 'w-16' : 'w-64';

    const variantMap: Record<string, string> = {
      sidebar: 'border-r border-govbr-gray-10',
      floating: 'm-2 rounded-lg shadow-lg border border-govbr-gray-10',
      inset: 'border-r border-govbr-gray-10',
    };

    return [
      'hidden md:flex flex-col bg-white font-rawline min-h-full relative transition-all duration-200',
      widthCls,
      variantMap[this.variant],
    ].join(' ');
  }

  get headerClasses(): string {
    const padding = this.collapsed ? 'px-2 py-4' : 'px-4 py-4';
    return `${padding} border-b border-govbr-gray-10`;
  }

  get footerClasses(): string {
    const padding = this.collapsed ? 'px-2 py-3' : 'px-4 py-3';
    return `${padding} border-t border-govbr-gray-10 mt-auto`;
  }
}
