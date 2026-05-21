import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('../auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('../auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('../auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
  },
  {
    path: 'forget-password',
    loadComponent: () => import('../auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('../auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  }

];
