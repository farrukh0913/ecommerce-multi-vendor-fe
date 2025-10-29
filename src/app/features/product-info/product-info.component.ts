import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getCurrencySymbol } from '../../shared/utils/currency.utils';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
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
  getCurrencySymbol = getCurrencySymbol;

 constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to route param changes
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');

      this.loadProduct(this.productId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadProduct(id: string | null): void {
    
  }


 

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  onProductReceived(product: any): void {
    this.product = product;
    this.breadcrumb[2].name = product.name;
  }
}
