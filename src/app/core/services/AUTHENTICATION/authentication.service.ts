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

@Injectable({
  providedIn: 'root'
})
export class AUTHENTICATIONService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment2.baseUrl}auth`;

  login(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userInfo);
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userInfo);
  }

  verifyEmail(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, userInfo);
  }

  googleLogin(payload: { idToken: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, payload);
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

  logout(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/revoke-token`, { refreshToken });
  }
 changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/change-password`, payload);
}

  constructor() { }
}
