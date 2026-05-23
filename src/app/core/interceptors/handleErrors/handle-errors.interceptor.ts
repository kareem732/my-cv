import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/Toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    tap((event) => {
      if (
        event instanceof HttpResponse &&
        req.method !== 'GET' &&
        event.status >= 200 &&
        event.status < 300
      ) {
        if (!req.url.includes('login')) {
          const body = event.body as any;
          const successMsg = body?.message || 'Action completed successfully';
          toast.showToast(successMsg, 'success');
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';

      if (error.status === 0) {
        errorMsg = 'No Internet Connection or Server is unreachable.';
      } else if (error.status === 401) {
        // ✅ مش بنعمل navigate هنا — الـ refresh interceptor بيتولاها
        errorMsg = 'Unauthorized! Please login again.';
      } else if (error.status === 403) {
        errorMsg = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMsg = 'Resource not found.';
      } else if (error.status >= 400 && error.status < 500) {
        const errorBody = error.error as any;
        errorMsg = errorBody?.message || 'Client-side error occurred.';
      } else if (error.status >= 500) {
        errorMsg = 'Server Error! Please try again later.';
        router.navigate(['/server-error']);
      } else {
        errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
      }

      toast.showToast(errorMsg, 'error');
      console.error('%c [API Error]:', 'color: white; background: red; padding: 4px;', errorMsg);
      return throwError(() => error);
    })
  );
};
