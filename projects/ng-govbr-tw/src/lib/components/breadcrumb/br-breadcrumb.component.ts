import {
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'br-breadcrumb',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="font-rawline" aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center overflow-x-auto">
        <!-- Home -->
        @if (showHome) {
          <li class="flex items-center">
            <a
              [routerLink]="homeRoute"
              class="text-govbr-primary hover:text-govbr-primary-dark govbr-focus-ring rounded transition-colors"
              aria-label="Página inicial"
              >
              <i class="fa-solid fa-house text-govbr-sm"></i>
            </a>
            <i class="fa-solid fa-chevron-right text-[10px] text-govbr-gray-40 mx-2"></i>
          </li>
        }
    
        <!-- Items -->
        @for (item of items; track item; let last = $last) {
          <li
            class="flex items-center"
            >
            @if (!last && item.route) {
              <a
                [routerLink]="item.route"
                class="text-govbr-sm text-govbr-primary hover:text-govbr-primary-dark truncate max-w-[180px] transition-colors govbr-focus-ring rounded"
                [title]="item.label"
                >
                {{ item.label }}
              </a>
            }
            @if (last || !item.route) {
              <span
                class="text-govbr-sm text-govbr-gray-60 truncate max-w-[180px]"
                [attr.aria-current]="last ? 'page' : null"
                [title]="item.label"
                >
                {{ item.label }}
              </span>
            }
            @if (!last) {
              <i
                class="fa-solid fa-chevron-right text-[10px] text-govbr-gray-40 mx-2"
              ></i>
            }
          </li>
        }
      </ol>
    </nav>
    `,
})
export class BrBreadcrumbComponent {
  @Input() items: BrBreadcrumbItem[] = [];
  @Input() showHome = true;
  @Input() homeRoute: string | unknown[] = '/';
}

export interface BrBreadcrumbItem {
  label: string;
  route?: string | unknown[];
}
