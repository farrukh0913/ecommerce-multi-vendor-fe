import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private readonly endpoint = `${BASE_URL}/shop/organizations`;

  constructor(private http: HttpClient) {}

  /**
   * Get all organizations with optional filters (pagination, search, etc.)
   */
  getAll(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params = params.append(key, filters[key]);
        }
      });
    }
    return this.http.get<any[]>(this.endpoint, { params });
  }

  /**
   * Create a new organization
   */
  create(payload: any): Observable<any> {
    return this.http.post<any>(this.endpoint, payload);
  }

  /**
   * Get a single organization by ID or UUID
   * (if your backend supports filtering this way)
   */
  getById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any[]>(this.endpoint, { params });
  }

  /**
   * Delete organization (if supported by backend)
   */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
