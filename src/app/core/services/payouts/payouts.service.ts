import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  _approveNotes?: string;
  _rejectReason?: string;
}

export interface PayoutRequest {
  amount: number;
}

export interface ApprovePayoutRequest {
  notes: string;
}

export interface RejectPayoutRequest {
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class PayoutsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment2.baseUrl}payouts`;

  getWallet(): Observable<WalletInfo> {
    return this.http.get<WalletInfo>(`${this.baseUrl}/wallet`);
  }


  connectStripe(): Observable<any> {
    return this.http.post(`${this.baseUrl}/connect-stripe`, {});
  }


  getMyPayouts(): Observable<Payout[]> {
    return this.http.get<Payout[]>(`${this.baseUrl}/my`);
  }

  requestPayout(body: PayoutRequest): Observable<Payout> {
    return this.http.post<Payout>(`${this.baseUrl}/request`, body);
  }


  getAllPayouts(status?: number): Observable<Payout[]> {
    let params = new HttpParams();
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }
    return this.http.get<Payout[]>(this.baseUrl, { params });
  }

  approvePayout(id: number, body: ApprovePayoutRequest): Observable<Payout> {
    return this.http.put<Payout>(`${this.baseUrl}/${id}/approve`, body);
  }

  rejectPayout(id: number, body: RejectPayoutRequest): Observable<Payout> {
    return this.http.put<Payout>(`${this.baseUrl}/${id}/reject`, body);
  }
}
