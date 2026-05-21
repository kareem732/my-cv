import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

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

export interface ApprovePayoutBody {
  notes: string;
}

export interface RejectPayoutBody {
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayoutAdminService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment2.baseUrl}payouts`;

  getAllPayouts(pageNumber?: number, pageSize?: number): Observable<Payout[]> {
    let params = new HttpParams();
    if (pageNumber !== undefined) params = params.set('pageNumber', pageNumber);
    if (pageSize !== undefined) params = params.set('pageSize', pageSize);
    return this.http.get<Payout[]>(this.baseUrl, { params });
  }

  approvePayout(id: number, notes: string): Observable<Payout> {
    const body: ApprovePayoutBody = { notes };
    return this.http.put<Payout>(`${this.baseUrl}/${id}/approve`, body);
  }

  rejectPayout(id: number, reason: string): Observable<Payout> {
    const body: RejectPayoutBody = { reason };
    return this.http.put<Payout>(`${this.baseUrl}/${id}/reject`, body);
  }
}
