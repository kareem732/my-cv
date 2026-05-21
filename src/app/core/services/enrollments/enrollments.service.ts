import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface Enrollment {
  id: number;
  courseId: number;
  courseTitle: string;
  thumbnailUrl: string;
  enrolledAt: string;
}

export interface EnrollmentDetails {
  courseId: number;
  courseTitle: string;
  thumbnailUrl: string;
  instructorName: string;
  enrolledAt: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {

  private http = inject(HttpClient);
  private baseUrl = environment2.baseUrl;

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}enrollments`);
  }

checkEnrollment(courseId: number): Observable<boolean> {
  console.log('calling:', `${this.baseUrl}enrollments/${courseId}/check`); 
  return this.http.get<boolean>(`${this.baseUrl}enrollments/${courseId}/check`);
}

getEnrollmentDetails(courseId: number): Observable<EnrollmentDetails> {
    return this.http.get<EnrollmentDetails>(`${this.baseUrl}enrollments/${courseId}`);
  }
}
