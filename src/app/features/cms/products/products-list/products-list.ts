import { Component } from '@angular/core';
import { ProductService } from '../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BlogArticlesService } from '../../../../shared/services/blog-articles.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { OrganizationService } from '../../../../shared/services/organization.service';
import { environment } from '../../../../../environments/environment';
import { SharedService } from '../../../../shared/services/sahared.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products-list',
  standalone: false,
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  productList: any = [];
  paginatedProducts: any[] = [];
  searchName = '';
  searchCategory = '';
  r2BaseUrl: string = environment.r2BaseUrl + '/';
  selectedProduct: any = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pagesArray: number[] = [];
  categories: any = [];
  loading = false;
  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$ = new Subject<void>();
  constructor(
    private productService: ProductService,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private sharedService: SharedService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((cats) => {
      this.categories = cats;
    });

    this.searchSubject
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((searchValue: string) => {
        this.applyFilters();
      });
    this.fetchProductList();
  }

  /**
   * fetch all product list on base of filters
   */
  fetchProductList() {
    this.loading = true;
    this.spinner.start();
    const offset = (this.currentPage - 1) * this.pageSize;
    const queryParams: any = {
      order: this.sortColumn ? `${this.sortColumn}.${this.sortDirection}` : 'created_at.desc',
      limit: this.pageSize,
      offset: offset,
    };
    if (this.searchName) {
      queryParams['name'] = `ilike.%${this.searchName}%`;
    }
    if (this.searchCategory) {
      queryParams['category_id'] = `eq.${this.searchCategory}`;
    }

    this.productService.getAll(queryParams).subscribe({
      next: (data: any) => {
        console.log('API response:', data);
        const totalProducts = 60;
        const blogWhoWearWhatId = ['1e6a5917bbb3', '79bc0ce5cb48'];
        this.productList = data?.filter(
          (item: any) => !blogWhoWearWhatId.includes(item.category_id)
        );
        // this.productList = data;
        this.paginatedProducts = this.productList;
        // Pagination
        this.totalPages = Math.ceil(totalProducts / this.pageSize);

        // Show max 6 pages in pagination bar
        const maxPagesToShow = 6;
        const startPage = Math.max(this.currentPage - Math.floor(maxPagesToShow / 2), 1);
        const endPage = Math.min(startPage + maxPagesToShow - 1, this.totalPages);
        this.pagesArray = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        this.spinner.stop();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.spinner.stop();
        this.loading = false;
      },
    });
  }

  /**
   * move to edit product
   * @param product
   */
  editProduct(product: any) {
    // Navigate to edit page
    this.router.navigate(['/cms/edit-product', product.id]);
  }

  /**
   * on searching the product
   * @param event
   */
  onSearchInput(event: any) {
    const value = event.target.value;
    this.searchSubject.next(value);
  }

  /**
   * got to new product
   */
  gotoNewProduct() {
    this.router.navigate(['/cms/new-products']);
  }

  /**
   * delete selected product
   * @param product
   */
  deleteProduct() {
    if (!this.selectedProduct) return;
    const productId = this.selectedProduct.id;
    this.spinner.start();
    this.selectedProduct = null;
    this.productService.delete(productId).subscribe({
      next: () => {
        this.spinner.stop();
        this.fetchProductList();
        this.sharedService.showToast('Product deleted successfully', 'success');
      },
      error: (err) => {
        this.spinner.stop();
        this.sharedService.showToast('Failed to delete product', 'error');
      },
      complete: () => {
        this.spinner.stop();
      },
    });
  }

  /**
   * apply filters
   */
  applyFilters(event?: any) {
    this.searchCategory = event?.value ?? this.searchCategory;
    this.currentPage = 1; // reset to first page
    this.fetchProductList(); // fetch filtered data from server
  }

  /**
   * reset all filter
   */
  resetFilters() {
    this.searchName = '';
    this.searchCategory = '';
    this.applyFilters();
  }

  /**
   * sorting coloumn
   */
  sortBy(column: string) {
    console.log('column: ', column);
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.fetchProductList();
  }

  /**
   * switch sort icon
   */
  getSortIcon(column: string) {
    if (this.sortColumn !== column) return 'swap-vertical-outline';
    return this.sortDirection === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline';
  }

  /**
   * pagination setup
   */
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    console.log('this.currentPage: ', this.currentPage);
    this.fetchProductList(); // fetch next page from server
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
