import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface Review {
  id: number;
  courseId: number;
  courseTitle: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}

export interface CourseFilter {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminReviewsService {
  private readonly _http = inject(HttpClient);
  private readonly baseUrl = environment2.baseUrl;

  getReviews(filters?: { courseId?: number; rating?: number }): Observable<ReviewsResponse> {
    let params = new HttpParams();

    if (filters?.courseId !== undefined) {
      params = params.set('courseId', filters.courseId);
    }
    if (filters?.rating !== undefined) {
      params = params.set('rating', filters.rating);
    }

    return this._http.get<ReviewsResponse>(`${this.baseUrl}admin/reviews`, { params });
  }

  searchCourses(search: string): Observable<CourseFilter[]> {
    const params = new HttpParams().set('search', search);
    return this._http.get<CourseFilter[]>(`${this.baseUrl}admin/reviews/courses-filter`, { params });
  }

  deleteReview(courseId: number, reviewId: number): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}courses/${courseId}/reviews/${reviewId}`);
  }
}
