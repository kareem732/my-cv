import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminReviewsService, ReviewsResponse } from '../../../../core/services/AdminReviews/admin-reviews.service';

@Component({
  selector: 'app-admin-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class AdminReviewsComponent implements OnInit {
  private readonly _reviewsService = inject(AdminReviewsService);

  @Input() courseId!: number;

  reviewsData    = signal<ReviewsResponse | null>(null);
  isLoading      = signal(true);
  errorMessage   = signal('');
  successMessage = signal('');
  selectedRating = signal<number | undefined>(undefined);

  // ── Delete Modal ──────────────────────────────────────
  isDeleteModalOpen = signal(false);
  deleteTargetId    = signal<{ courseId: number; reviewId: number } | null>(null);
  isDeleteLoading   = signal(false);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._reviewsService.getReviews({
      courseId: this.courseId,
      rating: this.selectedRating()
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

  onRatingFilter(rating: number | undefined): void {
    this.selectedRating.set(rating);
    this.loadReviews();
  }

  openDeleteModal(courseId: number, reviewId: number): void {
    this.deleteTargetId.set({ courseId, reviewId });
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deleteTargetId.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTargetId();
    if (!target) return;

    this.isDeleteLoading.set(true);
    this._reviewsService.deleteReview(target.courseId, target.reviewId).subscribe({
      next: () => {
        this.isDeleteLoading.set(false);
        this.closeDeleteModal();
        this.successMessage.set('Review deleted successfully.');
        this.loadReviews();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isDeleteLoading.set(false);
        this.errorMessage.set('Failed to delete review.');
      }
    });
  }

  getStars(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
