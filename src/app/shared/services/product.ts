import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { forkJoin, map } from 'rxjs';

const BASE_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productFilters = {
    limit: 20,
    offset: 0,
    order: '',
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

  private readonly endpoint = `${BASE_URL}/shop/products`;

  constructor(private http: HttpClient) { }

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
      const value = options[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.append(key, value as any);
      }
    });
    return this.http.get(this.endpoint, { params });
  }


  getProductDetails(productId: string): Observable<any> {
    const productUrl = `${BASE_URL}/shop/products?id=eq.${productId}`;
    const variantsUrl = `${BASE_URL}/shop/product_variants?product_id=eq.${productId}`;
    const mediaUrl = `${BASE_URL}/inventory/product_media?product_id=eq.${productId}`;
    const priceUrl = `${BASE_URL}/shop/pricelist?product_id=eq.${productId}`;

    // Execute all requests in parallel
    return forkJoin({
      product: this.http.get(productUrl),
      variants: this.http.get(variantsUrl),
      media: this.http.get(mediaUrl),
      priceList: this.http.get(priceUrl)
    }).pipe(
      map((response: any) => {
        const product = Array.isArray(response.product) ? response.product[0] : response.product;

        return {
          ...product,
          variants: response.variants || [],
          media: response.media || [],
          priceList: response.priceList || []
        };
      })
    );
  }


}
