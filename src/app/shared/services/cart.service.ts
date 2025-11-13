import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
export interface CartVariants {
  selectedColor?: any;
  selectedSize?: any;
  thumbnail_url: string;
  hasCustom?: boolean;
  model?: any;
}

export interface CartItem {
  components?: any;
  pricelist_id?: string | null;
  product_id?: string;
  quantity?: number;
  saved_for_later?: boolean;
  user_id?: string;
  variants?: CartVariants;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = `${environment.apiBaseUrl}/shop`;
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  constructor(private http: HttpClient, private spinner: NgxUiLoaderService) {
    this.updateCartObservable();
  }

  /**
   * Fetch all cart items with optional filters
   * @param params Optional query parameters (limit, offset, user_id, etc.)
   */
  getCartItems(params?: Record<string, any>): Observable<any> {
    const httpParams = new HttpParams({ fromObject: this.cleanParams(params) });

    return this.http.get(`${this.baseUrl}/cart_items_view`, {
      params: httpParams,
    });
  }

  /**
   * Utility function to remove null or undefined values from params
   */
  private cleanParams(params?: Record<string, any>): Record<string, any> {
    if (!params) return {};
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  /**
   * Get a single cart item by ID
   * @param id Cart item ID
   */
  getCartItemById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart_items?id=eq.${id}`);
  }

  /**
   * Add a new item to the cart
   * @param data Cart item data
   */
  addCartItem(data: CartItem): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart_items`, data).pipe(
      tap(() => {
        this.updateCartObservable();
      })
    );
  }

  /**
   * Update an existing cart item
   * @param id Cart item ID
   * @param data Updated cart item data
   */
  updateCartItem(id: string, data: CartItem): Observable<any> {
    return this.http
      .patch(`${this.baseUrl}/cart_items?id=eq.${id}`, data)
      .pipe(tap(() => this.updateCartObservable()));
  }

  /**
   * Delete a cart item by ID
   * @param id Cart item ID
   */
  deleteCartItem(id: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/cart_items?id=eq.${id}`)
      .pipe(tap(() => this.updateCartObservable()));
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
   * @param data Cart view data
   */
  createCartView(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/carts_view`, data);
  }

  /**
   * update cart observable items
   */
  updateCartObservable() {
    this.spinner.start();
    this.getCartItems({ user_id: 'Cg0wLTM4NS0yODA4OS0wEgRtb2Nr' }).subscribe({
      next: (data) => {
        this.spinner.stop();
        this.cartItemsSubject.next(data);
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
  }
}
