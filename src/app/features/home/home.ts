import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category';
import { ProductService } from '../../shared/services/product';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  showDetailModal: boolean = false;
  tabs: any = [];
  selectedTab = this.tabs[0];
  products: any = [];
  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.getAllCategories();
  }
  /**
   * update tab selection value
   * @param tab
   */
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.getProductByCategories();
    // you can trigger filtering logic or API call here
  }

  /**
   * Fetches all product categories
   * @returns {void}
   */
  getAllCategories(): void {
    this.spinner.start();
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.tabs = data.slice(0, 3);
        this.selectedTab = this.tabs[0];
        this.getProductByCategories();
      },
      error: (err) => {},
      complete: () => {
        this.spinner.stop();
      },
    });
  }

  /**
   * Fetches all product by Categories
   * @returns {void}
   */
  getProductByCategories(): void {
    this.spinner.start();
    this.productService.getByCategory(this.selectedTab.id).subscribe({
      next: (data) => {
        this.products = data;
        console.log('Categories data:', data);
      },
      error: (err) => {},
      complete: () => {
        this.spinner.stop();
      },
    });
  }

  /**
   * route to catgeory pagee
   */
  moveToCategoryPage() {
    this.router.navigate(['/products-by-category/t-shirts']);
  }
}
