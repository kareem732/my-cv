import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { CourseDetails } from '../../../../../../core/services/COURSES/courses.service';

@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [NgClass, DecimalPipe, DatePipe],
  templateUrl: './course-overview.component.html',
})
export class CourseOverviewComponent {

  @Input() course!: CourseDetails;
  @Input() isActioning = false;

  @Output() submitEvent    = new EventEmitter<void>();
  @Output() archiveEvent   = new EventEmitter<void>();
  @Output() unarchiveEvent = new EventEmitter<void>();
  @Output() editEvent      = new EventEmitter<void>();

  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  get statusLower(): string { return this.course?.status?.toLowerCase() ?? ''; }

  get statusClass(): string {
    switch (this.statusLower) {
      case 'published':   return 'bg-green-500/90 text-white';
      case 'draft':       return 'bg-gray-600/80 text-white';
      case 'pending':
      case 'underreview': return 'bg-amber-400/90 text-white';
      case 'archived':    return 'bg-red-500/90 text-white';
      default:            return 'bg-gray-100 text-gray-700';
    }
  }

  get canSubmit(): boolean    { return this.statusLower === 'draft'; }
  get canArchive(): boolean   { return this.statusLower === 'published'; }
  get canUnarchive(): boolean { return this.statusLower === 'archived'; }
  get canEdit(): boolean      { return ['draft', 'published'].includes(this.statusLower); }

  get price(): number         { return this.course?.price ?? 0; }
  get discountPrice(): number { return this.course?.discountPrice ?? 0; }
  get averageRating(): number { return this.course?.averageRating ?? 0; }
  get totalStudents(): number { return this.course?.totalStudents ?? 0; }

  get hasDiscount(): boolean {
    return this.discountPrice > 0 && this.discountPrice < this.price;
  }

  get discountPercent(): number {
    if (!this.hasDiscount || this.price === 0) return 0;
    return Math.round((1 - this.discountPrice / this.price) * 100);
  }

  getThumbnailUrl(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }
}
