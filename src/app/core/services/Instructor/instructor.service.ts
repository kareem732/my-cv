import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';

@Injectable({ providedIn: 'root' })
export class InstructorService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _platformId = inject(PLATFORM_ID);

  private _accessToken = signal<string | null>(null);

  private readonly coursesUrl  = `${environment2.baseUrl}Courses`;
  private readonly sectionsUrl = `${environment2.baseUrl}Sections`;

  constructor() {
    afterNextRender(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this._accessToken.set(token);
      }
    });
  }

  setToken(token: string) {
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('accessToken', token);
      this._accessToken.set(token);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this._accessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }


  getCourseById(courseId: number): Observable<any> {
    return this._httpClient.get(`${this.coursesUrl}/${courseId}`, { headers: this.getHeaders() });
  }

  getMyCourses(): Observable<any> {
    return this._httpClient.get(`${this.coursesUrl}/my-courses`, { headers: this.getHeaders() });
  }

  GetCourseByIdLikeStudent(id: any): Observable<any> {
    return this._httpClient.get(`${this.coursesUrl}/my-courses/${id}`);
  }

  createCourse(courseData: any): Observable<any> {
    return this._httpClient.post(`${this.coursesUrl}`, courseData, { headers: this.getHeaders() });
  }

  editCourse(courseId: number, courseData: any): Observable<any> {
    return this._httpClient.put(`${this.coursesUrl}/${courseId}`, courseData, { headers: this.getHeaders() });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this._httpClient.delete(`${this.coursesUrl}/${courseId}`, { headers: this.getHeaders() });
  }

  publishCourse(courseId: number): Observable<any> {
    return this._httpClient.post(`${this.coursesUrl}/${courseId}/publish`, {}, { headers: this.getHeaders() });
  }

  unpublishCourse(courseId: number): Observable<any> {
    return this._httpClient.post(`${this.coursesUrl}/${courseId}/unpublish`, {}, { headers: this.getHeaders() });
  }


  addSection(courseId: number, sectionData: { title: string }): Observable<any> {
    return this._httpClient.post(`${this.coursesUrl}/${courseId}/Sections`, sectionData, { headers: this.getHeaders() });
  }

  updateSection(courseId: number, sectionId: number, sectionData: { title: string }): Observable<any> {
    return this._httpClient.put(`${this.coursesUrl}/${courseId}/Sections/${sectionId}`, sectionData, { headers: this.getHeaders() });
  }

  deleteSection(courseId: number, sectionId: number): Observable<any> {
    return this._httpClient.delete(`${this.coursesUrl}/${courseId}/Sections/${sectionId}`, { headers: this.getHeaders() });
  }

  reorderSections(courseId: number, sectionsOrder: { [key: string]: number }): Observable<any> {
    return this._httpClient.put(`${this.coursesUrl}/${courseId}/Sections/reorder`, sectionsOrder, { headers: this.getHeaders() });
  }

  moveSection(courseId: number, sectionId: number, payload: { newPosition: number }): Observable<any> {
    return this._httpClient.put(`${this.coursesUrl}/${courseId}/Sections/${sectionId}/move`, payload, { headers: this.getHeaders() });
  }


  addLesson(sectionId: number, lessonData: any): Observable<any> {
    return this._httpClient.post(`${this.sectionsUrl}/${sectionId}/Lessons`, lessonData, { headers: this.getHeaders() });
  }

  updateLesson(sectionId: number, lessonId: number, lessonData: { title: string; videoUrl: string; durationSeconds: number; isFreePreview: boolean }): Observable<any> {
    return this._httpClient.put(`${this.sectionsUrl}/${sectionId}/Lessons/${lessonId}`, lessonData, { headers: this.getHeaders() });
  }

  deleteLesson(sectionId: number, lessonId: number): Observable<any> {
    return this._httpClient.delete(`${this.sectionsUrl}/${sectionId}/Lessons/${lessonId}`, { headers: this.getHeaders() });
  }

  reorderLessons(sectionId: number, lessonsOrder: { [key: string]: number }): Observable<any> {
    return this._httpClient.put(`${this.sectionsUrl}/${sectionId}/Lessons/reorder`, lessonsOrder, { headers: this.getHeaders() });
  }

  moveLesson(sectionId: number, lessonId: number, payload: { newPosition: number }): Observable<any> {
    return this._httpClient.put(`${this.sectionsUrl}/${sectionId}/Lessons/${lessonId}/move`, payload, { headers: this.getHeaders() });
  }
}
