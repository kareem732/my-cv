import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { EnrollmentsService, Enrollment } from '../../../../../../../core/services/enrollments/enrollments.service';

@Component({
  selector: 'app-my-learnings',
  imports: [RouterOutlet],
  templateUrl: './my-learnings.component.html',
  styleUrl: './my-learnings.component.css'
})
export class MyLearningsComponent implements OnInit {

  private enrollmentsService = inject(EnrollmentsService);
  private router             = inject(Router);
  private route              = inject(ActivatedRoute);

  enrollments = signal<Enrollment[]>([]);
  isLoading   = signal<boolean>(true);
  error       = signal<string | null>(null);
  skeletons   = [1, 2, 3, 4, 5, 6];

  // ✅ هل فيه child route نشط؟
  get isChildActive(): boolean {
    return this.route.children.length > 0;
  }

  ngOnInit(): void {
    this.enrollmentsService.getMyEnrollments().subscribe({
      next: (data) => { this.enrollments.set(data); this.isLoading.set(false); },
      error: ()     => { this.error.set('Failed to load your courses.'); this.isLoading.set(false); }
    });
  }

  goToDetails(courseId: number): void {
    this.router.navigate(['course-learning', courseId], { relativeTo: this.route });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  }
}
