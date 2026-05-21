import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toastMsg = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMsg.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }
}
