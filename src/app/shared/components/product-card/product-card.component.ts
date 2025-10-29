import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getCurrencySymbol } from '../../utils/currency.utils';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCard {
  @Output() quickViewClicked = new EventEmitter<any>();
  @Output() detailViewClicked = new EventEmitter<any>();
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() product: any = null;
  imageBaseUrl: string = environment.s3BaseUrl;
  getCurrencySymbol = getCurrencySymbol;

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
    this.detailViewClicked.emit(this.product);
  }
}
