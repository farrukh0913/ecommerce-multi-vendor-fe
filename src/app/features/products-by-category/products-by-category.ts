import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-by-category',
  standalone: false,
  templateUrl: './products-by-category.html',
  styleUrl: './products-by-category.scss',
})
export class ProductsByCategory {
  showDetailModal: boolean = false;
  productCategory: string = 'T-Shirts';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private route: ActivatedRoute) {
    /**
     * get current category
     */
    const category = this.route.snapshot.paramMap.get('category');
    if (category) {
      // this.productCategory = category;
    }
    console.log('Selected Category:', category);
  }
}
