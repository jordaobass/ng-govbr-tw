import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';


/**
 * BrMenuComponent — Push sidebar menu following GovBR DS pattern.
 *
 * When open, the menu occupies space in the layout and pushes the
 * main content to the right. No overlay, no scrim.
 *
 * Text color follows GovBR DS: blue interactive text, white on active.
 */
@Component({
  selector: 'br-menu',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open) {
      <nav
        [class]="panelClasses"
        role="navigation"
        [attr.aria-label]="ariaLabel"
        >
        <!-- Menu body (scrollable) -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <ng-content></ng-content>
        </div>
        <!-- Menu footer (optional slot) -->
        <div [class.hidden]="!hasFooter" [class]="footerClasses">
          <ng-content select="[menu-footer]"></ng-content>
        </div>
      </nav>
    }
    `,
})
export class BrMenuComponent {
  @Input() open = true;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() variant: 'white' | 'light' = 'white';
  @Input() width: 'narrow' | 'default' | 'wide' = 'default';
  @Input() hasFooter = false;
  @Input() ariaLabel = 'Menu principal';

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close();
    }
  }

  get panelClasses(): string {
    const widthMap: Record<string, string> = {
      narrow: 'w-60',
      default: 'w-64',
      wide: 'w-72',
    };

    const variantMap: Record<string, string> = {
      white: 'bg-white border-r border-govbr-gray-10',
      light: 'bg-govbr-gray-2 border-r border-govbr-gray-10',
    };

    return [
      'flex flex-col font-rawline min-h-0 h-full flex-shrink-0',
      widthMap[this.width],
      variantMap[this.variant],
    ].join(' ');
  }

  get footerClasses(): string {
    return 'border-t border-govbr-gray-10 px-4 py-3 flex-shrink-0';
  }
}
