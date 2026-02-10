import { Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'br-footer',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <footer class="bg-govbr-primary-darkest text-govbr-on-primary font-rawline mt-auto">
      <div class="max-w-screen-xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          @if (logoSrc) {
            <img
              [src]="logoSrc"
              alt="Logo"
              class="h-8 brightness-0 invert"
              />
          }
          <div class="text-center md:text-right text-sm opacity-80">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </footer>
    `,
})
export class BrFooterComponent {
  @Input() logoSrc = '';
}
