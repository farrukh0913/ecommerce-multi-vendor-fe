import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private cartItemsSubject = new BehaviorSubject<any[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItemsSubject.asObservable(); // Subscribe to this in components

  constructor() {}

  /**
   * Load cart items from localStorage
   */
  private loadCartFromStorage(): any[] {
    return JSON.parse(localStorage.getItem('cartItem') || '[]');
  }

  /**
   * Show toast notification
   */
  showToast(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: false,
      customClass: {
        popup: 'slide-in-right',
        icon: 'no-tick-anim',
      },
      showClass: {
        popup: 'slide-in-right',
      },
      hideClass: {
        popup: 'slide-out-right',
      },
    });
  }

  /**
   * Add item to cart (prevents duplicates)
   */
  addToCart(item: any) {
    const cartItems = this.loadCartFromStorage();
    console.log('cartItems: ', cartItems);
    const exists = cartItems.some((cartItem: any) => cartItem.id === item.id);
    console.log('exists: ', exists);

    if (exists) {
      this.showToast('Already in Cart', 'This product is already in your cart.');
      return;
    }

    cartItems.push(item);
    localStorage.setItem('cartItem', JSON.stringify(cartItems));
    this.cartItemsSubject.next(cartItems);
    this.showToast('Added!', 'Product added to cart.');
  }

  /**
   * Remove item from cart
   */
  removeFromCart(id: string | number) {
    const cartItems = this.loadCartFromStorage().filter((item: any) => item.id !== id);
    localStorage.setItem('cartItem', JSON.stringify(cartItems));
    this.cartItemsSubject.next(cartItems);
    this.showToast('Removed', 'Product removed from cart.');
  }

  /**
   * Clear cart
   */
  clearCart() {
    localStorage.removeItem('cartItem');
    this.cartItemsSubject.next([]);
    this.showToast('Cleared', 'All items removed from cart.');
  }
}
