import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { AUTHENTICATIONService } from '../../../core/services/AUTHENTICATION/authentication.service';
import { ProfileService } from '../../../core/services/Profile/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _router = inject(Router);
private readonly _profileService = inject(ProfileService);
  // Signals for state management
  isSidebarOpen = signal<boolean>(false);
  isLogoutPopupOpen = signal<boolean>(false);
  isLogoutLoading = signal<boolean>(false);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  openLogoutPopup() {
    this.isLogoutPopupOpen.set(true);
    this.closeSidebar();
  }

  closeLogoutPopup() {
    this.isLogoutPopupOpen.set(false);
    this.isLogoutLoading.set(false); // Reset loading state when closed
  }

confirmLogout() {
  this.isLogoutLoading.set(true);
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const theme = localStorage.getItem('theme');

  this._authService.logout(refreshToken).subscribe({
    next: () => {
      localStorage.clear();
      if (theme) localStorage.setItem('theme', theme);
      this._profileService.currentUser.set(null); 
      this.closeLogoutPopup();
      this._router.navigate(['auth/login']);
    },
    error: (err) => {
      console.error('Logout failed:', err);
      this.isLogoutLoading.set(false);
    }
  });
}
}
