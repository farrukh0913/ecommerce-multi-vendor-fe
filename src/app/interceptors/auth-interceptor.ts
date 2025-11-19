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
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQwNThmY2U1MWMzMTc3Yzk0ZDZjMWQzZmM3NzI3MWE1YTQ3ZDRmYTgifQ.eyJhdF9oYXNoIjoicVhpQXJuUFNkSjNJZ25NU0hEUmN0dyIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYzNjMzMzUwLCJpYXQiOjE3NjM1NDY5NTAsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.eyAq5q-oE0dkxDRU55koMQv2alSUfXmngINDBqZrJE8yUIqTUVAwL7AA7vpFanN4q2S5enpU0gtVomo4X3a_G6-_Vc9BfpfxY3Z9r-YkTl2CZ8Ifo9bpONU__t5c-DtaafnPo-_9MUebSl69M6p0F1JXeaYDFyoXX5S2M1yWE5SbHFyPwmVMBCUjdcwhxi8BBGh-KuOGr9gYRRMM88SIH6dL3dSDKkA32q8BDzs9MzkyOxO7rrdIh2q1YggA3KtUFGeMFaqtFQSZ3Z-Mq8hGfsfzoX-MMxIK8yS7JyvnBwlHfOXcKmsbs1lM1DBaKpPw_MESyHfvACY6_ZcF3_TVvA',
  };
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    // Only add token for specific method(s) or URL
    const token = this.authToken.Authorization;
    const protectedMethods = ['POST', 'DELETE', 'PATCH']; // only for these methods
    const protectedUrls = ['https://api-acad3b2f317a.eu-west1.edgeflare.dev/shop/cart_items_view'];

    const isProtectedMethod = protectedMethods.includes(req.method);
    const isProtectedUrl = protectedUrls.some((url) => req.url.startsWith(url));

    if (token && (isProtectedMethod || isProtectedUrl)) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          // Prefer: 'return=representation'
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // window.location.reload ();
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
