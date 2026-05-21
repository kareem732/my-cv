import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentsService, EnrollmentDetails } from '../../../../../../../../../core/services/enrollments/enrollments.service';
@Component({
  selector: 'app-course-learning',
  imports: [],
  templateUrl: './course-learning.component.html',
  styleUrl: './course-learning.component.css'
})
export class CourseLearningComponent implements OnInit {

  private route              = inject(ActivatedRoute);
  private router             = inject(Router);
  private enrollmentsService = inject(EnrollmentsService);

  details    = signal<EnrollmentDetails | null>(null);
  isLoading  = signal<boolean>(true);
  error      = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid course ID.');
      this.isLoading.set(false);
      return;
    }

    this.enrollmentsService.getEnrollmentDetails(id).subscribe({
      next: (data) => { this.details.set(data); this.isLoading.set(false); },
      error: ()     => { this.error.set('Failed to load course details.'); this.isLoading.set(false); }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/profile/my-learnings']);
  }

  goToContinueLearning(): void {
    const id = this.details()?.courseId;
    if (id) this.router.navigate(['/student/courses/continue-learning', id]);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  }

  remainingLessons(): number {
    const d = this.details();
    if (!d) return 0;
    return d.totalLessons - d.completedLessons;
  }
}
