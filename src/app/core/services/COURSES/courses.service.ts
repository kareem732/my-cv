import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';
import { COURSERES } from '../../interfaces/COURSE/course';

export interface CourseListItem {
  id: number;
  title: string;
  shortDescription: string;
  thumbnailUrl: string;
  price: number;
  discountPrice: number;
  level: string;
  language: string;
  instructorName: string;
  subCategoryName: string;
  status: string;
  averageRating: number;
  totalStudents: number;
  createdAt: string;
}

export interface CourseDetails {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  previewVideoUrl: string | null;
  price: number;
  discountPrice: number;
  level: string;
  status: string;
  language: string;
  rejectionReason: string | null;
  requirements: string[];
  whatYouLearn: string[];
  instructorId: string;
  instructorName: string;
  subCategoryId: number;
  subCategoryName: string;
  categoryName: string;
  averageRating: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  level: number;
  language: string;
  subCategoryId: number;
  requirements: string[];
  whatYouLearn: string[];
}

export interface UpdateCourseRequest {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  level: number;
  language: string;
  subCategoryId: number;
  requirements: string[];
  whatYouLearn: string[];
}

@Injectable({
  providedIn: 'root'
})
export class COURSESService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment2.baseUrl}courses`;

  GetAllCourses(): Observable<COURSERES> {
    return this.http.get<COURSERES>(this.apiUrl);
  }

  GetCourseById(id: number): Observable<CourseDetails> {
    return this.http.get<CourseDetails>(`${this.apiUrl}/${id}`);
  }

  GetMyCourses(): Observable<CourseListItem[]> {
    return this.http.get<CourseListItem[]>(`${this.apiUrl}/my`);
  }

  GetPendingCourses(): Observable<CourseListItem[]> {
    return this.http.get<CourseListItem[]>(`${this.apiUrl}/pending`);
  }

  CreateCourse(formData: FormData): Observable<CourseDetails> {
    return this.http.post<CourseDetails>(this.apiUrl, formData);
  }

  UpdateCourse(id: number, formData: FormData): Observable<CourseDetails> {
    return this.http.put<CourseDetails>(`${this.apiUrl}/${id}`, formData);
  }

  DeleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  SubmitCourse(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/submit`, {});
  }

  ArchiveCourse(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/archive`, {});
  }

  UnarchiveCourse(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/unarchive`, {});
  }

  ApproveCourse(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/approve`, {});
  }

  RejectCourse(id: number, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/reject`, { reason });
  }
}
