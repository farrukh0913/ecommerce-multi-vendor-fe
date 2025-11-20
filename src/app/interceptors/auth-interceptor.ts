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
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwZTgzNWVmNmQxZWVhN2M2ZDIzZjY2NTZkYjNkMzc5YWZkYTFlYTkifQ.eyJhdF9oYXNoIjoidy1jb3ktdVZjT29lbXhMa2N1b1lQdyIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYzNzE1ODU0LCJpYXQiOjE3NjM2Mjk0NTQsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.vmTLGlOir-H-7JqgPYkqguQxE2xffn2IAP8N83VdfsGRmXJHnj1aE4ACftsZ_Z0iUt45vyLVp0LceLqulWDhmGVnpH3_LA0VvHua1-n-ytaurhYImgxjFV4CuvjN37HzN9hSeiVGgZfR2Hi0iV98xhW3FbcZ85KcoisM9d1s0t2FzEvvviV60LrV5cunpvfu6Iva_-H35Ppl8h9hwkkvn5H3Pw4GvIyuvSl2gAZjI4U9eTWC5k7Bu6pxaSL9piOF5Nozo3O5lrKxa34OFo2Pgram4dXbBskWYZbLH3qcJ3Yn3vt-kR3UoxjhR2Z4p0U29tUI1EZlTt7RrTOybCxomw',
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
          Prefer: 'return=representation'
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
