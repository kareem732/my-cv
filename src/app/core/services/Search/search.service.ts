import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface SearchSuggestion {
  courseId: number;
  title: string;
  category: string;
  thumbnailUrl: string;
}

export interface CourseResult {
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

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private base = environment2.baseUrl;

  getSuggestions(q: string): Observable<SearchSuggestion[]> {
    return this.http.get<SearchSuggestion[]>(`${this.base}search/suggestions`, {
      params: { q }
    });
  }

  getRelated(courseId: number): Observable<CourseResult[]> {
    return this.http.get<CourseResult[]>(`${this.base}search/related/${courseId}`);
  }

  getPopular(take: number = 10): Observable<CourseResult[]> {
    return this.http.get<CourseResult[]>(`${this.base}search/popular`, {
      params: { take }
    });
  }

  getTrending(take: number = 10): Observable<CourseResult[]> {
    return this.http.get<CourseResult[]>(`${this.base}search/trending`, {
      params: { take }
    });
  }
}
