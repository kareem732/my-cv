import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';

export const studentGuard: CanActivateFn = () => {
  const auth = inject(AuthHelperService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.hasRole('Student')) return true;

  if (!auth.isLoggedIn()) return router.createUrlTree(['/auth/login']);
  return router.createUrlTree([auth.getRedirectUrl()]);
};
