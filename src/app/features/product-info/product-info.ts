import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getCurrencySymbol } from '../../shared/utils/currency.utils';
import { ProductService } from '../../shared/services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.html',
  styleUrl: './product-info.scss',
})
export class ProductInfo {
  // Expose global objects for use in template
  Object = Object;
  Array = Array;
  productId: any = null;
  product: any = null;
  activeTab = 'Specification';
  showDetailModal = false;
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
  r2BaseUrl: string = environment.r2BaseUrl;
  productReview: any = [];
  getCurrencySymbol = getCurrencySymbol;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    // Subscribe to route param changes
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
    this.fetchReviews();
  }

  /**
   * fetch product reviews
   */
  fetchReviews() {
    this.productService.getProductReviews(this.productId).subscribe((data) => {
      this.productReview = data;
    });
  }

  /**
   * update tabs variable
   * @param tabName
   */
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  /**
   * update variable on product recive
   * @param product
   */
  onProductReceived(product: any): void {
    this.product = product;
    this.breadcrumb[2].name = product.name;
  }
}
