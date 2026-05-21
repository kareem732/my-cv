import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseListItem } from '../../../../../core/services/COURSES/courses.service';

@Component({
  selector: 'app-course-card-menu',
  imports: [],
  templateUrl: './course-card-menu.component.html',
  styleUrl: './course-card-menu.component.css'
})
export class CourseCardMenuComponent {

  @Input() course!: CourseListItem;

  @Output() edit      = new EventEmitter<number>();
  @Output() submit    = new EventEmitter<number>();
  @Output() archive   = new EventEmitter<number>();
  @Output() unarchive = new EventEmitter<number>();
  @Output() delete    = new EventEmitter<number>();

  isOpen = false;

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  onEdit(): void {
    this.edit.emit(this.course.id);
    this.closeMenu();
  }

  onSubmit(): void {
    this.submit.emit(this.course.id);
    this.closeMenu();
  }

  onToggleArchive(): void {
    if (this.course.status === 'Archived') {
      this.unarchive.emit(this.course.id);
    } else {
      this.archive.emit(this.course.id);
    }
    this.closeMenu();
  }

  onDelete(): void {
    this.delete.emit(this.course.id);
    this.closeMenu();
  }

  get canEdit(): boolean {
    return ['Draft', 'Published'].includes(this.course.status);
  }

  get canSubmit(): boolean {
    return this.course.status === 'Draft';
  }

  get isArchived(): boolean {
    return this.course.status === 'Archived';
  }

  get canDelete(): boolean {
    return ['Draft', 'Archived'].includes(this.course.status);
  }
}
