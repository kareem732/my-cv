import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  bio: string;
  profilePictureUrl: string;
  roles: string[];
  createdAt: string;
}

export interface UpdateProfileBody {
  firstName: string;
  lastName: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly _http = inject(HttpClient);
  private readonly _base = environment2.baseUrl + 'profile/me';
  private readonly _imgBase = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  private fixUrl(user: UserProfile): UserProfile {
    const url = user.profilePictureUrl;
    const fullUrl = url
      ? url.startsWith('http')
        ? url
        : this._imgBase + url + '?t=' + Date.now()  
      : '';
    return { ...user, profilePictureUrl: fullUrl };
  }

  currentUser = signal<UserProfile | null>(null);

  getProfile() {
    return this._http.get<UserProfile>(this._base).pipe(
      tap(data => this.currentUser.set(this.fixUrl(data)))
    );
  }

  updateProfile(body: UpdateProfileBody) {
    return this._http.put<UserProfile>(this._base, body).pipe(
      tap(updated => this.currentUser.set(this.fixUrl(updated)))
    );
  }

  updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post<UserProfile>(`${this._base}/avatar`, formData).pipe(
      tap(updated => this.currentUser.set(this.fixUrl(updated)))
    );
  }

  deleteAvatar() {
    return this._http.delete(`${this._base}/avatar`).pipe(
      tap(() => this.currentUser.update(u => u ? { ...u, profilePictureUrl: '' } : u))
    );
  }
}
