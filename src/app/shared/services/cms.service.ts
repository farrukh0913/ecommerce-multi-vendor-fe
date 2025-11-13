import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/cms`;

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
    return this.http.get(`${this.baseUrl}/news_articles`);
  }

  getNewsArticleById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/news_articles/${id}`);
  }

  createNewsArticle(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/news_articles`, payload);
  }

  updateNewsArticle(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/news_articles/${id}`, payload);
  }

  deleteNewsArticle(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/news_articles/${id}`);
  }

  // ===========================
  // 🎟️ EVENTS METHODS
  // ===========================

  getEvents(filters?: any): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/events`);
  }

  getEventById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${id}`);
  }

  createEvent(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, payload);
  }

  updateEvent(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/events/${id}`, payload);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/events/${id}`);
  }

  // ===========================
  // 📩 CONTACT MESSAGES METHODS
  // ===========================
  getContactMessages(filters?: any): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${environment.apiBaseUrl}/crm/contact_messages`, {
      params,
    });
  }

  getContactMessageById(id: string): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/crm/contact_messages/${id}`);
  }

  createContactMessage(payload: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/crm/contact_messages`, payload);
  }

  updateContactMessage(id: string, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/crm/contact_messages/${id}`, payload);
  }

  deleteContactMessage(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/crm/contact_messages/${id}`);
  }
}
