import { Component, OnInit, inject } from '@angular/core';
import { CourseCardComponent } from '../course-card/course-card.component';
import { SearchService, CourseResult } from '../../../../../core/services/Search/search.service';

@Component({
  selector: 'app-popular-courses',
  standalone: true,
  imports: [CourseCardComponent],
  templateUrl: './popular-courses.component.html',
})
export class PopularCoursesComponent implements OnInit {
  private searchService = inject(SearchService);

  courses: CourseResult[] = [];
  loading = true;
  error   = false;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.error   = false;

    this.searchService.getPopular(8).subscribe({
      next: res => {
        this.courses = res;
        this.loading = false;
      },
      error: () => {
        this.error   = true;
        this.loading = false;
      }
    });
  }

  get skeletons(): number[] {
    return Array(4).fill(0).map((_, i) => i);
  }
}
