import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  InstructorReviewsService,
  ReviewsResponse,
  CourseFilter
} from '../../../../core/services/InstructorReviews/instructor-reviews.service';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  private readonly _reviewsService = inject(InstructorReviewsService);

  reviewsData    = signal<ReviewsResponse | null>(null);
  courses        = signal<CourseFilter[]>([]);
  isLoading      = signal(true);
  errorMessage   = signal('');
  successMessage = signal('');

  selectedCourseId = signal<number | undefined>(undefined);

  ngOnInit(): void {
    this.loadCoursesFilter();
    this.loadReviews();
  }

  loadCoursesFilter(): void {
    this._reviewsService.getCoursesFilter().subscribe({
      next: (data) => this.courses.set(data),
      error: () => {}
    });
  }

  loadReviews(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._reviewsService.getReviews({
      courseId: this.selectedCourseId(),
    }).subscribe({
      next: (data) => {
        this.reviewsData.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load reviews.');
        this.isLoading.set(false);
      }
    });
  }

  onCourseChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedCourseId.set(val ? +val : undefined);
    this.loadReviews();
  }

  clearFilters(): void {
    this.selectedCourseId.set(undefined);
    this.loadReviews();
  }

  getStarsReversed(): number[] {
    return [5, 4, 3, 2, 1];
  }

  getBarWidth(star: number): string {
    const data = this.reviewsData();
    if (!data || data.totalReviews === 0) return '0%';
    const dist = data.ratingDistribution as Record<string, number>;
    const count = dist[star] ?? dist[String(star)] ?? 0;
    return `${Math.round((count / data.totalReviews) * 100)}%`;
  }

  getBarCount(star: number): number {
    const data = this.reviewsData();
    if (!data) return 0;
    const dist = data.ratingDistribution as Record<string, number>;
    return dist[star] ?? dist[String(star)] ?? 0;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year:  'numeric',
      month: 'short',
      day:   'numeric'
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  get hasActiveFilters(): boolean {
    return this.selectedCourseId() !== undefined;
  }
}
