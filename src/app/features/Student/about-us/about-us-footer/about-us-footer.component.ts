import { Component, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ContactUsService, SubmitContactPayload } from '../../../../core/services/ContactUs/contact-us.service';
import { CertificatesService, VerifyCertificate } from '../../../../core/services/certificates/certificates.service';

@Component({
  selector: 'app-about-us-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about-us-footer.component.html',
})
export class AboutUsFooterComponent {
  private contactService = inject(ContactUsService);
  private certSvc        = inject(CertificatesService);
  private fb             = inject(FormBuilder);
  private destroyRef     = inject(DestroyRef);

  isLoading  = signal(false);
  isSuccess  = signal(false);
  errorMsg   = signal('');

  verifyCode   = signal('');
  isVerifying  = signal(false);
  verifyResult = signal<VerifyCertificate | null>(null);
  verifyError  = signal<string | null>(null);

  socialIcons = signal([
    { icon: 'globe',          label: 'Website' },
    { icon: 'at-sign',        label: 'Email'   },
    { icon: 'message-circle', label: 'Chat'    },
  ]);

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
    email:    ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
    subject:  ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    message:  ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isLoading.set(true);
    this.isSuccess.set(false);
    this.errorMsg.set('');

    const payload: SubmitContactPayload = this.form.getRawValue();

    this.contactService.submitContact(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSuccess.set(true);
          this.isLoading.set(false);
          this.form.reset();
        },
        error: (err) => {
          this.errorMsg.set(err?.error?.message || 'Something went wrong, please try again.');
          this.isLoading.set(false);
        },
      });
  }

  verifyCertificate(): void {
    const code = this.verifyCode().trim();
    if (!code) return;

    this.isVerifying.set(true);
    this.verifyResult.set(null);
    this.verifyError.set(null);

    this.certSvc.verifyCertificate(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.isValid) {
            this.verifyResult.set(res);
          } else {
            this.verifyError.set('Certificate not found.');
          }
          this.isVerifying.set(false);
        },
        error: () => {
          this.verifyError.set('Certificate not found.');
          this.isVerifying.set(false);
        }
      });
  }

  resetVerify(): void {
    this.verifyCode.set('');
    this.verifyResult.set(null);
    this.verifyError.set(null);
  }
}
