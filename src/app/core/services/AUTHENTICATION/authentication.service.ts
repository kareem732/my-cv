import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface ResetPasswordPayload {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AUTHENTICATIONService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment2.baseUrl}auth`;

  login(userInfo: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, userInfo);
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userInfo);
  }

  verifyEmail(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, userInfo);
  }

  googleLogin(payload: { idToken: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, payload);
  }

  resetPassword(payload: ResetPasswordPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, payload);
  }

  forgetPassword(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, userInfo);
  }

  resendOtp(payload: { email: string; purpose: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, payload);
  }

  // ✅ للـ logout الحقيقي — بيلغي الـ token على السيرفر
  logout(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/revoke-token`, { refreshToken });
  }

  // ✅ للـ interceptor — بيجدد الـ access token وبيبعت الاتنين زي ما السيرفر بيطلب
  refreshToken(accessToken: string, refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {
      accessToken,
      refreshToken,
    });
  }

  changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, payload);
  }
}
