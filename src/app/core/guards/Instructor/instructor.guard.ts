import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';

export const instructorGuard: CanActivateFn = () => {
  const auth = inject(AuthHelperService);

  if (auth.isLoggedIn() && auth.hasRole('Instructor')) return true;

  return false;
};
