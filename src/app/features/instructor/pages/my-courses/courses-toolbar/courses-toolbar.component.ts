import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses-toolbar',
  imports: [FormsModule,NgClass],
  templateUrl: './courses-toolbar.component.html',
  styleUrl: './courses-toolbar.component.css'
})
export class CoursesToolbarComponent {

  searchTerm: string = '';
  selectedStatus: string = 'All';

  statuses = ['All', 'Published', 'Draft', 'Pending', 'Archived'];

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() addCourse = new EventEmitter<void>();

  onSearch(): void {
    this.searchChange.emit(this.searchTerm);
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.statusChange.emit(status);
  }

  onAddCourse(): void {
    this.addCourse.emit();
  }
}
