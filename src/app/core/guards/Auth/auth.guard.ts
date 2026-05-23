import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthHelperService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true;
  return router.createUrlTree([auth.getRedirectUrl()]);
};
