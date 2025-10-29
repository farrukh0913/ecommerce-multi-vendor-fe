import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';

import { App } from './app';
import { ProductCard } from './shared/components/product-card/product-card';
import { Home } from './features/home/home';
import { Faq } from './features/faq/faq';
import { ContactUs } from './features/contact-us/contact-us';
import { NewsEvents } from './features/news-events/news-events';
import { ShopNow } from './features/shop-now/shop-now';
import { BaseModal } from './shared/components/base-modal/base-modal';
import { ProductDetail } from './shared/components/product-detail/product-detail';
import { ProductInfo } from './features/product-info/product-info';
import { ShoppingCart } from './features/cart/shopping-cart/shopping-cart';
import { Cart } from './features/cart/cart/cart';
import { Checkout } from './features/cart/checkout/checkout';
import { OrderComplete } from './features/cart/order-complete/order-complete';
import { ContentHeader } from './shared/components/content-header/content-header';
import { BaseSideMenu } from './shared/components/base-side-menu/base-side-menu';
import { SearchProduct } from './shared/components/search-product/search-product';
import { Header } from './core/components/header/header';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { Footer } from './core/components/footer/footer';
import { ProductsByCategory } from './features/products-by-category/products-by-category';
import { AppRoutingModule } from './app-routing.module';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  pbColor: '#ec8951',
  hasProgressBar: false,
  fgsColor: '#ec8951',
  fgsType: SPINNER.cubeGrid,
  fgsSize: 70,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  text: '',
};

@NgModule({
  declarations: [
    App,
    Header,
    MainLayout,
    Footer,
    ProductCard,
    Home,
    NewsEvents,
    Faq,
    ContactUs,
    ShopNow,
    BaseModal,
    ProductDetail,
    ProductsByCategory,
    ProductInfo,
    Cart,
    ShoppingCart,
    Checkout,
    OrderComplete,
    ContentHeader,
    BaseSideMenu,
    SearchProduct,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient(withInterceptorsFromDi())],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [App],
})
export class AppModule {}
