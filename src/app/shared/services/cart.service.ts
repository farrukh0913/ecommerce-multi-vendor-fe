import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = `${environment.apiBaseUrl}/shop`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch all cart items with optional filters
   * @param params Optional query parameters (limit, offset, user_id, etc.)
   */
  getCartItems(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(`${this.baseUrl}/cart_items`, { params: httpParams });
  }

  /**
   * Get a single cart item by ID
   * @param id Cart item ID
   */
  getCartItemById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart_items/${id}`);
  }

  /**
   * Add a new item to the cart
   * @param data Cart item data
   */
  addCartItem(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart_items`, data);
  }

  /**
   * Update an existing cart item
   * @param id Cart item ID
   * @param data Updated cart item data
   */
  updateCartItem(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/cart_items/${id}`, data);
  }

  /**
   * Delete a cart item by ID
   * @param id Cart item ID
   */
  deleteCartItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart_items/${id}`);
  }

  /**
   * Fetch all carts view (aggregated cart data)
   * @param params Optional query parameters for filtering
   */
  getCartsView(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(`${this.baseUrl}/carts_view`, { params: httpParams });
  }

  /**
   * Create a new cart view record
   * (Typically not needed for normal carts but supported)
   * @param data Cart view data
   */
  createCartView(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/carts_view`, data);
  }
}
