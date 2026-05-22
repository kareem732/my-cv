import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import {
  catchError,
  switchMap,
  throwError,
  BehaviorSubject,
  filter,
  take
} from 'rxjs';

import { AUTHENTICATIONService } from '../../../core/services/AUTHENTICATION/authentication.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const Refresh_Token: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AUTHENTICATIONService);
  const router = inject(Router);

  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('accessToken');
  }

  const authReq = token ? addTokenHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (req.url.includes('/refresh-token')) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        return handle401Error(authReq, next, authService, platformId, router);
      }

      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AUTHENTICATIONService,
  platformId: object,
  router: Router
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    let refreshToken: string | null = null;

    if (isPlatformBrowser(platformId)) {
      refreshToken = localStorage.getItem('refreshToken');
    }

    if (!refreshToken) {
      isRefreshing = false;
      logoutLocally(platformId, router);
      return throwError(() => new Error('No refresh token found'));
    }

    return authService.logout(refreshToken).pipe(
      switchMap((res: any) => {
        isRefreshing = false;

        const newAccessToken = res.data?.accessToken || res.accessToken;
        const newRefreshToken = res.data?.refreshToken || res.refreshToken;

        if (isPlatformBrowser(platformId)) {
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        refreshTokenSubject.next(newAccessToken);

        return next(addTokenHeader(request, newAccessToken));
      }),

      catchError((err) => {
        logoutLocally(platformId, router);
        return throwError(() => err);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(addTokenHeader(request, token)))
  );
}

function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function logoutLocally(platformId: object, router: Router) {
  isRefreshing = false;
  refreshTokenSubject.next(null);

  if (isPlatformBrowser(platformId)) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');

    router.navigate(['/auth/login']);
  }
}
