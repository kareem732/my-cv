import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHelperService } from '../AuthHelper/auth-helper.service';
import { AUTHENTICATIONService } from '../../../core/services/AUTHENTICATION/authentication.service';
import { ProfileService } from '../../../core/services/Profile/profile.service';
import { NotificationsService } from '../../../core/services/notifications/notifications.service';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LogoutService {
  private readonly authService          = inject(AUTHENTICATIONService);
  private readonly authHelper           = inject(AuthHelperService);
  private readonly profileService       = inject(ProfileService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly router               = inject(Router);

  isLogoutPopupOpen = signal<boolean>(false);
  isLogoutLoading   = signal<boolean>(false);

  openLogoutPopup() {
    this.isLogoutPopupOpen.set(true);
  }

  closeLogoutPopup() {
    this.isLogoutPopupOpen.set(false);
    this.isLogoutLoading.set(false);
  }

  confirmLogout() {
    this.isLogoutLoading.set(true);
    const refreshToken = this.authHelper.getRefreshToken() ?? '';
    const theme = sessionStorage.getItem('theme');

    this.authService.logout(refreshToken).subscribe({
      next: () => {
        this.authHelper.clearStorage();
        if (theme) sessionStorage.setItem('theme', theme);

        this.profileService.currentUser.set(null);

        this.notificationsService.clearCache();

        this.closeLogoutPopup();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.isLogoutLoading.set(false);
      },
    });
  }
}
