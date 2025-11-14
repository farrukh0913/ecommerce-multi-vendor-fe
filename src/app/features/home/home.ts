import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { OrganizationService } from '../../shared/services/organization.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BlogArticlesService } from '../../shared/services/blog-articles.service';

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
  organizations: any = [];
  selectedProductId: any = {};
  r2BaseUrl: string = environment.r2BaseUrl;
  blogs: any = [];
  whoWearWhat: any = [];
  heroImages = [
    `${this.r2BaseUrl}/uploads/hero-image.png`,
    `${this.r2BaseUrl}/uploads/hero-image-2.png`,
  ];
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private organizationService: OrganizationService,
    private blogArticlesService: BlogArticlesService
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
    this.getBlogs();
    this.getWhoWearByCategory();
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
    const filters = { ...this.productService.productFilters, order: 'created_at.desc', limit: 20 };
    this.productService.getFiltered(filters).subscribe({
      next: (data) => {
        const blogWhoWearWhatId = ['1e6a5917bbb3', '79bc0ce5cb48'];
        this.newProducts = data?.filter(
          (item: any) => !blogWhoWearWhatId.includes(item.category_id)
        );
        console.log('this.newProducts: ', this.newProducts);
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

  /**
   * Fetches all product by Categories
   * @returns {void}
   */
  getBlogs(): void {
    this.spinner.start();
    this.blogArticlesService.list().subscribe({
      next: (data) => {
        this.blogs = data;
        console.log('this.blogs: ', this.blogs);
        this.spinner.stop();
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
  getWhoWearByCategory(): void {
    this.spinner.start();
    this.productService.getByCategory('79bc0ce5cb48').subscribe({
      next: (data) => {
        this.whoWearWhat = data;
      },
      error: (err) => {},
      complete: () => {
        this.spinner.stop();
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
