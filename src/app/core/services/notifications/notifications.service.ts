import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment2 } from '../../environment/ENV';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  actionUrl: string;
  createdAt: string;
  readAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private base = environment2.baseUrl;

  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private unreadCount$   = new BehaviorSubject<number>(0);
  private isLoading$     = new BehaviorSubject<boolean>(false);

  private pendingRequest: Observable<NotificationsResponse> | null = null;
  needsRefresh = false;

  readonly notifications = this.notifications$.asObservable();
  readonly unreadCount   = this.unreadCount$.asObservable();
  readonly isLoading     = this.isLoading$.asObservable();

  getNotifications(): Observable<NotificationsResponse> {
    if (this.needsRefresh) {
      this.needsRefresh = false;
      return this.fetchFromServer();
    }

    if (this.notifications$.value.length > 0) {
      return of({
        notifications: this.notifications$.value,
        unreadCount:   this.unreadCount$.value,
      });
    }

    return this.fetchFromServer();
  }

  private fetchFromServer(): Observable<NotificationsResponse> {
    if (this.pendingRequest) {
      return this.pendingRequest;
    }

    this.isLoading$.next(true);

    this.pendingRequest = this.http
      .get<NotificationsResponse>(`${this.base}notifications`)
      .pipe(
        tap({
          next: (res) => {
            const unique = Array.from(
              new Map(
                res.notifications.map((n) => [
                  `${n.type}_${n.message}_${n.createdAt.slice(0, 16)}`,
                  n,
                ])
              ).values()
            );
            this.notifications$.next(unique);
            const unread = unique.filter(n => !n.isRead).length;
            this.unreadCount$.next(unread);
            this.isLoading$.next(false);
            this.pendingRequest = null;
          },
          error: () => {
            this.isLoading$.next(false);
            this.pendingRequest = null;
          },
        }),
        shareReplay(1)
      );

    return this.pendingRequest;
  }

  refresh(): Observable<NotificationsResponse> {
    this.needsRefresh = true;
    this.pendingRequest = null;
    return this.fetchFromServer();
  }

  clearCache(): void {
    this.notifications$.next([]);
    this.unreadCount$.next(0);
    this.isLoading$.next(false);
    this.pendingRequest = null;
    this.needsRefresh = false;
  }

  markAsRead(id: number): Observable<void> {
    return this.http
      .patch<void>(`${this.base}notifications/${id}/read`, {})
      .pipe(
        tap(() => {
          const updated = this.notifications$.value.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          );
          this.notifications$.next(updated);
          this.unreadCount$.next(Math.max(0, this.unreadCount$.value - 1));
        })
      );
  }

  markAllAsRead(): Observable<void> {
    return this.http
      .patch<void>(`${this.base}notifications/read-all`, {})
      .pipe(
        tap(() => {
          const updated = this.notifications$.value.map((n) => ({
            ...n,
            isRead: true,
          }));
          this.notifications$.next(updated);
          this.unreadCount$.next(0);
        })
      );
  }
}
