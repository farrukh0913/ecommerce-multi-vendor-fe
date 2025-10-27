import { Component } from '@angular/core';

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
  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }
}
