import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BrHeaderComponent,
  BrFooterComponent,
} from 'ng-govbr-tw';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BrHeaderComponent,
    BrFooterComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="min-h-screen flex flex-col bg-govbr-gray-2">
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <br-footer
        logoSrc="https://www.gov.br/++theme++flavor/static/images/govbr-logo-large.png"
      >
        <div class="text-center text-sm text-govbr-gray-60">
          <p>Biblioteca open-source para Angular 17+</p>
          <p class="mt-1">
            <a href="https://github.com/jordaobass/ng-govbr-tw" target="_blank" class="text-govbr-primary hover:underline">
              GitHub
            </a>
            &bull;
            <a href="https://www.npmjs.com/package/@schenkerjon/ng-govbr-tw" target="_blank" class="text-govbr-primary hover:underline">
              NPM
            </a>
          </p>
        </div>
      </br-footer>
    </div>
  `,
})
export class AppComponent {}
