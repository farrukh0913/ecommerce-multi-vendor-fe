import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class Checkout {
  cartItems = [
    {
      name: 'Premium Cotton Shirt',
      price: 45,
      quantity: 1,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Slim Fit Denim Jeans',
      price: 60,
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/710mqhd9mCL._UY1100_.jpg',
    },
  ];

  getSubtotal(): number {
    return this.cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }

  getTotal(): number {
    return this.getSubtotal() + 10; // flat shipping for example
  }

  placeOrder() {
    alert('✅ Order placed successfully!');
  }
}
