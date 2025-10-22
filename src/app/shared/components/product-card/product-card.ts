import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Output() quickViewClicked = new EventEmitter<void>();
  @Input() viewMode: 'grid' | 'list' = 'grid';
  constructor(private router: Router) {}
  
  /**
   * quick view clicked
   */
  quickView() {
    this.quickViewClicked.emit();
  }

  /**
   * go to product detail info
   * @param productId
   */
  goToDetail(productId: number) {
    this.router.navigate(['/product-detail', productId]);
  }
}
