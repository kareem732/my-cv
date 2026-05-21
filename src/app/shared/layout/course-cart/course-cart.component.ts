import { Component, inject, OnInit, signal } from '@angular/core';
import { COURSESService } from '../../../core/services/COURSES/courses.service';
import { COURSERES } from '../../../core/interfaces/COURSE/course';
import { CourseListItem } from '../../../core/interfaces/CourseListItem/course-list-item';

@Component({
  selector: 'app-course-cart',
  imports: [],
  templateUrl: './course-cart.component.html',
  styleUrl: './course-cart.component.css'
})
export class COURSECARTComponent implements OnInit {
  private _courseService = inject(COURSESService);
  courses = signal<CourseListItem[]>([]);

  ngOnInit() {
    this._courseService.GetAllCourses().subscribe({
      next: (res: COURSERES) => {
        this.courses.set(res.data); 
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getImage(url: string | null): string {
  if (!url) return 'assets/placeholder.png';

  if (url.startsWith('http')) return url;

  return `https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net${url}`;
}
}
