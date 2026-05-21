import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';


export interface LessonProgress {
  lessonId: number;
  lessonTitle: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface SectionProgress {
  sectionId: number;
  sectionTitle: string;
  totalLessons: number;
  completedLessons: number;
  lessons: LessonProgress[];
}

export interface CourseProgress {
  courseId: number;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  isCompleted: boolean;
  sections: SectionProgress[];
}

export interface CompleteLessonResponse {
  lessonId: number;
  alreadyCompleted: boolean;
  newProgressPercent: number;
  courseCompleted: boolean;
}

export interface WatchTimeRequest {
  watchedSeconds: number;
  totalSeconds: number;
}

export interface WatchTimeResponse {
  lessonId: number;
  watchedSeconds: number;
  watchedPercent: number;
  justCompleted: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private baseUrl = environment2.baseUrl;

  constructor(private http: HttpClient) {}


  getCourseProgress(courseId: number): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(
      `${this.baseUrl}courses/${courseId}/progress`
    );
  }

  completeLesson(courseId: number, lessonId: number): Observable<CompleteLessonResponse> {
    return this.http.post<CompleteLessonResponse>(
      `${this.baseUrl}courses/${courseId}/progress/lessons/${lessonId}/complete`,
      {}
    );
  }

  updateWatchTime(
    courseId: number,
    lessonId: number,
    body: WatchTimeRequest
  ): Observable<WatchTimeResponse> {
    return this.http.post<WatchTimeResponse>(
      `${this.baseUrl}courses/${courseId}/progress/lessons/${lessonId}/watch-time`,
      body
    );
  }
}
