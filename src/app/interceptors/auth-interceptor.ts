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
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA2OTc1MTQ5OTAzNjY3N2ExYzAwZWUzMGRmMTY2YTY3Mjk5YTcxMDcifQ.eyJhdF9oYXNoIjoiU2xfZy1URGRGbjRncFE0OHpKZ3dwUSIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYzNDU4NzIzLCJpYXQiOjE3NjMzNzIzMjMsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.OXx9zM8a_iu94B2qM38sa_WpFaBQ2OFfkD9YJKICvODf0cTZjTpldro_rafoG1ZEC9OjlBT3g5KCVN6OcK1u4Yxonj9uwFGbnbwJt_odXNgjduVGuMpKyvXDr7QXr-GdFjxCkz4RuDokqknCBMB6SiEPVmaJHf0EFzhtRX9pOXvTLuGZkNKplZbgvK4AR5kU4ud3JPlDT7NS0E5EtoExXBrmpII8CvzY5WgQtMg8NEmU3PTEBy8JedHU1lT1tDAcE5G3oKY1eFIQ9wFuexwTyia4WUK7TgH8tvgDWqbVGPdg1iII54YnHI-w4oo--hQBLuVz8fMYHUMYwT9oftXRyQ',
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
        },
      });
    }

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