import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private readonly baseUrl = `${environment.apiBaseUrl}/cms/faqs`;
  private authToken = {
    Authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4MDQzZDQ4MGE4OWJiOGM5MTZlNzVhM2FlODRiY2NiZGY3ODJjNDkifQ.eyJhdF9oYXNoIjoiUndXNHRBQjhNUV9nQy0yX3FSejJZZyIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYzMDMwNDUwLCJpYXQiOjE3NjI5NDQwNTAsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.e2wWvY0Lrwda1jk8uilkfgoBBe6dxPFERI-Q14bISYs7NWz6327Q_PHAL3wRgXNlD1DxYdrwkik_b_rMqpeoPd4ZTbOHt6rB5ncnZ6SzzEU2O3JtvMyYQ3BL0X7F9QvnslqQSrWISRssxGyjfREFVHWA6VFp8FIaYDE5sgIU2SiMelYPl9FlWRKoF486bRj4tLtYkAlEhpniLnqrevj6qkQxps_fxTCk4YmHCQ5SvSF2JC_cB1QJZl0L6Ivo0qp8wTSdVlYygLge7d7DovjvSywgorSLYB_BMwzkBIudzRQPF6QpApA6hEZ4aN03Bs5vQL0x1I8iFy7jZ3kMJPwf4w',
  };
  constructor(private http: HttpClient) {}

  /**
   * Get list of FAQs (supports filters, pagination, sorting)
   */
  getFaqs(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<any[]>(this.baseUrl, { params });
  }

  /**
   * Get a single FAQ by ID
   */
  getFaqById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new FAQ record
   */
  createFaq(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  /**
   * Update an existing FAQ by ID
   */
  updateFaq(id: string, payload: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.authToken.Authorization,
    });
    return this.http.patch<any>(`${this.baseUrl}/?id=eq.${id}`, payload, { headers });
  }

  /**
   * Delete FAQ by ID
   */
  deleteFaq(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
