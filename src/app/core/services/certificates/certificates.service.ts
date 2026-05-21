import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface Certificate {
  id: number;
  verifyCode: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  issuedAt: string;
  verifyUrl: string;
}

export interface VerifyCertificate {
  isValid: boolean;
  studentName: string;
  courseName: string;
  instructorName: string;
  issuedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {

  private http = inject(HttpClient);
  private base = environment2.baseUrl;

  generateCertificate(courseId: number): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.base}certificates/courses/${courseId}`, {});
  }

  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.base}certificates`);
  }

  downloadCertificate(id: number): Observable<Blob> {
    return this.http.get(`${this.base}certificates/${id}/download`, { responseType: 'blob' });
  }

  verifyCertificate(verifyCode: string): Observable<VerifyCertificate> {
    return this.http.get<VerifyCertificate>(`${this.base}certificates/verify/${verifyCode}`);
  }
}
