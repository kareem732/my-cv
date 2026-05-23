import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHelperService } from '../AuthHelper/auth-helper.service';
import { AUTHENTICATIONService } from '../../../core/services/AUTHENTICATION/authentication.service';
import { ProfileService } from '../../../core/services/Profile/profile.service';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LogoutService {
  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _authHelper = inject(AuthHelperService);
  private readonly _profileService = inject(ProfileService);
  private readonly _router = inject(Router);

  isLogoutPopupOpen = signal<boolean>(false);
  isLogoutLoading = signal<boolean>(false);

  openLogoutPopup() {
    this.isLogoutPopupOpen.set(true);
  }

  closeLogoutPopup() {
    this.isLogoutPopupOpen.set(false);
    this.isLogoutLoading.set(false);
  }

  confirmLogout() {
    this.isLogoutLoading.set(true);
    const refreshToken = this._authHelper.getRefreshToken() ?? '';

    const theme = sessionStorage.getItem('theme');

    this._authService.logout(refreshToken).subscribe({
      next: () => {
        this._authHelper.clearStorage();
        if (theme) sessionStorage.setItem('theme', theme);
        this._profileService.currentUser.set(null);
        this.closeLogoutPopup();
        this._router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.isLogoutLoading.set(false);
      },
    });
  }
}
