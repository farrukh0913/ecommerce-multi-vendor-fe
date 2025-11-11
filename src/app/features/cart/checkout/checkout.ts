import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../shared/services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  @Output() nextStep = new EventEmitter<any[]>();
  checkoutForm!: FormGroup;
  cartItems: any = [];
  r2BaseUrl: string = environment.r2BaseUrl + '/';
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private cartService: CartService) {}

  ngOnInit(): void {
    /**
     * initalize form
     */
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      shipping_phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      shipping_address: ['', [Validators.required, Validators.minLength(5)]],
      shipping_city: ['', Validators.required],
      shipping_state: ['', Validators.required],
      shipping_country: ['', Validators.required],
      shipping_postalCode: ['', Validators.required],
      billing_phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      billing_address: ['', [Validators.required, Validators.minLength(5)]],
      billing_city: ['', Validators.required],
      billing_state: ['', Validators.required],
      billing_country: ['', Validators.required],
      billing_postalCode: ['', Validators.required],
      paymentMethod: ['card', Validators.required],
      deliveryOption: ['rush', Validators.required],
      create_account: [false, Validators.required],
      same_as_billing: [false, Validators.required],
      cardNumber: ['', []],
      cardExpiry: ['', []],
      cardCvv: ['', []],
    });

    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.cartItems = items;
      console.log('🛒 Cart updated:', items);
    });
  }

  /**
   * place user order
   */
  placeOrder(): void {
    // if (this.checkoutForm.invalid) {
    //   this.checkoutForm.markAllAsTouched();
    //   return;
    // }

    const order = {
      ...this.checkoutForm.value,
      items: this.cartItems,
      total: this.grandTotal + 5,
    };
    this.nextStep.emit(order);
    console.log('Order placed successfully:', order);
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
   * Calculates the grand total by adding GST,
   * subtracting any discount applied from the coupon.
   */
  get grandTotal(): number {
    return this.totalCost + this.gstAmount + this.shippingAmount;
  }

  /**
   * Calculates 5% GST on the total cost.
   */
  get gstAmount(): number {
    return this.totalCost * 0.05;
  }

  /**
   * Calculates 10% Shipping on the total cost.
   */
  get shippingAmount(): number {
    return this.totalCost * (this.checkoutForm.value.deliveryOption === 'rush' ? 0.1 : 0.0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
