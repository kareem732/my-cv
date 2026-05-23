import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type UserRole = 'Admin' | 'Instructor' | 'Student';

export interface SessionResponse {
  accessToken?: string;
  refreshToken?: string;
  roles?: UserRole[];
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ROLES: 'roles',
} as const;

const ROLE_REDIRECTS: Partial<Record<UserRole, string>> = {
  Admin: '/admin/dashboard',
  Instructor: '/instructor/dashboard',
  Student: '/student/home',
};

const FALLBACK_REDIRECT = '/auth/login';

@Injectable({ providedIn: 'root' })
export class AuthHelperService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isLoggedIn(): boolean {
    return this.isBrowser && !!this.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getAccessToken(): string | null {
    return this.isBrowser ? this.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
  }

  getRefreshToken(): string | null {
    return this.isBrowser ? this.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null;
  }

  getRoles(): UserRole[] {
    if (!this.isBrowser) return [];
    try {
      const raw = this.getItem(STORAGE_KEYS.ROLES);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as UserRole[]) : [];
    } catch {
      return [];
    }
  }

  hasRole(role: UserRole): boolean {
    return this.getRoles().includes(role);
  }

  saveSession(res: SessionResponse): void {
    if (!this.isBrowser) return;
    if (res.accessToken) this.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
    if (res.refreshToken) this.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
    if (res.roles?.length) {
      this.setItem(STORAGE_KEYS.ROLES, JSON.stringify(res.roles));
    }
  }

  clearStorage(): void {
    if (!this.isBrowser) return;
    Object.values(STORAGE_KEYS).forEach((key) => sessionStorage.removeItem(key));
  }

  getRedirectUrl(): string {
    const roles = this.getRoles();
    for (const role of roles) {
      if (ROLE_REDIRECTS[role]) return ROLE_REDIRECTS[role]!;
    }
    return FALLBACK_REDIRECT;
  }

  private getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  private setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
}
