import { Component, inject, output, input, OnInit } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../../../../core/services/Profile/profile.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLinkWithHref, RouterLinkActive, DatePipe],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private readonly _profileService = inject(ProfileService);
  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  isOpen = input<boolean>(false);
  closeSidebar = output<void>();
  logoutClicked = output<void>();

  user = this._profileService.currentUser;

  ngOnInit() {
    if (!this.user()) {
      this._profileService.getProfile().subscribe();
    }
  }

  getAvatarUrl(url: string | null | undefined): string {
    if (!url) return 'images/Person.png';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }
}
