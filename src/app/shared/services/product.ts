import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productFilters = {
    limit: 20,
    offset: 0,
    order: 'created_at.desc',
    name: '',
    template_id: '',
    category_id: '',
    slug: '',
    description: '',
    tags: '',
    sku: '',
    barcode: '',
    mpn: '',
    thumbnail_url: '',
    status: '',
    condition: '',
    manufacturer_id: '',
    attributes: '',
    metadata: '',
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    id: '',
    uuid: '',
    parent_id: '',
    is_variant: false,
    weight: null,
  };

  private readonly endpoint = `${BASE_URL}/inventory/products`;

  constructor(private http: HttpClient) {}

  /**
   * Get all products with optional filters
   * @param filters { page?, limit?, category?, sortBy?, search?, status? }
   */
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

  /** Get product by ID */
  getById(id: string): Observable<any> {
    return this.http.get(`${this.endpoint}?id=${id}`);
  }

  /** Create a new product */
  create(payload: any): Observable<any> {
    return this.http.post(this.endpoint, payload);
  }

  /** Update product by ID */
  update(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${id}`, payload);
  }

  /** Delete product by ID */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }

  /** Search products by keyword */
  search(keyword: string): Observable<any> {
    const params = new HttpParams().set('search', keyword);
    return this.http.get(this.endpoint, { params });
  }

  /** Get products by category ID */
  getByCategory(categoryId: string): Observable<any> {
    const params = new HttpParams().set('category_id', categoryId);
    return this.http.get(this.endpoint, { params });
  }

  /** Get featured or filtered products */
  getFiltered(options: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(options).forEach((key) => {
      if (options[key] !== undefined && options[key] !== null)
        params = params.append(key, options[key] as any);
    });
    return this.http.get(this.endpoint, { params });
  }
}
