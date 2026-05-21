import { Component, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ContactUsService, SubmitContactPayload } from '../../../../core/services/ContactUs/contact-us.service';

@Component({
  selector: 'app-about-us-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about-us-footer.component.html',
})
export class AboutUsFooterComponent {
  private contactService = inject(ContactUsService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  isSuccess = signal(false);
  errorMsg = signal('');

  socialIcons = signal([
    { icon: 'globe', label: 'Website' },
    { icon: 'at-sign', label: 'Email' },
    { icon: 'message-circle', label: 'Chat' },
  ]);

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
    subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
}
