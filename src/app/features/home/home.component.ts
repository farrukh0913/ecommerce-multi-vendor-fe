import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { OrganizationService } from '../../shared/services/organization.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class Home {
  showDetailModal: boolean = false;
  tabs: any = [];
  selectedTab = this.tabs[0];
  products: any = [];
  newProducts: any = [];
  organizations: any = [];
  selectedProductId: any = {};
  heroImages=['https://laravel.pixelstrap.net/multikart/storage/146/fashion_one_2.png','https://laravel.pixelstrap.net/multikart/storage/2772/fashion_one_9.png']
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private organizationService: OrganizationService
  ) {}

  /**
   * Initial Fetch
   * @returns {void}
   */
  ngOnInit(): void {
    // Subscribe to shared categories observable
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((cats) => {
      if (cats.length) {
        this.tabs = cats.slice(0, 3);
        this.selectedTab = this.tabs[0];
        this.getProductByCategories();
      }
    });
    this.getProductNewArrival();
    this.getShopOrganizations();
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
   * Fetches all product by Categories
   * @returns {void}
   */
  getProductByCategories(): void {
    this.spinner.start();
    this.productService.getByCategory(this.selectedTab.id).subscribe({
      next: (data) => {
        this.products = data.slice(0, 4);
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
    const filters = { ...this.productService.productFilters, order: 'created_at.desc' };
    this.productService.getFiltered(filters).subscribe({
      next: (data) => {
        this.newProducts = data;
        // console.log('Categories data:', data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.spinner.stop();
      },
    });
  }

  /**
   * fecth all shop organizations
   * @returns {void}
   */
  getShopOrganizations() {
    this.organizationService.getAll().subscribe({
      next: (data) => {
        this.organizations = data;
        console.log('data: organizations ', data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  /**
   * route to catgeory pagee
   */
  quickViewClicked(item: any) {
    this.selectedProductId = item.id;
    this.showDetailModal = true;
  }

  /**
   * route to catgeory pagee
   */
  moveToCategoryPage() {
    this.router.navigate(['/products-by-category/t-shirts']);
  }

  /**
   * open wesbite url on click on organization name
   * @param item
   */
  openWebUrl(item: any) {
    if (item?.website) {
      window.open(item.website, '_blank');
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
