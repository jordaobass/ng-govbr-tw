import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { BrAnimationService } from '../../animations/animation.service';

// ─── BrMegaMenu (container) ─────────────────────────────────────────────────

@Component({
  selector: 'br-mega-menu',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    @keyframes br-mega-menu-dropdown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  template: `
    <div class="hidden md:block relative font-rawline">
      <!-- Trigger bar -->
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
          class="absolute left-0 right-0 z-50 bg-white border-b border-govbr-gray-10 shadow-lg"
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
    `,
})
export class BrMegaMenuComponent {
  private readonly animationService = inject(BrAnimationService);
  private elementRef = inject(ElementRef);

  @Input() variant: 'primary' | 'dark' | 'white' = 'primary';
  @Input() activePanel: string | null = null;
  @Output() activePanelChange = new EventEmitter<string | null>();

  get panelAnimation(): string {
    if (!this.animationService.isEnabled()) return 'none';
    return 'br-mega-menu-dropdown 200ms ease-out forwards';
  }

  toggle(panelId: string): void {
    this.activePanel = this.activePanel === panelId ? null : panelId;
    this.activePanelChange.emit(this.activePanel);
  }

  close(): void {
    this.activePanel = null;
    this.activePanelChange.emit(null);
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
  }

  get barClasses(): string {
    const variants = {
      primary: 'bg-govbr-primary text-white',
      dark: 'bg-govbr-primary-darkest text-white',
      white: 'bg-white text-govbr-gray-80 border-b border-govbr-gray-10',
    } as const;
    return variants[this.variant];
  }
}

// ─── BrMegaMenuTrigger ──────────────────────────────────────────────────────

@Component({
  selector: 'br-mega-menu-trigger',
  standalone: true,
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
      primary: 'text-white hover:bg-white/15',
      dark: 'text-white hover:bg-white/15',
      white: 'text-govbr-gray-80 hover:bg-govbr-primary-lightest hover:text-govbr-primary',
    } as const;

    const activeBg = this.isActive
      ? (this.variant === 'white' ? 'bg-govbr-primary-lightest text-govbr-primary' : 'bg-white/15')
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
