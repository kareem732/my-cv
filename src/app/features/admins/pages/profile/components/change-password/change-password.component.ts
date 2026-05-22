import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AUTHENTICATIONService } from '../../../../../../core/services/AUTHENTICATION/authentication.service';
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPass     = control.get('newPassword')?.value;
  const confirmPass = control.get('confirmPassword')?.value;
  return newPass && confirmPass && newPass !== confirmPass ? { mismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _fb          = inject(FormBuilder);

  isSaving  = signal(false);
  isSuccess = signal(false);
  errorMsg  = signal<string | null>(null);

  showCurrent = signal(false);
  showNew     = signal(false);
  showConfirm = signal(false);

  form = this._fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    ]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordMatchValidator });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving.set(true);
    this.isSuccess.set(false);
    this.errorMsg.set(null);

    this._authService.changePassword(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.isSuccess.set(true);
        this.isSaving.set(false);
        this.form.reset();
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Failed to change password.');
        this.isSaving.set(false);
      },
    });
  }
}
