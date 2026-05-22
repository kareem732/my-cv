import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthHelperService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.hasRole('Admin')) return true;

  if (!auth.isLoggedIn()) return router.createUrlTree(['/auth/login']);
  return router.createUrlTree([auth.getRedirectUrl()]);
};
