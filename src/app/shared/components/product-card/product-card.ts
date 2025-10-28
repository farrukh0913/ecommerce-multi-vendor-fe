import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Output() quickViewClicked = new EventEmitter<any>();
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() product: any = null;
  imageBaseUrl: string = environment.s3BaseUrl;
  constructor(private router: Router) {}

  /**
   * quick view clicked
   */
  quickView(event: MouseEvent) {
    event.stopPropagation();
    this.quickViewClicked.emit(this.product);
  }

  /**
   * go to product detail info
   * @param productId
   */
  goToDetail(productId: string) {
    this.router.navigate(['/product-detail', productId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top after navigation
    });
  }
}
