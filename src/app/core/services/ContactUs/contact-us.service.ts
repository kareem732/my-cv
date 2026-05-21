import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';


export interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  adminReply: string;
  repliedAt: string;
  createdAt: string;
}

export interface SubmitContactPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}


@Injectable({ providedIn: 'root' })
export class ContactUsService {
  private base = environment2.baseUrl;

  constructor(private http: HttpClient) {}
  submitContact(payload: SubmitContactPayload): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(`${this.base}contact`, payload);
  }

  getContacts(status?: number): Observable<ContactMessage[]> {
    let params = new HttpParams();
    if (status !== undefined) params = params.set('status', status.toString());
    return this.http.get<ContactMessage[]>(`${this.base}contact`, { params });
  }

  getContactById(id: number): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${this.base}contact/${id}`);
  }

  replyToContact(id: number, reply: string): Observable<void> {
    return this.http.post<void>(`${this.base}contact/${id}/reply`, { reply });
  }
}
