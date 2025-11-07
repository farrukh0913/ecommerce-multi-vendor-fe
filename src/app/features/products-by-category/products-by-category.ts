import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products-by-category',
  standalone: false,
  templateUrl: './products-by-category.html',
  styleUrl: './products-by-category.scss',
})
export class ProductsByCategory {
  showDetailModal: boolean = false;
  viewMode: 'grid' | 'list' = 'grid';
  categoryId: string = '';
  categoryName: string = '';
  productsByCategory: any = [];
  isMobile = inject(ResponsiveService).isMobile;
  gridLayout: string = 'grid-3';
  sortOrder: string = 'created_at.desc';
  categoryMenuOpen: boolean = false;
  showCount: number = 10;
  r2BaseUrl: string = environment.r2BaseUrl;
  appliedFilters: any = [];
  visibleFilter: { [key: string]: boolean } = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  };
  categories: any[] = [];
  brands = [
    { name: 'UrbanEdge' },
    { name: 'DenimX' },
    { name: 'StreetWear Co.' },
    { name: 'ClassicThreads' },
  ];
  colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Blue', hex: '#0078FF' },
    { name: 'Olive', hex: '#808000' },
  ];
  prices = [
    { name: 'Under $50', min: 0, max: 50 },
    { name: '$50 - $100', min: 50, max: 100 },
    { name: '$100 - $200', min: 100, max: 200 },
    { name: 'Above $200', min: 200, max: 1000 },
  ];
  ratings = [
    { stars: 5, name: '5 ⭐', selected: false },
    { stars: 4, name: '4 ⭐', selected: false },
    { stars: 3, name: '3 ⭐', selected: false },
    { stars: 2, name: '2 ⭐', selected: false },
    { stars: 1, name: '1 ⭐', selected: false },
  ];
  filters: any[] = [];
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
      name: '',
      path: null,
    },
  ];
  private destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {
    /**
     * get current category
     */
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    const categoryName = this.route.snapshot.paramMap.get('categoryName');
    if (categoryId && categoryName) {
      this.categoryId = categoryId;
      this.categoryName = categoryName;
      this.breadcrumb[2].name = categoryName;
      this.getProductsByFilters();
    }
    console.log('Selected Category:', categoryId);
  }

  ngOnInit(): void {
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((cats) => {
      this.categories = cats.map((cat) => ({
        id: cat.id,
        name: cat.name,
      }));

      this.buildFilters();
      const selectedCategory = this.categories.find((cat) => cat.id === this.categoryId);
      console.log('selectedCategory: ', selectedCategory);

      if (selectedCategory) {
        this.appliedFilters.push({
          ...selectedCategory,
          selected: true,
          type: 'category',
        });

        console.log('this.appliedFilters: ', this.appliedFilters);
      }

      // this.applyDefaultCategoryFilter();
    });
  }

  private buildFilters() {
    this.filters = [
      {
        id: '1',
        title: 'Category',
        type: 'category',
        data: this.categories,
        selectedItems: this.categories.filter((cat) => cat.id === this.categoryId),
      },
      {
        id: '2',
        title: 'Brand',
        type: 'brand',
        data: this.brands,
        selectedItems: [],
      },
      {
        id: '3',
        title: 'Color',
        type: 'color',
        data: this.colors,
        selectedItems: [],
      },
      {
        id: '4',
        title: 'Price',
        type: 'price',
        data: this.prices,
        selectedItems: [],
      },
      {
        id: '5',
        title: 'Rating',
        type: 'rating',
        data: this.ratings,
        selectedItems: [],
      },
    ];
  }

  /**
   * Fetches all product by Categories
   * @returns {void}
   */
  getProductsByFilters(): void {
    let productFilters: any = JSON.parse(JSON.stringify(this.productService.productFilters));
    productFilters.limit = this.showCount;
    productFilters.category_id = this.filters.length
      ? this.filters
          .find((data) => data.type === 'category')
          .selectedItems.map((data: any) => data.id)
          .join(',')
      : this.categoryId;
    productFilters.order = this.sortOrder;
    productFilters.minPrice =
      this.filters.find((data) => data.type === 'price')?.selectedItems?.[0]?.min || 1;
    productFilters.maxPrice = this.filters.find(
      (data) => data.type === 'price'
    )?.selectedItems?.[0]?.max;
    console.log(' this.filters: ', this.filters);
    this.spinner.start();
    console.log('productFilters: ', productFilters);
    this.productService.getFiltered(productFilters).subscribe({
      next: (data) => {
        const blogWhoWearWhatId = ['1e6a5917bbb3', '79bc0ce5cb48'];
        this.productsByCategory = data?.filter(
          (item: any) => !blogWhoWearWhatId.includes(item.category_id)
        );
        this.spinner.stop();
        // console.log('Categories data:', data);
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
  }

  /**
   * toggle for filter accordion
   */
  toggleVisibleFilter(index: string) {
    this.visibleFilter[index] = !this.visibleFilter[index];
  }

  /**
   * call api on filter change
   * @param event
   * @param type
   */
  onFilterChange(event: Event, type: 'sortOrder' | 'showCount') {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (type === 'sortOrder') {
      this.sortOrder = value;
      this.getProductsByFilters();
    } else if (type === 'showCount') {
      this.showCount = Number(value);
      this.getProductsByFilters();
      console.log('Show count changed:', this.showCount);
    }
  }

  onCategorySelect(category: string) {
    console.log('Selected:', category);
    this.categoryMenuOpen = false;
  }

  /**
   * getting selected Items from filter child
   */
  updateSelectedItems(filterId: string, selectedItems: any[]) {
    const filter = this.filters.find((f) => f.id === filterId);
    if (!filter) return;

    const previousSelected = filter.selectedItems;
    filter.selectedItems = selectedItems;

    const removedItems = previousSelected.filter(
      (prevItem: any) => !selectedItems.some((si) => si.name === prevItem.name)
    );

    if (removedItems.length > 0) {
      removedItems.forEach((item: any) => this.removeappliedFilter(filter.type, item));
    } else {
      this.getProductsByFilters();
    }

    this.getAppliedFilters();
  }

  /**
   * get all apllied filter
   */
  getAppliedFilters() {
    this.filters.forEach((filter) => {
      if (filter.selectedItems.length > 0) {
        filter.selectedItems.forEach((item: any) => {
          if (!this.appliedFilters.find((af: any) => af.name === item.name)) {
            this.appliedFilters.push({ ...item, type: filter.type });
          }
        });
      }
    });
  }

  /**
   * remove applied filter from display
   * @param type
   * @param item
   */
  removeappliedFilter(type: string, item: any) {
    const filter = this.filters.find((f) => f.type === type);
    if (filter) {
      filter.selectedItems = filter.selectedItems.filter(
        (selectedItem: any) => selectedItem.name !== item.name
      );
      this.appliedFilters = this.appliedFilters.filter((af: any) => af.name !== item.name);
    }
    this.getAppliedFilters();
    this.getProductsByFilters();
  }

  /**
   * clear all filters
   */
  clearAllFilters() {
    this.appliedFilters = [];
    this.filters.forEach((filter) => {
      filter.selectedItems = [];
    });
    this.getAppliedFilters();
    this.getProductsByFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
