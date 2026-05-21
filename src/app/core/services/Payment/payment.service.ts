import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface PaymentIntentRes {
  clientSecret: string;
}

export interface PaymentState {
  orderId: number;
  finalPrice: number;
  courseTitle: string;
  thumbnail: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private readonly base = environment2.baseUrl + 'payments';

  createPaymentIntent(orderId: number): Observable<PaymentIntentRes> {
    return this.http.post<PaymentIntentRes>(`${this.base}/create-intent`, { orderId });
  }

  
}
