import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-complete',
  standalone: false,
  templateUrl: './order-complete.html',
  styleUrl: './order-complete.scss',
})
export class OrderComplete {
  @Input() orderInfo: any = null;
  orderId = Math.floor(Math.random() * 1000000);
  grandTotal = 125.49;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
