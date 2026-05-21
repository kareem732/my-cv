import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface WalletInfo {
  totalEarned: number;
  totalPaidOut: number;
  pendingAmount: number;
  availableBalance: number;
  isStripeConnected: boolean;
  stripeAccountId: string;
  platformCommission: number;
}

export interface Payout {
  id: number;
  instructorId: string;
  instructorName: string;
  amount: number;
  platformFee: number;
  status: string;
  rejectionReason: string;
  stripeTransferId: string;
  notes: string;
  createdAt: string;
  processedAt: string;
}

export interface PayoutRequest {
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PayoutInstructorService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment2.baseUrl}payouts`;

  getWallet(): Observable<WalletInfo> {
    return this.http.get<WalletInfo>(`${this.baseUrl}/wallet`);
  }

  getMyPayouts(): Observable<Payout[]> {
    return this.http.get<Payout[]>(`${this.baseUrl}/my`);
  }

  connectStripe(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/connect-stripe`, {});
  }

  requestPayout(amount: number): Observable<Payout> {
    const body: PayoutRequest = { amount };
    return this.http.post<Payout>(`${this.baseUrl}/request`, body);
  }

}
