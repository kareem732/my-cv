import { Component, inject, OnInit, OnDestroy, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WishlistStateService } from "../../../core/services/WishList/components/wishlist-state.service";
import { NotificationsService, Notification } from "../../../core/services/notifications/notifications.service";
import { NavigationEnd } from "@angular/router";
import { filter } from "rxjs";
import { ThemeService } from "../../../core/services/Theme/theme.service";
import { ProfileService } from "../../../core/services/Profile/profile.service";

@Component({
  selector: 'app-navbar-student',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-student.component.html',
  styleUrl: './navbar-student.component.css'
})
export class NavbarStudentComponent implements OnInit, OnDestroy {
  wishlistState    = inject(WishlistStateService);
  private notifSvc = inject(NotificationsService);
  private router   = inject(Router);
  themeService     = inject(ThemeService);
  profileService   = inject(ProfileService);

  user = this.profileService.currentUser;

  isMenuOpen     = signal<boolean>(false);
  isNotifOpen    = signal<boolean>(false);
  notifications: Notification[] = [];
  unreadCount    = 0;
  isNotifLoading = false;

  private destroy$ = new Subject<void>();

  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

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

  ngOnInit(): void {
    this.wishlistState.load();
    this.loadNotifications();
    if (!this.user()) {
      this.profileService.getProfile().subscribe();
    }
  }

  toggleMenu()  { this.isMenuOpen.update(v => !v); }
  closeMenu()   { this.isMenuOpen.set(false); }

  toggleNotif() {
    this.isNotifOpen.update(v => !v);
    if (this.isNotifOpen()) this.loadNotifications();
  }

  closeNotif() { this.isNotifOpen.set(false); }

  loadNotifications(): void {
    this.isNotifLoading = true;
    this.notifSvc.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.notifications = res.notifications;
          this.unreadCount   = res.unreadCount;
          this.isNotifLoading = false;
        },
        error: (err) => {
          this.isNotifLoading = false;
        }
      });
  }

  markAsRead(notif: Notification): void {
    if (notif.isRead) return;
    this.notifSvc.markAsRead(notif.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          notif.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      });
  }

  markAllAsRead(): void {
    this.notifSvc.markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications.forEach(n => n.isRead = true);
          this.unreadCount = 0;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
