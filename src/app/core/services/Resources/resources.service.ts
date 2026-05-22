import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV'; // ✅ same import as CurriculmService

export interface Resource {
  id: number;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSizeFormatted: string;
}

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  private http = inject(HttpClient);
  private base = environment2.baseUrl; // ✅ was 'courses', now the real API base URL

  getResources(courseId: number, sectionId: number, lessonId: number): Observable<Resource[]> {
    return this.http.get<Resource[]>(
      `${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons/${lessonId}/resources`
    );
  }

  addResource(courseId: number, sectionId: number, lessonId: number, title: string, file: File): Observable<Resource> {
    const fd = new FormData();
    fd.append('Title', title);
    fd.append('File', file);
    return this.http.post<Resource>(
      `${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons/${lessonId}/resources`,
      fd
    );
  }

  deleteResource(courseId: number, sectionId: number, lessonId: number, resourceId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}courses/${courseId}/curriculum/sections/${sectionId}/lessons/${lessonId}/resources/${resourceId}`
    );
  }
}
