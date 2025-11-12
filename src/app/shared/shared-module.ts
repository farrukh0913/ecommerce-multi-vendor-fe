import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';

import { SearchProduct } from './components/search-product/search-product';
import { ProductDetail } from './components/product-detail/product-detail';
import { ProductCard } from './components/product-card/product-card';
import { ContentHeader } from './components/content-header/content-header';
import { BaseSideMenu } from './components/base-side-menu/base-side-menu';
import { BaseModal } from './components/base-modal/base-modal';
import { AccordionFilter } from './components/accordion-filter/accordion-filter';
import { RouterModule } from '@angular/router';
import { AlertModal } from './components/alert-modal/alert-modal';

@NgModule({
  declarations: [
    SearchProduct,
    ProductDetail,
    ProductCard,
    ContentHeader,
    BaseSideMenu,
    BaseModal,
    AccordionFilter,
    AlertModal,
  ],
  imports: [CommonModule, NgxUiLoaderModule, RouterModule],
  exports: [
    SearchProduct,
    ProductDetail,
    ProductCard,
    ContentHeader,
    BaseSideMenu,
    BaseModal,
    AccordionFilter,
    CommonModule,
    NgxUiLoaderModule,
    RouterModule,
    AlertModal
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
