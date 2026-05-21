import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface PlatformSettings {
  name: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  currency: string;
  language: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  workingHours: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedIn: string;
  youtube: string;
  metaTitle: string;
  metaDescription: string;
  allowRegister: boolean;
  maintenanceMode: boolean;
  allowGoogleLogin: boolean;
  allowSubscription: boolean;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment2.baseUrl}settings`;

  getSettings(): Observable<PlatformSettings> {
    return this.http.get<PlatformSettings>(this.baseUrl);
  }

  updateSettings(payload: PlatformSettings): Observable<PlatformSettings> {
    return this.http.put<PlatformSettings>(this.baseUrl, payload);
  }
}
