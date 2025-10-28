import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getCurrencySymbol } from '../../shared/utils/currency.utils';

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

  productId:any=null
  product:any=null
  activeTab = 'Specification';
  showDetailModal = false;
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
  getCurrencySymbol = getCurrencySymbol;
 
  
  constructor(
    private route: ActivatedRoute,
  ) {
    this.productId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  onProductReceived(product: any): void {
    this.product = product;
  }
}
