import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';


export interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  durationInSeconds: number;
  duration: string;
  order: number;
  isFreePreview: boolean;
  type: string;
  resourceCount: number;
}

export interface Section {
  id: number;
  title: string;
  order: number;
  lessonCount: number;
  totalSeconds: number;
  totalDuration: string;
  lessons: Lesson[];
}

export interface Curriculum {
  courseId: number;
  courseTitle: string;
  totalSections: number;
  totalLessons: number;
  totalSeconds: number;
  totalDuration: string;
  freePreviewCount: number;
  sections: Section[];
}


export interface SectionBody {
  title: string;
}

export interface LessonBody {
  title: string;
  description: string;
  videoUrl: string;
  durationInSeconds: number;
  type: number;
  isFreePreview: boolean;
}

export interface ReorderSectionsBody {
  items: { sectionId: number; order: number }[];
}

export interface ReorderLessonsBody {
  items: { lessonId: number; order: number }[];
}


@Injectable({ providedIn: 'root' })
export class CurriculmService {
  private http = inject(HttpClient);
  private base = environment2.baseUrl;


  getCurriculum(courseId: number): Observable<Curriculum> {
    return this.http.get<Curriculum>(`${this.base}courses/${courseId}/curriculum`);
  }


  addSection(courseId: number, body: SectionBody): Observable<Section> {
    return this.http.post<Section>(`${this.base}courses/${courseId}/curriculum/sections`, body);
  }

  updateSection(courseId: number, sectionId: number, body: SectionBody): Observable<Section> {
    return this.http.put<Section>(`${this.base}courses/${courseId}/curriculum/sections/${sectionId}`, body);
  }

  deleteSection(courseId: number, sectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}courses/${courseId}/curriculum/sections/${sectionId}`);
  }

  reorderSections(courseId: number, body: ReorderSectionsBody): Observable<void> {
    return this.http.put<void>(`${this.base}courses/${courseId}/curriculum/sections/reorder`, body);
  }


  addLesson(courseId: number, sectionId: number, body: LessonBody): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons`, body);
  }

  updateLesson(courseId: number, sectionId: number, lessonId: number, body: LessonBody): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons/${lessonId}`, body);
  }

  deleteLesson(courseId: number, sectionId: number, lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons/${lessonId}`);
  }

  reorderLessons(courseId: number, sectionId: number, body: ReorderLessonsBody): Observable<void> {
    return this.http.put<void>(`${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons/reorder`, body);
  }

  toggleFreePreview(courseId: number, sectionId: number, lessonId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons/${lessonId}/toggle-preview`,
      {}
    );
  }
}
