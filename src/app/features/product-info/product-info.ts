import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/services/product';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.html',
  styleUrl: './product-info.scss',
})
export class ProductInfo {
  breadcrumb=[
     {
      name:'Home',
      path:'/'
    },
    {
      name:'Categories',
      path:'/shop-now'
    },
    {
      name:'kkkk',
      path:null
    }
  ]
  activeTab = 'description';
  showDetailModal = false;
  productFeatures: string[] = [
    '5.3 oz./yd² (US), 8.8 oz./L yd (CA), 100% cotton',
    'Sport Grey: 90/10 cotton/polyester',
    'Midweight fabric',
    'Semi-fitted',
    '½" rib collar',
    'Taped neck and shoulders',
    'Double-needle sleeve and bottom hem',
    'Side seams',
    'Tear-away label',
  ];
  additionalInfo = [
    {
      label: 'Color',
      value: 'Black, Heliconia, Navy, Purple, Red, Sport Grey, White',
    },
    {
      label: 'Size',
      value: '2XL, L, M, S, XL',
    },
  ];
  constructor(
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', productId);
    if (productId) {
      this.fetchProductById(productId);
    }
  }
  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  fetchProductById(productId: string) {
    this.spinner.start();
    this.productService.getById(productId).subscribe({
      next: (data) => {
        console.log('Categories data:', data);
      },
      error: (err) => {},
      complete: () => {
        this.spinner.stop();
      },
    });
  }
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }
}
