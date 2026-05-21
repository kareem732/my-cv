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
  updatedAt: string;
}

export interface ReviewsResponse {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
  reviews: Review[];
}

export interface CourseFilter {
  id: number;
  title: string;
}

export interface GetReviewsParams {
  courseId?: number;
  rating?: number;
}


@Injectable({
  providedIn: 'root'
})
export class InstructorReviewsService {
  private readonly _http = inject(HttpClient);

  private readonly _base = `${environment2.baseUrl}instructor/reviews`;

  getReviews(params?: GetReviewsParams): Observable<ReviewsResponse> {
    let httpParams = new HttpParams();

    if (params?.courseId !== undefined) {
      httpParams = httpParams.set('courseId', params.courseId);
    }
    if (params?.rating !== undefined) {
      httpParams = httpParams.set('rating', params.rating);
    }

    return this._http.get<ReviewsResponse>(this._base, { params: httpParams });
  }

  getCoursesFilter(): Observable<CourseFilter[]> {
    return this._http.get<CourseFilter[]>(`${this._base}/courses-filter`);
  }
}
