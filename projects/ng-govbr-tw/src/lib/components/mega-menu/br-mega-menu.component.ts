import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrAnimationService } from '../../animations/animation.service';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BrMenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: BrMenuItem[];
  section?: string; // For grouping (e.g., 'Links úteis', 'Redes sociais')
}

export interface BrSocialLink {
  icon: string;
  url: string;
  label: string;
}

// ─── BrMegaMenu (container) ─────────────────────────────────────────────────

@Component({
  selector: 'br-mega-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    @keyframes br-mega-menu-dropdown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes br-drawer-slide-in {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @keyframes br-drawer-slide-out {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
    @keyframes br-overlay-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes br-drawer-stack-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes br-drawer-stack-out {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `],
  template: `
    <!-- ═══ DESKTOP: Horizontal mega menu bar ═══ -->
    <div class="hidden md:block relative font-rawline">
      <nav
        [class]="barClasses"
        role="navigation"
        aria-label="Menu principal"
      >
        <div class="max-w-[1280px] mx-auto px-4">
          <ul class="flex items-center gap-0 overflow-x-auto" role="menubar">
            <ng-content select="br-mega-menu-trigger"></ng-content>
          </ul>
        </div>
      </nav>

      <!-- Mega panel (full-width dropdown) -->
      @if (activePanel) {
        <div
          class="absolute left-0 right-0 z-50 bg-govbr-bg border-b border-govbr-gray-10 shadow-lg"
          role="region"
          [attr.aria-label]="'Painel ' + activePanel"
          [style.animation]="panelAnimation"
        >
          <div class="max-w-[1280px] mx-auto px-4 py-6">
            <ng-content select="br-mega-menu-panel"></ng-content>
          </div>
        </div>
      }
    </div>

    <!-- ═══ MOBILE: Drawer menu ═══ -->
    @if (mobileOpen) {
      <!-- Overlay -->
      <div
        class="md:hidden fixed inset-0 z-[998] bg-black/35"
        [style.animation]="overlayAnimation"
        (click)="closeMobile()"
        aria-hidden="true"
      ></div>

      <!-- Drawer -->
      <nav
        class="md:hidden fixed left-0 top-0 bottom-0 z-[999] w-[85vw] max-w-[360px] bg-govbr-gray-2 flex flex-col shadow-xl"
        [style.animation]="drawerAnimation"
        role="navigation"
        aria-label="Menu principal"
        (keydown)="onDrawerKeydown($event)"
        #drawerEl
      >
        <!-- Drawer Header -->
        <div class="flex items-center justify-between px-4 py-3 bg-govbr-bg border-b border-govbr-gray-5">
          @if (navigationStack.length > 0) {
            <button
              type="button"
              class="flex items-center gap-2 text-govbr-primary text-sm font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-govbr-focus-color rounded px-2 py-1 -ml-2"
              (click)="navigateBack()"
              aria-label="Voltar"
            >
              <i class="fa-solid fa-arrow-left"></i>
              <span>Voltar</span>
            </button>
          } @else {
            <div class="flex items-center gap-3">
              @if (logoSrc) {
                <img [src]="logoSrc" [alt]="logoAlt" class="h-6" />
              }
              @if (drawerTitle) {
                <span class="text-sm font-semibold text-govbr-gray-80">{{ drawerTitle }}</span>
              }
            </div>
          }
          <button
            type="button"
            class="w-10 h-10 flex items-center justify-center rounded-full text-govbr-gray-60 hover:bg-govbr-gray-2 transition-colors focus:outline-none focus:ring-2 focus:ring-govbr-focus-color"
            (click)="closeMobile()"
            aria-label="Fechar menu"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Menu Items -->
        <div class="flex-1 overflow-y-auto">
          <!-- Current level title -->
          @if (navigationStack.length > 0) {
            <div class="px-4 py-3 bg-govbr-bg border-b border-govbr-gray-5">
              <span class="text-sm font-semibold text-govbr-gray-80">{{ currentLevelTitle }}</span>
            </div>
          }

          <ul role="menu" class="py-2">
            @for (item of currentMenuItems; track item.id; let i = $index) {
              @if (item.section && (i === 0 || currentMenuItems[i-1]?.section !== item.section)) {
                <li class="mt-6 first:mt-2">
                  <span class="block px-4 py-2 text-xs font-semibold text-govbr-gray-40 uppercase tracking-wider">
                    {{ item.section }}
                  </span>
                </li>
              }
              <li role="none">
                <button
                  type="button"
                  [class]="getItemClasses(item, i)"
                  [attr.aria-expanded]="item.children ? 'false' : null"
                  [attr.aria-haspopup]="item.children ? 'true' : null"
                  role="menuitem"
                  [attr.tabindex]="i === focusedIndex ? 0 : -1"
                  (click)="onItemClick(item)"
                  (focus)="focusedIndex = i"
                  #menuItem
                >
                  @if (item.icon) {
                    <i [class]="'fa-solid fa-' + item.icon + ' w-5 text-center'"></i>
                  }
                  <span class="flex-1 text-left">{{ item.label }}</span>
                  @if (item.children && item.children.length > 0) {
                    <i class="fa-solid fa-chevron-right text-xs text-govbr-gray-40"></i>
                  }
                </button>
              </li>
            }
          </ul>

          <!-- Social Links Section -->
          @if (socialLinks.length > 0 && navigationStack.length === 0) {
            <div class="mt-6 px-4 py-4 border-t border-govbr-gray-5">
              <span class="block text-xs font-semibold text-govbr-gray-40 uppercase tracking-wider mb-3">
                Redes sociais
              </span>
              <div class="flex items-center gap-3">
                @for (social of socialLinks; track social.url) {
                  <a
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    [attr.aria-label]="social.label"
                    class="w-10 h-10 flex items-center justify-center rounded-full bg-govbr-bg border border-govbr-gray-5 text-govbr-gray-60 hover:text-govbr-primary hover:border-govbr-primary transition-colors focus:outline-none focus:ring-2 focus:ring-govbr-focus-color"
                  >
                    <ng-container *ngTemplateOutlet="socialIconTemplate || defaultSocialIcon; context: { $implicit: social }"></ng-container>
                    <ng-template #defaultSocialIcon>
                      <i [class]="'fa-brands fa-' + social.icon"></i>
                    </ng-template>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </nav>
    }
  `,
})
export class BrMegaMenuComponent {
  private readonly animationService = inject(BrAnimationService);
  private elementRef = inject(ElementRef);

  // Desktop inputs
  @Input() variant: 'primary' | 'dark' | 'white' = 'primary';
  @Input() activePanel: string | null = null;
  @Output() activePanelChange = new EventEmitter<string | null>();

  // Mobile drawer inputs
  @Input() mobileOpen = false;
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  @Input() menuItems: BrMenuItem[] = [];
  @Input() socialLinks: BrSocialLink[] = [];
  @Input() logoSrc?: string;
  @Input() logoAlt = 'Logo';
  @Input() drawerTitle?: string;

  // Template for custom social icons
  @ContentChild('socialIcon') socialIconTemplate?: TemplateRef<unknown>;

  // Mobile navigation stack
  navigationStack: { items: BrMenuItem[]; title: string }[] = [];
  focusedIndex = 0;
  private isClosing = false;

  get currentMenuItems(): BrMenuItem[] {
    if (this.navigationStack.length === 0) {
      return this.menuItems;
    }
    return this.navigationStack[this.navigationStack.length - 1].items;
  }

  get currentLevelTitle(): string {
    if (this.navigationStack.length === 0) return '';
    return this.navigationStack[this.navigationStack.length - 1].title;
  }

  get panelAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-mega-menu-dropdown 200ms ease-out forwards';
  }

  get drawerAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return this.isClosing
      ? 'br-drawer-slide-out 200ms ease-in forwards'
      : 'br-drawer-slide-in 250ms ease-out forwards';
  }

  get overlayAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-overlay-fade-in 200ms ease-out forwards';
  }

  // Desktop methods
  toggle(panelId: string): void {
    this.activePanel = this.activePanel === panelId ? null : panelId;
    this.activePanelChange.emit(this.activePanel);
  }

  close(): void {
    this.activePanel = null;
    this.activePanelChange.emit(null);
  }

  // Mobile methods
  openMobile(): void {
    this.mobileOpen = true;
    this.mobileOpenChange.emit(true);
    this.focusedIndex = 0;
    this.navigationStack = [];
  }

  closeMobile(): void {
    if (this.animationService.isEnabled()) {
      this.isClosing = true;
      setTimeout(() => {
        this.mobileOpen = false;
        this.mobileOpenChange.emit(false);
        this.isClosing = false;
        this.navigationStack = [];
      }, 200);
    } else {
      this.mobileOpen = false;
      this.mobileOpenChange.emit(false);
      this.navigationStack = [];
    }
  }

  onItemClick(item: BrMenuItem): void {
    if (item.children && item.children.length > 0) {
      // Navigate to submenu
      this.navigationStack.push({
        items: item.children,
        title: item.label,
      });
      this.focusedIndex = 0;
    } else if (item.route) {
      // Navigate to route and close
      this.closeMobile();
    }
  }

  navigateBack(): void {
    if (this.navigationStack.length > 0) {
      this.navigationStack.pop();
      this.focusedIndex = 0;
    }
  }

  getItemClasses(item: BrMenuItem, index: number): string {
    const isActive = this.focusedIndex === index;
    const base = [
      'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
      'border-b border-govbr-gray-5 last:border-b-0',
      'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-govbr-focus-color focus:ring-dashed',
    ];

    if (isActive) {
      base.push('bg-govbr-primary-darkest text-govbr-on-primary');
    } else {
      base.push('bg-govbr-bg text-govbr-gray-80 hover:bg-govbr-gray-2');
    }

    return base.join(' ');
  }

  onDrawerKeydown(event: KeyboardEvent): void {
    const items = this.currentMenuItems;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex + 1) % items.length;
        this.focusCurrentItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex - 1 + items.length) % items.length;
        this.focusCurrentItem();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (items[this.focusedIndex]) {
          this.onItemClick(items[this.focusedIndex]);
        }
        break;
      case 'ArrowLeft':
      case 'Backspace':
        if (this.navigationStack.length > 0) {
          event.preventDefault();
          this.navigateBack();
        }
        break;
      case 'ArrowRight': {
        const currentItem = items[this.focusedIndex];
        if (currentItem?.children?.length) {
          event.preventDefault();
          this.onItemClick(currentItem);
        }
        break;
      }
    }
  }

  private focusCurrentItem(): void {
    setTimeout(() => {
      const items = this.elementRef.nativeElement.querySelectorAll('[role="menuitem"]');
      if (items[this.focusedIndex]) {
        items[this.focusedIndex].focus();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.activePanel && !this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activePanel) {
      this.close();
    }
    if (this.mobileOpen) {
      this.closeMobile();
    }
  }

  get barClasses(): string {
    const variants = {
      primary: 'bg-govbr-primary text-govbr-on-primary',
      dark: 'bg-govbr-primary-darkest text-govbr-on-primary',
      white: 'bg-govbr-bg text-govbr-gray-80 border-b border-govbr-gray-10',
    } as const;
    return variants[this.variant];
  }
}

// ─── BrMegaMenuTrigger ──────────────────────────────────────────────────────

@Component({
  selector: 'br-mega-menu-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <li role="none">
      <button
        type="button"
        [class]="triggerClasses"
        [attr.aria-expanded]="isActive"
        aria-haspopup="true"
        role="menuitem"
        (click)="onToggle()"
        (keydown.escape)="onClose()"
      >
        @if (icon) {
          <i [class]="'fa-solid fa-' + icon + ' mr-2 text-sm'"></i>
        }
        {{ label }}
        <i
          class="fa-solid fa-chevron-down ml-1.5 text-xs transition-transform duration-200"
          [class.rotate-180]="isActive"
        ></i>
      </button>
    </li>
  `,
})
export class BrMegaMenuTriggerComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() panelId = '';
  @Input() isActive = false;
  @Input() variant: 'primary' | 'dark' | 'white' = 'primary';
  @Output() panelToggle = new EventEmitter<string>();
  @Output() panelClose = new EventEmitter<void>();

  onToggle(): void {
    this.panelToggle.emit(this.panelId);
  }

  onClose(): void {
    this.panelClose.emit();
  }

  get triggerClasses(): string {
    const variantMap = {
      primary: 'text-govbr-on-primary hover:bg-govbr-bg/15',
      dark: 'text-govbr-on-primary hover:bg-govbr-bg/15',
      white: 'text-govbr-gray-80 hover:bg-govbr-primary-lightest hover:text-govbr-primary',
    } as const;

    const activeBg = this.isActive
      ? (this.variant === 'white' ? 'bg-govbr-primary-lightest text-govbr-primary' : 'bg-govbr-bg/15')
      : '';

    return [
      'flex items-center px-4 py-3 text-govbr-sm font-semibold font-rawline transition-colors whitespace-nowrap cursor-pointer',
      'govbr-focus-ring',
      variantMap[this.variant],
      activeBg,
    ].filter(Boolean).join(' ');
  }
}

// ─── BrMegaMenuPanel ────────────────────────────────────────────────────────

@Component({
  selector: 'br-mega-menu-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (isActive) {
      <div class="flex flex-wrap gap-8">
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class BrMegaMenuPanelComponent {
  @Input() panelId = '';
  @Input() isActive = false;
}

// ─── BrMegaMenuColumn ───────────────────────────────────────────────────────

@Component({
  selector: 'br-mega-menu-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="min-w-[200px] flex-1">
      @if (title) {
        <h5 class="text-govbr-sm font-semibold text-govbr-gray-80 mb-2 px-2">{{ title }}</h5>
      }
      <ul role="list" class="space-y-0.5">
        <ng-content></ng-content>
      </ul>
    </div>
  `,
})
export class BrMegaMenuColumnComponent {
  @Input() title?: string;
}

// ─── BrMegaMenuLink ─────────────────────────────────────────────────────────

@Component({
  selector: 'br-mega-menu-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <li>
      @if (route) {
        <a
          [routerLink]="route"
          class="flex items-center gap-2 px-2 py-2 text-govbr-sm text-govbr-gray-60 hover:text-govbr-primary hover:bg-govbr-gray-2 rounded transition-colors govbr-focus-ring"
        >
          @if (icon) {
            <i [class]="'fa-solid fa-' + icon + ' w-4 text-center text-govbr-gray-40'"></i>
          }
          <span>{{ label }}</span>
        </a>
      } @else {
        <button
          type="button"
          class="flex items-center gap-2 w-full px-2 py-2 text-govbr-sm text-govbr-gray-60 hover:text-govbr-primary hover:bg-govbr-gray-2 rounded transition-colors text-left govbr-focus-ring"
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
export class BrMegaMenuLinkComponent {
  @Input() route?: string | unknown[];
  @Input() label = '';
  @Input() icon?: string;
  @Output() action = new EventEmitter<void>();
}
