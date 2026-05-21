import { Component, inject, OnInit, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WishlistStateService } from "../../../core/services/WishList/components/wishlist-state.service";
import { NotificationsService, Notification } from "../../../core/services/notifications/notifications.service";
import { NavigationEnd } from "@angular/router";
import { filter } from "rxjs";
import { ThemeService } from "../../../core/services/Theme/theme.service";
@Component({
  selector: 'app-navbar-student',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-student.component.html',
  styleUrl: './navbar-student.component.css'
})
export class NavbarStudentComponent implements OnInit {
  wishlistState  = inject(WishlistStateService);
  private notifSvc   = inject(NotificationsService);
  private destroyRef = inject(DestroyRef);
  private router     = inject(Router);
  themeService   = inject(ThemeService); // ← أضف

  isMenuOpen       = signal<boolean>(false);
  isNotifOpen      = signal<boolean>(false);
  notifications: Notification[] = [];
  unreadCount      = 0;
  isNotifLoading   = false;
scrollTo(sectionId: string): void {
  this.closeMenu();

  const alreadyOnHome = this.router.url.includes('/student/home');

  if (alreadyOnHome) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    });

    this.router.navigate(['/student/home']);
  }
}

  ngOnInit(): void {
    this.wishlistState.load();
    this.loadNotifications();
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
    this.notifSvc.getNotifications(false)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.notifications = res.notifications;
          this.unreadCount   = res.unreadCount;
          this.isNotifLoading = false;
        },
        error: () => { this.isNotifLoading = false; }
      });
  }

  markAsRead(notif: Notification): void {
    if (notif.isRead) return;
    this.notifSvc.markAsRead(notif.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          notif.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      });
  }

  markAllAsRead(): void {
    this.notifSvc.markAllAsRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.forEach(n => n.isRead = true);
          this.unreadCount = 0;
        }
      });
  }
}
