import { Component, inject, signal, OnInit, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AUTHENTICATIONService } from '../../services/AUTHENTICATION/authentication.service';
import { GoogleAuthService } from '../../services/GoogleAuth/google-auth.service';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';
import { ThemeService } from '../../services/Theme/theme.service';

const GOOGLE_CLIENT_ID = '609659048335-q3bsdns5pf06chhknif8akrjod89krnb.apps.googleusercontent.com';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  private readonly _authService = inject(AUTHENTICATIONService);
  private readonly _authHelper = inject(AuthHelperService);
  private readonly _googleAuthService = inject(GoogleAuthService);
  private readonly _router = inject(Router);
  private readonly _platformId = inject(PLATFORM_ID);
  themeService = inject(ThemeService);
  showPassword = signal(false);
  loader = signal(false);
  errMsg = signal('');

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    rememberMe: new FormControl(false)
  });

  ngOnInit(): void {
    this._googleAuthService.initialize(GOOGLE_CLIENT_ID);
    this._googleAuthService.credential$.subscribe(idToken => {
      this.loginWithGoogle(idToken);
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._googleAuthService.renderButton(this.googleBtn.nativeElement);
    }
  }

  loginWithGoogle(idToken: string): void {
    this.loader.set(true);
    this._authService.googleLogin({ idToken }).subscribe({
      next: (res) => {
        this.loader.set(false);
        this.handleLoginSuccess(res);
      },
      error: (err) => {
        this.loader.set(false);
        this.errMsg.set(err.error?.message || 'Google login failed');
      }
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;
    this.loader.set(true);
    this._authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loader.set(false);
        this.handleLoginSuccess(res);
      },
      error: (err) => {
        this.loader.set(false);
        this.errMsg.set(err.error?.message || 'Invalid email or password');
      }
    });
  }

  private handleLoginSuccess(res: any): void {
    this._authHelper.saveSession(res);

    if (!this._authHelper.isLoggedIn()) {
      this.errMsg.set('Login failed: invalid response from server');
      return;
    }

    this._router.navigate([this._authHelper.getRedirectUrl()]);
  }
}
