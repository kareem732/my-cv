import { Component, Input, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CourseCard } from '../../../../../core/services/homeService/home-service.service';
import { WishlistStateService } from '../../../../../core/services/WishList/components/wishlist-state.service';
import { WishListService } from '../../../../../core/services/WishList/wish-list.service';
import { CourseResult } from '../../../../../core/services/Search/search.service';

type CourseInput = CourseCard | CourseResult;

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './course-card.component.html',
})
export class CourseCardComponent {
  @Input() course!: CourseInput;
  @Input() searchQuery = '';

  private wishlistService = inject(WishListService);
  wishlistState = inject(WishlistStateService);
  isLoading = signal(false);

  isWishlisted(): boolean {
    return this.wishlistState.isWishlisted(this.course.id);
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    if (this.isLoading()) return;
    this.isLoading.set(true);

    if (this.isWishlisted()) {
      this.wishlistService.removeFromWishlist(this.course.id).subscribe({
        next: () => { this.wishlistState.remove(this.course.id); this.isLoading.set(false); },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.wishlistService.addToWishlist(this.course.id).subscribe({
        next: () => { this.wishlistState.add(this.course.id); this.isLoading.set(false); },
        error: () => this.isLoading.set(false)
      });
    }
  }

  get highlightedTitle(): string {
    if (!this.searchQuery.trim()) return this.course.title;
    const escaped = this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return this.course.title.replace(
      regex,
      '<mark class="bg-yellow-200 text-gray-900 rounded px-0.5">$1</mark>'
    );
  }

  get displayPrice(): string {
    return this.course.discountPrice !== null
      ? `$${this.course.discountPrice.toFixed(2)}`
      : `$${this.course.price.toFixed(2)}`;
  }

  get hasDiscount(): boolean {
    return this.course.discountPrice !== null && this.course.discountPrice < this.course.price;
  }

  get stars(): { index: number; cls: string }[] {
    return [1, 2, 3, 4, 5].map(i => {
      const r = this.course.averageRating;
      let cls = 'text-gray-300';
      if (i <= Math.floor(r)) cls = 'text-yellow-400';
      else if (i === Math.ceil(r) && r % 1 >= 0.5) cls = 'text-yellow-300';
      return { index: i, cls };
    });
  }

  get levelBadgeClass(): string {
    const map: Record<string, string> = {
      beginner:     'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      advanced:     'bg-red-100 text-red-700',
    };
    return map[this.course.level?.toLowerCase()] ?? 'bg-gray-100 text-gray-700';
  }

  get thumbnailSrc(): string {
  const url = this.course.thumbnailUrl;
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net${url}`;
}

  get formattedStudents(): string {
    return new Intl.NumberFormat().format(this.course.totalStudents);
  }
}
