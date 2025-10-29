import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';

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
  categoryId: string = '';
  productsByCategory: any = [];
  breadcrumb = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Categories',
      path: '/shop-now',
    },
    {
      name: this.productCategory,
      path: null,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    /**
     * get current category
     */
    const category = this.route.snapshot.paramMap.get('category');
    if (category) {
      this.categoryId = category;
      this.getProductByCategories();
    }
    console.log('Selected Category:', category);
  }

  /**
   * Fetches all product by Categories
   * @returns {void}
   */
  getProductByCategories(): void {
    this.spinner.start();
    this.productService.getByCategory(this.categoryId).subscribe({
      next: (data) => {
        this.productsByCategory = data;
        // console.log('Categories data:', data);
      },
      error: (err) => {},
      complete: () => {
        this.spinner.stop();
      },
    });
  }
}
