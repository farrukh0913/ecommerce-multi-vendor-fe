import { Component, EventEmitter, Output } from '@angular/core';
import { SharedService } from '../../../shared/services/sahared.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-shopping-cart',
  standalone: false,
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  @Output() close = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<any[]>();
  couponCode = '';
  discount = 0;
  private destroy$ = new Subject<void>();
  cartItems: any = [];
  r2BaseUrl: string = environment.r2BaseUrl + '/';

  constructor(
    private router: Router,
    private cartService: CartService,
    private spinner: NgxUiLoaderService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.cartItems = items;
      console.log('🛒 Cart updated:', items);
    });
  }
  /**
   * Removing item from Cart
   */
  removeFromCart(item: any) {
    this.spinner.start();
    this.cartService.deleteCartItem(item.id).subscribe({
      next: (data: any) => {
        // console.log('data: ', data);
        this.sharedService.showToast('Item removed from cart.');
        this.spinner.stop();
      },
      error: (err: any) => {
        // console.log('err: ', err);
        this.spinner.stop();
        this.sharedService.showToast('Failed to remove item.', 'error');
      },
    });
  }

  /**
   * Calculates the total cost of all items in the cart
   * by summing up (price × quantity) for each item.
   */
  get totalCost(): number {
    return this.cartItems.reduce(
      (acc: any, item: any) => acc + item.final_price * item.quantity,
      0
    );
  }

  /**
   * Calculates 5% GST on the total cost.
   */
  get gstAmount(): number {
    return this.totalCost * 0.05;
  }

  /**
   * Calculates the grand total by adding GST,
   * subtracting any discount applied from the coupon.
   */
  get grandTotal(): number {
    return this.totalCost + this.gstAmount - this.discount;
  }

  /**
   * Increases the quantity of a specific cart item by 1.
   * @param item - The cart item whose quantity will be increased.
   */
  increaseQty(item: any) {
    item.quantity++;
    this.updateProductQuantity(item);
  }

  /**
   * Decreases the quantity of a specific cart item by 1.
   * Ensures that the quantity never goes below 1.
   * @param item - The cart item whose quantity will be decreased.
   */
  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateProductQuantity(item);
    }
  }

  /**
   * Applies a coupon discount to the total cost.
   * - Currently supports the code 'SAVE10' for a 10% discount.
   * - Shows an alert whether the coupon is valid or not.
   */
  applyCoupon() {
    if (this.couponCode.trim().toLowerCase() === 'save10') {
      this.discount = this.totalCost * 0.1;
      alert('Coupon applied! 10% discount added.');
    } else {
      this.discount = 0;
      alert('Invalid coupon code.');
    }
  }
  /**
   * route to design editor to view user added design
   * @param productId
   * @param customDesignPath
   * @param cartId
   */
  moveToCustomDesign(productId: string, customDesignPath: string, cartId: string) {
    this.router.navigate(['/design-tool'], {
      queryParams: {
        productId: productId,
        model: customDesignPath.split('/').pop(),
        isEdit: true,
        cartId: cartId,
      },
    });
    this.close.emit();
  }

  /**
   * remove custom design from user product
   * @param item
   */
  removeCustomDesign(item: any) {
    this.spinner.start();
    const cartItem = JSON.parse(JSON.stringify(item));
    delete cartItem.variants.hasCustom;
    delete cartItem.variants.model;
    delete cartItem.id;
    this.cartService.updateCartItem(item.id, cartItem).subscribe({
      next: (data: any) => {
        // console.log('data: ', data);
        this.spinner.stop();
        this.sharedService.showToast('Custom design removed from item.');
      },
      error: (err: any) => {
        // console.log('err: ', err);
        this.spinner.stop();
        this.sharedService.showToast('Failed to remove custom design.', 'error');
      },
    });
  }

  /**
   * update product quantity in the cart
   * @param item
   */
  updateProductQuantity(item: any) {
    let payload = JSON.parse(JSON.stringify(item));
    console.log('payload: ', payload);
    delete payload.id;
    this.cartService.updateCartItem(item.id, payload).subscribe({
      next: (data: any) => {
        // console.log('data: ', data);
        this.sharedService.showToast('Product quantity updated successfully.');
      },
      error: (err: any) => {
        // console.log('err: ', err);
        this.sharedService.showToast('Failed to update product quantity.', 'error');
      },
    });
  }

  /**
   * emit changes to parent
   */
  emitStep() {
    this.nextStep.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
