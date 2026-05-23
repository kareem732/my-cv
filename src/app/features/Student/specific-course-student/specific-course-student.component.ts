import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { COURSESService, CourseDetails } from '../../../core/services/COURSES/courses.service';
import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { EnrollmentsService } from '../../../core/services/enrollments/enrollments.service';

@Component({
  selector: 'app-specific-course-student',
  imports: [CommonModule, CurriculumComponent, ReviewsComponent],
  templateUrl: './specific-course-student.component.html',
  styleUrl: './specific-course-student.component.css'
})
export class SpecificCourseStudentComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesService = inject(COURSESService);
  private enrollmentsService = inject(EnrollmentsService);

  course = signal<CourseDetails | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  activeTab = signal<'overview' | 'curriculum' | 'requirements'>('overview');
  isPreviewOpen = signal<boolean>(false);
  courseId = signal<number>(0);
  isEnrolled = signal<boolean>(false);
  get thumbnailSrc(): string {
    const url = this.course()?.thumbnailUrl;
    if (!url) return 'https://placehold.co/480x270?text=Course';
    if (url.startsWith('http')) return url;
    return `https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net${url}`;
  }
  discountPercent = computed(() => {
    const c = this.course();
    if (!c || !c.discountPrice || c.discountPrice >= c.price) return null;
    return Math.round(((c.price - c.discountPrice) / c.price) * 100);
  });

  levelLabel = computed(() => {
    const map: Record<string, string> = {
      Beginner: '🟢 Beginner',
      Intermediate: '🟡 Intermediate',
      Advanced: '🔴 Advanced',
    };
    return map[this.course()?.level ?? ''] ?? this.course()?.level ?? '';
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid course ID.');
      this.isLoading.set(false);
      return;
    }



    this.courseId.set(id);

    this.coursesService.GetCourseById(id).subscribe({
      next: (data) => {
        this.course.set(data);
        this.isLoading.set(false);
        this.checkEnrollment(id);
      },
      error: () => {
        this.error.set('Failed to load course. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private checkEnrollment(courseId: number): void {
  this.enrollmentsService.checkEnrollment(courseId).subscribe({
    next: (isEnrolled) => {
      this.isEnrolled.set(isEnrolled);
    },
    error: (err) => {
      this.isEnrolled.set(false);
    }
  });
}
  goToCheckout(): void {
    const c = this.course();
    this.router.navigate(['/student/checkout'], {
      state: {
        courseId: this.courseId(),
        title: c?.title,
        price: c?.discountPrice && c.discountPrice < c.price ? c.discountPrice : c?.price,
        originalPrice: c?.price,
        thumbnail: c?.thumbnailUrl,
        instructor: c?.instructorName,
      }
    });
  }

  goToCourse(): void {
  this.router.navigate(['/student/courses/continue-learning', this.courseId()]);
}
  setTab(tab: string) {
    this.activeTab.set(tab as 'overview' | 'curriculum' | 'requirements');
  }

  openPreview() { if (this.course()?.previewVideoUrl) this.isPreviewOpen.set(true); }
  closePreview() { this.isPreviewOpen.set(false); }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
