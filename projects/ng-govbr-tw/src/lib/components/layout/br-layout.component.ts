import { Component, ViewEncapsulation } from '@angular/core';


/**
 * BrLayoutComponent — Main application layout following GovBR DS.
 *
 * Structure:
 * ┌──────────────────────────────────────────┐
 * │ br-header                                │
 * ├──────────────────────────────────────────┤
 * │ br-menu-bar / br-mega-menu (optional)    │
 * ├────────┬─────────────────────────────────┤
 * │ br-menu│  main content                   │
 * │ (push) │  (scrollable)                   │
 * │        │                                 │
 * ├────────┴─────────────────────────────────┤
 * │ br-footer                                │
 * └──────────────────────────────────────────┘
 *
 * The br-menu is a push sidebar — when open it takes space
 * and pushes the main content to the right.
 *
 * Usage:
 * ```html
 * <br-layout>
 *   <br-header menuMode="sidebar" (menuToggle)="menuOpen = $event"></br-header>
 *   <br-menu [open]="menuOpen" (openChange)="menuOpen = $event">
 *     <br-menu-item label="Home" icon="house" route="/"></br-menu-item>
 *   </br-menu>
 *   <div>Page content</div>
 *   <br-footer></br-footer>
 * </br-layout>
 * ```
 */
@Component({
  selector: 'br-layout',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="flex flex-col min-h-screen font-rawline">
      <!-- Header -->
      <ng-content select="br-header"></ng-content>

      <!-- Slot for bar below header (br-menu-bar, br-mega-menu, etc.) -->
      <ng-content select="br-menu-bar, br-mega-menu, [layout-bar]"></ng-content>

      <!-- Content area: sidebar (push) + main -->
      <div class="flex flex-1 min-h-0">
        <!-- Push sidebar (br-menu) — inline, takes space when open -->
        <ng-content select="br-menu"></ng-content>

        <!-- Push sidebar (br-sidebar) — for shadcn-style sidebar -->
        <ng-content select="br-sidebar"></ng-content>

        <!-- Main content -->
        <main class="flex-1 bg-govbr-gray-2 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <ng-content></ng-content>
        </main>
      </div>

      <!-- Footer -->
      <ng-content select="br-footer"></ng-content>
    </div>
  `,
})
export class BrLayoutComponent {}
