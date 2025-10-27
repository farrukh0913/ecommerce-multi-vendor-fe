import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly endpoint = `${BASE_URL}/inventory/product_categories`;

  constructor(private http: HttpClient) {}

  /** Get all categories (with optional pagination or search) */
  getAll(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null)
          params = params.append(key, filters[key]);
      });
    }

    return this.http.get(this.endpoint, { params });
  }

  /** Get single category */
  getById(id: string): Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`);
  }

  /** Create a new category */
  create(payload: any): Observable<any> {
    return this.http.post(this.endpoint, payload);
  }

  /** Update category */
  update(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${id}`, payload);
  }

  /** Delete category */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }

  /** Search categories by name or tag */
  search(keyword: string): Observable<any> {
    const params = new HttpParams().set('search', keyword);
    return this.http.get(this.endpoint, { params });
  }

  /** Get categories with product count or metadata */
  getWithStats(): Observable<any> {
    return this.http.get(`${this.endpoint}/stats`);
  }
}
