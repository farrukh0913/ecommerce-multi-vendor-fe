import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogArticlesService {
  private baseUrl = `${environment.apiBaseUrl}/cms/blog_articles`;

  constructor(private http: HttpClient) {}

  /** List blog articles with filters */
  list(params?: any & { limit?: number; offset?: number; order?: string }): Observable<any[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<any[]>(this.baseUrl, { params: httpParams });
  }

  /** Get a single blog article by id */
  get(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Create a new blog article */
  create(article: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, article);
  }

  /** Update an existing blog article by id */
  update(id: string, article: Partial<any>): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, article);
  }

  /** Delete a blog article by id */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
