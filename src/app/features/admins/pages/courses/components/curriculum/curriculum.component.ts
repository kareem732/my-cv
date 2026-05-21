import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CurriculmService, Curriculum } from '../../../../../../core/services/Curriculm/curriculm.service';

@Component({
  selector: 'app-admin-curriculum',
  imports: [CommonModule],
  templateUrl: './curriculum.component.html',
})
export class AdminCurriculumComponent implements OnInit {
  private curriculumService = inject(CurriculmService);
  private sanitizer         = inject(DomSanitizer);

  courseId     = input.required<number>();
  curriculum   = signal<Curriculum | null>(null);
  isLoading    = signal(true);
  error        = signal<string | null>(null);
  openSections = signal<Set<number>>(new Set());

  videoUrl     = signal<SafeResourceUrl | null>(null);
  videoTitle   = signal<string>('');
  isVideoOpen  = signal(false);

  ngOnInit(): void {
    this.curriculumService.getCurriculum(this.courseId()).subscribe({
      next: (data) => {
        this.curriculum.set(data);
        if (data.sections.length > 0) {
          this.openSections.set(new Set([data.sections[0].id]));
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
    current.has(id) ? current.delete(id) : current.add(id);
    this.openSections.set(current);
  }

  isOpen(id: number): boolean {
    return this.openSections().has(id);
  }

  openVideo(url: string, title: string): void {
    const embedUrl = this.toEmbedUrl(url);
    this.videoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
    this.videoTitle.set(title);
    this.isVideoOpen.set(true);
  }

  closeVideo(): void {
    this.isVideoOpen.set(false);
    this.videoUrl.set(null);
    this.videoTitle.set('');
  }

  private toEmbedUrl(url: string): string {
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    return url;
  }

  formatSeconds(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  }
}
