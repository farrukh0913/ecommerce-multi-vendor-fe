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
  newProducts: any = [];
  selectedItem:any ={}
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
   * Initial Fetch
   * @returns {void}
   */
  ngOnInit(): void{
    this.getProductNewArrival()
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
        this.products = data.slice(0,4);
        // console.log('Categories data:', data);
      },
      error: (err) => {},
      complete: () => {
        this.spinner.stop();
      },
    });
  }

  /**
   * Fetches all New products
   * @returns {void}
   */
  getProductNewArrival(): void {
    this.spinner.start();
    const filters = { ...this.productService.productFilters, order: 'created_at.desc'};
    this.productService.getFiltered(filters).subscribe({
      next: (data) => {
        this.newProducts = data;
        // console.log('Categories data:', data);
      },
      error: (err) => {console.log(err) },
      complete: () => {
        this.spinner.stop();
      },
    });
  }


  /**
   * Fetches all New products
   * @returns {void}
   */
  getProductDetail(productId:string): void {
    this.spinner.start();
    this.productService.getProductDetails(productId).subscribe({
      next: (data) => {
        this.selectedItem = data;
        console.log('this.selectedItem: ', this.selectedItem);
        // console.log('Categories data:', data);
      },
      error: (err) => {console.log(err) },
      complete: () => {
        this.spinner.stop();
        this.showDetailModal = true
      },
    });
  }

  /**
   * route to catgeory pagee
   */
  quickViewClicked(item:any){
   this.getProductDetail(item.id)
    
  }


  /**
   * route to catgeory pagee
   */
  moveToCategoryPage() {
    this.router.navigate(['/products-by-category/t-shirts']);
  }
}
