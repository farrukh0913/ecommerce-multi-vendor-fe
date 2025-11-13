import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authToken = {
    Authorization:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjJhYTIyODBjODFkYWZiYmU0M2FmN2YwZmNkODhjODZkNzQwMGMzN2IifQ.eyJhdF9oYXNoIjoiRXhCRWx0S1lSRTdZZEhJNnNGZzVKUSIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYzMTE0MDQwLCJpYXQiOjE3NjMwMjc2NDAsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.kVTbphYtwnGksRkvM7Mg9mRlu34s94ntNdSrKMk8Ie2SVtvVsuLqu0775g7Vi20uA4YjSoT940mE95F-ZM1C8jcT3CL_YvdGC2zIuAlj91uhW33oXUcnMdKFV3ihMEWZeDCm8kLI_g5eIuFgSW41a21ehk5S879HDqtMF1C5RA_Ajp4sOcaBFmuhGDBEk1jtRxI5n7Iw8dbxVGZ4xGR5HFj1ySyP27lvpO4-w0nOoWY6NNza-n2zmHrrpWwzZz5Uk1FfflzEtoybjuhEl-CbkvjTGFptsO46MH8TxDZUkKmz5u0NpW414PN3WAoW_w3KQ6jMiQvVzyxxx02v9_P-sw',
  };
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from localStorage (or use your AuthService)
    const token = this.authToken.Authorization;

    // Clone request and add Authorization header if token exists
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Pass request and handle errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('Unauthorized! Redirecting to login...');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          console.error('Access denied!');
        } else if (error.status === 500) {
          console.error('Server error:', error.message);
        }

        return throwError(() => error);
      })
    );
  }
}
