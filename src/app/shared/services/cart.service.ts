import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
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
  private authToken = {
    Authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwZWU3M2MzMDk4MzBlZmViMzIzMjI4NmJmZWMxMDYyMjc3MzFkNDkifQ.eyJhdF9oYXNoIjoidzdrQnROeV9HMUh2Q21vUFRoN3pxdyIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYyODUxMzMyLCJpYXQiOjE3NjI3NjQ5MzIsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.eRFo-1HetlCDNYISVuqxduV0M-7ipcnfw8V_WIE_mYHNN6L1jkBspiKF39mYwePCsAzQlQ9aSU1qgLMHB9A6UQ8IO35Ew1bFhiHKdAsEEpqMLQzEg6WMoKCbxa0XMuiV_uBBCkaJi20al9MjmmUiJsUxIVnRO0BJWvDRKZSQhTU6sfCzt0zzIxcJ7o1lSF7AOECna7VZ4toO4H-gSKcFKfva143UaHxQ3xC1ndUIYHxMlEiUATiovv3QCd_cKWlZP3lpCj5S1cviBZZQl2kDrEpI9TAAqZBApPTXM7AUjVVYc_3Q15x6iSURj6DsF2O_b3BoJRZCpoXvhntoSlpTyg',
  };
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  constructor(private http: HttpClient) {
    this.updateCartObservable();
  }

  /**
   * Fetch all cart items with optional filters
   * @param params Optional query parameters (limit, offset, user_id, etc.)
   */
  getCartItems(params?: Record<string, any>): Observable<any> {
    const httpParams = new HttpParams({ fromObject: this.cleanParams(params) });
    return this.http.get(`${this.baseUrl}/cart_items`, { params: httpParams });
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
    const authToken = this.authToken;
    return this.http.post(`${this.baseUrl}/cart_items`, data, { headers: authToken }).pipe(
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
  const headers = new HttpHeaders({
    Authorization: this.authToken.Authorization,
  });

  return this.http
    .patch(`${this.baseUrl}/cart_items?id=eq.${id}`, data, { headers })
    .pipe(tap(() => this.updateCartObservable()));
}


  /**
   * Delete a cart item by ID
   * @param id Cart item ID
   */
  deleteCartItem(id: string): Observable<any> {
   const headers = new HttpHeaders({
    Authorization: this.authToken.Authorization
  });

  return this.http
    .delete(`${this.baseUrl}/cart_items?id=eq.${id}`, { headers })
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
    this.getCartItems({ user_id: 'Cg0wLTM4NS0yODA4OS0wEgRtb2Nr' }).subscribe((data) => {
      this.cartItemsSubject.next(data);
    });
  }
}
