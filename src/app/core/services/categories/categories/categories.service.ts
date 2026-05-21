import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../../environment/ENV';
import { CategoriesRes } from '../../../interfaces/Categories/categories/categories';

export interface CategoryPayload {
  name: string;
  description: string;
  iconUrl?: string;
}

export interface SubCategoryPayload {
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment2.baseUrl}categories`;


  getCategories(): Observable<CategoriesRes> {
    return this.http.get<CategoriesRes>(this.baseUrl);
  }

  createCategory(payload: CategoryPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateCategory(id: number, payload: CategoryPayload): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }


  createSubCategory(categoryId: number, payload: SubCategoryPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${categoryId}/subcategories`, payload);
  }

  updateSubCategory(categoryId: number, subCategoryId: number, payload: SubCategoryPayload): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${categoryId}/subcategories/${subCategoryId}`, payload);
  }

  deleteSubCategory(categoryId: number, subCategoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${categoryId}/subcategories/${subCategoryId}`);
  }
}
