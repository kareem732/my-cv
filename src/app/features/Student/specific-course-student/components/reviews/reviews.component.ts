import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsResponse, ReviewsService } from '../../../../../core/services/REVIEWSS/Reviews/reviews.service';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  @Input() courseId!: number;

  private reviewsService = inject(ReviewsService);

  reviews = signal<ReviewsResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.reviewsService.getCourseReviews(this.courseId).subscribe({
      next: (data) => { this.reviews.set(data); this.isLoading.set(false); },
      error: () => { this.error.set('Failed to load reviews.'); this.isLoading.set(false); }
    });
  }
}
