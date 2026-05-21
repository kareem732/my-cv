import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { CoursesToolbarComponent } from './courses-toolbar/courses-toolbar.component';
import { CoursesStatsBarComponent } from './courses-stats-bar/courses-stats-bar.component';
import { CourseListItem, COURSESService } from '../../../../core/services/COURSES/courses.service';

@Component({
  selector: 'app-my-courses',
  imports: [
    CoursesToolbarComponent,
    CoursesStatsBarComponent,
    NgClass
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {
  openMenuId: number | null = null;

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  private coursesService = inject(COURSESService);
  private router = inject(Router);

  allCourses: CourseListItem[] = [];
  filteredCourses: CourseListItem[] = [];
  skeletonRows = Array(8);

  isLoading = false;
  error: string | null = null;

  private currentSearch = '';
  private currentStatus = 'All';

  isDeleteModalOpen = false;
  isDeleteLoading = false;
  private deleteTargetId: number | null = null;

  toastVisible = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';
  private toastTimer: any;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = null;

    this.coursesService.GetMyCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load courses. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getThumbnailUrl(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net${url}`;
  }

  onSearchChange(term: string): void {
    this.currentSearch = term.toLowerCase();
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.currentStatus = status;
    this.applyFilters();
  }

  onAddCourse(): void {
    this.router.navigate(['/instructor/my-courses/create']);
  }

  onViewSpec(id: number): void {
    this.router.navigate([`/instructor/my-courses/${id}`]);
  }

  onEdit(id: number): void {
    this.router.navigate([`/instructor/my-courses/${id}/edit`]);
  }

  onSubmit(id: number): void {
    this.coursesService.SubmitCourse(id).subscribe({
      next: () => {
        this.showToast('success', 'Course submitted for review successfully.');
        this.loadCourses();
      },
      error: () => this.showToast('error', 'Failed to submit course.')
    });
  }

  onArchive(id: number): void {
    this.coursesService.ArchiveCourse(id).subscribe({
      next: () => {
        this.showToast('success', 'Course archived successfully.');
        this.loadCourses();
      },
      error: () => this.showToast('error', 'Failed to archive course.')
    });
  }

  onUnarchive(id: number): void {
    this.coursesService.UnarchiveCourse(id).subscribe({
      next: () => {
        this.showToast('success', 'Course unarchived successfully.');
        this.loadCourses();
      },
      error: () => this.showToast('error', 'Failed to unarchive course.')
    });
  }

  onDelete(id: number): void {
    this.deleteTargetId = id;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (this.deleteTargetId === null) return;
    this.isDeleteLoading = true;

    this.coursesService.DeleteCourse(this.deleteTargetId).subscribe({
      next: () => {
        this.isDeleteLoading = false;
        this.isDeleteModalOpen = false;
        this.deleteTargetId = null;
        this.showToast('success', 'Course deleted successfully.');
        this.loadCourses();
      },
      error: () => {
        this.isDeleteLoading = false;
        this.isDeleteModalOpen = false;
        this.showToast('error', 'Failed to delete course.');
      }
    });
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.deleteTargetId = null;
  }

  private showToast(type: 'success' | 'error', message: string): void {
    clearTimeout(this.toastTimer);
    this.toastType = type;
    this.toastMessage = message;
    this.toastVisible = true;
    this.toastTimer = setTimeout(() => this.toastVisible = false, 3000);
  }

  private applyFilters(): void {
    let result = [...this.allCourses];

    if (this.currentStatus !== 'All') {
      result = result.filter(c =>
        this.currentStatus === 'Pending'
          ? ['pending', 'underreview'].includes(c.status.toLowerCase())
          : c.status.toLowerCase() === this.currentStatus.toLowerCase()
      );
    }

    if (this.currentSearch) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(this.currentSearch)
      );
    }

    this.filteredCourses = result;
  }
}
