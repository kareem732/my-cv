import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthHelperService);
  const router = inject(Router);

  // مش logged in → اتفضل على صفحات الـ auth
  if (!auth.isLoggedIn()) return true;

  // logged in → حوّله على الـ home بتاعت الـ role
  router.navigate([auth.getRedirectUrl()]);
  return false;
};
