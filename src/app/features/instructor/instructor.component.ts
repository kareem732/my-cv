import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarInstructorComponent } from './components/navbar-instructor/navbar-instructor.component';
import { SidebarInstructorComponent } from './components/sidebar-instructor/sidebar-instructor.component';
import { AUTHENTICATIONService } from '../../core/services/AUTHENTICATION/authentication.service';
import { ProfileService } from '../../core/services/Profile/profile.service';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [RouterOutlet, SidebarInstructorComponent, NavbarInstructorComponent],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})
export class InstructorComponent {
  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _router = inject(Router);
  private readonly _profileService = inject(ProfileService);
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
