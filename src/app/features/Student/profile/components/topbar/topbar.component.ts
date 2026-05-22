import { Component, inject, OnInit, signal, DestroyRef, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService, Notification } from '../../../../../core/services/notifications/notifications.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, DatePipe, SidebarComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent implements OnInit {

  private notifSvc   = inject(NotificationsService);
  private destroyRef = inject(DestroyRef);

  isSidebarOpen  = signal<boolean>(false);
  isNotifOpen    = signal<boolean>(false);
  notifications: Notification[] = [];
  unreadCount    = 0;
  isNotifLoading = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }
menuClicked = output<void>();
  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleNotif(): void {
    this.isNotifOpen.update(v => !v);
    if (this.isNotifOpen()) this.loadNotifications();
  }

  closeNotif(): void {
    this.isNotifOpen.set(false);
  }

  onLogout(): void {

  }

  loadNotifications(): void {
    this.isNotifLoading = true;
    this.notifSvc.getNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.notifications  = res.notifications;
          this.unreadCount    = res.unreadCount;
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
