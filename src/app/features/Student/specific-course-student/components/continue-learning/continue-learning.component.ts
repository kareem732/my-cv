import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { ProgressComponent } from './components/progress/progress.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { CurriculmService, Curriculum } from '../../../../../core/services/Curriculm/curriculm.service';
import { ProgressService, CourseProgress } from '../../../../../core/services/progress/progress.service';
import { CertificatesService, Certificate } from '../../../../../core/services/certificates/certificates.service';

@Component({
  selector: 'app-continue-learning',
  imports: [CurriculumComponent, ProgressComponent, ReviewsComponent],
  templateUrl: './continue-learning.component.html',
  styleUrl: './continue-learning.component.css'
})
export class ContinueLearningComponent implements OnInit {
  private route       = inject(ActivatedRoute);
  private currService = inject(CurriculmService);
  private progService = inject(ProgressService);
  private certService = inject(CertificatesService);

  courseId   = signal<number>(0);
  curriculum = signal<Curriculum | null>(null);
  progress   = signal<CourseProgress | null>(null);
  isLoading  = signal<boolean>(true);
  error      = signal<string | null>(null);

  // Certificate state
  certificate        = signal<Certificate | null>(null);
  certLoading        = signal<boolean>(false);
  certError          = signal<string | null>(null);
  certDownloading    = signal<boolean>(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid course ID.');
      this.isLoading.set(false);
      return;
    }
    this.courseId.set(id);
    this.loadData(id);
  }

  private loadData(id: number): void {
    forkJoin({
      curriculum: this.currService.getCurriculum(id),
      progress:   this.progService.getCourseProgress(id)
    }).subscribe({
      next: ({ curriculum, progress }) => {
        this.curriculum.set(curriculum);
        this.progress.set(progress);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load course data.');
        this.isLoading.set(false);
      }
    });
  }

  reloadProgress(): void {
    this.progService.getCourseProgress(this.courseId()).subscribe({
      next: (data) => this.progress.set(data),
      error: (err)  => console.error('Failed to reload progress:', err)
    });
  }

  // ── Certificate ────────────────────────────────────────────
  getCertificate(): void {
    if (this.certLoading()) return;
    this.certLoading.set(true);
    this.certError.set(null);

    this.certService.generateCertificate(this.courseId()).subscribe({
      next: (cert) => {
        this.certificate.set(cert);
        this.certLoading.set(false);
        // ابدأ التنزيل مباشرة
        this.downloadCertificate(cert.id);
      },
      error: () => {
        this.certError.set('Failed to generate certificate. Please try again.');
        this.certLoading.set(false);
      }
    });
  }

  downloadCertificate(certId: number): void {
    if (this.certDownloading()) return;
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
