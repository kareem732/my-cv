import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';


export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  courseCount: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  order: number;
  totalCourses: number;
  subCategories: SubCategory[];
}

export interface CourseCard {
  id: number;
  title: string;
  shortDescription: string;
  thumbnailUrl: string;
  price: number;
  discountPrice: number | null;
  level: string;
  language: string;
  instructorName: string;
  subCategoryName: string;
  status: string;
  averageRating: number;
  totalStudents: number;
  createdAt: string;
}

export interface SearchSuggestion {
  courseId: number;
  title: string;
  category: string;
  thumbnailUrl: string;
}

export interface CoursesFilter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  subCategoryId?: number;
  categoryId?: number;
  level?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

export interface PaginatedCourses {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: CourseCard[];
}


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly baseUrl = environment2.baseUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}categories`);
  }

  getTrendingCourses(take: number = 10): Observable<CourseCard[]> {
    const params = new HttpParams().set('take', take.toString());
    return this.http.get<CourseCard[]>(`${this.baseUrl}search/trending`, { params });
  }

  getPopularCourses(take: number = 10): Observable<CourseCard[]> {
    const params = new HttpParams().set('take', take.toString());
    return this.http.get<CourseCard[]>(`${this.baseUrl}search/popular`, { params });
  }

  getSearchSuggestions(query: string): Observable<SearchSuggestion[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<SearchSuggestion[]>(`${this.baseUrl}search/suggestions`, { params });
  }

  getCourses(filter: CoursesFilter = {}): Observable<PaginatedCourses> {
    let params = new HttpParams();

    if (filter.pageIndex != null)    params = params.set('PageIndex',     filter.pageIndex.toString());
    if (filter.pageSize  != null)    params = params.set('PageSize',      filter.pageSize.toString());
    if (filter.search)               params = params.set('Search',        filter.search);
    if (filter.subCategoryId != null) params = params.set('SubCategoryId', filter.subCategoryId.toString());
    if (filter.categoryId    != null) params = params.set('CategoryId',    filter.categoryId.toString());
    if (filter.level)                params = params.set('Level',         filter.level);
    if (filter.language)             params = params.set('Language',      filter.language);
    if (filter.minPrice != null)     params = params.set('MinPrice',      filter.minPrice.toString());
    if (filter.maxPrice != null)     params = params.set('MaxPrice',      filter.maxPrice.toString());
    if (filter.sortBy)               params = params.set('SortBy',        filter.sortBy);

    return this.http.get<PaginatedCourses>(`${this.baseUrl}courses`, { params });
  }
}
