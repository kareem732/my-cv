import { Component, output, inject, ChangeDetectorRef } from '@angular/core';
import { ProfileService, UserProfile } from '../../../../../../core/services/Profile/profile.service';

@Component({
  selector: 'app-profile-avatar',
  imports: [],
  templateUrl: './profile-avatar.component.html',
})
export class ProfileAvatarComponent {
  private readonly _profileService = inject(ProfileService);
  private readonly _cdr            = inject(ChangeDetectorRef);
  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  user          = this._profileService.currentUser;
  avatarUpdated = output<UserProfile>();
  isUploading   = false;
  isDeleting    = false;

  getAvatarUrl(url: string | null | undefined): string {
    if (!url) return 'images/Person.png';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.isUploading = true;
    this._profileService.updateAvatar(file).subscribe({
      next: (updated) => {
        this.avatarUpdated.emit(updated);
        this.isUploading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.isUploading = false;
        this._cdr.detectChanges();
      },
    });
  }

  deleteAvatar() {
    this.isDeleting = true;
    this._profileService.deleteAvatar().subscribe({
      next: () => {
        const u = this.user();
        if (u) this.avatarUpdated.emit({ ...u, profilePictureUrl: '' });
        this.isDeleting = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.isDeleting = false;
        this._cdr.detectChanges();
      },
    });
  }
}
