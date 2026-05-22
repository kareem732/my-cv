import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthHelperService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('accessToken');
  }

  getRoles(): string[] {
    if (!this.isBrowser) return [];
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  saveSession(res: any): void {
    if (!this.isBrowser) return;
    if (res?.accessToken) localStorage.setItem('accessToken', res.accessToken);
    if (res?.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
    if (res?.roles && Array.isArray(res.roles)) {
      localStorage.setItem('roles', JSON.stringify(res.roles));
    }
  }

  clearStorage(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
  }

  getRedirectUrl(): string {
    const roles = this.getRoles();
    if (roles.includes('Admin')) return '/admin/dashboard';
    if (roles.includes('Instructor')) return '/instructor/dashboard';
    if (roles.includes('Student')) return '/student/home';
    return '/auth/login';
  }
}
