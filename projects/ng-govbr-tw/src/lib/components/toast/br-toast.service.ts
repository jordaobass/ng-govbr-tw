import { Injectable, signal } from '@angular/core';

export interface BrToast {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

export interface BrToastOptions {
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BrToastService {
  private static nextId = 0;

  readonly toasts = signal<BrToast[]>([]);

  private defaultDuration = 5000;

  success(message: string, options?: BrToastOptions): string {
    return this.show('success', message, options);
  }

  danger(message: string, options?: BrToastOptions): string {
    return this.show('danger', message, options);
  }

  warning(message: string, options?: BrToastOptions): string {
    return this.show('warning', message, options);
  }

  info(message: string, options?: BrToastOptions): string {
    return this.show('info', message, options);
  }

  show(type: BrToast['type'], message: string, options?: BrToastOptions): string {
    const id = `toast-${BrToastService.nextId++}`;
    const toast: BrToast = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? this.defaultDuration,
      dismissible: options?.dismissible ?? true,
    };

    this.toasts.update(list => [...list, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this.toasts.set([]);
  }
}
