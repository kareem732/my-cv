import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private http = inject(HttpClient);
  private base = environment2.baseUrl;

  getNotifications(unreadOnly = false): Observable<NotificationsResponse> {
    return this.http.get<NotificationsResponse>(`${this.base}notifications`, {
      params: { unreadOnly: unreadOnly.toString() }
    });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.base}notifications/read-all`, {});
  }
}
