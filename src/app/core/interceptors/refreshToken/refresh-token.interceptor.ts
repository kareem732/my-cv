import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  switchMap,
  throwError,
  BehaviorSubject,
  filter,
  take,
} from 'rxjs';

import { AUTHENTICATIONService } from '../../../core/services/AUTHENTICATION/authentication.service';
import { AuthHelperService } from '../../services/AuthHelper/auth-helper.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const Refresh_Token: HttpInterceptorFn = (req, next) => {
  const authHelper = inject(AuthHelperService);
  const authService = inject(AUTHENTICATIONService);
  const router = inject(Router);

  const token = authHelper.getAccessToken();
  const authReq = token ? addTokenHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // لو الـ request نفسه هو الـ refresh — اوقف ومتعملش loop
      if (req.url.includes('/refresh-token')) {
        logoutLocally(authHelper, router);
        return throwError(() => error);
      }

      if (error.status === 401) {
        return handle401Error(authReq, next, authService, authHelper, router);
      }

      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AUTHENTICATIONService,
  authHelper: AuthHelperService,
  router: Router
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const accessToken = authHelper.getAccessToken();
    const refreshToken = authHelper.getRefreshToken();

    // لو مفيش tokens خالص — اعمل logout فوراً
    if (!accessToken || !refreshToken) {
      isRefreshing = false;
      logoutLocally(authHelper, router);
      return throwError(() => new Error('No tokens found'));
    }

    // ✅ بعت الاتنين زي ما السيرفر بيطلب
    return authService.refreshToken(accessToken, refreshToken).pipe(
      switchMap((res) => {
        isRefreshing = false;

        authHelper.saveSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          roles: res.roles as any,
        });

        refreshTokenSubject.next(res.accessToken);
        return next(addTokenHeader(request, res.accessToken));
      }),

      catchError((err) => {
        logoutLocally(authHelper, router);
        return throwError(() => err);
      })
    );
  }

  // لو في refresh جاري — استنى وبعت الـ request بعد ما يخلص
  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(addTokenHeader(request, token)))
  );
}

function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function logoutLocally(authHelper: AuthHelperService, router: Router) {
  isRefreshing = false;
  refreshTokenSubject.next(null);
  authHelper.clearStorage();
  router.navigate(['/auth/login']);
}
