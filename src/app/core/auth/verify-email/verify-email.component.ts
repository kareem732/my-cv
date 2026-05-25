import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AUTHENTICATIONService } from '../../services/AUTHENTICATION/authentication.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ,RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _router = inject(Router);
  private readonly _platformId = inject(PLATFORM_ID);

  loader = signal<boolean>(false);
  errMsg = signal<string>('');

  verifyForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    code: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{6}$')]),
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      const emailFromState = history.state?.email;

      if (emailFromState) {
        this.verifyForm.get('email')?.setValue(emailFromState);
      } else {
          this._router.navigate(['/auth/register']);
      }
    }
  }

  handleVerify() {
    if (this.verifyForm.valid) {
      this.loader.set(true);
      this.errMsg.set('');

      const payload = this.verifyForm.getRawValue();

      this._authService.verifyEmail(payload).subscribe({
        next: (res) => {
          this.loader.set(false);
          this._router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.loader.set(false);
          this.errMsg.set(err.error?.message || 'Invalid verification code');
        }
      });
    } else {
      this.verifyForm.markAllAsTouched();
    }
  }
}
