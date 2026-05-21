import { Component, inject, signal, OnInit, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AUTHENTICATIONService } from '../../services/AUTHENTICATION/authentication.service';
import { GoogleAuthService } from '../../services/GoogleAuth/google-auth.service';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';
import { ThemeService } from '../../services/Theme/theme.service';

const GOOGLE_CLIENT_ID = '609659048335-q3bsdns5pf06chhknif8akrjod89krnb.apps.googleusercontent.com';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _authHelper = inject(AuthHelperService);
  private readonly _googleAuthService = inject(GoogleAuthService);
  private readonly _router = inject(Router);
  private readonly _platformId = inject(PLATFORM_ID);
themeService = inject(ThemeService);

  errMsg = signal<string>('');
  loader = signal<boolean>(false);

  registerForm = new FormGroup({
    firstName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    lastName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
    confirmPassword: new FormControl(null, [Validators.required]),
    role: new FormControl('Student', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password === confirmPassword) return null;
    form.get('confirmPassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
  }

  ngOnInit(): void {
    this._googleAuthService.initialize(GOOGLE_CLIENT_ID);
    this._googleAuthService.credential$.subscribe(idToken => {
      this.registerWithGoogle(idToken);
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._googleAuthService.renderButton(this.googleBtn.nativeElement);
    }
  }

  registerWithGoogle(idToken: string): void {
    this.loader.set(true);
    this._authService.googleLogin({ idToken }).subscribe({
      next: (res) => {
        this.loader.set(false);
        this.handleSuccess(res);
      },
      error: (err) => {
        this.loader.set(false);
        this.errMsg.set(err.error?.message || 'Google sign-up failed');
      }
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      this.loader.set(true);
      this._authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loader.set(false);
          const userEmail = this.registerForm.get('email')?.value;
          this._router.navigate(['/auth/verify-email'], {
            state: { email: userEmail }
          });
        },
        error: (err) => {
          this.loader.set(false);
          this.errMsg.set(err.error?.message || 'Error');
        }
      });
    }
  }

  private handleSuccess(res: any): void {
    this._authHelper.saveSession(res);
    this._router.navigate([this._authHelper.getRedirectUrl()]);
  }
}
