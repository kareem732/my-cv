import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistItem, WishListService } from '../../../core/services/WishList/wish-list.service';
import { WishlistStateService } from '../../../core/services/WishList/components/wishlist-state.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishListService);
  private wishlistState   = inject(WishlistStateService);

  items = signal<WishlistItem[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

ngOnInit(): void {
  this.wishlistService.getWishlist().subscribe({
    next: (data) => {
      this.items.set(data);
      this.isLoading.set(false);
    },
    error: () => {
      this.error.set('Failed to load wishlist.');
      this.isLoading.set(false);
    }
  });
}
  getThumbnail(url: string | null): string {
  if (!url) return 'https://placehold.co/160x100?text=Course';
  if (url.startsWith('http')) return url;
  return `https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net${url}`;
}
  remove(courseId: number): void {
    this.wishlistService.removeFromWishlist(courseId).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i.courseId !== courseId));
        this.wishlistState.remove(courseId);
      }
    });
  }
}
