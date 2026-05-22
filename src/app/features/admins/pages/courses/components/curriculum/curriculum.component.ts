import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CurriculmService, Curriculum } from '../../../../../../core/services/Curriculm/curriculm.service';
import { ResourcesService, Resource } from '../../../../../../core/services/Resources/resources.service';
import { environment2 } from '../../../../../../core/environment/ENV';

@Component({
  selector: 'app-admin-curriculum',
  imports: [CommonModule],
  templateUrl: './curriculum.component.html',
})
export class AdminCurriculumComponent implements OnInit {
  private curriculumService = inject(CurriculmService);
  private resourcesService  = inject(ResourcesService);
  private sanitizer         = inject(DomSanitizer);

  courseId     = input.required<number>();
  curriculum   = signal<Curriculum | null>(null);
  isLoading    = signal(true);
  error        = signal<string | null>(null);
  openSections = signal<Set<number>>(new Set());

  lessonResources  = signal<Map<number, Resource[]>>(new Map());
  loadingResources = signal<Set<number>>(new Set());

  videoUrl    = signal<SafeResourceUrl | null>(null);
  videoTitle  = signal<string>('');
  isVideoOpen = signal(false);

  ngOnInit(): void {
    this.curriculumService.getCurriculum(this.courseId()).subscribe({
      next: (data) => {
        this.curriculum.set(data);
        if (data.sections.length > 0) {
          const firstSection = data.sections[0];
          this.openSections.set(new Set([firstSection.id]));
          this.loadResourcesForSection(firstSection);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load curriculum.');
        this.isLoading.set(false);
      }
    });
  }

  toggleSection(id: number): void {
    const current = new Set(this.openSections());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
      const section = this.curriculum()?.sections.find(s => s.id === id);
      if (section) this.loadResourcesForSection(section);
    }
    this.openSections.set(current);
  }

  private loadResourcesForSection(section: any): void {
    section.lessons.forEach((lesson: any) => {
      if (lesson.resourceCount > 0 && !this.lessonResources().has(lesson.id)) {
        this.loadResourcesForLesson(section.id, lesson.id);
      }
    });
  }

  private loadResourcesForLesson(sectionId: number, lessonId: number): void {
    const loading = new Set(this.loadingResources());
    loading.add(lessonId);
    this.loadingResources.set(loading);

    this.resourcesService.getResources(this.courseId(), sectionId, lessonId).subscribe({
      next: (resources) => {
        const map = new Map(this.lessonResources());
        map.set(lessonId, resources);
        this.lessonResources.set(map);

        const done = new Set(this.loadingResources());
        done.delete(lessonId);
        this.loadingResources.set(done);
      },
      error: () => {
        const done = new Set(this.loadingResources());
        done.delete(lessonId);
        this.loadingResources.set(done);
      }
    });
  }

  getResources(lessonId: number): Resource[] {
    return this.lessonResources().get(lessonId) ?? [];
  }

  isLoadingResources(lessonId: number): boolean {
    return this.loadingResources().has(lessonId);
  }

  isOpen(id: number): boolean {
    return this.openSections().has(id);
  }

  getFileUrl(fileUrl: string): string {
    if (fileUrl.startsWith('http')) return fileUrl;
    const serverRoot = environment2.baseUrl.replace(/\/api\/?$/, '');
    return `${serverRoot}${fileUrl}`;
  }

  openVideo(url: string, title: string): void {
    this.videoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.toEmbedUrl(url)));
    this.videoTitle.set(title);
    this.isVideoOpen.set(true);
  }

  closeVideo(): void {
    this.isVideoOpen.set(false);
    this.videoUrl.set(null);
    this.videoTitle.set('');
  }

  private toEmbedUrl(url: string): string {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

    return url;
  }
}
