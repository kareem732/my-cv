import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsResponse, ReviewsService } from '../../../../../../core/services/REVIEWSS/Reviews/reviews.service';

@Component({
  selector: 'app-admin-reviews',
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
})
export class AdminReviewsComponent implements OnInit {
  private reviewsService = inject(ReviewsService);

  courseId  = input.required<number>();
  data      = signal<ReviewsResponse | null>(null);
  isLoading = signal(true);
  error     = signal<string | null>(null);

  readonly stars = [5, 4, 3, 2, 1];

  ngOnInit(): void {
    this.reviewsService.getCourseReviews(this.courseId()).subscribe({
      next: (res) => {
        this.data.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load reviews.');
        this.isLoading.set(false);
      }
    });
  }

  getStarPercent(star: number): number {
    const s = this.data()?.summary;
    if (!s) return 0;
    const map: Record<number, number> = {
      5: s.fiveStarsPercent,
      4: s.fourStarsPercent,
      3: s.threeStarsPercent,
      2: s.twoStarsPercent,
      1: s.oneStarPercent,
    };
    return map[star] ?? 0;
  }

  getStarCount(star: number): number {
    const s = this.data()?.summary;
    if (!s) return 0;
    const map: Record<number, number> = {
      5: s.fiveStars,
      4: s.fourStars,
      3: s.threeStars,
      2: s.twoStars,
      1: s.oneStar,
    };
    return map[star] ?? 0;
  }
}
