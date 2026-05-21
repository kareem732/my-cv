import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review, ReviewsService, ReviewSummary } from '../../../../../../../core/services/REVIEWSS/Reviews/reviews.service';

@Component({
  selector: 'app-reviews',
  imports: [FormsModule],
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent implements OnInit {
  private reviewsService = inject(ReviewsService);

  @Input() courseId!: number;

  reviews      = signal<Review[]>([]);
  summary      = signal<ReviewSummary | null>(null);
  myReview     = signal<Review | null>(null);
  isLoading    = signal(true);
  isSubmitting = signal(false);
  isEditing    = signal(false);
  isDeleting   = signal(false);
  error        = signal<string | null>(null);
  submitError  = signal<string>('');

  rating  = 0;
  comment = '';
  hovered = 0;

  ngOnInit(): void {
    this.loadReviews();
    this.loadMyReview();
  }

  loadReviews(): void {
    this.isLoading.set(true);
    this.reviewsService.getCourseReviews(this.courseId).subscribe({
      next: (res) => {
        this.reviews.set(res.reviews);
        this.summary.set(res.summary);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load reviews.');
        this.isLoading.set(false);
      }
    });
  }

  loadMyReview(): void {
    this.reviewsService.getMyReview(this.courseId).subscribe({
      next: (res) => {
        if (!res) return;
        this.myReview.set(res);
        this.rating  = res.rating;
        this.comment = res.comment;
      },
      error: () => this.myReview.set(null)
    });
  }

  submitReview(): void {
    if (!this.rating || !this.comment.trim()) return;
    this.isSubmitting.set(true);
    this.submitError.set('');

    const payload = { rating: this.rating, comment: this.comment };

    const handleError = (err: any) => {
  this.isSubmitting.set(false);
  const commentErrors = err?.error?.errors?.Comment;
  this.submitError.set(
    Array.isArray(commentErrors)
      ? commentErrors[0]
      : (err?.error?.message ?? 'Something went wrong. Please try again.')
  );
};

    if (this.myReview()) {
      this.reviewsService.updateReview(this.courseId, this.myReview()!.id, payload).subscribe({
        next: (updated) => {
          this.myReview.set(updated);
          this.isEditing.set(false);
          this.isSubmitting.set(false);
          this.submitError.set('');
          this.loadReviews();
        },
        error: handleError
      });
    } else {
      this.reviewsService.addReview(this.courseId, payload).subscribe({
        next: (created) => {
          this.myReview.set(created);
          this.isSubmitting.set(false);
          this.submitError.set('');
          this.loadReviews();
        },
        error: handleError
      });
    }
  }

  deleteReview(): void {
    if (!this.myReview()) return;
    this.isDeleting.set(true);
    this.reviewsService.deleteReview(this.courseId, this.myReview()!.id).subscribe({
      next: () => {
        this.myReview.set(null);
        this.rating  = 0;
        this.comment = '';
        this.isDeleting.set(false);
        this.loadReviews();
      },
      error: () => this.isDeleting.set(false)
    });
  }

  startEdit(): void {
    this.rating  = this.myReview()!.rating;
    this.comment = this.myReview()!.comment;
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.rating  = this.myReview()!.rating;
    this.comment = this.myReview()!.comment;
    this.isEditing.set(false);
  }

  setRating(r: number): void  { this.rating  = r; }
  setHovered(r: number): void { this.hovered = r; }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
