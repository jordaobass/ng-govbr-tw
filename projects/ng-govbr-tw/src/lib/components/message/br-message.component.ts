import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';


@Component({
  selector: 'br-message',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (visible) {
      <div [class]="messageClasses" role="alert">
        <div class="flex items-start">
          <i [class]="iconClass + ' mt-0.5 mr-3 text-lg flex-shrink-0'"></i>
          <div class="flex-1 text-sm min-w-0">
            @if (title) {
              <strong class="block font-semibold mb-0.5">{{ title }}</strong>
            }
            <ng-content></ng-content>
          </div>
          @if (dismissible) {
            <button
              type="button"
              class="ml-3 text-current opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
              (click)="dismiss()"
              aria-label="Fechar"
              >
              <i class="fa-solid fa-xmark"></i>
            </button>
          }
        </div>
        <!-- Progress bar for auto-dismiss -->
        @if (autoDismiss && autoDismiss > 0 && visible) {
          <div
            class="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 transition-none"
            [style.width.%]="progressWidth"
            [style.transition]="'width ' + autoDismiss + 'ms linear'"
          ></div>
        }
      </div>
    }
    `,
})
export class BrMessageComponent implements OnInit, OnDestroy, OnChanges {
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';
  @Input() title?: string;
  @Input() dismissible = false;
  /** Auto-dismiss after N milliseconds. 0 or undefined = no auto-dismiss. */
  @Input() autoDismiss?: number;
  @Output() dismissed = new EventEmitter<void>();

  visible = true;
  progressWidth = 100;

  private timerId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.startAutoDismiss();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autoDismiss']) {
      this.clearTimer();
      this.startAutoDismiss();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  dismiss(): void {
    this.clearTimer();
    this.visible = false;
    this.dismissed.emit();
  }

  /** Re-show the message (useful for programmatic control) */
  show(): void {
    this.visible = true;
    this.progressWidth = 100;
    this.startAutoDismiss();
  }

  private startAutoDismiss(): void {
    if (!this.autoDismiss || this.autoDismiss <= 0) return;

    // Trigger progress animation after a tick
    requestAnimationFrame(() => {
      this.progressWidth = 0;
    });

    this.timerId = setTimeout(() => {
      this.dismiss();
    }, this.autoDismiss);
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  get messageClasses(): string {
    const base = 'p-4 rounded font-rawline border-l-4 relative overflow-hidden';
    const styles = {
      success: 'bg-green-50 border-govbr-success text-govbr-success',
      danger: 'bg-red-50 border-govbr-danger text-govbr-danger',
      warning: 'bg-govbr-warning-bg border-govbr-warning text-govbr-gray-80',
      info: 'bg-govbr-info-bg border-govbr-info text-govbr-primary-dark',
    } as const;
    return `${base} ${styles[this.type]}`;
  }

  get iconClass(): string {
    const icons = {
      success: 'fa-solid fa-circle-check',
      danger: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info',
    } as const;
    return icons[this.type];
  }
}
