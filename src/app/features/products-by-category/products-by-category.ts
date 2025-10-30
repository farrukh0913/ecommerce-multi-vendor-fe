import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { ResponsiveService } from '../../shared/services/responsive.service';

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

  

visibleFilter: { [key: string]: boolean } = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true
};

// Example data sources
categories = [
  { name: 'Men' },
  { name: 'Women' },
  { name: 'Kids' }
];

brands = [
  { name: 'UrbanEdge' },
  { name: 'DenimX' },
  { name: 'StreetWear Co.' },
  { name: 'ClassicThreads' }
];

colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue', hex: '#0078FF' },
  { name: 'Olive', hex: '#808000' }
];

prices = [
  { name: 'Under $50', min: 0, max: 50 },
  { name: '$50 - $100', min: 50, max: 100 },
  { name: '$100 - $200', min: 100, max: 200 },
  { name: 'Above $200', min: 200, max: 1000 }
];

 ratings = [
    { stars: 5, selected: false },
    { stars: 4, selected: false },
    { stars: 3, selected: false },
    { stars: 2, selected: false },
    { stars: 1, selected: false },
  ];

filters = [
  { id: '1', title: 'Category', type: 'category', data: this.categories, selectedItems: <any[]>[] },
  { id: '2', title: 'Brand', type: 'brand', data: this.brands, selectedItems: <any[]>[] },
  { id: '3', title: 'Color', type: 'color', data: this.colors, selectedItems: <any[]>[] },
  { id: '4', title: 'Price', type: 'price', data: this.prices, selectedItems: <any[]>[] },
  { id: '5', title: 'Rating', type: 'rating', data: this.ratings, selectedItems: <any[]>[] }
];


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
 
  


  constructor(
    private route: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    /**
     * get current category
     */
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    const categoryName = this.route.snapshot.paramMap.get('categoryName');
    if (categoryId && categoryName) {
      this.categoryId = categoryId;
      this.categoryName = categoryName
      this.breadcrumb[2].name = categoryName
      this.getProductByCategories();
    }
    console.log('Selected Category:', categoryId);
  }

  /**
   * Fetches all product by Categories
   * @returns {void}
   */
  getProductByCategories(): void {
    let productFilters: any = this.productService.productFilters;
    productFilters.limit = this.showCount;
    productFilters.category_id = this.categoryId;
    productFilters.order = this.sortOrder;
    this.spinner.start();
    this.productService.getFiltered(productFilters).subscribe({
      next: (data) => {
        this.productsByCategory = data;
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
  onFilterChange(event: Event, type: 'sortOrder' | 'showCount') {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (type === 'sortOrder') {
      this.sortOrder = value;
      this.getProductByCategories();
    } else if (type === 'showCount') {
      this.showCount = Number(value);
      this.getProductByCategories();
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
  const filter = this.filters.find(f => f.id === filterId);
  if (filter) {
    filter.selectedItems = selectedItems;
  }
  console.log('filter: ', filter);
}
}
