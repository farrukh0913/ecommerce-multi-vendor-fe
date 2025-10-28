import { Component, EventEmitter, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-search-product',
  standalone: false,
  templateUrl: './search-product.html',
  styleUrl: './search-product.scss',
})
export class SearchProduct {
  @Output() close = new EventEmitter<void>();
  placeholderText = 'Search for product name...';
  animatedPlaceholder = '';
  products: any = [];
  currentIndex = 0;
  showSearchModal: boolean = false;
  loading = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  productId: string = '';

  constructor(private productService: ProductService, private spinner: NgxUiLoaderService) {}

  ngOnInit() {
    this.animatePlaceholder();
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.performSearch(query);
      });
    this.getProductsByName();
  }

  /**
   *
   * @param event
   */
  onSearch(event: any) {
    const value = event.target.value.trim();
    this.searchSubject.next(value);
  }

  /**
   * call product by name api
   * @param query
   */
  performSearch(query: string) {
    this.getProductsByName(query);
    console.log('🔍 Searching for:', query);
  }

  /**
   * get products by name
   * @param filterValue
   */
  getProductsByName(filterValue: string = ''): void {
    this.loading = true;
    this.productService.productFilters.name = filterValue;
    this.productService.getFiltered(this.productService.productFilters).subscribe({
      next: (data) => {
        this.products = data;
        console.log('data:product ', data);
      },
      error: (err) => {},
      complete: () => {
        this.productService.productFilters.name = '';
        this.loading = false;
      },
    });
  }

  /**
   * animated placeholder for search input
   */
  animatePlaceholder() {
    if (this.currentIndex < this.placeholderText.length) {
      this.animatedPlaceholder += this.placeholderText.charAt(this.currentIndex);
      this.currentIndex++;
      setTimeout(() => this.animatePlaceholder(), 100);
    } else {
      setTimeout(() => {
        this.animatedPlaceholder = '';
        this.currentIndex = 0;
        this.animatePlaceholder();
      }, 2000);
    }
  }

  /**
   * emit close to close search modal
   */
  closeModal() {
    this.close.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
