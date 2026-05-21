import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarInstructorComponent } from './components/navbar-instructor/navbar-instructor.component';
import { SidebarInstructorComponent } from './components/sidebar-instructor/sidebar-instructor.component';
import { AUTHENTICATIONService } from '../../core/services/AUTHENTICATION/authentication.service';

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

    this._authService.logout(refreshToken).subscribe({
      next: () => {
        localStorage.clear();
        this.closeLogoutPopup();
        this._router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });
  }
}
