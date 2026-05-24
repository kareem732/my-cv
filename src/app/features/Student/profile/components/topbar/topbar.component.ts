import { Component, inject, OnInit, signal, DestroyRef, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService, Notification } from '../../../../../core/services/notifications/notifications.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, DatePipe, SidebarComponent, RouterLink],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent implements OnInit {
  private notificationsService = inject(NotificationsService);
  private destroyRef           = inject(DestroyRef);

  isSidebarOpen  = signal<boolean>(false);
  isNotifOpen    = signal<boolean>(false);
  isNotifLoading = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  menuClicked = output<void>();

  ngOnInit(): void {
    this.notificationsService.notifications
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => this.notifications = n);

    this.notificationsService.unreadCount
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(c => this.unreadCount = c);

    this.notificationsService.isLoading
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(l => this.isNotifLoading = l);

    this.notificationsService.getNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  toggleSidebar(): void { this.isSidebarOpen.update(v => !v); }
  closeSidebar(): void  { this.isSidebarOpen.set(false); }
  toggleNotif(): void   { this.isNotifOpen.update(v => !v); }
  closeNotif(): void    { this.isNotifOpen.set(false); }
  onLogout(): void      {}

  markAsRead(notification: Notification): void {
    if (notification.isRead) return;
    this.notificationsService.markAsRead(notification.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
