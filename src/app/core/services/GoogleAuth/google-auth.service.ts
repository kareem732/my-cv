import { Injectable, NgZone, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _ngZone = inject(NgZone);

  private _credentialResponse = new Subject<string>();
  credential$ = this._credentialResponse.asObservable();

  initialize(clientId: string): void {
    if (!isPlatformBrowser(this._platformId)) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        this._ngZone.run(() => {
          this._credentialResponse.next(response.credential);
        });
      }
    });
  }

  renderButton(element: HTMLElement, options?: any): void {
    if (!isPlatformBrowser(this._platformId)) return;

    google.accounts.id.renderButton(element, {
      type: 'standard',
      size: 'large',
      theme: 'outline',
      text: 'signin_with',
      shape: 'rectangular',
      ...options
    });
  }

  prompt(): void {
    if (!isPlatformBrowser(this._platformId)) return;
    google.accounts.id.prompt();
  }
}
