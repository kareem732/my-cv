import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AUTHENTICATIONService } from '../../services/AUTHENTICATION/authentication.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ,RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AUTHENTICATIONService);

  loader = signal<boolean>(false);
  errMsg = signal<string>('');

  forgetPassWordForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  forgetPassword() {
  if (this.forgetPassWordForm.invalid) {
    this.forgetPassWordForm.markAllAsTouched();
    return;
  }

  this.loader.set(true);
  this.errMsg.set('');

  const emailValue = this.forgetPassWordForm.value.email!;

  this._authService.forgetPassword({ email: emailValue }).subscribe({
    next: () => {
      this.loader.set(false);
      this._router.navigate(['/auth/reset-password'], {
        state: { email: emailValue, autoSent: true }
      });
    },
    error: (err) => {
      this.loader.set(false);
      this.errMsg.set(err.error?.message || 'Something went wrong! Please try again.');
    }
  });
}
}
