import { Component } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  standalone: false,
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  couponCode = '';
  discount = 0;

  cartItems = [
    {
      name: 'Sample Item',
      price: 50,
      quantity: 1,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_b_fm.jpg.webp',
    },
    {
      name: 'Cool Hoodie',
      price: 80,
      quantity: 1,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_b_fm.jpg.webp',
    },
  ];

  /**
   * Calculates the total cost of all items in the cart
   * by summing up (price × quantity) for each item.
   */
  get totalCost(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
  }

  /**
   * Decreases the quantity of a specific cart item by 1.
   * Ensures that the quantity never goes below 1.
   * @param item - The cart item whose quantity will be decreased.
   */
  decreaseQty(item: any) {
    if (item.quantity > 1) item.quantity--;
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
}
