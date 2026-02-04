import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';


@Component({
  selector: 'br-tab-panel',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class BrTabPanelComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() counter?: number;
  @Input() disabled = false;
  @ContentChildren('content') contentRef!: QueryList<unknown>;

  get templateRef(): TemplateRef<unknown> {
    return this._template;
  }
  _template!: TemplateRef<unknown>;
}

@Component({
  selector: 'br-tab',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="font-rawline">
      <!-- Tab navigation -->
      <nav
        [class]="navClasses"
        role="tablist"
        >
        @for (tab of tabs; track tab; let i = $index) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="activeIndex === i"
            [attr.aria-controls]="'br-tab-panel-' + id + '-' + i"
            [disabled]="tab.disabled"
            [class]="getTabClasses(i, !!tab.disabled)"
            (click)="selectTab(i)"
            >
            @if (tab.icon) {
              <i [class]="'fa-solid fa-' + tab.icon + ' mr-2'"></i>
            }
            <span>{{ tab.label }}</span>
            @if (tab.counter !== undefined) {
              <span
                class="ml-2 px-1.5 py-0.5 text-govbr-xs rounded-govbr-pill bg-govbr-primary text-white font-semibold"
                >
                {{ tab.counter }}
              </span>
            }
          </button>
        }
      </nav>
    
      <!-- Tab panels -->
      <div class="tab-content">
        @for (tab of tabs; track tab; let i = $index) {
          <div
            role="tabpanel"
            [id]="'br-tab-panel-' + id + '-' + i"
            [class]="panelClasses(i)"
            >
            @if (activeIndex === i) {
              <ng-content select="br-tab-panel"></ng-content>
            }
          </div>
        }
      </div>
    </div>
    `,
})
export class BrTabComponent {
  @Input() density: 'small' | 'medium' | 'large' = 'medium';
  @Input() activeIndex = 0;
  @Input() tabs: BrTabItem[] = [];
  @Input() inverted = false;

  @Output() activeIndexChange = new EventEmitter<number>();

  private static nextId = 0;
  id = BrTabComponent.nextId++;

  get navClasses(): string {
    const base = 'flex overflow-x-auto border-b border-govbr-gray-10 scrollbar-thin';
    const bg = this.inverted ? 'bg-govbr-primary-darkest' : '';
    return [base, bg].filter(Boolean).join(' ');
  }

  getTabClasses(index: number, disabled: boolean): string {
    const densitySizes = {
      small: 'px-4 py-2 text-govbr-sm',
      medium: 'px-6 py-3 text-govbr-base',
      large: 'px-8 py-4 text-govbr-lg',
    } as const;

    const base = [
      'inline-flex items-center whitespace-nowrap font-semibold font-rawline transition-colors',
      'border-b-4 -mb-px govbr-focus-ring',
      densitySizes[this.density],
    ].join(' ');

    const isActive = this.activeIndex === index;

    let stateCls: string;
    if (disabled) {
      stateCls = 'border-transparent text-govbr-gray-20 cursor-not-allowed';
    } else if (isActive) {
      stateCls = this.inverted
        ? 'border-white text-white'
        : 'border-govbr-primary text-govbr-primary';
    } else {
      stateCls = this.inverted
        ? 'border-transparent text-white/60 hover:text-white hover:border-white/40'
        : 'border-transparent text-govbr-gray-60 hover:text-govbr-primary hover:border-govbr-gray-20';
    }

    return [base, stateCls].join(' ');
  }

  panelClasses(index: number): string {
    return this.activeIndex === index ? 'p-4' : 'hidden';
  }

  selectTab(index: number): void {
    if (!this.tabs[index]?.disabled) {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
    }
  }
}

export interface BrTabItem {
  label: string;
  icon?: string;
  counter?: number;
  disabled?: boolean;
}
