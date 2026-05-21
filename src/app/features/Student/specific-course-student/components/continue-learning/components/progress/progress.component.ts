import { Component, Input, output, signal, inject } from '@angular/core';
import {
  CourseProgress, ProgressService,
  SectionProgress, LessonProgress
} from '../../../../../../../core/services/progress/progress.service';
import { CertificatesService } from '../../../../../../../core/services/certificates/certificates.service';

@Component({
  selector: 'app-progress',
  imports: [],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent {
  @Input() progress: CourseProgress | null = null;
  @Input() isLoading: boolean = true;
  @Input() courseId: number = 0;

  lessonCompleted = output<void>();

  private progService  = inject(ProgressService);
  private certService  = inject(CertificatesService);
  private openSections = signal<Set<number>>(new Set());

  certLoading     = signal<boolean>(false);
  certDownloading = signal<boolean>(false);
  certError       = signal<string | null>(null);

  isSectionOpen(sectionId: number): boolean {
    return this.openSections().has(sectionId);
  }

  toggleSection(sectionId: number): void {
    this.openSections.update(set => {
      const next = new Set(set);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  }

  sectionPercent(section: SectionProgress): number {
    if (!section.totalLessons) return 0;
    return Math.round((section.completedLessons / section.totalLessons) * 100);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  markComplete(lesson: LessonProgress, sectionId: number, event: Event): void {
    event.stopPropagation();
    this.progService.completeLesson(this.courseId, lesson.lessonId).subscribe({
      next: () => this.lessonCompleted.emit(),
      error: (err) => console.error('Failed to complete lesson:', err)
    });
  }

  // ── Certificate ────────────────────────────────────────────
  onGetCertificate(): void {
    if (this.certLoading() || this.certDownloading()) return;
    this.certLoading.set(true);
    this.certError.set(null);

    this.certService.generateCertificate(this.courseId).subscribe({
      next: (cert) => {
        this.certLoading.set(false);
        this.downloadCert(cert.id);
      },
      error: () => {
        this.certError.set('Failed to generate certificate.');
        this.certLoading.set(false);
      }
    });
  }

  private downloadCert(certId: number): void {
    this.certDownloading.set(true);

    this.certService.downloadCertificate(certId).subscribe({
      next: (blob) => {
        const url    = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href  = url;
        anchor.download = `certificate-${certId}.pdf`;
        anchor.click();
        URL.revokeObjectURL(url);
        this.certDownloading.set(false);
      },
      error: () => {
        this.certError.set('Failed to download certificate.');
        this.certDownloading.set(false);
      }
    });
  }
}
