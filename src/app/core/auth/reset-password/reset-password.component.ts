import { Component, inject, Input, ViewChildren, QueryList, ElementRef, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTHENTICATIONService, ResetPasswordPayload } from '../../services/AUTHENTICATION/authentication.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  @Input() emailFromForget: string = '';
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  errMsg = signal<string>('');
  loader = signal<boolean>(false);

  resendLoader = signal<boolean>(false);
  resendSuccessMsg = signal<string>('');

  ResetPasswordForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    otpCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    let stateEmail = this.emailFromForget;

    if (isPlatformBrowser(this.platformId)) {
      stateEmail = history.state?.email || this.emailFromForget;
    }

    if (stateEmail) {
      this.ResetPasswordForm.patchValue({ email: stateEmail });
    }
  }


 resendOtp() {
  const email = this.ResetPasswordForm.getRawValue().email;

  if (email) {
    this.resendLoader.set(true);
    this.resendSuccessMsg.set('');
    this.errMsg.set('');

    const payload = {
      email: email,
      purpose: 1
    };

    this._authService.resendOtp(payload).subscribe({
      next: (res) => {
        this.resendLoader.set(false);
        this.resendSuccessMsg.set('Verification code has been sent successfully to your email.');
        setTimeout(() => this.resendSuccessMsg.set(''), 5000);
      },
      error: (err) => {
        this.resendLoader.set(false);
        this.errMsg.set(err.error?.message || 'Failed to resend OTP. Please try again.');
      }
    });
  }
}

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const data = event.clipboardData?.getData('text').trim();
    if (data && /^\d{6}$/.test(data)) {
      const inputs = this.otpInputs.toArray();
      data.split('').forEach((char, index) => {
        if (inputs[index]) {
          inputs[index].nativeElement.value = char;
        }
      });
      this.updateOtpControl();
      inputs[5].nativeElement.focus();
    }
  }

  onOtpInput(event: any, index: number) {
    const input = event.target;
    if (input.value.length > 1) {
      input.value = input.value.slice(-1);
    }

    if (input.value && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
    this.updateOtpControl();
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !(event.target as HTMLInputElement).value && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  private updateOtpControl() {
    const otpValue = this.otpInputs
      .map(input => input.nativeElement.value)
      .join('');
    this.ResetPasswordForm.get('otpCode')?.setValue(otpValue);
  }


  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    const confirmControl = control.get('confirmPassword');

    if (password !== confirm) {
      confirmControl?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (confirmControl?.hasError('mismatch')) {
        const errors = { ...confirmControl.errors };
        delete errors['mismatch'];
        confirmControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  }

  submitReset() {
    if (this.ResetPasswordForm.valid) {
      this.loader.set(true);
      this.errMsg.set('');

      const resetData = this.ResetPasswordForm.getRawValue() as ResetPasswordPayload;

      this._authService.resetPassword(resetData).subscribe({
        next: (res) => {
          this.loader.set(false);
          this._router.navigate(["/auth/login"]);
        },
        error: (err) => {
          this.loader.set(false);
          this.errMsg.set(err.error?.message || 'Password reset failed. Please try again.');
        }
      });
    } else {
      this.ResetPasswordForm.markAllAsTouched();
    }
  }
}
