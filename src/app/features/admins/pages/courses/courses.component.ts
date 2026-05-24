import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminService } from '../../../../core/services/Admin/admin.service';
import { AdminCoursesRes } from '../../../../core/interfaces/Admin/admin-courses/admin-courses';
import { COURSESService, CourseDetails } from '../../../../core/services/COURSES/courses.service';
import { AdminCurriculumComponent } from './components/curriculum/curriculum.component';
import { AdminReviewsComponent } from './components/reviews/reviews.component';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule, AdminCurriculumComponent, AdminReviewsComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  private adminService   = inject(AdminService);
  private coursesService = inject(COURSESService);
  private destroyRef     = inject(DestroyRef);

  courses      = signal<AdminCoursesRes>([]);
  isLoading    = signal(true);
  errorMessage = signal<string | null>(null);
  activeFilter = signal<number | undefined>(undefined);
  searchQuery  = signal<string>('');

  isRejectModalOpen  = false;
  rejectReason       = '';
  rejectTargetId: number | null = null;
  isRejectLoading    = false;

  actionLoadingId = signal<number | null>(null);

  isViewModalOpen     = false;
  selectedCourse      = signal<CourseDetails | null>(null);
  isViewLoading       = signal(false);
  viewErrorMessage    = signal<string | null>(null);

  isViewRejectOpen    = false;
  viewRejectReason    = '';
  isViewRejectLoading = false;

  private searchSubject = new Subject<string>();

  totalEnrollments = computed(() =>
    this.courses().reduce((sum, c) => sum + c.enrollments, 0)
  );

  approvedCount = computed(() => this.courses().filter(c => c.status === 'Published').length);
  pendingCount  = computed(() => this.courses().filter(c => c.status === 'UnderReview').length);
  rejectedCount = computed(() => this.courses().filter(c => c.status === 'Rejected').length);

  statCards = computed(() => [
    { label: 'Total Courses', value: this.courses().length },
    { label: 'Published',     value: this.approvedCount() },
    { label: 'Under Review',  value: this.pendingCount()  },
    { label: 'Rejected',      value: this.rejectedCount() },
  ]);

  readonly statuses = [
    { label: 'All',         value: undefined },
    { label: 'UnderReview', value: 2 },
    { label: 'Published',   value: 3 },
    { label: 'Archived',    value: 4 },
    { label: 'Rejected',    value: 5 },
  ];

  readonly skeletonRows = Array(6).fill(0);

  ngOnInit(): void {
    this.loadCourses();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(query => {
      this.searchQuery.set(query);
      this.loadCourses();
    });
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const params = {
      ...(this.activeFilter() !== undefined && { status: this.activeFilter() }),
      ...(this.searchQuery() && { search: this.searchQuery() }),
    };

    this.adminService.getCourses(params).subscribe({
      next: (data) => {
        console.log(data);
        
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Something went wrong. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  setFilter(value: number | undefined): void {
    this.activeFilter.set(value);
    this.loadCourses();
  }

  viewCourse(id: number): void {
    this.isViewModalOpen  = true;
    this.isViewRejectOpen = false;
    this.viewRejectReason = '';
    this.selectedCourse.set(null);
    this.viewErrorMessage.set(null);
    this.isViewLoading.set(true);

    this.coursesService.GetCourseById(id).subscribe({
      next: (data) => {
        this.selectedCourse.set(data);
        this.isViewLoading.set(false);
      },
      error: () => {
        this.viewErrorMessage.set('Failed to load course details.');
        this.isViewLoading.set(false);
      }
    });
  }

  closeViewModal(): void {
    this.isViewModalOpen  = false;
    this.isViewRejectOpen = false;
    this.viewRejectReason = '';
    this.selectedCourse.set(null);
  }

  onApproveFromView(): void {
    const course = this.selectedCourse();
    if (!course) return;
    this.actionLoadingId.set(course.id);

    this.coursesService.ApproveCourse(course.id).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.closeViewModal();
        this.loadCourses();
      },
      error: () => this.actionLoadingId.set(null)
    });
  }

  openViewReject(): void {
    this.isViewRejectOpen = true;
  }

  closeViewReject(): void {
    this.isViewRejectOpen = false;
    this.viewRejectReason = '';
  }

  confirmViewReject(): void {
    const course = this.selectedCourse();
    if (!course || !this.viewRejectReason.trim()) return;
    this.isViewRejectLoading = true;

    this.coursesService.RejectCourse(course.id, this.viewRejectReason).subscribe({
      next: () => {
        this.isViewRejectLoading = false;
        this.closeViewModal();
        this.loadCourses();
      },
      error: () => this.isViewRejectLoading = false
    });
  }

  onApprove(id: number): void {
    this.actionLoadingId.set(id);
    this.coursesService.ApproveCourse(id).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.loadCourses();
      },
      error: () => this.actionLoadingId.set(null)
    });
  }

  openRejectModal(id: number): void {
    this.rejectTargetId    = id;
    this.rejectReason      = '';
    this.isRejectModalOpen = true;
  }

  closeRejectModal(): void {
    this.isRejectModalOpen = false;
    this.rejectTargetId    = null;
    this.rejectReason      = '';
  }

  confirmReject(): void {
    if (!this.rejectTargetId || !this.rejectReason.trim()) return;
    this.isRejectLoading = true;

    this.coursesService.RejectCourse(this.rejectTargetId, this.rejectReason).subscribe({
      next: () => {
        this.isRejectLoading   = false;
        this.isRejectModalOpen = false;
        this.rejectTargetId    = null;
        this.rejectReason      = '';
        this.loadCourses();
      },
      error: () => this.isRejectLoading = false
    });
  }

  onArchive(id: number): void {
    this.actionLoadingId.set(id);
    this.coursesService.ArchiveCourse(id).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.loadCourses();
      },
      error: () => this.actionLoadingId.set(null)
    });
  }

  onUnarchive(id: number): void {
    this.actionLoadingId.set(id);
    this.coursesService.UnarchiveCourse(id).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.loadCourses();
      },
      error: () => this.actionLoadingId.set(null)
    });
  }

  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

getThumbnailUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${this.baseUrl}${url}`;
}
}
