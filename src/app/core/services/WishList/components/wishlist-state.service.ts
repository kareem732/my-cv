import { Injectable, inject, signal } from '@angular/core';
import { WishListService } from '../wish-list.service';

@Injectable({ providedIn: 'root' })
export class WishlistStateService {
  private wishlistService = inject(WishListService);

  private _ids = signal<Set<number>>(new Set());
  wishlistIds = this._ids.asReadonly();

  load(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (items) => this._ids.set(new Set(items.map(i => i.courseId)))
    });
  }

  isWishlisted(courseId: number): boolean {
    return this._ids().has(courseId);
  }

  add(courseId: number): void {
    this._ids.update(set => new Set([...set, courseId]));
  }

  remove(courseId: number): void {
    this._ids.update(set => { const s = new Set(set); s.delete(courseId); return s; });
  }

  get count(): number {
    return this._ids().size;
  }
}
