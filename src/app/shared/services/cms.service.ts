import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/cms`;
  private readonly authHeaders = new HttpHeaders({
    Authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4MDQzZDQ4MGE4OWJiOGM5MTZlNzVhM2FlODRiY2NiZGY3ODJjNDkifQ.eyJhdF9oYXNoIjoiUndXNHRBQjhNUV9nQy0yX3FSejJZZyIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYzMDMwNDUwLCJpYXQiOjE3NjI5NDQwNTAsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.e2wWvY0Lrwda1jk8uilkfgoBBe6dxPFERI-Q14bISYs7NWz6327Q_PHAL3wRgXNlD1DxYdrwkik_b_rMqpeoPd4ZTbOHt6rB5ncnZ6SzzEU2O3JtvMyYQ3BL0X7F9QvnslqQSrWISRssxGyjfREFVHWA6VFp8FIaYDE5sgIU2SiMelYPl9FlWRKoF486bRj4tLtYkAlEhpniLnqrevj6qkQxps_fxTCk4YmHCQ5SvSF2JC_cB1QJZl0L6Ivo0qp8wTSdVlYygLge7d7DovjvSywgorSLYB_BMwzkBIudzRQPF6QpApA6hEZ4aN03Bs5vQL0x1I8iFy7jZ3kMJPwf4w',
  });

  constructor(private http: HttpClient) {}

  private buildParams(filters?: any): HttpParams {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.append(key, filters[key]);
        }
      });
    }
    return params;
  }

  // ===========================
  // 📘 NEWS ARTICLES METHODS
  // ===========================

  getNewsArticles(filters?: any): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/news_articles`, { headers: this.authHeaders, params });
  }

  getNewsArticleById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/news_articles/${id}`, { headers: this.authHeaders });
  }

  createNewsArticle(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/news_articles`, payload, { headers: this.authHeaders });
  }

  updateNewsArticle(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/news_articles/${id}`, payload, {
      headers: this.authHeaders,
    });
  }

  deleteNewsArticle(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/news_articles/${id}`, { headers: this.authHeaders });
  }

  // ===========================
  // 🎟️ EVENTS METHODS
  // ===========================

  getEvents(filters?: any): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/events`, { headers: this.authHeaders, params });
  }

  getEventById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${id}`, { headers: this.authHeaders });
  }

  createEvent(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, payload, { headers: this.authHeaders });
  }

  updateEvent(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/events/${id}`, payload, { headers: this.authHeaders });
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/events/${id}`, { headers: this.authHeaders });
  }

  // ===========================
  // 📩 CONTACT MESSAGES METHODS
  // ===========================
  getContactMessages(filters?: any): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${environment.apiBaseUrl}/crm/contact_messages`, {
      headers: this.authHeaders,
      params,
    });
  }

  getContactMessageById(id: string): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/crm/contact_messages/${id}`, {
      headers: this.authHeaders,
    });
  }

  createContactMessage(payload: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/crm/contact_messages`, payload, {
      headers: this.authHeaders,
    });
  }

  updateContactMessage(id: string, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/crm/contact_messages/${id}`, payload, {
      headers: this.authHeaders,
    });
  }

  deleteContactMessage(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/crm/contact_messages/${id}`, {
      headers: this.authHeaders,
    });
  }
}
