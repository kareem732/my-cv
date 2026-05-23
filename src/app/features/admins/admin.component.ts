import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AUTHENTICATIONService } from '../../core/services/AUTHENTICATION/authentication.service';
import { ProfileService } from '../../core/services/Profile/profile.service';
import { LogoutService } from '../../core/services/logout/logout.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _router = inject(Router);
private readonly _profileService = inject(ProfileService);
  isLogoutPopupOpen = signal<boolean>(false);
  isLogoutLoading = signal<boolean>(false);
  readonly logoutService = inject(LogoutService);

  openLogoutPopup() {
    this.isLogoutPopupOpen.set(true);
  }

  closeLogoutPopup() {
    this.isLogoutPopupOpen.set(false);
    this.isLogoutLoading.set(false);
  }

}
