import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-complete',
  standalone: false,
  templateUrl: './order-complete.component.html',
  styleUrl: './order-complete.component.scss',
})
export class OrderComplete {
  orderId = Math.floor(Math.random() * 1000000);
  grandTotal = 125.49;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
