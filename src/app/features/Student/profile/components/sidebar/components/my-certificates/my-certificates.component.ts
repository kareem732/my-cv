import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CertificatesService, Certificate } from '../../../../../../../core/services/certificates/certificates.service';

@Component({
  selector: 'app-my-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-certificates.component.html',
})
export class MyCertificatesComponent implements OnInit {

  private certSvc    = inject(CertificatesService);
  private destroyRef = inject(DestroyRef);

  certificates: Certificate[] = [];
  isLoading = false;
  error: string | null = null;
  downloadingId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = null;
    this.certSvc.getMyCertificates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.certificates = data;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Failed to load certificates.';
          this.isLoading = false;
        }
      });
  }

  download(cert: Certificate): void {
    if (this.downloadingId) return;
    this.downloadingId = cert.id;
    this.certSvc.downloadCertificate(cert.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${cert.courseName}-certificate.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          this.downloadingId = null;
        },
        error: () => { this.downloadingId = null; }
      });
  }

  copyVerifyUrl(cert: Certificate): void {
    navigator.clipboard.writeText(cert.verifyUrl ?? '');
  }
}
