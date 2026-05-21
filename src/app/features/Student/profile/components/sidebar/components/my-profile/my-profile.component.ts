import { Component, inject, OnInit } from '@angular/core';
import { ProfileAvatarComponent } from './components/profile-avatar/profile-avatar.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ProfileService, UserProfile } from '../../../../../../../core/services/Profile/profile.service';

@Component({
  selector: 'app-my-profile',
  imports: [ProfileAvatarComponent, ProfileFormComponent],
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {
  private readonly _profileService = inject(ProfileService);

  user = this._profileService.currentUser;
  isLoading = true;

  ngOnInit() {
    this._profileService.getProfile().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }

  onProfileUpdated(updated: UserProfile) {
    this._profileService.currentUser.set(updated);
  }

  onAvatarUpdated(updated: UserProfile) {
    this._profileService.currentUser.set(updated);
  }
}
