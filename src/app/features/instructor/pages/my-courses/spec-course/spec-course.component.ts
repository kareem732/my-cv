
import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { CourseDetails, COURSESService } from '../../../../../core/services/COURSES/courses.service';
import { Curriculum } from '../../../../../core/services/Curriculm/curriculm.service';
import { CourseOverviewComponent } from './course-overview/course-overview.component';
import { CourseCurriculumComponent } from './course-curriculum/course-curriculum.component';

@Component({
  selector: 'app-spec-course',
  standalone: true,
  imports: [NgClass, CourseOverviewComponent, CourseCurriculumComponent],
  templateUrl: './spec-course.component.html',
  styleUrl: './spec-course.component.css'
})
export class SpecCourseComponent implements OnInit {

  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private courseSvc  = inject(COURSESService);
  private destroyRef = inject(DestroyRef);

  courseId!: number;
  course: CourseDetails | null = null;
  isLoading = true;
  loadError: string | null = null;

  activeTab: 'overview' | 'curriculum' = 'overview';

  curriculum: Curriculum | null = null;

  isActioning = false;

  toastVisible = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
  }

  loadCourse(): void {
    this.isLoading = true;
    this.loadError = null;

    this.courseSvc.GetCourseById(this.courseId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (course) => {
          this.course    = course;
          this.isLoading = false;
        },
        error: () => {
          this.loadError = 'Failed to load course details. Please try again.';
          this.isLoading = false;
        }
      });
  }

  setTab(tab: 'overview' | 'curriculum'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/instructor/my-courses']);
  }

  onSubmit(): void {
    this.isActioning = true;
    this.courseSvc.SubmitCourse(this.courseId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isActioning = false;
          this.showToast('success', 'Course submitted for review.');
          this.loadCourse();
        },
        error: () => {
          this.isActioning = false;
          this.showToast('error', 'Failed to submit course.');
        }
      });
  }

  onArchive(): void {
    this.isActioning = true;
    this.courseSvc.ArchiveCourse(this.courseId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isActioning = false;
          this.showToast('success', 'Course archived successfully.');
          this.loadCourse();
        },
        error: () => {
          this.isActioning = false;
          this.showToast('error', 'Failed to archive course.');
        }
      });
  }

  onUnarchive(): void {
    this.isActioning = true;
    this.courseSvc.UnarchiveCourse(this.courseId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isActioning = false;
          this.showToast('success', 'Course unarchived successfully.');
          this.loadCourse();
        },
        error: () => {
          this.isActioning = false;
          this.showToast('error', 'Failed to unarchive course.');
        }
      });
  }

  onEdit(): void {
    this.router.navigate([`/instructor/my-courses/${this.courseId}/edit`]);
  }

  onCurriculumLoaded(curriculum: Curriculum): void {
    this.curriculum = curriculum;
  }

  showToast(type: 'success' | 'error', message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastType    = type;
    this.toastMessage = message;
    this.toastVisible = true;
    this.toastTimer   = setTimeout(() => (this.toastVisible = false), 3500);
  }
}
