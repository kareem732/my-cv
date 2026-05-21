// order.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment2 } from '../../environment/ENV';

export interface OrderItem {
  id: number;
  courseId: number;
  courseTitle: string;
  thumbnailUrl: string;
  price: number;
}

export interface CourseOrder {
  id: number;
  orderId: number;
  status: string;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  couponCode: string;
  clientSecret: string;
  isFree: boolean;
  paidAt: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderBody {
  courseIds: number[];
}

export interface ApplyCouponBody {
  couponCode: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _http = inject(HttpClient);
  private readonly _base = environment2.baseUrl + 'orders';

  createOrder(body: CreateOrderBody) {
    return this._http.post<any>(this._base, body).pipe(
      map(res => this.mapOrder(res))
    );
  }

  applyCoupon(orderId: number, body: ApplyCouponBody) {
    return this._http.post<any>(`${this._base}/${orderId}/coupon`, body).pipe(
      map(res => this.mapOrder(res))
    );
  }

  getMyOrders() {
    return this._http.get<any[]>(`${this._base}/my`).pipe(
      map(res => res.map(o => this.mapOrder(o)))
    );
  }

  private mapOrder(res: any): CourseOrder {

  console.log('MAP ORDER =>', res);

  return {
    ...res,

    orderId: res.orderId ?? res.id,

    isFree:
      res.isFree ??
      (res.finalPrice === 0),

    clientSecret: res.clientSecret
  };



}
}
