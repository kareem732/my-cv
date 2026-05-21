import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment2 } from '../../environment/ENV';
import { Observable } from 'rxjs';
import { AdminStats } from '../../interfaces/Admin/Admin-Stats/admin-stats';
import { User } from '../../interfaces/Admin/Users/users';
import { GetUserId } from '../../interfaces/Admin/GetUserId/get-user-id';
import { AdminCoursesRes } from '../../interfaces/Admin/admin-courses/admin-courses';

export interface AdminCoursesParams {
  status?: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment2.baseUrl}admin`;


  getAdminStats(months: number): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/stats`, {
      params: { months: months.toString() }
    });
  }


  getUsers(search: string = '', isBanned?: boolean): Observable<User[]> {
    let params: any = {};
    if (search) params['search'] = search;
    if (isBanned !== undefined) params['isBanned'] = isBanned.toString();
    return this.http.get<User[]>(`${this.baseUrl}/users`, { params });
  }

  getUserById(id: string): Observable<GetUserId> {
    return this.http.get<GetUserId>(`${this.baseUrl}/users/${id}`);
  }

  banUser(id: string, reason: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/users/${id}/ban`, { reason });
  }

  unbanUser(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/users/${id}/unban`, {});
  }

  changeUserRole(id: string, newRole: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/users/${id}/role`, { newRole });
  }


  getCourses(params?: AdminCoursesParams): Observable<AdminCoursesRes> {
    return this.http.get<AdminCoursesRes>(`${this.baseUrl}/courses`, { params: { ...params } });
  }



}
