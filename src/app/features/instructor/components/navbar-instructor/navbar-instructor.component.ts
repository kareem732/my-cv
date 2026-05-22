import { Component, inject, OnInit, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/Theme/theme.service';
import { ProfileService } from '../../../../core/services/Profile/profile.service';

@Component({
  selector: 'app-navbar-instructor',
  imports: [RouterLink],
  templateUrl: './navbar-instructor.component.html',
})
export class NavbarInstructorComponent implements OnInit {
  themeService   = inject(ThemeService);
  profileService = inject(ProfileService);

  signOutClicked = output<void>();

  user = this.profileService.currentUser;

  ngOnInit() {
    if (!this.user()) {
      this.profileService.getProfile().subscribe();
    }
  }

  getAvatarUrl(url: string | null | undefined): string {
    const base = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';
    if (!url) return 'images/Person.png';
    if (url.startsWith('http')) return url;
    return `${base}${url}`;
  }
}
