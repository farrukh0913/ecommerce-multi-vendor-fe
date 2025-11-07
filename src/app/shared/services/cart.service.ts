import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  pricelist_id?: string| null;
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
  private  authToken={Authorization:'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYTVhMWNmOTMwNGU2MzRiMTNmMjE0NTU3MWQyOTI4ZDVjZjdlZGYifQ.eyJhdF9oYXNoIjoianZrc2g2dkNoV09JSlBvZG81QkoyZyIsImF1ZCI6WyJvYXV0aDItcHJveHkiLCJwdWJsaWMtd2VidWkiXSwiYXpwIjoicHVibGljLXdlYnVpIiwiZW1haWwiOiJraWxnb3JlQGtpbGdvcmUudHJvdXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzYyNTk1NDEyLCJpYXQiOjE3NjI1MDkwMTIsImlzcyI6Imh0dHBzOi8vaWFtLWFjYWQzYjJmMzE3YS5ldS13ZXN0MS5lZGdlZmxhcmUuZGV2L2RleCIsIm5hbWUiOiJLaWxnb3JlIFRyb3V0IiwicG9saWN5Ijp7InBncm9sZSI6ImF1dGhuIn0sInN1YiI6IkNnMHdMVE00TlMweU9EQTRPUzB3RWdSdGIyTnIifQ.rAVVH6Mq-zZOGVxpEBITs0OYzbw1RfU34jLjPEAArXVCGqgKCi-VKH2_jmK_NmJMUo3zayrO38MEaW9nqjVOC8IQE1FlitaIkDFGS_GlJnhLhUI03ujZHL36VbyUpOYvvFj1BQ_w5AvM5DxyheIxOSrQEl3wtrxXSGxqPbI3VfbEAOiOALm6RgV6eFT2nIJ3wgNuv0YCekRu-BM1kYbOAO9jhfzhOCuW7zrXFVFARhseGGD8QQOytHcOlGE2IjCx8oenK2hMuN6yKa_rS1tHHs6PTE2o89agGcfIR-OT-8INXgaI7gVaDKB4UuhULT9J8m5y1thWyXNwJ5oWVs7amg'};

  constructor(private http: HttpClient) {}

  /**
   * Fetch all cart items with optional filters
   * @param params Optional query parameters (limit, offset, user_id, etc.)
   */
 getCartItems(params?: Record<string, any>): Observable<any> {
  const httpParams = new HttpParams({ fromObject: this.cleanParams(params) });

  console.log('➡️ Sending GET /cart_items with params:', httpParams.toString());

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
    return this.http.get(`${this.baseUrl}/cart_items/${id}`);
  }

  /**
   * Add a new item to the cart
   * @param data Cart item data
   */
  addCartItem(data: CartItem): Observable<any> {
    const authToken = this.authToken;
    return this.http.post(`${this.baseUrl}/cart_items`, data, { headers: authToken });
  }

  /**
   * Update an existing cart item
   * @param id Cart item ID
   * @param data Updated cart item data
   */
  updateCartItem(id: string, data: CartItem): Observable<any> {
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
   * @param data Cart view data
   */
  createCartView(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/carts_view`, data);
  }
}
