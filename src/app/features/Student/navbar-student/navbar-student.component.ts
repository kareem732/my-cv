import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { WishlistStateService } from '../../../core/services/WishList/components/wishlist-state.service';
import { NotificationsService, Notification } from '../../../core/services/notifications/notifications.service';
import { ThemeService } from '../../../core/services/Theme/theme.service';
import { ProfileService } from '../../../core/services/Profile/profile.service';

@Component({
  selector: 'app-navbar-student',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-student.component.html',
  styleUrl: './navbar-student.component.css'
})
export class NavbarStudentComponent implements OnInit, OnDestroy {
  wishlistState                = inject(WishlistStateService);
  private notificationsService = inject(NotificationsService);
  private router               = inject(Router);
  themeService                 = inject(ThemeService);
  profileService               = inject(ProfileService);

  user = this.profileService.currentUser;

  isMenuOpen     = signal<boolean>(false);
  isNotifOpen    = signal<boolean>(false);
  isNotifLoading = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  private destroy$ = new Subject<void>();
  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  ngOnInit(): void {
    this.wishlistState.load();

    if (!this.user()) {
      this.profileService.getProfile().subscribe();
    }

    this.notificationsService.notifications
      .pipe(takeUntil(this.destroy$))
      .subscribe(n => this.notifications = n);

    this.notificationsService.unreadCount
      .pipe(takeUntil(this.destroy$))
      .subscribe(c => this.unreadCount = c);

    this.notificationsService.isLoading
      .pipe(takeUntil(this.destroy$))
      .subscribe(l => this.isNotifLoading = l);

    this.notificationsService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.notificationsService.needsRefresh) {
        this.notificationsService.getNotifications()
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAvatarUrl(url: string | null | undefined): string {
    if (!url) return 'images/Person.png';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    const alreadyOnHome = this.router.url.includes('/student/home');
    if (alreadyOnHome) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      });
      this.router.navigate(['/student/home']);
    }
  }

  toggleMenu()  { this.isMenuOpen.update(v => !v); }
  closeMenu()   { this.isMenuOpen.set(false); }
  toggleNotif() { this.isNotifOpen.update(v => !v); }
  closeNotif()  { this.isNotifOpen.set(false); }

  markAsRead(notification: Notification): void {
    if (notification.isRead) return;
    this.notificationsService.markAsRead(notification.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
