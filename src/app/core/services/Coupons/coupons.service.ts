import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface ValidateCouponRes {
  isValid: boolean;
  message: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  remainingUses: number;
  expiresAt: string;
  isActive: boolean;
  isExpired: boolean;
  canBeUsed: boolean;
  createdAt: string;
}

export interface CreateCouponBody {
  code: string;
  discountType: number;
  discountValue: number;
  usageLimit: number;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class CouponsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment2.baseUrl}coupons`;

  validateCoupon(code: string, orderAmount: number): Observable<ValidateCouponRes> {
    const params = new HttpParams()
      .set('code', code)
      .set('orderAmount', orderAmount);
    return this.http.get<ValidateCouponRes>(`${this.baseUrl}/validate`, { params });
  }

  getCoupons(activeOnly = false): Observable<Coupon[]> {
    const params = new HttpParams().set('activeOnly', activeOnly);
    return this.http.get<Coupon[]>(this.baseUrl, { params });
  }

  createCoupon(body: CreateCouponBody): Observable<Coupon> {
    return this.http.post<Coupon>(this.baseUrl, body);
  }

  getCouponById(id: number): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.baseUrl}/${id}`);
  }

  updateCoupon(id: number, body: CreateCouponBody): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.baseUrl}/${id}`, body);
  }

  deleteCoupon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleCoupon(id: number): Observable<Coupon> {
    return this.http.patch<Coupon>(`${this.baseUrl}/${id}/toggle`, {});
  }
}
