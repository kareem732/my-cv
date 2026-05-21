import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

export interface WishlistItem {
  id: number;
  courseId: number;
  courseTitle: string;
  thumbnailUrl: string;
  instructorName: string;
  price: number;
  discountPrice: number;
  averageRating: number;
  totalRatings: number;
  level: string;
  addedAt: string;
  isEnrolled: boolean;
}

@Injectable({ providedIn: 'root' })
export class WishListService {
  private http = inject(HttpClient);
  private base = environment2.baseUrl;

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.base}wishlist`);
  }

  addToWishlist(courseId: number): Observable<void> {
    return this.http.post<void>(`${this.base}wishlist/${courseId}`, {});
  }

  removeFromWishlist(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}wishlist/${courseId}`);
  }
}
