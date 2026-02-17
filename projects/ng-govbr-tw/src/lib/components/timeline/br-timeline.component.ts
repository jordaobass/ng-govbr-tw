import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BrTimelineItem {
  title: string;
  description?: string;
  date?: string;
  icon?: string;
  status?: 'completed' | 'current' | 'pending';
}

@Component({
  selector: 'br-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="br-timeline font-rawline"
      [class.br-timeline-horizontal]="orientation === 'horizontal'"
      role="list"
      [attr.aria-label]="ariaLabel"
    >
      @for (item of items; track $index; let isFirst = $first; let isLast = $last) {
        <div
          class="br-timeline-item"
          [class.br-timeline-item-completed]="item.status === 'completed'"
          [class.br-timeline-item-current]="item.status === 'current'"
          [class.br-timeline-item-pending]="item.status === 'pending' || !item.status"
          role="listitem"
          [attr.aria-current]="item.status === 'current' ? 'step' : null"
        >
          <div class="br-timeline-marker">
            <div class="br-timeline-icon" [attr.aria-hidden]="true">
              @if (item.icon) {
                <i [class]="item.icon"></i>
              } @else {
                @switch (item.status) {
                  @case ('completed') {
                    <i class="fas fa-check"></i>
                  }
                  @case ('current') {
                    <i class="fas fa-circle"></i>
                  }
                  @default {
                    <span class="br-timeline-dot"></span>
                  }
                }
              }
            </div>
            @if (!isLast) {
              <div class="br-timeline-line" aria-hidden="true"></div>
            }
          </div>
          <div class="br-timeline-content">
            @if (item.date) {
              <span class="br-timeline-date">{{ item.date }}</span>
            }
            <h4 class="br-timeline-title">{{ item.title }}</h4>
            @if (item.description) {
              <p class="br-timeline-description">{{ item.description }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ═══ Timeline Base ═══ */
    .br-timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .br-timeline-item {
      display: flex;
      gap: var(--govbr-spacing-4);
      position: relative;
    }

    /* ═══ Marker (icon + line) ═══ */
    .br-timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .br-timeline-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      z-index: 1;
      transition: all 0.2s ease;
    }

    .br-timeline-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--govbr-gray-20);
    }

    .br-timeline-line {
      width: 2px;
      flex-grow: 1;
      min-height: 24px;
      background-color: var(--govbr-gray-10);
    }

    /* ═══ Content ═══ */
    .br-timeline-content {
      padding-bottom: var(--govbr-spacing-6);
      flex: 1;
    }

    .br-timeline-date {
      display: block;
      font-size: var(--govbr-font-size-xs);
      color: var(--govbr-gray-60);
      margin-bottom: var(--govbr-spacing-1);
    }

    .br-timeline-title {
      font-size: var(--govbr-font-size-base);
      font-weight: var(--govbr-font-weight-semi-bold);
      color: var(--govbr-gray-80);
      margin: 0 0 var(--govbr-spacing-1) 0;
      line-height: var(--govbr-line-height-medium);
    }

    .br-timeline-description {
      font-size: var(--govbr-font-size-sm);
      color: var(--govbr-gray-60);
      margin: 0;
      line-height: var(--govbr-line-height-medium);
    }

    /* ═══ Status: Completed ═══ */
    .br-timeline-item-completed .br-timeline-icon {
      background-color: var(--govbr-success-dark);
      color: var(--govbr-on-primary);
    }

    .br-timeline-item-completed .br-timeline-line {
      background-color: var(--govbr-success-dark);
    }

    .br-timeline-item-completed .br-timeline-title {
      color: var(--govbr-gray-80);
    }

    /* ═══ Status: Current ═══ */
    .br-timeline-item-current .br-timeline-icon {
      background-color: var(--govbr-primary);
      color: var(--govbr-on-primary);
      box-shadow: 0 0 0 4px rgba(19, 81, 180, 0.2);
    }

    .br-timeline-item-current .br-timeline-title {
      color: var(--govbr-primary);
      font-weight: var(--govbr-font-weight-bold);
    }

    /* ═══ Status: Pending ═══ */
    .br-timeline-item-pending .br-timeline-icon {
      background-color: var(--govbr-gray-5);
      border: 2px solid var(--govbr-gray-20);
    }

    .br-timeline-item-pending .br-timeline-title {
      /* gray-40 sobre a pagina da 3,33:1 e reprova para texto (precisa 4,5). */
      color: var(--govbr-gray-60);
    }

    .br-timeline-item-pending .br-timeline-description {
      color: var(--govbr-gray-60);
    }

    /* ═══ Horizontal Orientation ═══ */
    .br-timeline-horizontal {
      flex-direction: row;
      overflow-x: auto;
    }

    .br-timeline-horizontal .br-timeline-item {
      flex-direction: column;
      align-items: center;
      min-width: 150px;
      text-align: center;
    }

    .br-timeline-horizontal .br-timeline-marker {
      flex-direction: row;
      width: 100%;
      justify-content: center;
    }

    .br-timeline-horizontal .br-timeline-line {
      width: auto;
      height: 2px;
      min-height: auto;
      min-width: 40px;
      flex-grow: 1;
      position: absolute;
      top: 15px;
      left: calc(50% + 20px);
      right: calc(-50% + 20px);
    }

    .br-timeline-horizontal .br-timeline-content {
      padding-bottom: 0;
      padding-top: var(--govbr-spacing-3);
    }
  `],
})
export class BrTimelineComponent {
  @Input() items: BrTimelineItem[] = [];
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() ariaLabel = 'Timeline';
}
