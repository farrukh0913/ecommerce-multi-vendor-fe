import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private readonly baseUrl = `${environment.apiBaseUrl}/cms/faqs`;
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
    return this.http.patch<any>(`${this.baseUrl}/?id=eq.${id}`, payload);
  }

  /**
   * Delete FAQ by ID
   */
  deleteFaq(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
