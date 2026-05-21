import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../../environment/ENV';

export interface ReviewSummary {
  averageRating: number;
  totalRatings: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
  fiveStarsPercent: number;
  fourStarsPercent: number;
  threeStarsPercent: number;
  twoStarsPercent: number;
  oneStarPercent: number;
}

export interface Review {
  id: number;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  courseId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  summary: ReviewSummary;
  reviews: Review[];
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment2.baseUrl}courses`;

  getCourseReviews(courseId: number): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.baseUrl}/${courseId}/reviews`);
  }

  addReview(courseId: number, payload: ReviewPayload): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/${courseId}/reviews`, payload);
  }

  getMyReview(courseId: number): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/${courseId}/reviews/my`);
  }

  updateReview(courseId: number, reviewId: number, payload: ReviewPayload): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${courseId}/reviews/${reviewId}`, payload);
  }

  deleteReview(courseId: number, reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${courseId}/reviews/${reviewId}`);
  }



}
