import { Component, Input, OnChanges } from '@angular/core';
import { CourseListItem } from '../../../../../core/services/COURSES/courses.service';

@Component({
  selector: 'app-courses-stats-bar',
  imports: [],
  templateUrl: './courses-stats-bar.component.html',
  styleUrl: './courses-stats-bar.component.css'
})
export class CoursesStatsBarComponent implements OnChanges {

  @Input() courses: CourseListItem[] = [];

  stats = {
    all: 0,
    published: 0,
    draft: 0,
    pending: 0,
    archived: 0
  };

  ngOnChanges(): void {
    this.calcStats();
  }

  private calcStats(): void {
    this.stats.all       = this.courses.length;
    this.stats.published = this.courses.filter(c => c.status === 'Published').length;
    this.stats.draft     = this.courses.filter(c => c.status === 'Draft').length;
    this.stats.pending   = this.courses.filter(c => c.status === 'Pending' || c.status === 'UnderReview').length;
    this.stats.archived  = this.courses.filter(c => c.status === 'Archived').length;
  }
}
